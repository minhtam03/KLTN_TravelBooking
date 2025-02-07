import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: Number,
    required: true,
  },
  roomType: {
    type: String,
    required: true, // Ví dụ: "single", "double", "suite"
  },
  price: {
    type: Number,
    required: true,
  },
  maxPeople: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true, // Liên kết với Hotel
  },
}, { timestamps: true });

export default mongoose.model("Room", roomSchema);
