import Hotel from '../models/Hotel.js';

export const getAvailableHotels = async (destination) => {
    try {
        // Truy vấn các khách sạn có sẵn tại destination với ít nhất 1 phòng còn trống
        const hotels = await Hotel.find({
            location: destination,
            roomsAvailable: { $gte: 1 } // Đảm bảo có ít nhất 1 phòng còn trống
        });
        return hotels;
    } catch (error) {
        console.error("Error fetching available hotels: ", error);
        throw new Error('Error fetching available hotels');
    }
};
