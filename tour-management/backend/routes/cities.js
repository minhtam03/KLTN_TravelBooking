import express from "express"

import {
    importCity
} from "../controllers/cityController.js";


const router = express.Router();


router.get("/import-city", importCity)

export default router
