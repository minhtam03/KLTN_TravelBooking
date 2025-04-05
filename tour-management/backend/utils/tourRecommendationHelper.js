import Tour from "../models/Tour.js";
import Booking from "../models/Booking.js";
import { getEmbedding } from "./embeddingHelper.js";

export const getSuggestedTours = async (userId, topK = 5) => {
    // Bước 1: Lấy lịch sử đặt tour của người dùng
    const bookings = await Booking.find({ userId }).populate("tourId");
    const bookedTours = bookings.map((b) => b.tourId).filter(Boolean);

    if (!bookedTours.length) return [];

    // Bước 2: Ghép nội dung mô tả các tour đã đặt để tạo embedding
    const userDesc = bookedTours.map((tour) => tour.desc).join("\n");
    const queryEmbedding = await getEmbedding(userDesc);

    if (!queryEmbedding) return [];

    // Bước 3: Truy vấn các tour gần nhất bằng MongoDB Atlas Vector Search
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
                reviews: 1,
                score: { $meta: "searchScore" }
            }
        }
    ]);

    return result;
};
