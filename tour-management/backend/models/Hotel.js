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
  photo: {
    type: String,
  },
  reviews: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Review"
    }
  ]
}, {
  timestamps: true,  // Thêm timestamp cho thời gian tạo và cập nhật
});



export default mongoose.model("Hotel", hotelSchema);