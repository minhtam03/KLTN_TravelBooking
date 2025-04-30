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
    getFlightCount,
} from '../controllers/flightController.js'

import {
    importFlight, getAllFlightsV2,
    searchFlightsV2, getSingleFlightV2, convertPricesToUSD,
    deleteFlightV2, updateFlightV2, createFlightV2
} from '../controllers/flightV2Controller.js';

const router = express.Router()


router.post('/import-flights', importFlight);

// router.get('/search/filter', searchFlights)
router.get('/search/filter', searchFlightsV2)

// router.post('/', createFlight)
router.post('/', createFlightV2)


// router.put('/:id', updateFlight)
router.put('/:id', updateFlightV2)

// router.delete('/:id', deleteFlight)
router.delete('/:id', deleteFlightV2)

// router.get('/:id', getSingleFlight)
router.get('/:id', getSingleFlightV2)


// router.get('/', getAllFlights)
router.get('/', getAllFlightsV2)


router.get('/count', getFlightCount)
router.post('/convert-prices', convertPricesToUSD);

export default router
