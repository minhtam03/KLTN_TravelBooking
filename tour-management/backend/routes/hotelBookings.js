import express from "express";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js"

import {
    createHotelBooking,
    getHotelBookingHistory,
    getHotelBooking,
    getHotelBookingCount,
    getAllHotelBookingsWithAmount,
    getAllHotelBooking
} from "../controllers/hotelBookingController.js";

const router = express.Router();

// /api/v1/booking/hotel

router.get("/bookings-with-amount", getAllHotelBookingsWithAmount);
router.post("/", createHotelBooking);
router.get("/all", verifyUser, getHotelBookingHistory);
router.get("/count", verifyUser, getHotelBookingCount);
router.get("/:id", getHotelBooking);
router.get("/", getAllHotelBooking);

export default router;
