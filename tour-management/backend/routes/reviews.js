import express from "express"
import { createReview, getReviewSummary } from "../controllers/reviewController.js"
import { verifyUser } from "../utils/verifyToken.js"
const router = express.Router()

// router.post('/:tourId', verifyUser, createReview)
// router.get('/summary/:tourId', getReviewSummary);


router.post('/', verifyUser, createReview)

router.get('/summary/:targetId/:reviewTargetType', getReviewSummary);


export default router