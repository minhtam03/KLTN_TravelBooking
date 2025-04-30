import Hotel from '../models/Hotel.js'
import City from '../models/City.js'
import axios from 'axios';
import { removeVietnameseTones } from '../utils/removeVietnamese.js';
import { amenitiesDictionary } from '../utils/amenitiesDictionary.js';

const VND_TO_USD = 25000;
// create new hotel
export const createHotel = async (req, res) => {
    const newHotel = new Hotel(req.body)
    try {
        const savedHotel = await newHotel.save()

        res
            .status(200)
            .json({
                success: true,
                message: "Successfully created hotel",
                data: savedHotel,
            })
    } catch (error) {
        res
            .status(500)
            .json({
                success: false,
                message: "Failed to create hotel"
            })
    }
}

// update hotel
export const updateHotel = async (req, res) => {

    const id = req.params.id

    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(id, {
            $set: req.body
        }, { new: true })
        res.status(200).json({
            success: true,
            message: "Successfully updated hotel",
            data: updatedHotel
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update hotel",
        })
    }
}

// delete hotel
export const deleteHotel = async (req, res) => {

    const id = req.params.id

    try {
        await Hotel.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            message: "Successfully deleted hotel",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete hotel",
        })
    }
}

// getSingle hotel
export const getSingleHotel = async (req, res) => {
    const id = req.params.id

    try {
        const hotel = await Hotel.findById(id)
            .populate({
                path: "reviews",
                populate: {
                    path: "userId",
                    select: "username photo" // Chỉ lấy thông tin cần thiết
                }
            });
        res.status(200).json({
            success: true,
            message: "Successful get single hotel",
            data: hotel,
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: "not found hotel",
        })
    }
}

// getAll hotel
export const getAllHotel = async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : null;

    try {
        let hotels;

        if (page !== null) {
            hotels = await Hotel.find({})
                .skip(page * 8)
                .limit(8);
        } else {
            hotels = await Hotel.find({});
        }

        res.status(200).json({
            success: true,
            count: hotels.length,
            message: "Successful get all hotel",
            data: hotels
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: "not found hotel"
        });
    }
};

export const getHotelCount = async (req, res) => {
    try {
        const count = await Hotel.countDocuments();
        res.status(200).json({ success: true, count });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to count hotels" });
    }
}


// export const getHotelBySearch = async (req, res) => {
//     const location = new RegExp(req.query.location, 'i'); // tìm gần đúng
//     const minPrice = parseInt(req.query.minPrice) || 0;
//     const maxPrice = parseInt(req.query.maxPrice) || 9999999;

//     try {
//         const hotels = await Hotel.find({
//             location,
//             pricePerNight: { $gte: minPrice, $lte: maxPrice }
//         });

//         res.status(200).json({
//             success: true,
//             message: "Successfully searched hotels",
//             data: hotels,
//         });
//     } catch (error) {
//         res.status(404).json({
//             success: false,
//             message: "Search failed",
//             error: error.message
//         });
//     }
// };
export const getHotelBySearch = async (req, res) => {
    const { location: locationQuery, minPrice, maxPrice } = req.query;

    if (!locationQuery) {
        return res.status(400).json({
            success: false,
            message: "Location is required",
        });
    }

    const location = new RegExp(locationQuery, 'i');
    const min = parseInt(minPrice) || 0;
    const max = parseInt(maxPrice) || 9999999;

    try {
        const hotels = await Hotel.find({
            location,
            pricePerNight: { $gte: min, $lte: max }
        });

        res.status(200).json({
            success: true,
            message: "Successfully searched hotels",
            data: hotels,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Search failed",
            error: error.message,
        });
    }
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms)); // ✅ Thêm sleep function

export const importHotels = async (req, res) => {
    try {
        const cities = await City.find();

        const savedHotels = [];

        for (const city of cities) {
            try {

                await sleep(500);

                const response = await axios.get(`https://mixivivu.com/api/hotels/get-list?city=${city.cityId}`);
                const hotels = response.data?.result?.data || [];
                console.log(response.data?.result?.data)

                for (const h of hotels) {
                    const hotelDoc = {
                        hotelName: h.title || "Unnamed Hotel",
                        address: h.address || "Unknown Address",
                        pricePerNight: h.salePrice || h.defaultPrice || 0,
                        stars: h.standard || 0,
                        roomsAvailable: h.spec?.hotel?.totalRooms || 0,
                        amenities: (h.features || []).map(feature => feature.text) || [],
                        photo: h.city?.image || null,
                        city: city.name,
                        location: city.name,
                        reviews: []
                    };

                    try {
                        // await Hotel.updateOne(
                        //     { hotelName: hotelDoc.hotelName, address: hotelDoc.address },
                        //     hotelDoc,
                        //     { upsert: true }
                        // );
                        await Hotel.updateOne(
                            { address: hotelDoc.address },
                            hotelDoc,
                            { upsert: true }
                        );
                        savedHotels.push(hotelDoc.hotelName);
                    } catch (saveError) {
                        console.error('Error saving hotel:', h.title, saveError.message);
                    }
                }
            } catch (cityError) {
                console.error(`Error fetching hotels for city ${city.name}:`, cityError.message);
            }
        }

        res.status(200).json({ message: 'Imported hotels successfully', count: savedHotels.length, hotels: savedHotels });
    } catch (error) {
        console.error('Error importing hotels:', error.message);
        res.status(500).json({ error: 'Failed to import hotels' });
    }
};

const translateAmenities = (amenities) => {
    return amenities.map(item => amenitiesDictionary[item.trim()] || item);
};

export const normalizeHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find({}); // Lấy tất cả hotel

        for (const hotel of hotels) {
            let updated = false;


            if (hotel.pricePerNight && !hotel.pricePerNightOriginal) {
                hotel.pricePerNightOriginal = hotel.pricePerNight;
                updated = true;
            }

            // Chuyển pricePerNight thành USD
            if (hotel.pricePerNight) {
                hotel.pricePerNight = Math.round(hotel.pricePerNightOriginal / VND_TO_USD);
                updated = true;
            }

            // Chuẩn hóa hotelName
            if (hotel.hotelName) {
                const normalizedHotelName = removeVietnameseTones(hotel.hotelName);
                if (normalizedHotelName !== hotel.hotelName) {
                    hotel.hotelName = normalizedHotelName;
                    updated = true;
                }
            }
            //  Dịch amenities
            if (hotel.amenities && Array.isArray(hotel.amenities) && hotel.amenities.length > 0) {
                const translatedAmenities = translateAmenities(hotel.amenities);
                hotel.amenities = translatedAmenities;
                updated = true;
            }

            if (hotel.photo) {
                hotel.photo = "https://i.pinimg.com/736x/2b/ae/a9/2baea90a59dd85042d3a70d13ae7d8a9.jpg"; // hoặc hotel.photo = "";
                updated = true;
            }

            if (updated) {
                await hotel.save();
            }
        }

        res.status(200).json({
            success: true,
            message: `Normalized ${hotels.length} hotels.`,
        });
    } catch (error) {
        console.error('Error normalizing hotels:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to normalize hotels.',
        });
    }
};