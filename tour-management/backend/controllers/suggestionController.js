import Tour from '../models/Tour.js';
import Flight from '../models/Flight.js';
import Hotel from '../models/Hotel.js';
import Booking from '../models/Booking.js'
import dotenv from 'dotenv';
import { ChatGroq } from "@langchain/groq";
import { HumanMessage } from "@langchain/core/messages";
import { calculateEstimatedCost } from '../utils/calculateEstimatedCost.js';
import { findSuggestedInfo, findToursBasedOnKeywords } from '../utils/suggestionHelper.js';
import { getKeywordsAndSynonymsFromAI } from '../utils/aiHelper.js';
import { getAvailableTours } from '../services/tourService.js';
import { getAvailableFlights } from '../services/flightService.js';
import { getAvailableHotels } from '../services/hotelService.js';

dotenv.config();
const CHATGROQ_API_KEY = process.env.CHATGROQ_API_KEY;


export const getSuggestions = async (req, res) => {
    try {
        const { budget, duration, departure, destination, startDate, userId } = req.body;

        if (!budget || !duration || !departure || !startDate) {
            return res.status(400).send("Vui lòng nhập đầy đủ thông tin bắt buộc!");
        }

        let destinations = [];
        let keyword = null;

        // Bước 1: Xử lý khi người dùng nhập destination
        if (destination) {
            destinations = [destination];
            keyword = await findSuggestedInfo(userId); // Lấy keyword từ lịch sử đặt tour của người dùng
        }
        // Bước 2: Xử lý khi không nhập destination
        else {
            // Lấy cả keyword và từ đồng nghĩa từ AI
            const { keywords, synonyms } = await getKeywordsAndSynonymsFromAI(userId);
            destinations = await findToursBasedOnKeywords(keywords, synonyms);  // Tìm tour dựa trên từ khóa và từ đồng nghĩa
        }

        let options = [];

        for (let dest of destinations) {
            const tours = await getAvailableTours(dest, duration);
            const flights = await getAvailableFlights(departure, dest, startDate);
            const hotels = await getAvailableHotels(dest);

            for (let tour of tours) {
                for (let flight of flights) {
                    for (let hotel of hotels) {
                        const totalCost = tour.price + (flight.price * 2) + (hotel.pricePerNight * duration);
                        if (totalCost <= budget) {
                            // Tính relevanceScore cho tour
                            let score = 0;
                            if (keyword && tour.desc.toLowerCase().includes(keyword)) score += 2;
                            if (keyword && tour.title.toLowerCase().includes(keyword)) score += 1;

                            options.push({
                                destination: dest,
                                tour: tour.toObject(),
                                flight: flight.toObject(),
                                hotel: hotel.toObject(),
                                totalCost,
                                relevanceScore: score
                            });
                        }
                    }
                }
            }
        }

        if (!options.length) {
            return res.status(404).json({
                message: "Không tìm thấy lịch trình phù hợp với ngân sách.",
                suggestedKeyword: keyword
            });
        }

        // Sắp xếp kết quả theo relevanceScore và totalCost
        options.sort((a, b) => b.relevanceScore - a.relevanceScore || a.totalCost - b.totalCost);

        res.json({ options, suggestedKeyword: keyword });

    } catch (error) {
        console.error(error);
        res.status(500).send("Lỗi máy chủ khi gợi ý lịch trình");
    }
};