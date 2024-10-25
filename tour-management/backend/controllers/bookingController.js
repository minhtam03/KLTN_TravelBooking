import Booking from "../models/Booking.js"

// create new booking
export const createBooking = async(req, res) => {
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
export const getBooking = async(req, res) => {
    const id = req.params.id
    try {
        const book = await Booking.findById(id)
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
export const getAllBooking = async(req, res) => {

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


// get booking history of a user
export const getBookingHistory = async (req, res) => {
    const userId = req.user.id; // Lấy userId từ token đã xác thực

    try {
        const bookings = await Booking.find({ userId });  // Find all bookings with the user's ID

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
            message: "Internal server error",
        });
    }
}