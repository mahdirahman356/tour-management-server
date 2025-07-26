/* eslint-disable @typescript-eslint/no-explicit-any */
import { Booking } from "../booking/booking.model"
import { PAYMENT_STATUS } from "../payment/payment.interface"
import { Payment } from "../payment/payment.model"
import { Tour } from "../tour/tour.model"
import { IsActive } from "../user/user.interface"
import { User } from "../user/user.model"

const now = new Date()
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7)
const thrityDaysAgo = new Date(now).setDate(now.getDate() - 30)

const getUserStats = async () => {

    const totalUsersPromise = User.countDocuments()
    const totalActiveUsersPromise = User.countDocuments({ isActive: IsActive.ACTIVE })
    const totalInActiveUsersPromise = User.countDocuments({ isActive: IsActive.INACTIVE })
    const totalBlockedUsersPromise = User.countDocuments({ isActive: IsActive.BLOCKED })

    const newUsersInLast7DaysPromise = User.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    })
    const newUsersInLast30DaysPromise = User.countDocuments({
        createdAt: { $gte: thrityDaysAgo }
    })

    const usersByRolePromise = User.aggregate([
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }
        }
    ])

    const [totalUsers, totalActiveUsers, totalInActiveUsers, totalBlockedUsers,
        newUsersInLast7Days, newUsersInLast30Days, usersByRole] = await Promise.all([
            totalUsersPromise,
            totalActiveUsersPromise,
            totalInActiveUsersPromise,
            totalBlockedUsersPromise,
            newUsersInLast7DaysPromise,
            newUsersInLast30DaysPromise,
            usersByRolePromise
        ])


    return {
        totalUsers,
        totalActiveUsers,
        totalInActiveUsers,
        totalBlockedUsers,
        newUsersInLast7Days,
        newUsersInLast30Days,
        usersByRole
    }
}

const getTourStats = async () => {

    const totalTourPromise = Tour.countDocuments()

    const totalTourByTypeTourPromise = Tour.aggregate([
        {
            $lookup: {
                from: "tourtypes",
                localField: "tourType",
                foreignField: "_id",
                as: "type"
            }
        },
        {
            $unwind: "$type"
        },
        {
            $group: {
                _id: "$type.name",
                count: { $sum: 1 }
            }
        }
    ])

    const totalTourByDivisionPromise = Tour.aggregate([
        {
            $lookup: {
                from: "divisions",
                localField: "division",
                foreignField: "_id",
                as: "division"
            }
        },
        {
            $unwind: "$division"
        },
        {
            $group: {
                _id: "$division.name",
                count: { $sum: 1 }
            }
        }
    ])

    const avgTourCostPromise = Tour.aggregate([
        {
            $group: {
                _id: null,
                avgCostFrom: { $avg: "$costFrom" }
            }
        }
    ])

    const totalHighestBookedTourPromise = Booking.aggregate([
        {
            $group: {
                _id: "$tour",
                bookingCount: { $sum: 1 }
            }
        },
        {
            $sort: { bookingCount: -1 }
        },
        {
            $limit: 5
        },
        {
            $lookup: {
                from: "tours",
                let: { tourId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$_id", "$$tourId"] }
                        }
                    }
                ],
                as: "tour"
            }
        },
        {
            $unwind: "$tour"
        },
        {
            $project: {
                bookingCount: 1,
                "tour.title": 1,
                "tour.slug": 1
            }
        }
    ])

    const [totalTour, totalTourByTypeTour, totalTourByDivision, avgTourCost, totalHighestBookedTour] = await Promise.all([
        totalTourPromise,
        totalTourByTypeTourPromise,
        totalTourByDivisionPromise,
        avgTourCostPromise,
        totalHighestBookedTourPromise
    ])

    return {
        totalTour,
        totalTourByTypeTour,
        totalTourByDivision,
        avgTourCost,
        totalHighestBookedTour
    }
}

const getBookingStats = async () => {

    const totalBookingPromise = Booking.countDocuments()

    const bookingsLast7DaysPromise = Booking.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    })
    const bookingsLast30DaysPromise = Booking.countDocuments({
        createdAt: { $gte: thrityDaysAgo }
    })


    const totalBookingByStatusPromise = Booking.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ])

    const bookingPerTourPromise = Booking.aggregate([
        {
            $group: {
                _id: "$tour",
                bookingCount: { $sum: 1 }
            }
        },
        {
            $sort: { bookingCount: -1 }
        },
        {
            $limit: 10
        },
        {
            $lookup: {
                from: "tours",
                localField: "_id",
                foreignField: "_id",
                as: "tour"
            }
        },
        {
            $unwind: "$tour"
        },
        {
            $project: {
                bookingCount: 1,
                _id: 1,
                "tour.title": 1,
                "tour.slug": 1
            }
        }
    ])

    const avgGuestCountPerBookingPromise = Booking.aggregate([
        {
            $group: {
                _id: null,
                avgGuestCount: { $avg: "$guestCount" }
            }
        }
    ])

    const totalBookingByUniqueUsersPromise = Booking.distinct("user").then((user: any) => user.length)

    const [totalBooking, totalBookingByStatus, bookingPerTour, avgGuestCountPerBooking,
        bookingsLast7Days, bookingsLast30Days, totalBookingByUniqueUsers] = await Promise.all([
            totalBookingPromise,
            totalBookingByStatusPromise,
            bookingPerTourPromise,
            avgGuestCountPerBookingPromise,
            bookingsLast7DaysPromise,
            bookingsLast30DaysPromise,
            totalBookingByUniqueUsersPromise
        ])

    return {
        totalBooking,
        bookingsLast7Days,
        bookingsLast30Days,
        totalBookingByStatus,
        bookingPerTour,
        avgGuestCountPerBooking: avgGuestCountPerBooking[0].avgGuestCount,
        totalBookingByUniqueUsers
    }
}

const getPaymentStats = async () => {

    const totalPaymentPromise = Payment.countDocuments()

     const totalPaymentByStatusPromise = Payment.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ])

    const totalRevenuePromise = Payment.aggregate([
        {
            $match: { status: PAYMENT_STATUS.PAID }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$amount" }
            }
        }
    ])

    const avgPaymentAmoutPromise = Payment.aggregate([
        {
            $group: {
                _id: null,
                avgPaymentAmout: {$avg: "$amount"}
            }
        }
    ])

    const paymentGetewayDataPromise = Payment.aggregate([
        {
            $group: {
                _id: {$ifNull: ["$paymentGatewayData.status", "UNKNOWN"]},
                count: {$sum: 1}
            }
        }
    ])

    const [totalPayment, totalPaymentByStatus, totalRevenue, avgPaymentAmout, paymentGetewayData] = await Promise.all([
        totalPaymentPromise,
        totalPaymentByStatusPromise,
        totalRevenuePromise,
        avgPaymentAmoutPromise,
        paymentGetewayDataPromise
    ])

    return {
        totalPayment,
        totalPaymentByStatus,
        totalRevenue,
        avgPaymentAmout,
        paymentGetewayData
    }
}

export const StatsService = {
    getBookingStats,
    getPaymentStats,
    getTourStats,
    getUserStats
}