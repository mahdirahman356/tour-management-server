"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("../user/user.model");
const booking_interface_1 = require("./booking.interface");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const booking_model_1 = require("./booking.model");
const payment_model_1 = require("../payment/payment.model");
const payment_interface_1 = require("../payment/payment.interface");
const tour_model_1 = require("../tour/tour.model");
const sslCommerz_service_1 = require("../sslCommerz/sslCommerz.service");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const getTransactionId_1 = require("../../utils/getTransactionId");
const createBooking = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = (0, getTransactionId_1.getTransactionId)();
    const session = yield booking_model_1.Booking.startSession();
    session.startTransaction();
    try {
        const user = yield user_model_1.User.findById(userId);
        if (!(user === null || user === void 0 ? void 0 : user.phone) || !user.address) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Please Update Your Profile to Book a Tour.");
        }
        const tour = yield tour_model_1.Tour.findById(payload.tour).select("costFrom");
        if (!(tour === null || tour === void 0 ? void 0 : tour.costFrom)) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "No Tour Cost FOund");
        }
        const amount = Number(tour.costFrom) * Number(payload.guestCount);
        const booking = yield booking_model_1.Booking.create([
            Object.assign({ user: userId, status: booking_interface_1.BOOKING_STATUS.PENDING }, payload)
        ], { session });
        const payment = yield payment_model_1.Payment.create([
            {
                booking: booking[0]._id,
                status: payment_interface_1.PAYMENT_STATUS.UNPAID,
                transactionId: transactionId,
                amount: amount
            }
        ], { session });
        const updateBooking = yield booking_model_1.Booking
            .findByIdAndUpdate(booking[0]._id, { payment: payment[0]._id }, { new: true, runValidators: true, session }).populate("user", "name email phone address")
            .populate("tour", "title costFrom")
            .populate("payment");
        const userAddress = (updateBooking === null || updateBooking === void 0 ? void 0 : updateBooking.user).address;
        const userEmail = (updateBooking === null || updateBooking === void 0 ? void 0 : updateBooking.user).email;
        const userPhoneNumber = (updateBooking === null || updateBooking === void 0 ? void 0 : updateBooking.user).phone;
        const userName = (updateBooking === null || updateBooking === void 0 ? void 0 : updateBooking.user).name;
        const sslPayload = {
            address: userAddress,
            email: userEmail,
            phoneNumber: userPhoneNumber,
            name: userName,
            amount: amount,
            transactionId: transactionId
        };
        const sslPayment = yield sslCommerz_service_1.SSLService.sslPaymentInit(sslPayload);
        yield session.commitTransaction();
        session.endSession();
        return {
            paymentUrl: sslPayment.GatewayPageURL,
            booking: updateBooking
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const getUserBookings = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const myBookings = yield booking_model_1.Booking.find({ user: userId });
    if (!myBookings || myBookings.length === 0) {
        return {
            message: "You have not made any bookings yet.",
        };
    }
    return { myBookings };
});
const getBookingById = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield booking_model_1.Booking.findById(bookingId);
    if (!booking) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Booking Not Found");
    }
    return booking;
});
const updateBookingStatus = (status, bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedBookingStatus = yield booking_model_1.Booking.findByIdAndUpdate(bookingId, { status: status }, { new: true, runValidators: true });
    if (!updatedBookingStatus) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Booking Not Found");
    }
    return updatedBookingStatus;
});
const getAllBookings = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(booking_model_1.Booking.find(), query);
    const Bookings = yield queryBuilder
        .filter()
        .sort()
        .fields()
        .paginate()
        .build();
    const meta = yield queryBuilder.getMeta();
    return {
        data: Bookings,
        meta: meta
    };
});
exports.BookingService = {
    createBooking,
    getUserBookings,
    getBookingById,
    updateBookingStatus,
    getAllBookings,
};
