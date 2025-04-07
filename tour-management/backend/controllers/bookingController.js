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

// Get total count of bookings for a specific user (for pagination)
export const getBookingCount = async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: No user ID found in token",
        });
    }

    try {
        const count = await Booking.countDocuments({ userId }); // Đếm số lượng booking của user đó
        res.status(200).json({
            success: true,
            message: "User booking count retrieved",
            count
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Get all booking history for a specific user with pagination
export const getBookingHistory = async (req, res) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: No user ID found in token",
        });
    }

    const page = parseInt(req.query.page) || 0; // Trang hiện tại (mặc định là 0)
    const limit = 8; // Số lượng booking mỗi trang

    try {
        const totalBookings = await Booking.countDocuments({ userId }); // Chỉ tính số lượng booking của user đó
        const bookings = await Booking.find({ userId })
            .populate("tourId")
            .sort({ createdAt: -1 }) // Sắp xếp theo thời gian đặt mới nhất
            .skip(page * limit) // Bỏ qua các phần tử của trang trước đó
            .limit(limit); // Giới hạn số lượng mỗi trang

        res.status(200).json({
            success: true,
            message: "Successful",
            data: bookings,
            totalBookings, // Tổng số booking của user đó để tính số trang
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.name === "MongoNetworkError" ? "Database connection error" : "Internal server error",
        });
    }
};


export const getAllBookingsWithAmount = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("paymentId") // Lấy thông tin Payment của booking
            .sort({ createdAt: -1 }); // Sắp xếp theo thời gian đặt mới nhất

        console.log("Bookings data:", bookings);

        // Map dữ liệu và thêm trường amount từ Payment
        const bookingsWithAmount = bookings.map(booking => ({
            ...booking._doc,
            amount: booking.paymentId ? booking.paymentId.amount : 0, // Nếu có paymentId thì lấy amount, nếu không thì 0
        }));

        res.status(200).json({
            success: true,
            message: "Successfully retrieved bookings with payment amounts",
            data: bookingsWithAmount,
        });
    } catch (error) {
        console.error("Error fetching bookings with payment amounts:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};