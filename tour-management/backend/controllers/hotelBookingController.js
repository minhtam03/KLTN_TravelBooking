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

// Get hotel booking history for a specific user with pagination
export const getHotelBookingHistory = async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: No user ID found in token",
        });
    }

    const page = parseInt(req.query.page) || 0; // Current page (default is 0)
    const limit = 8; // Number of bookings per page

    try {
        const totalBookings = await HotelBooking.countDocuments({ userId });

        const bookings = await HotelBooking.find({ userId })
            .populate("hotelId")
            .sort({ createdAt: -1 })
            .skip(page * limit)
            .limit(limit);

        res.status(200).json({
            success: true,
            message: "Successful",
            data: bookings,
            totalBookings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                error.name === "MongoNetworkError"
                    ? "Database connection error"
                    : "Internal server error",
        });
    }
};

// Count hotel bookings of a user
export const getHotelBookingCount = async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: No user ID found in token",
        });
    }

    try {
        const count = await HotelBooking.countDocuments({ userId }); // Count user's hotel bookings
        res.status(200).json({
            success: true,
            message: "User hotel booking count retrieved",
            count
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
// Get hotel booking detail
export const getHotelBooking = async (req, res) => {
    const id = req.params.id;

    try {
        const booking = await HotelBooking.findById(id)
            .populate("hotelId")
            .populate("paymentId");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Hotel booking not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Successful",
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};