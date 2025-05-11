import express from "express"
import {
    createUser, deleteUser,
    getAllUser, getSingleUser, updateUser, getProfile, updateProfile
} from "../controllers/userController.js"
const router = express.Router()

import { verifyAdmin, verifyUser } from "../utils/verifyToken.js"

router.get("/profile", verifyUser, getProfile);

router.put("/profile", verifyUser, updateProfile);

// Create new user
router.post("/", verifyAdmin, createUser);

// update user
router.put("/:id", verifyAdmin, updateUser)

// delete user
router.delete("/:id", verifyAdmin, deleteUser)

// get single user
router.get("/:id", verifyAdmin, getSingleUser)

// get all user
router.get("/", verifyAdmin, getAllUser)



export default router