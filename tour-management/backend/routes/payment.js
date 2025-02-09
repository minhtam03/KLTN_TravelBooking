import express from "express"

import { createPayment } from "../controllers/paymentController.js";

// import {  } from "../utils/verifyToken.js";

const router = express.Router();

// create new hotel
router.post("/", createPayment)

export default router