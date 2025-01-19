import express from "express"

import { createHotel, updateHotel, deleteHotel, getSingleHotel, getAllHotel } from "../controllers/hotelController.js";

import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// create new hotel
router.post("/", verifyAdmin, createHotel)

// update hotel
router.put("/:id", updateHotel)

// delete hotel
router.delete("/:id", deleteHotel)

// get single hotel
router.get("/:id", getSingleHotel)

// get all hotel
router.get("/", getAllHotel)


export default router