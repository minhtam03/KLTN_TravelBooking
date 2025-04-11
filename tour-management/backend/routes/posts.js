import express from "express"

import {
    createPost,
    getAllPosts,
    getSinglePost,
    updatePost,
    deletePost,
    likePost,
    // getPostsPaginated,
    searchPosts
} from "../controllers/postController.js";

// import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// create new tour
router.post("/", createPost)
router.get("/", getAllPosts)
router.patch("/:id/like", likePost)
router.get("/:id", getSinglePost)
router.put("/:id", updatePost)
router.delete("/:id", deletePost)
router.get("/search", searchPosts);
// router.get("/pagination", getPostsPaginated);


export default router