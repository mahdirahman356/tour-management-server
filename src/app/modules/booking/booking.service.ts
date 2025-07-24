/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import httpStatus from "http-status-codes"
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Tour } from "../tour/tour.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { getTransactionId } from "../../utils/getTransactionId";


const createBooking = async (payload: Partial<IBooking>, userId: string) => {

    const transactionId = getTransactionId()

    const session = await Booking.startSession()
    session.startTransaction()

    try {
        const user = await User.findById(userId)

        if (!user?.phone || !user.address) {
            throw new AppError(httpStatus.BAD_REQUEST, "Please Update Your Profile to Book a Tour.")
        }

        const tour = await Tour.findById(payload.tour).select("costFrom")

        if (!tour?.costFrom) {
            throw new AppError(httpStatus.BAD_REQUEST, "No Tour Cost FOund")
        }

        const amount = Number(tour.costFrom) * Number(payload.guestCount)

        const booking = await Booking.create([
            {
                user: userId,
                status: BOOKING_STATUS.PENDING,
                ...payload
            }
        ], { session })

        const payment = await Payment.create([
            {
                booking: booking[0]._id,
                status: PAYMENT_STATUS.UNPAID,
                transactionId: transactionId,
                amount: amount
            }
        ], { session })

        const updateBooking = await Booking
            .findByIdAndUpdate(
                booking[0]._id,
                { payment: payment[0]._id },
                { new: true, runValidators: true, session }
            ).populate("user", "name email phone address")
            .populate("tour", "title costFrom")
            .populate("payment")

        const userAddress = (updateBooking?.user as any).address
        const userEmail = (updateBooking?.user as any).email
        const userPhoneNumber = (updateBooking?.user as any).phone
        const userName = (updateBooking?.user as any).name

        const sslPayload: ISSLCommerz = {
            address: userAddress,
            email: userEmail,
            phoneNumber: userPhoneNumber,
            name: userName,
            amount: amount,
            transactionId: transactionId
        }

        const sslPayment = await SSLService.sslPaymentInit(sslPayload)

        await session.commitTransaction();
        session.endSession()

        return {
            paymentUrl: sslPayment.GatewayPageURL,
            booking: updateBooking
        }


    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }
};

const getUserBookings = async (userId: string) => {
    const myBookings = await Booking.find({ user: userId })
    if (!myBookings || myBookings.length === 0) {
        return {
            message: "You have not made any bookings yet.",
        };
    }
    return { myBookings }
};

const getBookingById = async (bookingId: string) => {
    const booking = await Booking.findById(bookingId)
    if (!booking) {
        throw new AppError(httpStatus.BAD_REQUEST, "Booking Not Found")
    }
    return booking
};

const updateBookingStatus = async (status: BOOKING_STATUS, bookingId: string) => {
    const updatedBookingStatus = await Booking.findByIdAndUpdate(bookingId, { status: status }, {new: true, runValidators: true})
    if (!updatedBookingStatus) {
            throw new AppError(httpStatus.NOT_FOUND, "Booking Not Found");
        }
    return updatedBookingStatus
};

const getAllBookings = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(Booking.find(), query)
    const Bookings = await queryBuilder
        .filter()
        .sort()
        .fields()
        .paginate()
        .build()

    const meta = await queryBuilder.getMeta()

    return {
        data: Bookings,
        meta: meta
    }
};

export const BookingService = {
    createBooking,
    getUserBookings,
    getBookingById,
    updateBookingStatus,
    getAllBookings,
};