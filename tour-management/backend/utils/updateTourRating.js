import Review from "../models/Review.js";
import Tour from "../models/Tour.js";
import Hotel from "../models/Hotel.js";

export const updateTourAverageRating = async (tourId) => {
    const reviews = await Review.find({ targetId: tourId, reviewTargetType: "Tour" });
    if (reviews.length === 0) {
        await Tour.findByIdAndUpdate(tourId, { avgRating: 0 });
        return;
    }

    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Tour.findByIdAndUpdate(tourId, { avgRating: avg.toFixed(1) });
};


export const updateHotelAverageRating = async (hotelId) => {
    const reviews = await Review.find({ targetId: hotelId, reviewTargetType: "Hotel" });
    if (reviews.length === 0) {
        await Hotel.findByIdAndUpdate(hotelId, { avgRating: 0 });
        return;
    }

    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Hotel.findByIdAndUpdate(hotelId, { avgRating: avg.toFixed(1) });
};