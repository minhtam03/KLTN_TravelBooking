// models/HotelBooking.js
import mongoose from "mongoose";

const hotelBookingSchema = new mongoose.Schema({
    userId: { type: String },
    userEmail: { type: String },
    hotelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
        required: true
    },
    hotelName: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    nights: {
        type: Number,
        required: true
    },
    bookAt: {
        type: Date,
        required: true
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
        default: null
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    }
}, { timestamps: true });

export default mongoose.model("HotelBooking", hotelBookingSchema);
