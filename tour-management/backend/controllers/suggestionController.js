// import Tour from '../models/Tour.js';
// import Flight from '../models/Flight.js';
// import Hotel from '../models/Hotel.js';
// import Booking from '../models/Booking.js'
// import dotenv from 'dotenv';
// import { ChatGroq } from "@langchain/groq";
// import { HumanMessage } from "@langchain/core/messages";
// import { calculateEstimatedCost } from '../utils/calculateEstimatedCost.js';
// import { findSuggestedInfo, findToursBasedOnKeywords } from '../utils/suggestionHelper.js';
// import { getKeywordsAndSynonymsFromAI } from '../utils/aiHelper.js';
// import { getAvailableTours } from '../services/tourService.js';
// import { getAvailableFlights } from '../services/flightService.js';
// import { getAvailableHotels } from '../services/hotelService.js';

// dotenv.config();
// const CHATGROQ_API_KEY = process.env.CHATGROQ_API_KEY;


// export const getSuggestions = async (req, res) => {
//     try {
//         const { budget, duration, departure, destination, startDate, userId } = req.body;

//         if (!budget || !duration || !departure || !startDate) {
//             return res.status(400).send("Vui lòng nhập đầy đủ thông tin bắt buộc!");
//         }

//         let destinations = [];
//         let keyword = null;

//         // Bước 1: Xử lý khi người dùng nhập destination
//         if (destination) {
//             destinations = [destination];
//             keyword = await findSuggestedInfo(userId); // Lấy keyword từ lịch sử đặt tour của người dùng
//         }
//         // Bước 2: Xử lý khi không nhập destination
//         else {
//             // Lấy cả keyword và từ đồng nghĩa từ AI
//             const { keywords, synonyms } = await getKeywordsAndSynonymsFromAI(userId);
//             destinations = await findToursBasedOnKeywords(keywords, synonyms);  // Tìm tour dựa trên từ khóa và từ đồng nghĩa
//         }

//         let options = [];

//         for (let dest of destinations) {
//             const tours = await getAvailableTours(dest, duration);
//             const flights = await getAvailableFlights(departure, dest, startDate);
//             const hotels = await getAvailableHotels(dest);

//             for (let tour of tours) {
//                 for (let flight of flights) {
//                     for (let hotel of hotels) {
//                         const totalCost = tour.price + (flight.price * 2) + (hotel.pricePerNight * duration);
//                         if (totalCost <= budget) {
//                             // Tính relevanceScore cho tour
//                             let score = 0;
//                             if (keyword && tour.desc.toLowerCase().includes(keyword)) score += 2;
//                             if (keyword && tour.title.toLowerCase().includes(keyword)) score += 1;

//                             options.push({
//                                 destination: dest,
//                                 tour: tour.toObject(),
//                                 flight: flight.toObject(),
//                                 hotel: hotel.toObject(),
//                                 totalCost,
//                                 relevanceScore: score
//                             });
//                         }
//                     }
//                 }
//             }
//         }

//         if (!options.length) {
//             return res.status(404).json({
//                 message: "Không tìm thấy lịch trình phù hợp với ngân sách.",
//                 suggestedKeyword: keyword
//             });
//         }

//         // Sắp xếp kết quả theo relevanceScore và totalCost
//         options.sort((a, b) => b.relevanceScore - a.relevanceScore || a.totalCost - b.totalCost);

//         res.json({ options, suggestedKeyword: keyword });

//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Lỗi máy chủ khi gợi ý lịch trình");
//     }
// };


// import Tour from '../models/Tour.js';
// import Flight from '../models/Flight.js';
// import Hotel from '../models/Hotel.js';
// import dotenv from 'dotenv';
// import { getAvailableTours } from '../services/tourService.js';
// import { getAvailableFlights } from '../services/flightService.js';
// import { getAvailableHotels } from '../services/hotelService.js';
// import { getSuggestedTours } from '../utils/tourRecommendationHelper.js';

// dotenv.config();

// export const getSuggestions = async (req, res) => {
//     try {
//         const { budget, duration, departure, destination, startDate, userId } = req.body;

//         if (!budget || !duration || !departure || !startDate) {
//             return res.status(400).send("Vui lòng nhập đầy đủ thông tin bắt buộc!");
//         }

//         let options = [];

//         // ✅ Khi người dùng có nhập destination → truy vấn combo như bình thường
//         if (destination) {
//             const tours = await getAvailableTours(destination, duration);
//             const flights = await getAvailableFlights(departure, destination, startDate);
//             const hotels = await getAvailableHotels(destination);

//             for (let tour of tours) {
//                 for (let flight of flights) {
//                     for (let hotel of hotels) {
//                         const totalCost = tour.price + (flight.price * 2) + (hotel.pricePerNight * duration);
//                         if (totalCost <= budget) {
//                             options.push({
//                                 destination,
//                                 tour: tour.toObject(),
//                                 flight: flight.toObject(),
//                                 hotel: hotel.toObject(),
//                                 totalCost,
//                             });
//                         }
//                     }
//                 }
//             }
//         }

//         // ✅ Khi KHÔNG nhập destination → dùng hàm gợi ý embedding tái sử dụng
//         else {
//             const recommendedTours = await getSuggestedTours(userId, 5);

