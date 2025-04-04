import { ChatGroq } from '@langchain/groq';
import { HumanMessage } from '@langchain/core/messages';
import Booking from '../models/Booking.js';
import dotenv from 'dotenv';

dotenv.config();
const CHATGROQ_API_KEY = process.env.CHATGROQ_API_KEY;

// Hàm gọi AI để lấy cả từ khóa và từ đồng nghĩa
export const getKeywordsAndSynonymsFromAI = async (userId) => {
    try {
        const bookings = await Booking.find({ userId }).populate('tourId');
        if (!bookings.length) return { keywords: [], synonyms: [] };

        const tourDescriptions = bookings
            .map(b => b?.tourId?.desc)
            .filter(Boolean)
            .join("\n");

        const model = new ChatGroq({
            apiKey: CHATGROQ_API_KEY,
            model: "qwen-2.5-32b"
        });

        const message = new HumanMessage(`
            Summarize the following descriptions:
            ${tourDescriptions}
            Identify the most common travel themes using 1-3 keywords, separated by commas.
            For each keyword, please also return 3-5 related synonyms, separated by commas.
            Return only the keywords and synonyms, no explanation.
        `);

        const response = await model.invoke([message]);

        // Giả sử response.content trả về chuỗi "beach: coast, shore, sea, ocean"
        const parsedResponse = parseKeywordsAndSynonyms(response.content);
        return parsedResponse;
    } catch (err) {
        console.error("Error fetching keywords and synonyms from AI:", err);
        return { keywords: [], synonyms: [] };
    }
};

// Hàm phân tích và tách các từ khóa và từ đồng nghĩa từ phản hồi của AI
const parseKeywordsAndSynonyms = (content) => {
    const keywords = [];
    const synonyms = [];

    // Giả sử content có dạng như: "beach: coast, shore, sea, ocean"
    const keywordSynonymPairs = content.split("\n").filter(line => line.trim() !== "");
    keywordSynonymPairs.forEach(pair => {
        const [keyword, synonymList] = pair.split(":");
        keywords.push(keyword.trim());
        synonyms.push(synonymList.split(",").map(syn => syn.trim()));
    });

    return { keywords, synonyms };
};
