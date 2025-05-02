import mongoose from "mongoose";
import { cityList } from "../utils/cities.js";
const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    city: {
      type: String,
      enum: cityList,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    distance: {
      type: Number,
      required: false,
    },
    photo: {
      type: String,
    },
    desc: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: false,
    },
    duration: {
      type: Number,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    maxGroupSize: {
      type: Number,
      required: false,
    },

    reviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Review",
      },
    ],

    featured: {
      type: Boolean,
      default: false,
    },
    embedding: {
      type: [Number],
      default: [],
    },
    highlights: {
      type: [String],
      required: false,
      default: []
    },
    avgRating: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Tour", tourSchema);
