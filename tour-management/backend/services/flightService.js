import FlightV2 from '../models/FlightV2.js';

export const getAvailableFlights = async (departure, destination, startDate, duration) => {
    try {
        const departDate = new Date(startDate);

        // Tính ngày về = startDate + duration (số ngày)
        const returnDate = new Date(departDate);
        returnDate.setDate(departDate.getDate() + duration - 1);

        // Tìm chuyến đi (outbound)
        const outboundFlights = await FlightV2.find({
            fromPlace: departure,
            toPlace: destination,
            departDate: departDate.toISOString().split('T')[0], // 'YYYY-MM-DD'
        });

        // Tìm chuyến về (return)
        const returnFlights = await FlightV2.find({
            fromPlace: destination,
            toPlace: departure,
            departDate: returnDate.toISOString().split('T')[0],
        });

        return {
            outboundFlights,
            returnFlights,
        };
    } catch (error) {
        console.error("Error fetching available flights: ", error);
        throw new Error('Error fetching available flights');
    }
};

