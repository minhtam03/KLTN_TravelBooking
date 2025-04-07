// scripts/updateHotelPhotos.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Hotel from '../models/Hotel.js'; // chỉnh path nếu cần

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const DEFAULT_PHOTO =
    'https://cdn2.vietnambooking.com/wp-content/uploads/hotel_pro/hotel_436413/df17b8cfa8c1d0f44d55a54b7179efbf.jpg';

const updateHotelPhotos = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('✅ Connected to MongoDB');

        const hotels = await Hotel.find({
            $or: [{ photo: { $exists: false } }, { photo: null }, { photo: '' }],
        });

        console.log(`📌 Found ${hotels.length} hotels missing photo`);

        for (const hotel of hotels) {
            try {
                hotel.photo = DEFAULT_PHOTO;
                await hotel.save();
                console.log(`✅ Updated photo for: ${hotel.hotelName}`);
            } catch (err) {
                console.warn(`⚠️ Could not update hotel '${hotel.hotelName}':`, err.message);
            }
        }

        console.log('🎉 Photo update completed!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error updating hotel photos:', err);
        process.exit(1);
    }
};

updateHotelPhotos();
