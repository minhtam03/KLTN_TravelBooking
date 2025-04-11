// import Flight from '../models/Flight.js'

// export const createFlight = async (req, res) => {
//     const newFlight = new Flight(req.body)
//     try {
//         const savedFlight = await newFlight.save()

//         res
//             .status(200)    
//             .json({
//                 success: true,
//                 message: "Successfully created",
//                 data: savedFlight,
//             })
//     } catch (error) {
//         res 
//             .status(500)
//             .json({
//                 success:false,
//                 message: "Failed to create. Try again"
//             })
//     }
// }

import Flight from '../models/Flight.js'

// Create a new flight
export const createFlight = async (req, res) => {
    try {
        const newFlight = new Flight(req.body)
        const savedFlight = await newFlight.save()

        res.status(200).json({
            success: true,
            message: 'Successfully created flight',
            data: savedFlight,
        })
    } catch (error) {
        console.error('Create flight failed:', error.message)
        res.status(500).json({
            success: false,
            message: 'Failed to create flight. Try again.',
        })
    }
}

// Update flight
export const updateFlight = async (req, res) => {
    const id = req.params.id

    try {
        const updatedFlight = await Flight.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        )

        res.status(200).json({
            success: true,
            message: 'Successfully updated flight',
            data: updatedFlight,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update flight',
        })
    }
}

// Delete flight
export const deleteFlight = async (req, res) => {
    const id = req.params.id

    try {
        await Flight.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            message: 'Successfully deleted flight',
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete flight',
        })
    }
}

// Get single flight
export const getSingleFlight = async (req, res) => {
    const id = req.params.id

    try {
        const flight = await Flight.findById(id)
        res.status(200).json({
            success: true,
            message: 'Flight retrieved successfully',
            data: flight,
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Flight not found',
        })
    }
}

// Get all flights (optional pagination)
export const getAllFlights = async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : null

    try {
        const flights = page !== null
            ? await Flight.find().skip(page * 8).limit(8)
            : await Flight.find()

        res.status(200).json({
            success: true,
            count: flights.length,
            message: 'Successfully retrieved flights',
            data: flights,
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Flights not found',
        })
    }
}

// Search flights by query params
export const searchFlights = async (req, res) => {
    const {
        tripType,
        departureCity,
        arrivalCity,
        departureDate,
        returnDate,
        flightClass,
        minPrice,
        maxPrice,
    } = req.query;

    // 1. Validate các trường bắt buộc
    if (!tripType || !["one-way", "round-trip"].includes(tripType)) {
        return res.status(400).json({
            success: false,
            message: "tripType is required and must be 'one-way' or 'round-trip'",
        });
    }

    if (!departureCity || !arrivalCity || !departureDate) {
        return res.status(400).json({
            success: false,
            message: "departureCity, arrivalCity and departureDate are required",
        });
    }

    if (tripType === "round-trip" && !returnDate) {
        return res.status(400).json({
            success: false,
            message: "returnDate is required for round-trip flights",
        });
    }

    try {
        const query = {
            tripType,
            departureCity: new RegExp(departureCity, "i"),
            arrivalCity: new RegExp(arrivalCity, "i"),
            departureDate: {
                $gte: new Date(departureDate),
                $lt: new Date(new Date(departureDate).getTime() + 24 * 60 * 60 * 1000),
            },
        };

        // Nếu là vé khứ hồi → lọc thêm returnDate
        if (tripType === "round-trip") {
            query.returnDate = {
                $gte: new Date(returnDate),
                $lt: new Date(new Date(returnDate).getTime() + 24 * 60 * 60 * 1000),
            };
        }

        // Optional: hạng vé
        if (flightClass) query.flightClass = flightClass;

        // Optional: khoảng giá
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        const flights = await Flight.find(query);

        res.status(200).json({
            success: true,
            message: "Flight search successful",
            data: flights,
        });
    } catch (error) {
        console.error("Flight search error:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Count total flights
export const getFlightCount = async (req, res) => {
    try {
        const count = await Flight.estimatedDocumentCount()
        res.status(200).json({
            success: true,
            data: count,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch flight count',
        })
    }
}
