import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const HF_API_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2";
const HF_API_TOKEN = process.env.HF_API_TOKEN;

// export const getEmbedding = async (text) => {
//     try {
//         const response = await axios.post(HF_API_URL, text, {
//             headers: {
//                 Authorization: `Bearer ${HF_API_TOKEN}`,
//                 "Content-Type": "application/json",
//             },
//         });

//         const result = response.data;
//         if (Array.isArray(result) && Array.isArray(result[0])) {
//             return result[0];
//         }

//         return result;
//     } catch (err) {
//         console.error("Error fetching embedding:", err.message);
//         return null;
//     }
// };

export const getEmbedding = async (textOrArray) => {
    try {
        const response = await axios.post(HF_API_URL, textOrArray, {
            headers: {
                Authorization: `Bearer ${HF_API_TOKEN}`,
                "Content-Type": "application/json",
            },
        });

        const result = response.data;

        // Nếu đầu vào là 1 câu → trả về vector đơn
        if (typeof textOrArray === "string") {
            return Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;
        }

        // Nếu đầu vào là mảng nhiều câu → trả về mảng các vector
        return result;
    } catch (err) {
        console.error("Error fetching embedding:", err.message);
        return null;
    }
};

