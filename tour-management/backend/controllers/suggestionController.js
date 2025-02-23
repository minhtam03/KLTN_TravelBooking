import Tour from '../models/Tour.js';
import Flight from '../models/Flight.js';
import Hotel from '../models/Hotel.js';
import Booking from '../models/Booking.js'
import dotenv from 'dotenv';
import { ChatGroq } from "@langchain/groq";
import { HumanMessage } from "@langchain/core/messages";

import { calculateEstimatedCost } from '../utils/calculateEstimatedCost.js';

dotenv.config();
const CHATGROQ_API_KEY = process.env.CHATGROQ_API_KEY;



export const getSuggestions = async (req, res) => {
    try {
        let { budget, duration, departure, destination, startDate, userId } = req.body;

        if (!budget || !duration || !departure || !startDate) {
            return res.status(400).send("Vui lòng nhập đầy đủ thông tin bắt buộc!");
        }

        // Nếu user không nhập điểm đến, tự động gợi ý bằng ChatGroq AI
        if (!destination) {
            destination = await findSuggestedDestination(userId);
            if (!destination) {
                return res.status(400).send('Không có lịch sử đặt tour hoặc không tìm thấy điểm đến phù hợp.');
            }
        }

        console.log(`Điểm đến gợi ý: ${destination}`);

        // Fetch tour, flight, and hotel data from the database
        const tours = await Tour.getAvailableTours(destination, duration);
        const flights = await Flight.getAvailableFlights(departure, destination, startDate);
        const hotels = await Hotel.getAvailableHotels(destination);

        // Log data to ensure it's correct
        console.log('Tours:', tours);
        console.log('Flights:', flights);
        console.log('Hotels:', hotels);
        console.log("end");

        // Find the best options within budget
        const options = [];

        for (let tour of tours) {
            for (let flight of flights) {
                for (let hotel of hotels) {
                    // const estimatedCost = calculateEstimatedCost(tour, flight, hotel, budget, duration);

                    // if (estimatedCost.total <= budget) {
                    //     options.push({
                    //         // tour: { title: tour.title, desc: tour.desc, price: tour.price },
                    //         tour: tour.toObject(),
                    //         flight: {
                    //             flightNumber: flight.flightNumber,
                    //             airline: flight.airline,
                    //             airplaneType: flight.airplaneType,
                    //             departureDate: flight.departureDate,
                    //             class: flight.class,
                    //             price: flight.price * 2,
                    //         },
                    //         // hotel: {
                    //         //     hotelName: hotel.hotelName,
                    //         //     amenities: hotel.amenities,
                    //         //     price: hotel.pricePerNight * duration,
                    //         //     stars: hotel.stars,
                    //         //     pricePerNight: hotel.pricePerNight
                    //         // },
                    //         hotel: hotel.toObject(),
                    //         totalCost: estimatedCost.total,
                    //         estimatedDetails: estimatedCost
                    //     });
                    // }

                    const totalCost = tour.price + (flight.price * 2) + (hotel.pricePerNight * duration);

                    if (totalCost <= budget) {
                        options.push({
                            tour: tour.toObject(),
                            flight: flight.toObject(),
                            hotel: hotel.toObject(),
                            totalCost
                        });
                    }

                }
            }
        }

        if (options.length === 0) {
            return res.status(404).send('No options found within your budget.');
        }

        return res.json({ options });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving suggestions');
    }
};

// export const getSuggestedDestination = async (req, res) => {
//     try {
//         const { userId } = req.params;

//         if (!userId) {
//             console.error("Error: User ID is missing or invalid.");
//             return res.status(400).json({ message: "User ID is required." });
//         }

//         const bookings = await Booking.find({ userId }).populate('tourId');
//         if (!bookings.length) {
//             console.log(`No bookings found for user: ${userId}`);
//             return res.status(404).json({ message: "No booking history found for this user." });
//         }

