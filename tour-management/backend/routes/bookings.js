import express from "express"
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js"
import { createBooking, getAllBooking, getBooking, getBookingHistory, getBookingCount } from "../controllers/bookingController.js"
const router = express.Router()

router.post('/', verifyUser, createBooking)
router.get('/:id', verifyUser, getBooking)
router.get('/', verifyAdmin, getAllBooking)
router.get('/booking-history/all', verifyUser, getBookingHistory);  // New route for booking history
router.get("/booking-history/count", verifyUser, getBookingCount);

export default router