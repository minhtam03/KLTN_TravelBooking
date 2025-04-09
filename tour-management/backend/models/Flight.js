// import mongoose from "mongoose";

// // Define the flight schema
// const flightSchema = new mongoose.Schema({
//   departureCity: {
//     type: String,
//     required: true,
//   },
//   flightNumber: {
//     type: String,
//     required: true,
//   },
//   arrivalCity: {
//     type: String,
//     required: true,
//   },
//   departureDate: {
//     type: Date,
//     required: true,
//   },
//   price: {
//     type: Number,
//     required: true,
//   },
//   airline: {
//     type: String,
//     required: true,
//   },
//   flightTime: {
//     type: String,
//     required: true,
//   },
//   duration: {
//     type: String,
//     required: true,
//   },
//   airplaneType: {
//     type: String,
//     required: true,
//   },
//   class: {
//     type: String,
//     required: true,
//   },
// });

// export default mongoose.model("Flight", flightSchema);

import mongoose from "mongoose";
import { cityList } from "../utils/cities.js"; // Import danh sách tỉnh thành

const flightSchema = new mongoose.Schema({
  departureCity: {
    type: String,
    enum: cityList,
    required: true,
  },
  arrivalCity: {
    type: String,
    enum: cityList,
    required: true,
  },
  flightNumber: {
    type: String,
    required: true,
  },
  tripType: {
    type: String,
    enum: ["one-way", "round-trip"],
    required: true,
  },
  departureDate: {
    type: Date,
    required: true,
  },
  departureTime: {
    type: String,
    required: true,
  },
  returnDate: {
    type: Date,
    required: function () {
      return this.tripType === "round-trip";
    },
  },
  returnTime: {
    type: String,
    required: function () {
      return this.tripType === "round-trip";
    },
  },
  price: {
    type: Number,
    required: true,
  },
  airline: {
    type: String,
    required: true,
  },
  airplaneType: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    enum: ["economy", "business", "first"],
    required: true,
  },
});

export default mongoose.model("Flight", flightSchema);
