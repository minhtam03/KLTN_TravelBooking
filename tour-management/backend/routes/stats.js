import express from "express";
import { getWidgetData, getUserCount, getBookingCount, getTourCount, getEarnings, getUserGrowth, getGrowthData } from "../controllers/statController.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js"

const router = express.Router();

router.get("/widget-data", getWidgetData);
router.get("/user-count", getUserCount);
router.get("/tour-count", getTourCount);
router.get("/booking-count", getBookingCount);
router.get("/earnings", getEarnings);
router.get("/user-growth", getUserGrowth);
router.get("/growth", getGrowthData);


export default router;