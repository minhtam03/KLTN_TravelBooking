import mongoose from "mongoose";

// Define the flight schema
const flightSchema = new mongoose.Schema({
  departureCity: {
    type: String,
    required: true,
  },
  flightNumber: {
    type: String,
    required: true,
  },
  arrivalCity: {
    type: String,
    required: true,
  },
  departureDate: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  airline: {
    type: String,
    required: true,
  },
  flightTime: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  airplaneType: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Flight", flightSchema);