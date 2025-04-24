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
    getFlightCount, importVNFlights3Days, crawlVNFlights3Days
} from '../controllers/flightController.js'

const router = express.Router()

router.get('/crawl-flights-3days', crawlVNFlights3Days);
router.get('/import-real-flights', importVNFlights3Days);
router.get('/search/filter', searchFlights)
router.post('/', createFlight)
router.put('/:id', updateFlight)
router.delete('/:id', deleteFlight)
router.get('/:id', getSingleFlight)
router.get('/', getAllFlights)

router.get('/count', getFlightCount)


export default router
