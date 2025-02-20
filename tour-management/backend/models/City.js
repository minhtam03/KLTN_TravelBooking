import mongoose from "mongoose";
const citySchema = new mongoose.Schema(
    {
        cityName: {
            type: String,
            required: true,
            unique: true,
            trim: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("City", citySchema);

