import Hotel from '../models/Hotel.js'

// create new hotel
export const createHotel = async (req, res) => {
    const newHotel = new Hotel(req.body)
    try {
        const savedHotel = await newHotel.save()

        res
            .status(200)    
            .json({
                success: true,
                message: "Successfully created",
                data: savedHotel,
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

// update hotel

// delete hotel

// getSingle hotel

// getAll hotel