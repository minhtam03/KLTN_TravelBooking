import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Payment from "../models/Payment.js";
import Tour from "../models/Tour.js";

export const getWidgetData = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const tourCount = await Tour.countDocuments();
        const bookingCount = await Booking.countDocuments();
        const earnings = await Payment.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);

        res.status(200).json({
            success: true,
            data: {
                user: userCount,
                tour: tourCount,
                booking: bookingCount,
                earning: earnings.length > 0 ? earnings[0].total : 0,
            },
        });
    } catch (error) {
        console.error("Error fetching widget data:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getUserCount = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        res.status(200).json({ success: true, count: userCount });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getBookingCount = async (req, res) => {
    try {
        const bookingCount = await Booking.countDocuments();
        res.status(200).json({ success: true, count: bookingCount });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getTourCount = async (req, res) => {
    try {
        const tourCount = await Tour.countDocuments();
        res.status(200).json({ success: true, count: tourCount });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getEarnings = async (req, res) => {
    try {
        const earnings = await Payment.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
        res.status(200).json({ success: true, total: earnings.length > 0 ? earnings[0].total : 0 });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getUserGrowth = async (req, res) => {
    try {
        const today = new Date();
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(today.getDate() - 14);
        const lastWeekEnd = new Date(today);
        lastWeekEnd.setDate(today.getDate() - 7);

        const thisWeek = await User.countDocuments({
            createdAt: { $gte: new Date(today.setDate(today.getDate() - 7)) }
        });


        const lastWeek = await User.countDocuments({
            createdAt: { $gte: lastWeekStart, $lt: lastWeekEnd }
        });


        const growth = lastWeek > 0 ? ((thisWeek - lastWeek) / lastWeek) * 100 : 100;

        res.status(200).json({
            success: true,
            growth: Math.round(growth * 100) / 100,
        });
    } catch (error) {
        console.error("Error fetching user growth:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getGrowthData = async (req, res) => {
    try {
        const today = new Date();
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(today.getDate() - 14);
        const lastWeekEnd = new Date(today);
        lastWeekEnd.setDate(today.getDate() - 7);

        const thisWeekUsers = await User.countDocuments({
            createdAt: { $gte: new Date(today.setDate(today.getDate() - 7)) }
        });
        const lastWeekUsers = await User.countDocuments({
            createdAt: { $gte: lastWeekStart, $lt: lastWeekEnd }
        });
        const userGrowth = lastWeekUsers > 0 ? ((thisWeekUsers - lastWeekUsers) / lastWeekUsers) * 100 : 100;

        const thisWeekBookings = await Booking.countDocuments({
            createdAt: { $gte: new Date(today.setDate(today.getDate() - 7)) }
        });
        const lastWeekBookings = await Booking.countDocuments({
            createdAt: { $gte: lastWeekStart, $lt: lastWeekEnd }
        });
        const bookingGrowth = lastWeekBookings > 0 ? ((thisWeekBookings - lastWeekBookings) / lastWeekBookings) * 100 : 100;

        const thisWeekTours = await Tour.countDocuments({
            createdAt: { $gte: new Date(today.setDate(today.getDate() - 7)) }
        });
        const lastWeekTours = await Tour.countDocuments({
            createdAt: { $gte: lastWeekStart, $lt: lastWeekEnd }
        });
        const tourGrowth = lastWeekTours > 0 ? ((thisWeekTours - lastWeekTours) / lastWeekTours) * 100 : 100;

        const thisWeekBalance = await Payment.aggregate([
            { $match: { createdAt: { $gte: new Date(today.setDate(today.getDate() - 7)) } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const lastWeekBalance = await Payment.aggregate([
            { $match: { createdAt: { $gte: lastWeekStart, $lt: lastWeekEnd } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const balanceGrowth = lastWeekBalance.length > 0 && lastWeekBalance[0].total > 0
            ? ((thisWeekBalance[0]?.total - lastWeekBalance[0]?.total) / lastWeekBalance[0]?.total) * 100
            : 100;

        res.status(200).json({
            success: true,
            data: {
                user: Math.round(userGrowth * 100) / 100,
                booking: Math.round(bookingGrowth * 100) / 100,
                tour: Math.round(tourGrowth * 100) / 100,
                earning: Math.round(balanceGrowth * 100) / 100,
            }
        });
    } catch (error) {
        console.error("Error fetching growth data:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


