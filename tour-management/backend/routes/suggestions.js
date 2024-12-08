import express from "express"

import { getSuggestions } from "../controllers/suggestionController.js";

// import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// create new tour
router.post("/suggest", getSuggestions)

export default router