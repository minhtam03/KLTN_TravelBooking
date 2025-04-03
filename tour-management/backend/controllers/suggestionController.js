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


export const findSuggestedInfo = async (userId) => {
    try {
        if (!userId) {
            console.error("User ID is missing or invalid.");
            return { destinations: [], keyword: null };
        }

        const bookings = await Booking.find({ userId }).populate('tourId');
        if (!bookings.length) {
            console.log(`No bookings found for user: ${userId}`);
            return { destinations: [], keyword: null };
        }

        const validBookings = bookings.filter(booking => booking.tourId && booking.tourId.desc);
        if (!validBookings.length) {
            console.log("No valid tours found in booking history.");
            return { destinations: [], keyword: null };
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

        let keyword = response?.content?.trim().toLowerCase() || null;
        console.log(`User's preferred destination keyword: ${keyword}`);

        const suggestedTours = keyword
            ? await Tour.find({ desc: { $regex: keyword, $options: "i" } })
            : [];

        let destinations = suggestedTours.map(tour => tour.city);
        console.log(`Suggested Destinations: ${destinations}`);

        return { destinations, keyword };

    } catch (error) {
        console.error("Error fetching suggested information:", error);
        return { destinations: [], keyword: null };
    }
};


export const getSuggestions = async (req, res) => {
    try {
        let { budget, duration, departure, destination, startDate, userId } = req.body;

        if (!budget || !duration || !departure || !startDate) {
            return res.status(400).send("Vui lòng nhập đầy đủ thông tin bắt buộc!");
        }

        // Gọi hàm để lấy danh sách điểm đến và từ khóa gợi ý
        let { destinations, keyword } = await findSuggestedInfo(userId);

        // Nếu người dùng không nhập destination, dùng danh sách từ gợi ý
        if (!destination) {
            if (!destinations.length) {
                return res.status(400).json({
                    message: "Không có lịch sử đặt tour hoặc không tìm thấy điểm đến phù hợp.",
                    suggestedKeyword: keyword
                });
            }
        } else {
            // Nếu người dùng đã nhập destination, chỉ dùng destination đó
            destinations = [destination];
        }

        console.log(`Điểm đến được sử dụng: ${destinations}`);
        console.log(`Từ khóa gợi ý: ${keyword}`);

        let options = [];

        // Lặp qua tất cả điểm đến được tìm thấy
        for (let dest of destinations) {
            // Lấy dữ liệu tour, chuyến bay, khách sạn cho từng điểm đến
            const tours = await Tour.getAvailableTours(dest, duration);
            const flights = await Flight.getAvailableFlights(departure, dest, startDate);
            const hotels = await Hotel.getAvailableHotels(dest);

            console.log(`Data for ${dest}:`);
            console.log('Tours:', tours);
            console.log('Flights:', flights);
            console.log('Hotels:', hotels);

            for (let tour of tours) {
                for (let flight of flights) {
                    for (let hotel of hotels) {
                        const totalCost = tour.price + (flight.price * 2) + (hotel.pricePerNight * duration);
                        if (totalCost <= budget) {
                            options.push({
                                destination: dest,
                                tour: tour.toObject(),
                                flight: flight.toObject(),
                                hotel: hotel.toObject(),
                                totalCost
                            });
                        }
                    }
                }
            }
        }

        if (options.length === 0) {
            return res.status(404).json({
                message: "No options found within your budget.",
                suggestedKeyword: keyword
            });
        }

        return res.json({ options, suggestedKeyword: keyword });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving suggestions");
    }
};
