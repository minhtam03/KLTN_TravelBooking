import mongoose from "mongoose";

// const reviewSchema = new mongoose.Schema(
//   {
//     productId: {
//       type: mongoose.Types.ObjectId,
//       ref: "Tour",
//     },
//     username: {
//       type: String,
//       required: true,
//     },
//     reviewText: {
//       type: String,
//       required: true,
//     },
//     rating: {
//       type: Number,
//       required: true,
//       min: 0,
//       max: 5,
//       default: 0,
//     },
//   },
//   { timestamps: true }
// );



// update for 3 types:
const reviewSchema = new mongoose.Schema({
  targetId: {
    type: mongoose.Types.ObjectId,
    required: true,
    refPath: 'reviewTargetType',  // Tham chiếu động tới Tour/Hotel/Flight
  },
  reviewTargetType: {
    type: String,
    required: true,
    enum: ['Tour', 'Hotel', 'Flight'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reviewText: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
    default: 0,
  },
}, { timestamps: true });




export default mongoose.model("Review", reviewSchema);
