// import Tour from "../models/Tour.js";
// import Booking from "../models/Booking.js";
// import { getEmbedding } from "./embeddingHelper.js";

// export const getSuggestedTours = async (userId, topK = 5) => {
//     // Bước 1: Lấy lịch sử đặt tour của người dùng
//     const bookings = await Booking.find({ userId }).populate("tourId");
//     const bookedTours = bookings.map((b) => b.tourId).filter(Boolean);

//     if (!bookedTours.length) return [];

//     // Bước 2: Ghép nội dung mô tả các tour đã đặt để tạo embedding
//     const userDesc = bookedTours.map((tour) => tour.desc).join("\n");
//     const queryEmbedding = await getEmbedding(userDesc);

//     if (!queryEmbedding) return [];

//     // Bước 3: Truy vấn các tour gần nhất bằng MongoDB Atlas Vector Search
//     const result = await Tour.aggregate([
//         {
//             $search: {
//                 index: "vector-embedding-index",
//                 knnBeta: {
//                     vector: queryEmbedding,
//                     path: "embedding",
//                     k: topK
//                 }
//             }
//         },
//         {
//             $project: {
//                 title: 1,
//                 city: 1,
//                 desc: 1,
//                 photo: 1,
//                 price: 1,
//                 duration: 1,
//                 reviews: 1,
//                 score: { $meta: "searchScore" }
//             }
//         }
//     ]);

//     return result;
// };

import mongoose from "mongoose";
import Tour from "../models/Tour.js";
import Booking from "../models/Booking.js";
import { getEmbedding } from "./embeddingHelper.js";

// Hàm tính cosine similarity giữa hai vectors
const cosineSimilarity = (a, b) => {
    const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
    const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
    return dot / (normA * normB);
};

export const getSuggestedTours = async (userId, topK = 5) => {
    try {
        // Bước 1: Lấy danh sách tourId đã đặt
        const bookings = await Booking.find({ userId }).select("tourId");
        const bookedTourIds = bookings
            .map(b => b.tourId)
            .filter(Boolean)
            .map(id => id.toString());

        if (!bookedTourIds.length) return [];

        // Bước 2: Lấy thông tin các tour đã đặt để tạo embedding người dùng
        const bookedTours = await Tour.find({ _id: { $in: bookedTourIds } });
        const userDesc = bookedTours.map(t => t.desc).join("\n");
        const userEmbedding = await getEmbedding(userDesc);
        if (!userEmbedding) return [];

        // Bước 3: Lấy các tour chưa từng đặt
        const unbookedTours = await Tour.find({
            _id: { $nin: bookedTourIds.map(id => new mongoose.Types.ObjectId(id)) },
            embedding: { $exists: true, $ne: null }
        });

        if (!unbookedTours.length) return [];

        // Bước 4: Tính cosine similarity giữa embedding user và mỗi tour
        const scoredTours = unbookedTours.map(tour => {
            const similarity = cosineSimilarity(userEmbedding, tour.embedding);
            return { ...tour.toObject(), score: similarity };
        });

        // Bước 5: Sắp xếp theo độ tương đồng và lấy topK
        const topRecommended = scoredTours
            .sort((a, b) => b.score - a.score)
            .slice(0, topK);

        return topRecommended;

    } catch (error) {
        console.error("Error in getSuggestedTours:", error.message);
        return [];
    }
};
