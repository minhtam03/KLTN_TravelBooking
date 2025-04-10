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
        const recommendedTours = await getSuggestedTours(userId, topK);
        res.status(200).json({ suggestions: recommendedTours });

    } catch (err) {
        console.error("Error in getSuggestedToursByEmbedding:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};