//             if (!recommendedTours.length) {
//                 return res.status(404).json({ message: "User has no bookings yet" });
//             }

//             for (let tour of recommendedTours) {
//                 const dest = tour.city;
//                 const flights = await getAvailableFlights(departure, dest, startDate);
//                 const hotels = await getAvailableHotels(dest);

//                 for (let flight of flights) {
//                     for (let hotel of hotels) {
//                         const totalCost = tour.price + (flight.price * 2) + (hotel.pricePerNight * duration);
//                         if (totalCost <= budget) {
//                             options.push({
//                                 destination: dest,
//                                 tour,
//                                 flight,
//                                 hotel,
//                                 totalCost,
//                                 relevanceScore: tour.score
//                             });
//                         }
//                     }
//                 }
//             }
//         }

//         if (!options.length) {
//             return res.status(404).json({ message: "Không tìm thấy lịch trình phù hợp với ngân sách." });
//         }

//         // Ưu tiên relevanceScore nếu có, sau đó tới totalCost
//         options.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0) || a.totalCost - b.totalCost);

//         res.json({ options });

//     } catch (error) {
//         console.error("Lỗi trong getSuggestions:", error);
//         res.status(500).send("Lỗi máy chủ khi gợi ý lịch trình");
//     }
// };


import Tour from '../models/Tour.js';
import Flight from '../models/Flight.js';
import Hotel from '../models/Hotel.js';
import { getAvailableTours } from '../services/tourService.js';
import { getAvailableFlights } from '../services/flightService.js';
import { getAvailableHotels } from '../services/hotelService.js';
import { getSuggestedTours } from '../utils/tourRecommendationHelper.js';


export const getSuggestions = async (req, res) => {
    try {
        const { budget, duration, departure, destination, startDate, userId } = req.body;

        if (!budget || !duration || !departure || !startDate) {
            return res.status(400).send("Vui lòng nhập đầy đủ thông tin bắt buộc!");
        }

        let options = [];
        let reason = null;
        const flightCache = {};
        const hotelCache = {};

        // ✅ Khi người dùng có nhập destination → truy vấn combo như bình thường (tối ưu)
        if (destination) {
            const tours = await getAvailableTours(destination, duration);

            if (!flightCache[destination]) {
                flightCache[destination] = await getAvailableFlights(departure, destination, startDate);
            }
            if (!hotelCache[destination]) {
                hotelCache[destination] = await getAvailableHotels(destination);
            }

            const flights = flightCache[destination];
            const hotels = hotelCache[destination];

            for (let tour of tours) {
                for (let flight of flights.slice(0, 3)) {
                    for (let hotel of hotels.slice(0, 3)) {
                        const totalCost = tour.price + (flight.price) + (hotel.pricePerNight * duration);
                        if (totalCost <= budget) {
                            options.push({
                                destination,
                                tour: tour.toObject(),
                                flight: flight.toObject(),
                                hotel: hotel.toObject(),
                                totalCost,
                            });
                        }
                    }
                }
            }
        }

        // ✅ Khi KHÔNG nhập destination → dùng hàm gợi ý embedding tái sử dụng
        else {
            const recommendedTours = await getSuggestedTours(userId, 5);

            if (!recommendedTours.length) {
                return res.status(404).json({ message: "User has no bookings yet" });
            }

            // Lấy các từ khóa đặc trưng từ các tour đã từng đặt để tạo lý do gợi ý
            const keywordSet = new Set();
            recommendedTours.forEach(tour => {
                const words = tour.desc.toLowerCase().split(/\W+/);
                words.forEach(word => {
                    if (word.length > 4) keywordSet.add(word);
                });
            });

            const keywords = Array.from(keywordSet).slice(0, 5).join(", ");
            reason = `Suggestions based on the tours you have previously booked, related to: ${keywords}.`;

            for (let tour of recommendedTours) {
                const city = tour.city;

                if (!flightCache[city]) {
                    flightCache[city] = await getAvailableFlights(departure, city, startDate);
                }
                if (!hotelCache[city]) {
                    hotelCache[city] = await getAvailableHotels(city);
                }

                const flights = flightCache[city];
                const hotels = hotelCache[city];

                for (let flight of flights.slice(0, 3)) {
                    for (let hotel of hotels.slice(0, 3)) {
                        const totalCost = tour.price + flight.price + (hotel.pricePerNight * duration);
                        if (totalCost <= budget) {
                            options.push({
                                destination: city,
                                tour,
                                flight: flight.toObject(),
                                hotel: hotel.toObject(),
                                totalCost,
                                relevanceScore: tour.score
                            });
                        }
                    }
                }
            }
        }

        if (!options.length) {
            return res.status(404).json({ message: "Không tìm thấy lịch trình phù hợp với ngân sách." });
        }

        // Ưu tiên relevanceScore nếu có, sau đó tới totalCost
        options.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0) || a.totalCost - b.totalCost);

        res.json({ options, reason });

    } catch (error) {
        console.error("Lỗi trong getSuggestions:", error);
        res.status(500).send("Lỗi máy chủ khi gợi ý lịch trình");
    }
};
