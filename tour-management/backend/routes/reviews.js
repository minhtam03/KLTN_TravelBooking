import express from "express"
import { createReview, getReviewSummary } from "../controllers/reviewController.js"
import { verifyUser } from "../utils/verifyToken.js"
const router = express.Router()

router.post('/:tourId', verifyUser, createReview)

// Route để lấy tổng hợp review (không cần đăng nhập)
router.get('/summary/:tourId', getReviewSummary);

export default router