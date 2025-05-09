// import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();
// const HF_API_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2";

// const HF_API_TOKEN = process.env.HF_API_TOKEN;


// export const getEmbedding = async (textOrArray) => {
//     try {
//         const response = await axios.post(HF_API_URL, textOrArray, {
//             headers: {
//                 Authorization: `Bearer ${HF_API_TOKEN}`,
//                 "Content-Type": "application/json",
//             },
//         });

//         const result = response.data;

//         // Nếu đầu vào là 1 câu → trả về vector đơn
//         if (typeof textOrArray === "string") {
//             return Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;
//         }

//         // Nếu đầu vào là mảng nhiều câu → trả về mảng các vector
//         return result;
//     } catch (err) {
//         console.error("Error fetching embedding:", err.message);
//         return null;
//     }
// };

// import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();
// const HF_API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/paraphrase-MiniLM-L6-v2";

// export const getEmbedding = async (text) => {
//     try {
//         const response = await axios.post(HF_API_URL, {
//             inputs: text // chỉ một câu hoặc mảng các câu
//         }, {
//             headers: {
//                 Authorization: `Bearer ${HF_API_TOKEN}`,
//                 "Content-Type": "application/json",

//             }
//         });

//         return response.data;
//     } catch (err) {
//         console.error("Error fetching embedding:", err.response?.data || err.message);
//         return null;
//     }
// };

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const COHERE_API_URL = "https://api.cohere.ai/v2/embed";
const COHERE_API_KEY = process.env.COHERE_API_KEY; // hoặc ghi trực tiếp nếu muốn

export const getEmbedding = async (textOrArray) => {
    try {
        // Đảm bảo luôn truyền vào dưới dạng mảng
        const texts = typeof textOrArray === "string" ? [textOrArray] : textOrArray;

        const response = await axios.post(COHERE_API_URL, {
            texts: texts,
            model: "embed-v4.0",
            embedding_types: ["float"]
        }, {
            headers: {
                Authorization: `Bearer ${COHERE_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        const result = response.data.embeddings.float;

        // Nếu chỉ truyền vào 1 câu → trả về vector đơn
        if (typeof textOrArray === "string") {
            return result[0];
        }

        // Nếu truyền vào mảng → trả về mảng các vector
        return result;
    } catch (err) {
        console.error("Error fetching embedding from Cohere:", err.response?.data || err.message);
        return null;
    }
};