import express from "express"

import { createPost, getAllPosts, getSinglePost, updatePost } from "../controllers/postController.js";

// import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// create new tour
router.post("/", createPost)
router.get("/", getAllPosts)
router.get("/:id", getSinglePost)
router.put("/:id", updatePost)

export default router