import FlightV2 from '../models/FlightV2.js';
import express from 'express';
import axios from 'axios';
import dayjs from 'dayjs';
import { removeVietnameseTones } from '../utils/removeVietnamese.js';
import { placeCodeMap } from '../utils/cities.js';

const VND_TO_USD = 25000;
const daysToFetch = 5;
const airports = Object.values(placeCodeMap);


export const importFlight = async (req, res) => {
    const today = new Date();
    const savedFlights = [];
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    try {
        for (let d = 0; d < daysToFetch; d++) {
            const date = new Date(today);
            date.setDate(today.getDate() + d);
            const isoDate = date.toISOString().split('T')[0] + 'T07:00:00';

            for (const from of airports) {
                for (const to of airports) {
                    console.log(isoDate)
                    if (from === to) continue;
                    await sleep(1000)
                    const response = await axios.post('https://apiportal.ivivu.com/web_prot/flightinbound//gate/apiv1/GetFlightDepart', {
                        roundTrip: false,
                        fromPlace: from,
                        toPlace: to,
                        departDate: isoDate,
                        returnDate: isoDate,
                        adult: 1,
                        child: 0,
                        infant: 0,
                        sources: "VietnamAirlines;VietJetAir;BambooAirways",
                        // sources: "VietnamAirlines",
                        ticketClass: null,
                        timeIndayRecomment: "09:00",
                        version: "2.0",
                        flightType: "Direct"
                    });
                    console.log(response)
                    const outboundGroup = response.data?.data?.[0] || {};
                    const flights = (outboundGroup.flights || []).slice(0, 20);

                    for (const f of flights) {
                        const depart = dayjs(f.departTime);
                        const landing = dayjs(f.landingTime);

                        const flightDoc = {
                            id: f.id,
                            flightNumber: f.flightNumber,
                            airline: f.airline,
                            fromPlace: removeVietnameseTones(f.fromPlace),
                            fromPlaceCode: f.fromPlaceCode,
                            toPlace: removeVietnameseTones(f.toPlace),
                            toPlaceCode: f.toPlaceCode,

                            ticketType: f.ticketType,
                            aircraftStr: f.aircraftStr,

                            totalPrice: f.totalPrice,
                            // totalPrice: +(f.totalPrice / VND_TO_USD).toFixed(2),

                            // Thời gian chuẩn
                            departTime: f.departTime,
                            landingTime: f.landingTime,
                            departDate: depart.format('YYYY-MM-DD'),
                            departTimeStr: depart.format('HH:mm'),
                            landingDate: landing.format('YYYY-MM-DD'),
                            landingTimeStr: landing.format('HH:mm'),

                            isReturn: false
                        };
                        console.log("done")
                        try {
                            await FlightV2.updateOne({ id: f.id }, flightDoc, { upsert: true });
                            savedFlights.push(flightDoc);
                        } catch (e) {
                            console.error('Error saving flight:', f.id, e.message);
                        }
                    }
                }
            }
        }

        res.status(200).json({ message: 'Imported flights into FlightV2', count: savedFlights.length });
    } catch (error) {
        console.error('Error importing flights:', error.message);
        res.status(500).json({ error: 'Failed to import flights to FlightV2' });
    }
};

// export const importFlight = async (req, res) => {
//     const today = new Date();
//     const savedFlights = [];
//     const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

//     const fetchFlightsWithRetry = async (payload, maxRetries = 5, delayMs = 1500) => {
//         for (let i = 0; i < maxRetries; i++) {
//             try {
//                 const res = await axios.post('https://apiportal.ivivu.com/web_prot/flightinbound//gate/apiv1/GetFlightDepart', payload);
//                 const result = res.data;
//                 const outboundGroup = result.data?.[0] || {};
//                 const flights = outboundGroup.flights || [];

//                 if (flights.length > 0 || result.stop === true) {
//                     console.log(`✅ Got ${flights.length} flights: ${payload.fromPlace} → ${payload.toPlace}`);
//                     return flights;
//                 }

//                 console.log(`⏳ Retry ${i + 1}/${maxRetries} for ${payload.fromPlace} → ${payload.toPlace}...`);
//             } catch (err) {
//                 console.error(`❌ Request failed (${payload.fromPlace} → ${payload.toPlace}):`, err.message);
//             }

//             await sleep(delayMs);
//         }

//         console.warn(`⚠️ No flights found after retries: ${payload.fromPlace} → ${payload.toPlace}`);
//         return [];
//     };

//     try {
//         for (let d = 0; d < daysToFetch; d++) {
//             const date = new Date(today);
//             date.setDate(today.getDate() + d);
//             const isoDate = date.toISOString().split('T')[0] + 'T07:00:00';

//             for (let i = 0; i < airports.length; i++) {
//                 for (let j = i + 1; j < airports.length; j++) {
//                     const from = airports[i];
//                     const to = airports[j];

//                     for (const [origin, destination] of [
//                         [from, to],
//                         [to, from]
//                     ]) {
//                         await sleep(1000);
//                         console.log(`🌐 Fetching: ${origin} → ${destination} on ${isoDate}`);

