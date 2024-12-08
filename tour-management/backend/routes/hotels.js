import express from "express"

import { createHotel } from "../controllers/hotelController.js";

// import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// create new tour
router.post("/", createHotel)

export default router