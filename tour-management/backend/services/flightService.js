import Flight from '../models/Flight.js';


export const getAvailableFlights = async (departure, destination, startDate) => {
    try {
        // Truy vấn chuyến bay từ database với các tiêu chí lọc
        const flights = await Flight.find({
            departureCity: departure,
            arrivalCity: destination,
            departureDate: { $gte: new Date(startDate) },  // Ngày khởi hành phải lớn hơn hoặc bằng ngày bắt đầu
        });
        return flights;
    } catch (error) {
        console.error("Error fetching available flights: ", error);
        throw new Error('Error fetching available flights');
    }
};
