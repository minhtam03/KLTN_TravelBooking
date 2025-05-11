// import { getAvailableTours } from '../services/tourService.js';
// import { getAvailableFlights } from '../services/flightService.js';
// import { getAvailableHotels } from '../services/hotelService.js';
// import { getSuggestedTours, getUserEmbedding } from '../utils/tourRecommendationHelper.js';
// import { getEmbedding } from '../utils/embeddingHelper.js';
// import { cosineSimilarity } from '../utils/tourRecommendationHelper.js';
// import { cityAirport } from '../utils/cities.js';


// // có log
// export const getSuggestions = async (req, res) => {
//     try {
//         const { budget, duration, departure, destination, startDate, userId } = req.body;
//         console.log("Request body:", req.body);

//         if (!budget || !duration || !departure || !startDate) {
//             console.warn("Thiếu trường bắt buộc");
//             return res.status(400).send("Missing required fields!");
//         }

//         const flightCache = {};
//         const hotelCache = {};
//         let options = [];
//         let reason = "Suggestions based on your booking history.";

//         const calculateTotalCost = (tour, flightGo, flightBack, hotel, duration) => {
//             return tour.price +
//                 (flightGo.totalPriceUSD) +
//                 (flightBack.totalPriceUSD) +
//                 (hotel.pricePerNight * duration);
//         };

//         const isValidData = (flightGo, flightBack, hotel) => {
//             return flightGo?.totalPriceUSD && flightBack?.totalPriceUSD && hotel?.pricePerNight;
//         };

//         if (destination) {
//             console.log("Gợi ý theo điểm đến cụ thể:", destination);

//             const [tours, flights, hotels] = await Promise.all([
//                 getAvailableTours(destination, duration),
//                 getAvailableFlights(departure, destination, startDate, duration),
//                 getAvailableHotels(destination)
//             ]);
//             console.log("Tours:", tours.length, "| Flights:", flights, "| Hotels:", hotels.length);

//             flightCache[destination] = flights;
//             hotelCache[destination] = hotels;

//             const { outboundFlights = [], returnFlights = [] } = flights || {};

//             options = tours.flatMap(tour =>
//                 outboundFlights.slice(0, 3).flatMap(flightGo =>
//                     returnFlights.slice(0, 3).flatMap(flightBack =>
//                         hotels.slice(0, 3).map(hotel => {
//                             if (!isValidData(flightGo, flightBack, hotel)) return null;
//                             const totalCost = calculateTotalCost(tour, flightGo, flightBack, hotel, duration);
//                             if (totalCost <= budget) {
//                                 return { destination, tour, flightGo, flightBack, hotel, totalCost };
//                             }
//                             return null;
//                         })
//                     )
//                 )
//             ).filter(Boolean);

//         } else {
//             console.log("✨ Gợi ý cá nhân hóa cho user:", userId);

//             const { recommendedTours, embeddingData } = await getSuggestedTours(userId, 10);
//             const tableData = recommendedTours.map(tour => ({
//                 Title: tour.title,
//                 City: tour.city,
//                 Price: `$${tour.price.toFixed(2)}`,
//                 Score: tour.score !== undefined ? tour.score.toFixed(4) : "N/A"
//             }));

//             console.table(tableData);

//             // Tính score trung bình (chỉ tính những tour có score hợp lệ)
//             const validScores = recommendedTours
//                 .filter(tour => typeof tour.score === 'number')
//                 .map(tour => tour.score);

//             const averageScore = validScores.length > 0
//                 ? (validScores.reduce((sum, val) => sum + val, 0) / validScores.length).toFixed(4)
//                 : "N/A";

//             console.log("Trung bình điểm tương đồng:", averageScore);
//             if (!recommendedTours.length) {
//                 return res.status(404).json({ message: "No recommended tour" });
//             }

//             if (embeddingData?.userEmbedding) {
//                 const { userEmbedding, bookedTours } = embeddingData;
//                 console.log("Using embedding data for personalization");

//                 const keywordFrequency = {};
//                 bookedTours.forEach(tour => {
//                     tour.desc.toLowerCase().split(/\W+/).forEach(word => {
//                         if (word.length > 4) keywordFrequency[word] = (keywordFrequency[word] || 0) + 1;
//                     });
//                 });

//                 const sortedKeywords = Object.entries(keywordFrequency)
//                     .sort((a, b) => b[1] - a[1])
//                     .map(([word]) => word)
//                     .slice(0, 20);

//                 const keywordEmbeddings = await getEmbedding(sortedKeywords);
//                 console.log("🔑 Top keywords:", sortedKeywords);

