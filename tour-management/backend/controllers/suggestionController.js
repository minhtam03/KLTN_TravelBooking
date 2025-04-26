import { getAvailableTours } from '../services/tourService.js';
import { getAvailableFlights } from '../services/flightService.js';
import { getAvailableHotels } from '../services/hotelService.js';
import { getSuggestedTours, getUserEmbedding } from '../utils/tourRecommendationHelper.js';
import { getEmbedding } from '../utils/embeddingHelper.js';

// export const getSuggestions = async (req, res) => {
//     try {
//         const { budget, duration, departure, destination, startDate, userId } = req.body;

//         if (!budget || !duration || !departure || !startDate) {
//             return res.status(400).send("Vui lòng nhập đầy đủ thông tin bắt buộc!");
//         }

//         let options = [];
//         let reason = "Suggestions based on your booking history.";
//         const flightCache = {};
//         const hotelCache = {};

//         // ✅ Khi người dùng có nhập destination → truy vấn combo như bình thường (tối ưu)
//         if (destination) {
//             const tours = await getAvailableTours(destination, duration);

//             if (!flightCache[destination]) {
//                 flightCache[destination] = await getAvailableFlights(departure, destination, startDate);
//             }
//             if (!hotelCache[destination]) {
//                 hotelCache[destination] = await getAvailableHotels(destination);
//             }

//             const flights = flightCache[destination];
//             const hotels = hotelCache[destination];

//             for (let tour of tours) {
//                 for (let flight of flights.slice(0, 3)) {
//                     for (let hotel of hotels.slice(0, 3)) {
//                         const totalCost = tour.price + (flight.price) + (hotel.pricePerNight * duration);
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

//             // Lấy các từ khóa đặc trưng từ các tour đã từng đặt để tạo lý do gợi ý
//             // const keywordSet = new Set();
//             // recommendedTours.forEach(tour => {
//             //     const words = tour.desc.toLowerCase().split(/\W+/);
//             //     words.forEach(word => {
//             //         if (word.length > 4) keywordSet.add(word);
//             //     });
//             // });

//             // const keywords = Array.from(keywordSet).slice(0, 5).join(", ");
//             // reason = `Suggestions based on the tours you have previously booked, related to: ${keywords}.`;

//             const embeddingData = await getUserEmbedding(userId);
//             if (!embeddingData || !embeddingData.userEmbedding) {
//                 return res.status(404).json({ message: "User has no bookings yet" });
//             }
//             const { userEmbedding, bookedTours } = embeddingData;
//             const keywordFrequency = {};
//             bookedTours.forEach(tour => {
//                 const words = tour.desc.toLowerCase().split(/\W+/);
//                 words.forEach(word => {
//                     if (word.length > 4) {
//                         keywordFrequency[word] = (keywordFrequency[word] || 0) + 1;
//                     }
//                 });
//             });
//             const sortedKeywords = Object.entries(keywordFrequency)
//                 .sort((a, b) => b[1] - a[1])
//                 .map(([word]) => word);

//             // Lấy embedding của top 20 từ khóa
//             const keywordCandidates = sortedKeywords.slice(0, 20);
//             const keywordEmbeddings = await getEmbedding(keywordCandidates);

//             if (Array.isArray(keywordEmbeddings) && keywordEmbeddings.length === keywordCandidates.length) {
//                 const topKeywords = [];

//                 for (let i = 0; i < keywordCandidates.length; i++) {
//                     const keyword = keywordCandidates[i];
//                     const embedding = keywordEmbeddings[i];

//                     const dot = userEmbedding.reduce((sum, val, j) => sum + val * embedding[j], 0);
//                     const normU = Math.sqrt(userEmbedding.reduce((sum, val) => sum + val * val, 0));
//                     const normK = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
//                     const similarity = dot / (normU * normK);
//                     topKeywords.push({ keyword, similarity });
//                 }

//                 topKeywords.sort((a, b) => b.similarity - a.similarity);
//                 const finalKeywords = topKeywords.slice(0, 5).map(k => k.keyword);
//                 reason = `Suggestions based on your interests: ${finalKeywords.join(", ")}.`;
//             }


//             for (let tour of recommendedTours) {
//                 const city = tour.city;

//                 if (!flightCache[city]) {
//                     flightCache[city] = await getAvailableFlights(departure, city, startDate);
//                 }
//                 if (!hotelCache[city]) {
//                     hotelCache[city] = await getAvailableHotels(city);
//                 }

//                 const flights = flightCache[city];
//                 const hotels = hotelCache[city];

//                 for (let flight of flights.slice(0, 3)) {
//                     for (let hotel of hotels.slice(0, 3)) {
//                         const totalCost = tour.price + flight.price + (hotel.pricePerNight * duration);
//                         if (totalCost <= budget) {
//                             options.push({
//                                 destination: city,
//                                 tour,
//                                 flight: flight.toObject(),
//                                 hotel: hotel.toObject(),
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

//         res.json({ options, reason });

