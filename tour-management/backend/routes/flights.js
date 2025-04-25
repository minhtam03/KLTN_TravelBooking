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
    getFlightCount, importVNFlights3Days,
} from '../controllers/flightController.js'

import { importFlight, getAllFlightsV2, searchFlightsV2 } from '../controllers/flightV2Controller.js';

const router = express.Router()


router.post('/import-flights', importFlight);
router.get('/import-real-flights', importVNFlights3Days);

// router.get('/search/filter', searchFlights)
router.get('/search/filter', searchFlightsV2)

router.post('/', createFlight)
router.put('/:id', updateFlight)
router.delete('/:id', deleteFlight)
router.get('/:id', getSingleFlight)

// router.get('/', getAllFlights)
router.get('/', getAllFlightsV2)


router.get('/count', getFlightCount)


export default router
