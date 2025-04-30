import Tour from "../models/Tour.js";

export const getAvailableTours = async (destination, duration) => {
    try {
        return await Tour.find({ city: destination, duration: duration });
    } catch (error) {
        console.error("Error fetching available tours: ", error);
        throw new Error('Error fetching available tours');
    }
};