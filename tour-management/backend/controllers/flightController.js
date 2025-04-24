import Flight from '../models/Flight.js'
import axios from "axios";
import { cityList } from "../utils/cities.js";
import puppeteer from 'puppeteer';
import dayjs from 'dayjs';
import fs from 'fs';

// Create a new flight
export const createFlight = async (req, res) => {
    try {
        const newFlight = new Flight(req.body)
        const savedFlight = await newFlight.save()

        res.status(200).json({
            success: true,
            message: 'Successfully created flight',
            data: savedFlight,
        })
    } catch (error) {
        console.error('Create flight failed:', error.message)
        res.status(500).json({
            success: false,
            message: 'Failed to create flight. Try again.',
        })
    }
}

// Update flight
export const updateFlight = async (req, res) => {
    const id = req.params.id

    try {
        const updatedFlight = await Flight.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        )

        res.status(200).json({
            success: true,
            message: 'Successfully updated flight',
            data: updatedFlight,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update flight',
        })
    }
}

// Delete flight
export const deleteFlight = async (req, res) => {
    const id = req.params.id

    try {
        await Flight.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            message: 'Successfully deleted flight',
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete flight',
        })
    }
}

// Get single flight
export const getSingleFlight = async (req, res) => {
    const id = req.params.id

    try {
        const flight = await Flight.findById(id)
        res.status(200).json({
            success: true,
            message: 'Flight retrieved successfully',
            data: flight,
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Flight not found',
        })
    }
}

// Get all flights (optional pagination)
export const getAllFlights = async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : null

    try {
        const flights = page !== null
            ? await Flight.find().skip(page * 8).limit(8)
            : await Flight.find()

        res.status(200).json({
            success: true,
            count: flights.length,
            message: 'Successfully retrieved flights',
            data: flights,
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Flights not found',
        })
    }
}