//                 if (keywordEmbeddings?.length === sortedKeywords.length) {
//                     const topKeywords = sortedKeywords.map((keyword, i) => {
//                         const similarity = cosineSimilarity(userEmbedding, keywordEmbeddings[i]);
//                         return { keyword, similarity };
//                     }).sort((a, b) => b.similarity - a.similarity);

//                     reason = `Suggestions based on your interests: ${topKeywords.slice(0, 5).map(k => k.keyword).join(", ")}.`;
//                     console.log(reason)
//                 }
//             } else {
//                 reason = "Top rated tours based on other users' reviews.";
//             }

//             const cities = [...new Set(recommendedTours.map(t => t.city))];
//             console.log("Cities to query flights/hotels:", cities);

//             await Promise.all(cities.map(async city => {
//                 if (!flightCache[city]) flightCache[city] = await getAvailableFlights(departure, city, startDate, duration);
//                 if (!hotelCache[city]) hotelCache[city] = await getAvailableHotels(city);
//             }));

//             options = recommendedTours.flatMap(tour => {
//                 const city = tour.city;
//                 const { outboundFlights = [], returnFlights = [] } = flightCache[city] || {};
//                 const hotels = hotelCache[city] || [];

//                 return outboundFlights.slice(0, 3).flatMap(flightGo =>
//                     returnFlights.slice(0, 3).flatMap(flightBack =>
//                         hotels.slice(0, 3).map(hotel => {
//                             if (!isValidData(flightGo, flightBack, hotel)) return null;
//                             const totalCost = calculateTotalCost(tour, flightGo, flightBack, hotel, duration);
//                             if (totalCost <= budget) {
//                                 const score = typeof tour.score === 'number'
//                                     ? (tour.score * 0.6 + (tour.avgRating || 0) * 0.4)
//                                     : (tour.avgRating || 0);

//                                 return {
//                                     destination: city,
//                                     tour,
//                                     flightGo,
//                                     flightBack,
//                                     hotel,
//                                     totalCost,
//                                     relevanceScore: Math.round(score * 100) / 100
//                                 };
//                             }
//                             return null;
//                         })
//                     )
//                 );
//             }).filter(Boolean);
//         }



//         if (!options.length) {
//             console.warn("Không có lịch trình nào thỏa mãn ngân sách");
//             return res.status(404).json({ message: "Không tìm thấy lịch trình phù hợp với ngân sách." });
//         }

//         options.sort((a, b) => b.relevanceScore - a.relevanceScore);
//         console.log("Final options count:", options.length);
//         res.json({ options, reason });

//     } catch (error) {
//         console.error("Lỗi trong getSuggestions:", error);
//         res.status(500).send("Lỗi máy chủ khi gợi ý lịch trình");
//     }
// };


import { getAvailableTours } from '../services/tourService.js';
import { getAvailableFlights } from '../services/flightService.js';
import { getAvailableHotels } from '../services/hotelService.js';
import { getSuggestedTours } from '../utils/tourRecommendationHelper.js';
import { getEmbedding } from '../utils/embeddingHelper.js';
import { cosineSimilarity } from '../utils/tourRecommendationHelper.js';

