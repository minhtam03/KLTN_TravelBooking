import Tour from '../models/Tour.js';
import Flight from '../models/Flight.js';
import Hotel from '../models/Hotel.js';
import { calculateEstimatedCost } from '../utils/calculateEstimatedCost.js';

export const getSuggestions = async (req, res) => {
    try {
        const { budget, duration, departure, destination, startDate } = req.body;

        // Fetch tour, flight, and hotel data from the database
        const tours = await Tour.getAvailableTours(destination);
        const flights = await Flight.getAvailableFlights(departure, destination, startDate);
        const hotels = await Hotel.getAvailableHotels(destination, duration);

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
                    const estimatedCost = calculateEstimatedCost(tour, flight, hotel, budget, duration);

                    // Check if the total cost is within the budget
                    if (estimatedCost.total <= budget) {
                        options.push({
                            tour: { title: tour.title, desc: tour.desc, price: tour.price },
                            flight: {
                                flightNumber: flight.flightNumber,
                                airline: flight.airline,
                                airplaneType: flight.airplaneType,
                                departureDate: flight.departureDate,
                                class: flight.class,
                                price: flight.price * 2,
                            },
                            hotel: {
                                hotelName: hotel.hotelName, 
                                amenities: hotel.amenities,
                                price: hotel.pricePerNight * duration,
                            },
                            totalCost: estimatedCost.total,
                            estimatedDetails: estimatedCost
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
