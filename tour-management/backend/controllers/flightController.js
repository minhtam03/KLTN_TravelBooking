import Flight from '../models/Flight.js'

export const createFlight = async (req, res) => {
    const newFlight = new Flight(req.body)
    try {
        const savedFlight = await newFlight.save()

        res
            .status(200)    
            .json({
                success: true,
                message: "Successfully created",
                data: savedFlight,
            })
    } catch (error) {
        res 
            .status(500)
            .json({
                success:false,
                message: "Failed to create. Try again"
            })
    }
}