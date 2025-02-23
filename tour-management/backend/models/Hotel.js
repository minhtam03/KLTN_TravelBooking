import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  hotelName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  pricePerNight: {
    type: Number,
    required: true,
  },
  stars: {
    type: Number,
    required: true,
  },
  roomsAvailable: {
    type: Number,
    required: true,
  },
  amenities: {
    type: [String],
    required: true,
  },
}, {
  timestamps: true,  // Thêm timestamp cho thời gian tạo và cập nhật
});

// hotelSchema.statics.getAvailableHotels = async function (destination, duration) {
//     try {
//         // Assuming the user wants to stay for the given duration and that the hotel has available rooms
//         return await this.find({
//             location: destination,
//             roomsAvailable: { $gte: 1 },
//             pricePerNight: { $lte: 500 },  // Assuming some upper price limit here (could be dynamic)
//         });
//     } catch (error) {
//         console.error("Error fetching available hotels: ", error);
//         throw new Error('Error fetching available hotels');
//     }
// };

hotelSchema.statics.getAvailableHotels = async function (destination) {
  try {
    return await this.find({
      location: destination,
      roomsAvailable: { $gte: 1 }
    });
  } catch (error) {
    console.error("Error fetching available hotels: ", error);
    throw new Error('Error fetching available hotels');
  }
};


const Hotel = mongoose.model('Hotel', hotelSchema);

export default mongoose.model("Hotel", hotelSchema);