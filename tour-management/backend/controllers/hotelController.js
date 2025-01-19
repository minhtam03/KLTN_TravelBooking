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
                message: "Successfully created hotel",
                data: savedHotel,
            })
    } catch (error) {
        res 
            .status(500)
            .json({
                success:false,
                message: "Failed to create hotel"
            })
    }
}

// update hotel
export const updateHotel = async (req, res) => {

    const id = req.params.id

    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(id, {
            $set: req.body
        }, {new: true})
        res.status(200).json({
            success: true,
            message: "Successfully updated hotel",
            data: updatedHotel
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update hotel",
        })
    }
}

// delete hotel
export const deleteHotel = async (req, res) => {

    const id = req.params.id

    try {
        await Hotel.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            message: "Successfully deleted hotel",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete hotel",
        })
    }
}

// getSingle hotel
export const getSingleHotel = async (req, res) => {
    const id = req.params.id

    try {
        const hotel = await Hotel.findById(id)
        res.status(200).json({
            success: true,
            message: "Successful get single hotel",
            data: hotel,
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: "not found hotel",
        })
    }
}

// getAll hotel
export const getAllHotel = async (req, res) => {

    // for pagination
    const page = parseInt(req.query.page)

    try {
        const hotels = await Hotel.find({})
        .skip(page * 8).limit(8)

        res.status(200).json({
            success: true,
            count: hotels.length,
            message: "Successful get all hotel",
            data: hotels
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: "not found hotel"
        })
    }
}