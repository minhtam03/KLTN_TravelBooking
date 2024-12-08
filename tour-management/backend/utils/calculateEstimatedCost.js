// utils/calculateEstimatedCost.js
export const calculateEstimatedCost = (tour, flight, hotel, budget, duration) => {
    try {
        const totalCost = tour.price + (flight.price * 2) + (hotel.pricePerNight * duration);
        return {
            total: totalCost,
            tourCost: tour.price,
            flightCost: flight.price * 2,  // Round-trip (departure + return)
            hotelCost: hotel.pricePerNight * duration
        };
    } catch (error) {
        console.error("Error calculating estimated cost: ", error);
        throw new Error('Error calculating estimated cost');
    }
};
