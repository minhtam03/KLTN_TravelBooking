import express from "express"

import { createPayment, stripeWebhook } from "../controllers/paymentController.js";

// import {  } from "../utils/verifyToken.js";

const router = express.Router();

// create new payment
router.post("/", createPayment)

// Route nhận dữ liệu webhook từ Stripe
router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

export default router