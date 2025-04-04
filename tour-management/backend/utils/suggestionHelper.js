// suggestionHelper.js
import Tour from "../models/Tour.js";
import Booking from '../models/Booking.js';
import { ChatGroq } from '@langchain/groq';
import { HumanMessage } from '@langchain/core/messages';
import dotenv from 'dotenv';

dotenv.config();


export const findToursBasedOnKeywords = async (keywords, synonyms) => {
    try {
        let filteredTours = [];

        // Tạo mảng các từ đồng nghĩa từ các keyword và synonyms
        const allKeywords = [...keywords, ...synonyms.flat()];

        // Truy vấn các tour phù hợp với từ khóa hoặc từ đồng nghĩa
        const tours = await Tour.find({ desc: { $regex: new RegExp(allKeywords.join("|"), "i") } });

        filteredTours = tours.map(tour => tour.city);

        return filteredTours;
    } catch (err) {
        console.error("Error finding tours based on keywords:", err);
        return [];
    }
};

// return keyword base on history
export const findSuggestedInfo = async (userId) => {
    try {
        const bookings = await Booking.find({ userId }).populate('tourId');
        if (!bookings.length) return null;

        const tourDescriptions = bookings
            .map(b => b?.tourId?.desc)
            .filter(Boolean)
            .join("\n");

        const model = new ChatGroq({
            apiKey: process.env.CHATGROQ_API_KEY,
            model: "qwen-2.5-32b"
        });

        const message = new HumanMessage(`
            Summarize the following descriptions:
            ${tourDescriptions}
            Identify the most common travel theme using 1-3 keywords, separated by commas.
            Return only the keywords, no explanation.
        `);

        const response = await model.invoke([message]);
        const keyword = response?.content?.trim().toLowerCase() || null;

        return keyword;
    } catch (err) {
        console.error("Error fetching keyword from AI:", err);
        return null;
    }
};