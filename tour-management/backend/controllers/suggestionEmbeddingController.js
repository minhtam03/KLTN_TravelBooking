// api dùng để test recommendedTour từ history người dùng

import Tour from "../models/Tour.js";
import Booking from "../models/Booking.js";
import { getEmbedding } from "../utils/embeddingHelper.js";
import { getSuggestedTours } from "../utils/tourRecommendationHelper.js";

export const getSuggestedToursByEmbedding = async (req, res) => {
    try {
        const { userId, topK } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "Missing userId" });
        }

        // // Bước 1: Lấy danh sách tour đã đặt
        // const bookings = await Booking.find({ userId }).populate("tourId");
        // const bookedTours = bookings.map((b) => b.tourId).filter(Boolean);

        // if (bookedTours.length === 0) {
        //     return res.status(200).json({ message: "User has no bookings yet", suggestions: [] });
        // }

        // // Bước 2: Ghép nội dung mô tả các tour đã đặt
        // const userDesc = bookedTours.map((tour) => tour.desc).join("\n");
        // const queryEmbedding = await getEmbedding(userDesc);

        // if (!queryEmbedding) {
        //     return res.status(500).json({ message: "Failed to generate embedding from user history" });
        // }

        const recommendedTours = await getSuggestedTours(userId, topK);

        // const result = await Tour.aggregate([
        //     {
        //         $search: {
        //             index: "vector-embedding-index",
        //             knnBeta: {
        //                 vector: queryEmbedding,
        //                 path: "embedding",
        //                 k: topK
        //             }
        //         }
        //     },
        //     {
        //         $project: {
        //             title: 1,
        //             city: 1,
        //             desc: 1,
        //             photo: 1,
        //             price: 1,
        //             duration: 1,
        //             score: { $meta: "searchScore" }
        //         }
        //     }
        // ]);

        res.status(200).json({ suggestions: recommendedTours });


    } catch (err) {
        console.error("Error in getSuggestedToursByEmbedding:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
