/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken";
import { uploadBufferToCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/AppError";
import { generatePdf, IInvoiceData } from "../../utils/invoice";
import { sendEmail } from "../../utils/sendEmail";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { ITour } from "../tour/tour.interface";
import { IUser } from "../user/user.interface";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import httpStatus from "http-status-codes"

const initPayment = async (bookingId: string) => {

    const payment = await Payment.findOne({ booking: bookingId })
    if (!payment) {
        throw new AppError(httpStatus.BAD_REQUEST, "Payment Not Found. You have not booked this tour")
    }

    const booking = await Booking.findById(payment.booking)

    const userAddress = (booking?.user as any).address
    const userEmail = (booking?.user as any).email
    const userPhoneNumber = (booking?.user as any).phone
    const userName = (booking?.user as any).name

    const sslPayload: ISSLCommerz = {
        address: userAddress,
        email: userEmail,
        phoneNumber: userPhoneNumber,
        name: userName,
        amount: payment.amount,
        transactionId: payment.transactionId
    }

    const sslPayment = await SSLService.sslPaymentInit(sslPayload)

    return {
        paymentUrl: sslPayment.GatewayPageURL
    }


};
const successPayment = async (query: Record<string, string>) => {

    const session = await Booking.startSession()
    session.startTransaction()

    try {

        const updatedPayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: PAYMENT_STATUS.PAID },
            { new: true, runValidators: true, session: session }
        )

        if (!updatedPayment) {
            throw new AppError(401, "Payment not found")
        }

        const updatedBooking = await Booking
            .findByIdAndUpdate(
                updatedPayment?.booking,
                { status: BOOKING_STATUS.COMPLETE },
                { new: true, runValidators: true, session }
            )
            .populate("tour", "title")
            .populate("user", "name email")

        if (!updatedBooking) {
            throw new AppError(401, "Booking not found")
        }
        const invoiceData: IInvoiceData = {
            bookingDate: updatedBooking.createdAt as Date,
            guestCount: updatedBooking.guestCount,
            totalAmount: updatedPayment.amount,
            tourTitle: (updatedBooking.tour as unknown as ITour).title,
            transactionId: updatedPayment.transactionId,
            userName: (updatedBooking.user as unknown as IUser).name
        }
        const pdfBuffer = await generatePdf(invoiceData)

        const cloudinaryResult = await uploadBufferToCloudinary(pdfBuffer, "invoice")
        if (!cloudinaryResult) {
            throw new AppError(401, "Error uploading pdf")
        }
        await Payment.findByIdAndUpdate(
            updatedPayment._id,
            { invoiceUrl: cloudinaryResult.secure_url },
            { runValidators: true, session })


        await sendEmail({
            to: (updatedBooking.user as unknown as IUser).email,
            subject: "Your Booking Invoice",
            templateName: "invoice",
            templateData: invoiceData,
            attachments: [
                {
                    filename: "invoice.pdf",
                    content: pdfBuffer,
                    contentType: "application/pdf"
                }
            ]
        })

        await session.commitTransaction();
        session.endSession()

        return { success: true, message: "Payment Completed successfully" }


    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }


};
const failPayment = async (query: Record<string, string>) => {
    const session = await Booking.startSession()
    session.startTransaction()

    try {

        const updatePayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: PAYMENT_STATUS.FAILED },
            { new: true, runValidators: true, session: session }
        )

        await Booking
            .findByIdAndUpdate(
                updatePayment?.booking,
                { status: BOOKING_STATUS.FAILED },
                { runValidators: true, session }
            )
        await session.commitTransaction();
        session.endSession()

        return { success: false, message: "Payment Failed" }


    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }

};
const cancelPayment = async (query: Record<string, string>) => {
    const session = await Booking.startSession()
    session.startTransaction()

    try {

        const updatePayment = await Payment.findOneAndUpdate(
            { transactionId: query.transactionId },
            { status: PAYMENT_STATUS.CANCELLED },
            { new: true, runValidators: true, session: session }
        )

        await Booking
            .findByIdAndUpdate(
                updatePayment?.booking,
                { status: BOOKING_STATUS.CANCEL },
                { runValidators: true, session }
            )

        await session.commitTransaction();
        session.endSession()

        return { success: false, message: "Payment Cancelled" }


    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }

};

const getInvoiceDownloadUrl = async (paymentId: string, decodedToken: JwtPayload) => {
    const payment = await Payment.findById(paymentId)
        .select("invoiceUrl")

    const booking = await Booking.findOne({payment: paymentId})   

    if(booking?.user.toString() !== decodedToken.userId){
          throw new AppError(403, "Unauthorized access to this booking")
    }

    if (!payment) {
        throw new AppError(401, "Payment not found")
    }

    if (!payment.invoiceUrl) {
        throw new AppError(401, "No invoice found")
    }

    return payment.invoiceUrl
};



export const PaymentService = {
    successPayment,
    failPayment,
    cancelPayment,
    initPayment,
    getInvoiceDownloadUrl
};