export const getSuggestions = async (req, res) => {
    try {
        const { budget, duration, departure, destination, startDate, userId } = req.body;
        console.log("Request body:", req.body);

        if (!budget || !duration || !departure || !startDate) {
            console.warn("Thiếu trường bắt buộc");
            return res.status(400).send("Missing required fields!");
        }

        const flightCache = {};
        const hotelCache = {};
        let options = [];
        let reason = "Suggestions based on your destination.";

        const calculateTotalCost = (tour, flightGo, flightBack, hotel, duration) => {
            return tour.price +
                (flightGo?.totalPriceUSD || 0) +
                (flightBack?.totalPriceUSD || 0) +
                ((hotel?.pricePerNight || 0) * duration);
        };

        const isValidData = (flightGo, flightBack, hotel) => {
            return flightGo || flightBack || hotel;
        };

        // === 1. Nếu có điểm đến cụ thể ===
        if (destination) {
            console.log("Gợi ý theo điểm đến cụ thể:", destination);

            const [tours, flights, hotels] = await Promise.all([
                getAvailableTours(destination, duration),
                getAvailableFlights(departure, destination, startDate, duration),
                getAvailableHotels(destination)
            ]);
            console.log("Tours:", tours.length, "| Flights:", flights, "| Hotels:", hotels.length);

            flightCache[destination] = flights;
            hotelCache[destination] = hotels;

            const { outboundFlights = [], returnFlights = [] } = flights || {};
            const outbound = outboundFlights.length ? outboundFlights.slice(0, 3) : [null];
            const inbound = returnFlights.length ? returnFlights.slice(0, 3) : [null];
            const hotelList = hotels.length ? hotels.slice(0, 3) : [null];

            options = tours.flatMap(tour =>
                outbound.flatMap(flightGo =>
                    inbound.flatMap(flightBack =>
                        hotelList.map(hotel => {
                            // if (!isValidData(flightGo, flightBack, hotel)) return null;
                            const totalCost = calculateTotalCost(tour, flightGo, flightBack, hotel, duration);
                            if (totalCost <= budget) {
                                return {
                                    destination,
                                    tour,
                                    flightGo,
                                    flightBack,
                                    hotel,
                                    totalCost
                                };
                            }
                            return null;
                        })
                    )
                )
            ).filter(Boolean);

            // === 2. Nếu không nhập điểm đến (gợi ý cá nhân hóa) ===
        } else {
            console.log("✨ Gợi ý cá nhân hóa cho user:", userId);

            const { recommendedTours, embeddingData } = await getSuggestedTours(userId, 5);
            if (!recommendedTours.length) {
                return res.status(404).json({ message: "No recommended tour" });
            }

            // Phân tích từ khóa nếu có embedding
            if (embeddingData?.userEmbedding) {
                const { userEmbedding, bookedTours } = embeddingData;

                const keywordFrequency = {};
                bookedTours.forEach(tour => {
                    tour.desc.toLowerCase().split(/\W+/).forEach(word => {
                        if (word.length > 4) keywordFrequency[word] = (keywordFrequency[word] || 0) + 1;
                    });
                });

                const sortedKeywords = Object.entries(keywordFrequency)
                    .sort((a, b) => b[1] - a[1])
                    .map(([word]) => word)
                    .slice(0, 20);

                const keywordEmbeddings = await getEmbedding(sortedKeywords);
                if (keywordEmbeddings?.length === sortedKeywords.length) {
                    const topKeywords = sortedKeywords.map((keyword, i) => {
                        const similarity = cosineSimilarity(userEmbedding, keywordEmbeddings[i]);
                        return { keyword, similarity };
                    }).sort((a, b) => b.similarity - a.similarity);

                    reason = `Suggestions based on your interests: ${topKeywords.slice(0, 5).map(k => k.keyword).join(", ")}.`;
                    console.log(reason);
                }
            } else {
                reason = "Top rated tours based on other users' reviews.";
            }

            // Lấy danh sách flight/hotel cho từng thành phố
            const cities = [...new Set(recommendedTours.map(t => t.city))];
            console.log("Cities to query flights/hotels:", cities);

            await Promise.all(cities.map(async city => {
                if (!flightCache[city]) flightCache[city] = await getAvailableFlights(departure, city, startDate, duration);
                if (!hotelCache[city]) hotelCache[city] = await getAvailableHotels(city);
            }));

            // Ghép lại tất cả lựa chọn
            options = recommendedTours.flatMap(tour => {
                const city = tour.city;
                const { outboundFlights = [], returnFlights = [] } = flightCache[city] || {};
                const hotels = hotelCache[city] || [];

                const outbound = outboundFlights.length ? outboundFlights.slice(0, 3) : [null];
                const inbound = returnFlights.length ? returnFlights.slice(0, 3) : [null];
                const hotelList = hotels.length ? hotels.slice(0, 3) : [null];

                return outbound.flatMap(flightGo =>
                    inbound.flatMap(flightBack =>
                        hotelList.map(hotel => {
                            if (!isValidData(flightGo, flightBack, hotel)) return null;

                            const totalCost = calculateTotalCost(tour, flightGo, flightBack, hotel, duration);
                            if (totalCost <= budget) {
                                const score = typeof tour.score === 'number'
                                    ? (tour.score * 0.6 + (tour.avgRating || 0) * 0.4)
                                    : (tour.avgRating || 0);

                                return {
                                    destination: city,
                                    tour,
                                    flightGo,
                                    flightBack,
                                    hotel,
                                    totalCost,
                                    relevanceScore: Math.round(score * 100) / 100
                                };
                            }
                            return null;
                        })
                    )
                );
            }).filter(Boolean);
        }

        if (!options.length) {
            console.warn("Không có lịch trình nào thỏa mãn ngân sách");
            return res.status(404).json({ message: "Không tìm thấy lịch trình phù hợp với ngân sách." });
        }

        options.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
        console.log("Final options count:", options.length);
        res.json({ options, reason });

    } catch (error) {
        console.error("Lỗi trong getSuggestions:", error);
        res.status(500).send("Lỗi máy chủ khi gợi ý lịch trình");
    }
};
