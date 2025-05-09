// // scripts/updateEmbeddings.js
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import Tour from '../models/Tour.js';
// import { getEmbedding } from '../utils/embeddingHelper.js';

// dotenv.config();

// const MONGO_URI = process.env.MONGO_URI;

// const validCities = new Set([
//     'Ha Noi', 'Ho Chi Minh', 'Da Nang', 'Hai Phong', 'Can Tho',
//     'Binh Duong', 'Bac Ninh', 'Vinh', 'Hue', 'Long An', 'Nghe An',
//     'Bac Giang', 'Quang Ninh', 'Nam Dinh', 'Thanh Hoa', 'Quang Binh',
//     'Son La', 'Tien Giang', 'Vinh Long', 'Dak Lak', 'Binh Thuan',
//     'Quang Tri', 'Lam Dong', 'An Giang', 'Ninh Binh', 'Tay Ninh',
//     'Ben Tre', 'Kien Giang', 'Dong Nai', 'Gia Lai', 'Bac Lieu',
//     'Phu Tho', 'Ca Mau', 'Hau Giang', 'Binh Phuoc', 'Ha Giang',
//     'Soc Trang', 'Dak Nong', 'Thanh Hoa', 'Lai Chau', 'Ha Tinh',
//     'Khanh Hoa', 'Yen Bai', 'Quang Nam', 'Nghe An', 'Bac Kan',
//     'Quang Ngai', 'Lang Son', 'Nam Dinh', 'Thai Nguyen', 'Hoa Binh',
//     'Quang Binh', 'Tuyen Quang', 'Hien Giang', 'Long An', 'Lam Dong',
//     'Sapa', 'Hung Yen', 'Bac Giang', 'Tuyen Quang', 'Quang Tri'
// ]);

// const updateAllTourEmbeddings = async () => {
//     try {
//         await mongoose.connect(MONGO_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });

//         console.log("✅ Connected to MongoDB");

//         const tours = await Tour.find({ desc: { $exists: true, $ne: "" } });

//         console.log(`🧠 Found ${tours.length} tours with desc`);

//         for (const tour of tours) {
//             // Sửa các trường không hợp lệ nếu cần
//             if (!validCities.has(tour.city)) {
//                 console.warn(`⚠️ Invalid city '${tour.city}' for tour '${tour.title}', setting to 'Ha Noi'`);
//                 tour.city = 'Ha Noi';
//             }
//             if (!tour.address) tour.address = "Default address";
//             if (!tour.distance || typeof tour.distance !== 'number') tour.distance = 1;
//             if (!tour.title) tour.title = "Unnamed Tour";
//             if (!tour.price || typeof tour.price !== 'number') tour.price = 0;
//             if (!tour.maxGroupSize || typeof tour.maxGroupSize !== 'number') tour.maxGroupSize = 1;

//             const embedding = await getEmbedding(tour.desc);

//             if (embedding) {
//                 try {
//                     tour.embedding = embedding;
//                     await tour.save();
//                     console.log(`✅ Updated embedding for tour: ${tour.title}`);
//                 } catch (err) {
//                     console.warn(`⚠️ Could not update tour '${tour.title}':`, err.message);
//                 }
//             } else {
//                 console.warn(`⚠️ Failed to get embedding for tour: ${tour.title}`);
//             }
//         }

//         console.log("🎉 Embedding update completed!");
//         process.exit(0);
//     } catch (err) {
//         console.error("❌ Error updating embeddings:", err);
//         process.exit(1);
//     }
// };

// updateAllTourEmbeddings();

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Tour from '../models/Tour.js';
import { getEmbedding } from '../utils/embeddingHelper.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const updateAllTourEmbeddings = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("✅ Connected to MongoDB");

        // Lấy tất cả tour có mô tả
        const tours = await Tour.find({ desc: { $exists: true, $ne: "" } });

        console.log(`🧠 Found ${tours.length} tours with desc to re-embed`);

        for (const tour of tours) {
            // Xóa embedding cũ
            tour.embedding = undefined;

            // Gọi hàm tạo embedding mới
            const embedding = await getEmbedding(tour.desc);

            if (embedding) {
                try {
                    tour.embedding = embedding;
                    await tour.save();
                    console.log(`✅ Replaced embedding for tour: ${tour.title}`);
                    console.log(`ℹ️ Embedding length: ${embedding.length}`);
                } catch (err) {
                    console.warn(`⚠️ Failed to save tour '${tour.title}':`, err.message);
                }
            } else {
                console.warn(`⚠️ Failed to generate embedding for '${tour.title}'`);
            }
        }

        console.log("🎉 All embeddings replaced successfully!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error updating embeddings:", err);
        process.exit(1);
    }
};

updateAllTourEmbeddings();