//                         const payload = {
//                             roundTrip: false,
//                             fromPlace: origin,
//                             toPlace: destination,
//                             departDate: isoDate,
//                             returnDate: isoDate,
//                             adult: 1,
//                             child: 0,
//                             infant: 0,
//                             sources: "VietnamAirlines;VietJetAir;BambooAirways",
//                             ticketClass: null,
//                             timeIndayRecomment: "09:00",
//                             version: "2.0",
//                             flightType: "Direct"
//                         };

//                         const flights = await fetchFlightsWithRetry(payload);

//                         for (const f of flights.slice(0, 20)) {
//                             const depart = dayjs(f.departTime);
//                             const landing = dayjs(f.landingTime);

//                             const flightDoc = {
//                                 id: f.id,
//                                 flightNumber: f.flightNumber,
//                                 airline: f.airline,
//                                 fromPlace: removeVietnameseTones(f.fromPlace),
//                                 fromPlaceCode: f.fromPlaceCode,
//                                 toPlace: removeVietnameseTones(f.toPlace),
//                                 toPlaceCode: f.toPlaceCode,
//                                 ticketType: f.ticketType,
//                                 aircraftStr: f.aircraftStr,
//                                 totalPrice: f.totalPrice,
//                                 departTime: f.departTime,
//                                 landingTime: f.landingTime,
//                                 departDate: depart.format('YYYY-MM-DD'),
//                                 departTimeStr: depart.format('HH:mm'),
//                                 landingDate: landing.format('YYYY-MM-DD'),
//                                 landingTimeStr: landing.format('HH:mm'),
//                                 isReturn: false
//                             };

//                             try {
//                                 await FlightV2.updateOne({ id: f.id }, flightDoc, { upsert: true });
//                                 savedFlights.push(flightDoc);
//                                 console.log(`💾 Saved flight ${f.flightNumber}: ${f.fromPlace} → ${f.toPlace}`);
//                             } catch (e) {
//                                 console.error('❌ Error saving flight:', f.id, e.message);
//                             }
//                         }
//                     }
//                 }
//             }
//         }

//         res.status(200).json({ message: '✅ Imported flights into FlightV2', count: savedFlights.length });
//     } catch (error) {
//         console.error('🚨 Error importing flights:', error.message);
//         res.status(500).json({ error: 'Failed to import flights to FlightV2' });
//     }
// };



export const getAllFlightsV2 = async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : null

    try {
        const flights = page !== null
            ? await FlightV2.find().skip(page * 8).limit(8)
            : await FlightV2.find()

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

export const searchFlightsV2 = async (req, res) => {
    const { fromPlace, toPlace, departDate, landingDate, ticketType } = req.query;

    if (!fromPlace || !toPlace || !departDate) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const outboundQuery = {
            fromPlace: new RegExp(fromPlace, 'i'),
            toPlace: new RegExp(toPlace, 'i'),
            departDate: departDate,
        };

        if (ticketType) {
            outboundQuery.ticketType = new RegExp(ticketType, 'i');
        }
        const outboundFlights = await FlightV2.find(outboundQuery).limit(50).sort({ totalPrice: 1 });

        let returnFlights = [];
        if (landingDate) {
            const returnQuery = {
                fromPlace: new RegExp(toPlace, 'i'),
                toPlace: new RegExp(fromPlace, 'i'),
                departDate: landingDate,
            };

            if (ticketType) {
                returnQuery.ticketType = new RegExp(ticketType, 'i');
            }

            returnFlights = await FlightV2.find(returnQuery).limit(50).sort({ totalPrice: 1 });
        }

        res.status(200).json({
            success: true,
            message: "Flight search successful",
            data: {
                outboundFlights,
                returnFlights,
            },
        });
    } catch (error) {
        console.error("Flight search error:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getSingleFlightV2 = async (req, res) => {
    const id = req.params.id

    try {
        const flight = await FlightV2.findById(id)
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


export const convertPricesToUSD = async (req, res) => {
    try {
        const flights = await FlightV2.find({}); // Lấy tất cả chuyến bay

        for (const flight of flights) {
            if (flight.totalPrice) {
                flight.totalPriceUSD = Math.round(flight.totalPrice / VND_TO_USD);
                await flight.save();
            }
        }

        res.status(200).json({
            success: true,
            message: `✅ Đã cập nhật ${flights.length} chuyến bay với totalPriceUSD.`,
        });
    } catch (error) {
        console.error('❌ Error converting prices:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to convert prices.',
        });
    }
};

export const deleteFlightV2 = async (req, res) => {
    const id = req.params.id

    try {
        await FlightV2.findByIdAndDelete(id)
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

export const updateFlightV2 = async (req, res) => {
    const id = req.params.id

    try {
        const updatedFlight = await FlightV2.findByIdAndUpdate(
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


export const createFlightV2 = async (req, res) => {
    try {
        const newFlight = new FlightV2(req.body)
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