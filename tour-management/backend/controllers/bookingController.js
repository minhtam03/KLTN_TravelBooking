import Booking from "../models/Booking.js"

// create new booking
export const createBooking = async (req, res) => {
    const newBooking = new Booking(req.body)
    try {
        const savedBooking = await newBooking.save()
        res.status(200).json({
            success: true,
            message: "Your tour is booked",
            data: savedBooking
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}

// get single booking
export const getBooking = async (req, res) => {
    const id = req.params.id
    try {
        const book = await Booking.findById(id).populate("tourId").populate("paymentId");
        res.status(200).json({
            success: true,
            message: "Successful",
            data: book
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: "Not found",
        })
    }
}

// get all booking
export const getAllBooking = async (req, res) => {

    try {
        const books = await Booking.find()
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


export const getBookingHistory = async (req, res) => {
    const userId = req.user?.id; // Đảm bảo userId có tồn tại

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: No user ID found in token",
        });
    }

    try {
        const bookings = await Booking.find({ userId }).populate("tourId");

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No bookings found for this user",
            });
        }

        res.status(200).json({
            success: true,
            message: "Successful",
            data: bookings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.name === "MongoNetworkError" ? "Database connection error" : "Internal server error",
        });
    }
};
