import express from "express"

import { createFlight } from "../controllers/flightController.js";

// import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// create new tour
router.post("/", createFlight)

export default router