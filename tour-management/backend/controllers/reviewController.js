import Tour from "../models/Tour.js"
import Review from "../models/Review.js"


export const createReview = async(req, res) => {
    const tourId = req.params.tourId
    const newReview = new Review({...req.body})
    try {

        const savedReview = await newReview.save()

        // after creating a new review now update the reviews array of the tour

        await Tour.findByIdAndUpdate(tourId, {
            $push: {reviews: savedReview._id}
        })

        res.status(200).json({
            success: true,
            message: "Review submitted",
            data: savedReview
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to submit",
        })
    }
}

// import Tour from "../models/Tour.js";
// import Review from "../models/Review.js";
// import Booking from "../models/Booking.js"; // Nhập mô hình Booking

// export const createReview = async (req, res) => {
//     const tourName = req.params.tourName;
//     const userId = req.user.id; // Lấy userId từ người dùng đã xác thực
//     const newReview = new Review({ ...req.body });

//     try {
//         // Kiểm tra xem người dùng đã đặt tour này chưa
//         const hasBooking = await Booking.findOne({ userId, tourName });
//         if (!hasBooking) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Bạn chưa đặt tour này", // Thông báo nếu chưa đặt tour
//             });
//         }

//         // Lưu đánh giá mới
//         const savedReview = await newReview.save();

//         // Cập nhật mảng đánh giá của tour
//         await Tour.findByIdAndUpdate(tourName, {
//             $push: { reviews: savedReview._id },
//         });

//         res.status(200).json({
//             success: true,
//             message: "Review submitted",
//             data: savedReview,
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Failed to submit",
//         });
//     }
// };
