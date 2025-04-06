import express from "express";
import {
    createHotelBooking,
    getHotelBookingHistory,
    getHotelBookingDetail,
    getHotelBookingCount
} from "../controllers/hotelBookingController.js";

const router = express.Router();

// /api/v1/hotel-bookings

router.post("/", createHotelBooking);
router.get("/hotel-history/all", getHotelBookingHistory);
router.get("/hotel-history/count", getHotelBookingCount);
router.get("/:id", getHotelBookingDetail);

export default router;
