import HotelBooking from "../models/HotelBooking.js";

// Create hotel booking
export const createHotelBooking = async (req, res) => {
    try {
        const newBooking = new HotelBooking(req.body);
        const saved = await newBooking.save();
        res.status(200).json({ success: true, message: "Hotel booking created", data: saved });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to create hotel booking", error: err.message });
    }
};

// Get all hotel bookings of a user
export const getHotelBookingHistory = async (req, res) => {
    try {
        const userId = req.query.userId;
        const page = parseInt(req.query.page) || 0;
        const limit = 8;
        const bookings = await HotelBooking.find({ userId })
            .populate("hotelId")
            .sort({ createdAt: -1 })
            .skip(page * limit)
            .limit(limit);

        res.status(200).json({ success: true, data: bookings });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch history", error: err.message });
    }
};

// Count hotel bookings of a user
export const getHotelBookingCount = async (req, res) => {
    try {
        const userId = req.query.userId;
        const count = await HotelBooking.countDocuments({ userId });
        res.status(200).json({ success: true, count });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to count", error: err.message });
    }
};

// Get hotel booking detail
export const getHotelBookingDetail = async (req, res) => {
    try {
        const booking = await HotelBooking.findById(req.params.id).populate("hotelId");
        if (!booking) return res.status(404).json({ success: false, message: "Not found" });
        res.status(200).json({ success: true, data: booking });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch detail", error: err.message });
    }
};