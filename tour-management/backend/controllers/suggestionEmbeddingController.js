import Tour from "../models/Tour.js";
import Booking from "../models/Booking.js";
import { getEmbedding } from "../utils/embeddingHelper.js";
import { cosineSimilarity } from "../utils/vectorMath.js";

export const getSuggestedToursByEmbedding = async (req, res) => {
    try {
        const { userId, topK = 5 } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "Missing userId" });
        }

        // Bước 1: Lấy danh sách tour đã đặt
        const bookings = await Booking.find({ userId }).populate("tourId");
        const bookedTours = bookings.map((b) => b.tourId).filter(Boolean);

        if (bookedTours.length === 0) {
            return res.status(200).json({ message: "User has no bookings yet", suggestions: [] });
        }

        // Bước 2: Ghép nội dung mô tả các tour đã đặt
        const userDesc = bookedTours.map((tour) => tour.desc).join("\n");
        const queryEmbedding = await getEmbedding(userDesc);

        if (!queryEmbedding) {
            return res.status(500).json({ message: "Failed to generate embedding from user history" });
        }

        // // Bước 3: Lấy tất cả tour có embedding
        // const allTours = await Tour.find({ embedding: { $exists: true, $ne: [] } });

        // const scored = allTours.map((tour) => ({
        //     tour,
        //     similarity: cosineSimilarity(tour.embedding, queryEmbedding),
        // }));

        // const topTours = scored
        //     .sort((a, b) => b.similarity - a.similarity)
        //     .slice(0, topK);

        // const suggestions = topTours.map((entry) => ({
        //     tour: entry.tour,
        //     similarity: parseFloat((entry.similarity * 100).toFixed(2)), // chuyển sang %
        // }));

        // return res.status(200).json({ suggestions });
        const result = await Tour.aggregate([
            {
                $search: {
                    index: "vector-embedding-index",
                    knnBeta: {
                        vector: queryEmbedding,
                        path: "embedding",
                        k: topK
                    }
                }
            },
            {
                $project: {
                    title: 1,
                    city: 1,
                    desc: 1,
                    photo: 1,
                    price: 1,
                    duration: 1,
                    score: { $meta: "searchScore" }
                }
            }
        ]);

        res.status(200).json({ suggestions: result });


    } catch (err) {
        console.error("Error in getSuggestedToursByEmbedding:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
