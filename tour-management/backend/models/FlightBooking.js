import mongoose from "mongoose";

const flightBookingSchema = new mongoose.Schema({
    userId: String,
    userEmail: String,
    flightId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Flight",
        required: true
    },
    fullName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    passportId: { type: String, required: true },
    phone: { type: String, required: true },
    guestSize: { type: Number, required: true },
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

export default mongoose.model("FlightBooking", flightBookingSchema);
