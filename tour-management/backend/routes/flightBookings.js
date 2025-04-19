import express from "express";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

import {
    createFlightBooking,
    getFlightBookingHistory,
    getFlightBooking,
    getFlightBookingCount,
    getAllFlightBookingsWithAmount,
    getAllFlightBooking
} from "../controllers/flightBookingController.js";

const router = express.Router();

// Base path: /api/v1/booking/flight

router.get("/bookings-with-amount", getAllFlightBookingsWithAmount); // admin
router.post("/", createFlightBooking);                               // đặt chuyến bay
router.get("/all", verifyUser, getFlightBookingHistory);             // lịch sử người dùng
router.get("/count", verifyUser, getFlightBookingCount);             // số lượng booking của user
router.get("/:id", getFlightBooking);                                // chi tiết booking
router.get("/", getAllFlightBooking);
export default router;