//         // Lọc những booking hợp lệ (có `tourId` và `desc`)
//         const validBookings = bookings.filter(booking => booking.tourId && booking.tourId.desc);
//         if (!validBookings.length) {
//             console.log("No valid tours found in booking history.");
//             return res.status(404).json({ message: "User has bookings, but no valid tour descriptions available." });
//         }

//         // Tạo danh sách mô tả tour
//         const tourDescriptions = validBookings.map(booking => booking.tourId.desc).join("\n");
//         console.log("Tour descriptions:", tourDescriptions);

//         // Gọi ChatGroq AI để phân tích sở thích du lịch
//         console.log("Sending request to ChatGroq...");
//         const model = new ChatGroq({
//             apiKey: CHATGROQ_API_KEY,
//         });

//         const message = new HumanMessage(`
//             Summarize the following descriptions:
//             ${tourDescriptions}

//             Identify the most common theme or keyword that describes the user's travel preferences.

//             Return only one word that best represents the user's favorite type of destination, such as 'beach', 'mountain', 'city', etc.

//             Do not return a full sentence or explanation, only a single word.
//         `);


//         // Giới hạn thời gian gọi API ChatGroq (timeout 10 giây)
//         const response = await Promise.race([
//             model.invoke([message]),
//             new Promise((_, reject) => setTimeout(() => reject(new Error("ChatGroq timeout")), 10000))
//         ]);

//         if (!response || !response.content) {
//             console.error("ChatGroq API did not return a valid response.");
//             return res.status(500).json({ message: "AI service failed to process the request." });
//         }

//         const keyword = response.content.trim().toLowerCase();
//         console.log(`User's preferred destination type: ${keyword}`);

//         // Tìm tour phù hợp với sở thích của user
//         const suggestedTour = await Tour.findOne({ desc: { $regex: keyword, $options: "i" } });

//         if (!suggestedTour) {
//             console.log(`No tour found matching keyword: ${keyword}`);
//             return res.status(404).json({ message: `No suggested destination found for preference: ${keyword}` });
//         }

//         console.log(`Suggested Destination: ${suggestedTour.city}`);
//         return res.status(200).json({ suggestedDestination: suggestedTour.city });

//     } catch (error) {
//         console.error("Error fetching suggested destination:", error);
//         return res.status(500).json({ message: "Internal server error.", error: error.message });
//     }
// };

export const findSuggestedDestination = async (userId) => {
    try {
        if (!userId) {
            console.error("User ID is missing or invalid.");
            return null;
        }

        const bookings = await Booking.find({ userId }).populate('tourId');
        if (!bookings.length) {
            console.log(`No bookings found for user: ${userId}`);
            return null;
        }

        const validBookings = bookings.filter(booking => booking.tourId && booking.tourId.desc);
        if (!validBookings.length) {
            console.log("No valid tours found in booking history.");
            return null;
        }

        const tourDescriptions = validBookings.map(booking => booking.tourId.desc).join("\n");

        const model = new ChatGroq({ apiKey: CHATGROQ_API_KEY });

        const message = new HumanMessage(`
            Summarize the following descriptions:
            ${tourDescriptions}
        
            Identify the most common theme or keyword that describes the user's travel preferences.
            
            Return only one word that best represents the user's favorite type of destination, such as 'beach', 'mountain', 'city', etc.
            
            Do not return a full sentence or explanation, only a single word.
        `);

        const response = await Promise.race([
            model.invoke([message]),
            new Promise((_, reject) => setTimeout(() => reject(new Error("ChatGroq timeout")), 10000))
        ]);

        if (!response || !response.content) {
            console.error("ChatGroq API did not return a valid response.");
            return null;
        }

        const keyword = response.content.trim().toLowerCase();
        console.log(`User's preferred destination type: ${keyword}`);

        const suggestedTour = await Tour.findOne({ desc: { $regex: keyword, $options: "i" } });

        console.log(suggestedTour.city)
        return suggestedTour ? suggestedTour.city : null;


    } catch (error) {
        console.error("Error fetching suggested destination:", error);
        return null;
    }
};
