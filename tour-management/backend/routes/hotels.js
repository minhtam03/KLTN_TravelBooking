import express from "express"

import {
    createHotel, updateHotel, importHotels,
    deleteHotel, getSingleHotel, getAllHotel,
    getHotelCount, getHotelBySearch, normalizeHotels
} from "../controllers/hotelController.js";

import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// create new hotel
router.post("/", createHotel)

// update hotel
router.put("/:id", updateHotel)

// delete hotel
router.delete("/:id", deleteHotel)

router.get("/import-hotels", importHotels)
router.get("/search/getHotelBySearch", getHotelBySearch);

router.get("/count", getHotelCount)

router.get("/normalize-hotels", normalizeHotels);

// get single hotel
router.get("/:id", getSingleHotel)

// get all hotel
router.get("/", getAllHotel)





export default router