import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: String
    },
    userEmail: {
      type: String,
    },
    tourId: {
      type: mongoose.Schema.Types.ObjectId,  // Lưu ObjectId của Tour
      ref: "Tour",
      required: true
    },
    tourName: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    guestSize: {
      type: Number,
      required: true
    },
    phone: {
      type: Number,
      required: true
    },
    bookAt: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
