// controllers/flightBookingController.js
import FlightBooking from "../models/FlightBooking.js";

// Create flight booking
export const createFlightBooking = async (req, res) => {
    try {
        const newBooking = new FlightBooking(req.body);
        const saved = await newBooking.save();
        res.status(200).json({ success: true, message: "Flight booking created", data: saved });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to create flight booking",
            error: err.message,
        });
    }
};

// Get flight booking history for a specific user with pagination
export const getFlightBookingHistory = async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: No user ID found in token",
        });
    }

    const page = parseInt(req.query.page) || 0;
    const limit = 8;

    try {
        const totalBookings = await FlightBooking.countDocuments({ userId });

        const bookings = await FlightBooking.find({ userId })
            .populate("flightId")
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

// Count flight bookings of a user
export const getFlightBookingCount = async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: No user ID found in token",
        });
    }

    try {
        const count = await FlightBooking.countDocuments({ userId });
        res.status(200).json({
            success: true,
            message: "User flight booking count retrieved",
            count,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Get flight booking detail
export const getFlightBooking = async (req, res) => {
    const id = req.params.id;

    try {
        const booking = await FlightBooking.findById(id)
            .populate("flightId")
            .populate("paymentId");

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Flight booking not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Successful",
            data: booking,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Get all flight bookings with payment amounts
// export const getAllFlightBookingsWithAmount = async (req, res) => {
//     try {
//         const bookings = await FlightBooking.find()
//             .populate("paymentId")

//             .sort({ createdAt: -1 });

//         const bookingsWithAmount = bookings.map((booking) => ({
//             ...booking._doc,
//             amount: booking.paymentId ? booking.paymentId.amount : 0,
//         }));

//         res.status(200).json({
//             success: true,
//             message: "Successfully retrieved flight bookings with payment amounts",
//             data: bookingsWithAmount,
//         });
//     } catch (error) {
//         console.error("Error fetching flight bookings with amount:", error);
//         res.status(500).json({
//             success: false,
//             message: "Internal server error",
//         });
//     }
// };

export const getAllFlightBookingsWithAmount = async (req, res) => {
    try {
        const bookings = await FlightBooking.find()
            .populate("paymentId")
            .populate("flightId") // Thêm dòng này
            .sort({ createdAt: -1 });

        const bookingsWithAmount = bookings.map((booking) => ({
            ...booking._doc,
            amount: booking.paymentId ? booking.paymentId.amount : 0,
        }));

        res.status(200).json({
            success: true,
            message: "Successfully retrieved flight bookings with payment amounts",
            data: bookingsWithAmount,
        });
    } catch (error) {
        console.error("Error fetching flight bookings with amount:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getAllFlightBooking = async (req, res) => {

    try {
        const books = await FlightBooking.find()
        res.status(200).json({
            success: true,
            message: "Successful",
            data: books
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }

}