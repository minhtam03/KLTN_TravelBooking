import express from "express"
import { createUser, deleteUser, getAllUser, getSingleUser, updateUser } from "../controllers/userController.js"
const router = express.Router()

import { verifyAdmin, verifyUser } from "../utils/verifyToken.js"

// Create new user
router.post("/", verifyAdmin, createUser);

// update user
router.put("/:id", verifyUser, updateUser)

// delete user
router.delete("/:id", verifyUser, deleteUser)

// get single user
router.get("/:id", verifyUser, getSingleUser)

// get all user
router.get("/", verifyAdmin, getAllUser)

export default router