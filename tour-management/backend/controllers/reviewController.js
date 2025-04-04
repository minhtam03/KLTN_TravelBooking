import Tour from "../models/Tour.js"
import Review from "../models/Review.js"
import dotenv from 'dotenv';
import { ChatGroq } from "@langchain/groq";
import { HumanMessage } from "@langchain/core/messages";
dotenv.config()

// create review
export const createReview = async (req, res) => {
    const tourId = req.params.tourId
    const newReview = new Review({ ...req.body })
    try {

        const savedReview = await newReview.save()

        // after creating a new review now update the reviews array of the tour

        await Tour.findByIdAndUpdate(tourId, {
            $push: { reviews: savedReview._id }
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

// summary review
export const getReviewSummary = async (req, res) => {
    try {
        const { tourId } = req.params;

        // Lấy danh sách review từ tourId
        const tour = await Tour.findById(tourId).populate("reviews");

        if (!tour || !tour.reviews || tour.reviews.length === 0) {
            return res.status(400).json({ success: false, message: "Không có đánh giá nào để tổng hợp" });
        }

        // Lấy nội dung review
        const reviewsText = tour.reviews.map(review => review.reviewText).join("\n");

        const model = new ChatGroq({
            apiKey: process.env.CHATGROQ_API_KEY,
            model: "qwen-2.5-32b"
        });

        const message = new HumanMessage(`
            Summarize the following reviews:
            ${reviewsText}

            Summarize the following reviews briefly and usefully. 
            Structure the summary into three separate paragraphs: one for the positive aspects, one for the negative aspects, and one for general user impressions. 
            Each paragraph should be short and to the point, include two sentences.
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




