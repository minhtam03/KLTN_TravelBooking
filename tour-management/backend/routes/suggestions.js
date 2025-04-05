import express from "express"

import { getSuggestions } from "../controllers/suggestionController.js";
import { getSuggestedToursByEmbedding } from "../controllers/suggestionEmbeddingController.js";
// import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// create new tour
router.post("/suggest", getSuggestions)
// router.get("/suggested-destination/:userId", getSuggestedDestination)


router.post('/embedding', getSuggestedToursByEmbedding);
export default router