//     } catch (error) {
//         console.error("Lỗi trong getSuggestions:", error);
//         res.status(500).send("Lỗi máy chủ khi gợi ý lịch trình");
//     }
// };

export const getSuggestions = async (req, res) => {
    try {
        const { budget, duration, departure, destination, startDate, userId } = req.body;

        if (!budget || !duration || !departure || !startDate) {
            return res.status(400).send("Vui lòng nhập đầy đủ thông tin bắt buộc!");
        }

        const exchangeRate = 25000;
        let options = [];
        let reason = "Suggestions based on your booking history.";
        const flightCache = {};
        const hotelCache = {};

        const calculateTotalCost = (tour, flightGo, flightBack, hotel, duration) => {
            return tour.price +
                (flightGo.totalPrice / exchangeRate) +
                (flightBack.totalPrice / exchangeRate) +
                (hotel.pricePerNight * duration);
        };

        const isValidData = (flightGo, flightBack, hotel) => {
            return flightGo?.totalPrice && flightBack?.totalPrice && hotel?.pricePerNight;
        };

        if (destination) {
            const [tours, flights, hotels] = await Promise.all([
                getAvailableTours(destination, duration),
                getAvailableFlights(departure, destination, startDate, duration),
                getAvailableHotels(destination)
            ]);

            console.log("Fetched Tours:", tours);
            console.log("Fetched Flights:", flights);
            console.log("Fetched Hotels:", hotels);

            flightCache[destination] = flights;
            hotelCache[destination] = hotels;

            const { outboundFlights = [], returnFlights = [] } = flights || {};

            options = tours.flatMap(tour =>
                outboundFlights.slice(0, 3).flatMap(flightGo =>
                    returnFlights.slice(0, 3).flatMap(flightBack =>
                        hotels.slice(0, 3).map(hotel => {
                            if (!isValidData(flightGo, flightBack, hotel)) {
                                console.warn("Missing price info:", { flightGo, flightBack, hotel });
                                return null;
                            }
                            const totalCost = calculateTotalCost(tour, flightGo, flightBack, hotel, duration);
                            if (totalCost <= budget) {
                                return {
                                    destination,
                                    tour,
                                    flightGo,
                                    flightBack,
                                    hotel,
                                    totalCost,
                                };
                            }
                            return null;
                        })
                    )
                )
            ).filter(Boolean);

        } else {
            const recommendedTours = await getSuggestedTours(userId, 5);
            console.log("Recommended Tours:", recommendedTours);
            if (!recommendedTours.length) {
                return res.status(404).json({ message: "User has no bookings yet" });
            }

            const embeddingData = await getUserEmbedding(userId);
            if (!embeddingData || !embeddingData.userEmbedding) {
                return res.status(404).json({ message: "User has no bookings yet" });
            }

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
                    const embedding = keywordEmbeddings[i];
                    const dot = userEmbedding.reduce((sum, val, j) => sum + val * embedding[j], 0);
                    const normU = Math.sqrt(userEmbedding.reduce((sum, val) => sum + val * val, 0));
                    const normK = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
                    return { keyword, similarity: dot / (normU * normK) };
                }).sort((a, b) => b.similarity - a.similarity);

                reason = `Suggestions based on your interests: ${topKeywords.slice(0, 5).map(k => k.keyword).join(", ")}.`;
            }

            const cities = [...new Set(recommendedTours.map(t => t.city))];
            await Promise.all(cities.map(async city => {
                if (!flightCache[city]) flightCache[city] = await getAvailableFlights(departure, city, startDate, duration);
                if (!hotelCache[city]) hotelCache[city] = await getAvailableHotels(city);
            }));

            options = recommendedTours.flatMap(tour => {
                const city = tour.city;
                const { outboundFlights = [], returnFlights = [] } = flightCache[city] || {};
                const hotels = hotelCache[city] || [];

                return outboundFlights.slice(0, 3).flatMap(flightGo =>
                    returnFlights.slice(0, 3).flatMap(flightBack =>
                        hotels.slice(0, 3).map(hotel => {
                            if (!isValidData(flightGo, flightBack, hotel)) {
                                console.warn("Missing price info:", { flightGo, flightBack, hotel });
                                return null;
                            }
                            const totalCost = calculateTotalCost(tour, flightGo, flightBack, hotel, duration);
                            if (totalCost <= budget) {
                                return {
                                    destination: city,
                                    tour,
                                    flightGo,
                                    flightBack,
                                    hotel,
                                    totalCost,
                                    relevanceScore: tour.score
                                };
                            }
                            return null;
                        })
                    )
                );
            }).filter(Boolean);
        }

        if (!options.length) {
            return res.status(404).json({ message: "Không tìm thấy lịch trình phù hợp với ngân sách." });
        }

        options.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0) || a.totalCost - b.totalCost);

        res.json({ options, reason });

    } catch (error) {
        console.error("Lỗi trong getSuggestions:", error);
        res.status(500).send("Lỗi máy chủ khi gợi ý lịch trình");
    }
};
