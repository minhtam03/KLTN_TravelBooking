import Tour from "../models/Tour.js"
import Hotel from "../models/Hotel.js"
import Flight from "../models/Flight.js"
import Review from "../models/Review.js"
import dotenv from 'dotenv';
import { ChatGroq } from "@langchain/groq";
import { HumanMessage } from "@langchain/core/messages";
dotenv.config()

// create review
// export const createReview = async (req, res) => {
//     const tourId = req.params.tourId
//     const newReview = new Review({ ...req.body })
//     try {

//         const savedReview = await newReview.save()

//         // after creating a new review now update the reviews array of the tour

//         await Tour.findByIdAndUpdate(tourId, {
//             $push: { reviews: savedReview._id }
//         })

//         res.status(200).json({
//             success: true,
//             message: "Review submitted",
//             data: savedReview
//         })

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Failed to submit",
//         })
//     }
// }

export const createReview = async (req, res) => {
    const { targetId, reviewTargetType, reviewText, rating } = req.body;
    const userId = req.user?.id || req.body.userId;

    try {
        if (!targetId || !reviewText || typeof rating !== 'number' || !userId) {
            return res.status(400).json({ success: false, message: "Thiếu dữ liệu" });
        }

        const newReview = new Review({
            targetId,
            reviewTargetType,
            reviewText,
            rating,
            userId
        });

        const savedReview = await newReview.save();

        let model;
        if (reviewTargetType === "Tour") model = Tour;
        else if (reviewTargetType === "Hotel") model = Hotel;
        else if (reviewTargetType === "Flight") model = Flight;

        if (model) {
            await model.findByIdAndUpdate(targetId, {
                $push: { reviews: savedReview._id }
            });
        }

        const populatedReview = await savedReview.populate('userId', 'username photo');

        res.status(200).json({
            success: true,
            message: "Review submitted",
            data: populatedReview
        });
    } catch (error) {
        console.error("CREATE REVIEW ERROR:", error);
        res.status(500).json({ success: false, message: "Failed to submit" });
    }
};

// summary review
export const getReviewSummary = async (req, res) => {
    try {
        const { targetId, reviewTargetType } = req.params;

        let modelTarget;
        if (reviewTargetType === "Tour") modelTarget = Tour;
        else if (reviewTargetType === "Hotel") modelTarget = Hotel;
        else if (reviewTargetType === "Flight") modelTarget = Flight;

        if (!modelTarget) return res.status(400).json({ success: false, message: "Invalid type" });
        const item = await modelTarget.findById(targetId).populate("reviews");

        if (!item || !item.reviews?.length) {
            return res.status(400).json({ success: false, message: "Không có đánh giá nào để tổng hợp" });
        }

        // Lấy nội dung review
        const reviewsText = item.reviews.map(review => review.reviewText).join("\n");

        const model = new ChatGroq({
            apiKey: process.env.CHATGROQ_API_KEY,
            model: "llama-3.1-8b-instant"
        });

        const message = new HumanMessage(`
            You will receive multiple reviews. Your job is to summarize them clearly and concisely.
            Please return the result in the following strict format:
            
            Positive Aspects:
            <Two sentences describing positive aspects>
            
            Negative Aspects:
            <Two sentences describing negative aspects>
            
            General User Impressions:
            <Two sentences giving general overall impressions>
        
            Analyze the following reviews:
            ${reviewsText}
        `);
        const response = await model.invoke([message]);

        if (response && response.content) {
            return res.status(200).json({
                success: true,
                message: "Tóm tắt đánh giá thành công",
                summary: response.content
            });
        }


    } catch (error) {
        console.error("Lỗi khi gọi API ChatGroq:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ khi tổng hợp đánh giá" });
    }
};




