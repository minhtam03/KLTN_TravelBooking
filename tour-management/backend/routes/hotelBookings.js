import express from "express";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js"

import {
    createHotelBooking,
    getHotelBookingHistory,
    getHotelBooking,
    getHotelBookingCount
} from "../controllers/hotelBookingController.js";

const router = express.Router();

// /api/v1/hotel-bookings

router.post("/", createHotelBooking);
router.get("/all", verifyUser, getHotelBookingHistory);
router.get("/count", verifyUser, getHotelBookingCount);
router.get("/:id", getHotelBooking);

export default router;
