// import Flight from '../models/Flight.js';


// export const getAvailableFlights = async (departure, destination, startDate) => {
//     try {
//         // Truy vấn chuyến bay từ database với các tiêu chí lọc
//         const flights = await Flight.find({
//             departureCity: departure,
//             arrivalCity: destination,
//             departureDate: { $gte: new Date(startDate) },  // Ngày khởi hành phải lớn hơn hoặc bằng ngày bắt đầu
//         });
//         return flights;
//     } catch (error) {
//         console.error("Error fetching available flights: ", error);
//         throw new Error('Error fetching available flights');
//     }
// };

import FlightV2 from '../models/FlightV2.js'; // hoặc 'FlightV2' nếu bạn dùng schema mới

export const getAvailableFlights = async (departure, destination, startDate, duration) => {
    try {
        const departDate = new Date(startDate);

        // Tính ngày về = startDate + duration (số ngày)
        const returnDate = new Date(departDate);
        returnDate.setDate(departDate.getDate() + duration);

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