// Search flights by query params
export const searchFlights = async (req, res) => {
    const {
        tripType,
        departureCity,
        arrivalCity,
        departureDate,
        returnDate,
        flightClass,
        minPrice,
        maxPrice,
    } = req.query;

    // 1. Validate các trường bắt buộc
    if (!tripType || !["one-way", "round-trip"].includes(tripType)) {
        return res.status(400).json({
            success: false,
            message: "tripType is required and must be 'one-way' or 'round-trip'",
        });
    }

    if (!departureCity || !arrivalCity || !departureDate) {
        return res.status(400).json({
            success: false,
            message: "departureCity, arrivalCity and departureDate are required",
        });
    }

    if (tripType === "round-trip" && !returnDate) {
        return res.status(400).json({
            success: false,
            message: "returnDate is required for round-trip flights",
        });
    }

    try {
        const query = {
            tripType,
            departureCity: new RegExp(departureCity, "i"),
            arrivalCity: new RegExp(arrivalCity, "i"),
            departureDate: {
                $gte: new Date(departureDate),
                $lt: new Date(new Date(departureDate).getTime() + 24 * 60 * 60 * 1000),
            },
        };

        // Nếu là vé khứ hồi → lọc thêm returnDate
        if (tripType === "round-trip") {
            query.returnDate = {
                $gte: new Date(returnDate),
                $lt: new Date(new Date(returnDate).getTime() + 24 * 60 * 60 * 1000),
            };
        }

        // Optional: hạng vé
        if (flightClass) query.flightClass = flightClass;

        // Optional: khoảng giá
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        const flights = await Flight.find(query);

        res.status(200).json({
            success: true,
            message: "Flight search successful",
            data: flights,
        });
    } catch (error) {
        console.error("Flight search error:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Count total flights
export const getFlightCount = async (req, res) => {
    try {
        const count = await Flight.estimatedDocumentCount()
        res.status(200).json({
            success: true,
            data: count,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch flight count',
        })
    }
}

// export const importRealFlights = async (req, res) => {
//     const accessKey = 'ec938dfc7d2e318949499a7a6105b142';

//     try {
//         const response = await axios.get(`https://api.aviationstack.com/v1/flights?access_key=${accessKey}`);

//         if (!response.data || !response.data.data) {
//             return res.status(500).json({
//                 success: false,
//                 message: "Không có dữ liệu từ API",
//             });
//         }

//         const raw = response.data.data;

//         const formattedFlights = raw
//             .filter(f =>
//                 f.departure?.airport &&
//                 f.arrival?.airport &&
//                 f.flight?.iata &&
//                 f.departure?.scheduled &&
//                 f.airline?.name
//             )
//             .map(f => {
//                 const departureCity = f.departure.airport;
//                 const arrivalCity = f.arrival.airport;

//                 // Kiểm tra có trong cityList không
//                 // if (!cityList.includes(departureCity) || !cityList.includes(arrivalCity)) {
//                 //     return null;
//                 // }

//                 return {
//                     departureCity,
//                     arrivalCity,
//                     flightNumber: f.flight.iata || f.flight.number,
//                     tripType: "one-way",
//                     departureDate: new Date(f.departure.scheduled),
//                     departureTime: new Date(f.departure.scheduled).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
//                     returnDate: null,
//                     returnTime: null,
//                     price: Math.floor(Math.random() * 400 + 100), // Tạo giá ngẫu nhiên 100–500
//                     airline: f.airline.name,
//                     airplaneType: f.aircraft?.icao || "Airbus A320",
//                     flightClass: "economy",
//                 };
//             })
//             .filter(f => f !== null); // Bỏ những chuyến không hợp lệ

//         if (formattedFlights.length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Không có chuyến bay hợp lệ để lưu",
//             });
//         }

//         // Xoá dữ liệu cũ nếu cần
//         await Flight.deleteMany({});
//         await Flight.insertMany(formattedFlights);

//         res.status(200).json({
//             success: true,
//             message: "Đã cập nhật chuyến bay thành công",
//             data: formattedFlights.slice(0, 10), // trả về 10 bản ghi mẫu
//         });
//     } catch (error) {
//         console.error("❌ Lỗi khi import chuyến bay:", error);
//         res.status(500).json({
//             success: false,
//             message: "Lỗi khi gọi API hoặc lưu dữ liệu chuyến bay",
//         });
//     }
// };


export const importVNFlights3Days = async (req, res) => {
    const accessKey = 'ec938dfc7d2e318949499a7a6105b142';
    const airports = ['SGN', 'HAN', 'DAD', 'CXR', 'PQC'];
    const today = new Date().toISOString().split('T')[0];

    let allFlights = [];

    try {
        for (const dep of airports) {
            const url = `http://api.aviationstack.com/v1/flights?access_key=${accessKey}&dep_iata=${dep}&flight_date=${today}`;

            console.log("📡 Fetching:", url);

            const response = await axios.get(url);
            const rawData = response.data.data || [];

            const filtered = rawData.filter(f =>
                airports.includes(f.arrival?.iata) &&
                f.flight_status === "scheduled"
            );

            const formatted = filtered.map(f => ({
                departureCity: f.departure?.airport || "Unknown",
                arrivalCity: f.arrival?.airport || "Unknown",
                departureIATA: f.departure?.iata || "",
                arrivalIATA: f.arrival?.iata || "",
                flightNumber: f.flight?.iata || f.flight?.number || "Unknown",
                tripType: "one-way",
                departureDate: new Date(f.departure?.scheduled),
                departureTime: new Date(f.departure?.scheduled).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                returnDate: null,
                returnTime: null,
                price: Math.floor(Math.random() * 400 + 100),
                airline: f.airline?.name || "Unknown",
                airlineIATA: f.airline?.iata || "",
                airplaneType: f.aircraft?.icao || "Airbus A320",
                flightClass: "economy",
                flightStatus: f.flight_status || "scheduled",
            }));

            allFlights = [...allFlights, ...formatted];
        }

        await Flight.deleteMany({});
        await Flight.insertMany(allFlights);

        res.status(200).json({
            success: true,
            message: "Đã import các chuyến bay nội địa trong ngày hôm nay (scheduled only)",
            count: allFlights.length,
            sample: allFlights.slice(0, 5),
        });
    } catch (err) {
        console.error("❌ Lỗi import:", err);
        res.status(500).json({
            success: false,
            message: "Lỗi khi lấy dữ liệu chuyến bay từ API",
        });
    }
};


const vietnamAirports = [
    { code: "SGN", name: "Hồ Chí Minh" },
    { code: "HAN", name: "Hà Nội" },
    { code: "DAD", name: "Đà Nẵng" },
    { code: "CXR", name: "Cam Ranh" },
    { code: "PQC", name: "Phú Quốc" }
];

const logFile = fs.createWriteStream('flight-crawl.log', { flags: 'a' });
const log = (msg) => {
    const time = new Date().toISOString();
    logFile.write(`[${time}] ${msg}\n`);
    console.log(msg);
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const crawlVNFlights3Days = async (req, res) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const results = [];

    for (let dayOffset = 0; dayOffset < 2; dayOffset++) {
        const flightDate = dayjs().add(dayOffset, 'day').format('YYYY-MM-DD');

        for (const from of vietnamAirports) {
            for (const to of vietnamAirports) {
                if (from.code === to.code) continue;

                try {
                    log(`✈️ Crawling ${from.name} → ${to.name} on ${flightDate}`);
                    await page.goto('https://www.traveloka.com/vi-vn/flight', { waitUntil: 'networkidle2' });

                    // Chọn sân bay đi
                    await page.waitForSelector('[data-testid="airport-input-departure"]');
                    await page.click('[data-testid="airport-input-departure"]');
                    await page.keyboard.down('Control');
                    await page.keyboard.press('A');
                    await page.keyboard.up('Control');
                    await page.keyboard.press('Backspace');
                    await page.type('[data-testid="airport-input-departure"]', from.name);
                    await page.keyboard.press('Enter');

                    // Chọn sân bay đến
                    await page.waitForSelector('[data-testid="airport-input-arrival"]');
                    await page.click('[data-testid="airport-input-arrival"]');
                    await page.keyboard.down('Control');
                    await page.keyboard.press('A');
                    await page.keyboard.up('Control');
                    await page.keyboard.press('Backspace');
                    await page.type('[data-testid="airport-input-arrival"]', to.name);
                    await page.keyboard.press('Enter');

                    // Chọn ngày bay
                    await page.waitForSelector('[data-testid="departure-date-input"]');
                    await page.click('[data-testid="departure-date-input"]');
                    await page.waitForTimeout(1000);
                    await page.click(`[data-testid="CalendarDateCell-${dayOffset}"]`);

                    // Nhấn "Tìm chuyến bay"
                    await page.waitForSelector('[data-id="IcSystemSearch"]');
                    await page.click('[data-id="IcSystemSearch"]');

                    // Chờ kết quả
                    await page.waitForSelector('[data-testid="flight-card"]', { timeout: 20000 });

                    // Trích xuất dữ liệu
                    const flights = await page.evaluate(() => {
                        const cards = document.querySelectorAll('[data-testid="flight-card"]');
                        const data = [];
                        cards.forEach(card => {
                            const airline = card.querySelector('[data-testid="airline-name"]')?.textContent?.trim();
                            const times = card.querySelectorAll('[data-testid="departure-time"]');
                            const departureTime = times[0]?.textContent?.trim();
                            const arrivalTime = times[1]?.textContent?.trim();
                            const priceText = card.querySelector('[data-testid="price-amount"]')?.textContent?.trim();
                            const price = parseInt(priceText?.replace(/[^\d]/g, '') || '0');
                            data.push({ airline, departureTime, arrivalTime, price });
                        });
                        return data;
                    });

                    // Lưu MongoDB
                    for (const flight of flights) {
                        const newFlight = new Flight({
                            departureCity: from.name,
                            arrivalCity: to.name,
                            flightNumber: `VN${Math.floor(Math.random() * 900 + 100)}`,
                            tripType: 'one-way',
                            departureDate: new Date(flightDate),
                            departureTime: flight.departureTime || '00:00',
                            returnDate: null,
                            returnTime: null,
                            price: flight.price || 0,
                            airline: flight.airline || 'Unknown',
                            airplaneType: 'A321',
                            flightClass: 'Economy',
                        });

                        await newFlight.save();
                        results.push(newFlight);
                    }

                    log(`✅ Đã lưu ${flights.length} chuyến ${from.code} → ${to.code}`);
                    await delay(3000);

                } catch (err) {
                    log(`⚠️ Lỗi crawl ${from.code} → ${to.code} ngày ${flightDate}: ${err.message}`);
                }
            }
        }
    }

    await browser.close();
    res.json({ success: true, total: results.length });
};

