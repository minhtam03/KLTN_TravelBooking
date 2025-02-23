import Tour from '../models/Tour.js';
import Flight from '../models/Flight.js';
import Hotel from '../models/Hotel.js';
import Booking from '../models/Booking.js'
import dotenv from 'dotenv';

import { calculateEstimatedCost } from '../utils/calculateEstimatedCost.js';

dotenv.config();
const CHATGROQ_API_KEY = process.env.CHATGROQ_API_KEY;
const CHATGROQ_API_URL = "https://api.chatgroq.com/v1/completions"; // Giả sử đây là API của ChatGroq


const getSuggestedDestination = async (userId) => {
    try {
        const bookings = await Booking.find({ userId }).populate('tourId');
        if (!bookings.length) return null;

        const tourDescriptions = bookings.map(booking => booking.tourId.desc).join("\n");
        const response = await fetch(CHATGROQ_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${CHATGROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4",  // Giả sử ChatGroq hỗ trợ GPT-4
                messages: [
                    { role: "system", content: "Bạn là một trợ lý du lịch, phân tích xu hướng du lịch của người dùng." },
                    { role: "user", content: `Phân tích sở thích du lịch từ mô tả sau:\n${tourDescriptions}\n\nTrả về từ khóa phổ biến nhất, ví dụ: 'beach', 'mountain', 'city'` }
                ]
            })
        })

        if (!response.ok) {
            throw new Error(`API ChatGroq lỗi: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        // Trích xuất từ khóa từ phản hồi API
        const keyword = data.choices[0].message.content.trim();
        console.log(`Từ khóa phổ biến của user: ${keyword}`);

        // Tìm tour mới có mô tả chứa từ khóa này
        const suggestedTour = await Tour.findOne({ desc: { $regex: keyword, $options: "i" } });

        return suggestedTour ? suggestedTour.city : null;

    } catch (error) {
        console.error("Error fetching suggested destination: ", error);
        return null;
    }
}


export const getSuggestions = async (req, res) => {
    try {
        const { budget, duration, departure, destination, startDate, userId } = req.body;

        if (!budget || !duration || !departure || !startDate) {
            return res.status(400).send("Vui lòng nhập đầy đủ thông tin bắt buộc!");
        }

        // Nếu user không nhập điểm đến, tự động gợi ý bằng ChatGroq AI
        if (!destination) {
            destination = await getSuggestedDestination(userId);
            if (!destination) {
                return res.status(400).send('Không có lịch sử đặt tour hoặc không tìm thấy điểm đến phù hợp.');
            }
        }

        console.log(`Điểm đến gợi ý: ${destination}`);

        // Fetch tour, flight, and hotel data from the database
        const tours = await Tour.getAvailableTours(destination);
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
                    // Check if the total cost is within the budget
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

