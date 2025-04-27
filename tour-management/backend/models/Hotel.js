import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  hotelName: {
    type: String,
    required: true,
  },
  location: {   // ten thanh pho
    type: String,
    required: true,
  },
  city: {   // ten thanh pho
    type: String,
    // required: true,
  },
  address: {   // dia chi cu the
    type: String,
    // required: true,
  },
  pricePerNight: {  // giá đô
    type: Number,
    required: true,
  },
  pricePerNightOriginal: { type: Number },  // giá việt
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