// import express from "express"

// import { createFlight } from "../controllers/flightController.js";

// // import { verifyAdmin } from "../utils/verifyToken.js";

// const router = express.Router();

// // create new tour
// router.post("/", createFlight)

// export default router

import express from 'express'
import {
    createFlight,
    updateFlight,
    deleteFlight,
    getSingleFlight,
    getAllFlights,
    searchFlights,
    getFlightCount
} from '../controllers/flightController.js'

const router = express.Router()
router.get('/search/filter', searchFlights)
router.post('/', createFlight)
router.put('/:id', updateFlight)
router.delete('/:id', deleteFlight)
router.get('/:id', getSingleFlight)
router.get('/', getAllFlights)

router.get('/count', getFlightCount)

export default router
