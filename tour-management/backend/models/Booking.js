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
      type: String,
      required: true
    },
    bookAt: {
      type: Date,
      required: true
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId, // Liên kết với bảng Payment
      ref: "Payment",
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"], // Trạng thái thanh toán
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
