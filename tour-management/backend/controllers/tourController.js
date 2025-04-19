import Tour from '../models/Tour.js'
import { getEmbedding } from '../utils/embeddingHelper.js';

// create new tour

// export const createTour = async (req, res) => {
//     const newTour = new Tour(req.body)
//     try {
//         const savedTour = await newTour.save()

//         res
//             .status(200)
//             .json({
//                 success: true,
//                 message: "Successfully created",
//                 data: savedTour,
//             })
//     } catch (error) {
//         res
//             .status(500)
//             .json({
//                 success: false,
//                 message: "Failed to create. Try again"
//             })
//     }
// }
export const createTour = async (req, res) => {
    try {
        const { desc } = req.body;

        // Gọi Hugging Face để tạo embedding
        const embedding = await getEmbedding(desc);

        const newTour = new Tour({
            ...req.body,
            embedding, // thêm embedding vào tour
        });

        const savedTour = await newTour.save();

        res.status(200).json({
            success: true,
            message: "Successfully created with embedding",
            data: savedTour,
        });
    } catch (error) {
        console.error("Create tour failed:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to create. Try again",
        });
    }
};

// update tour
export const updateTour = async (req, res) => {

    const id = req.params.id

    try {
        const updatedTour = await Tour.findByIdAndUpdate(id, {
            $set: req.body
        }, { new: true })
        res.status(200).json({
            success: true,
            message: "Successfully updated",
            data: updatedTour
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update",
        })
    }
}

// delete tour
export const deleteTour = async (req, res) => {

    const id = req.params.id

    try {
        await Tour.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            message: "Successfully deleted",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete",
        })
    }
}

// getSingle tour
export const getSingleTour = async (req, res) => {
    const id = req.params.id

    try {
        const tour = await Tour.findById(id)
            .populate({
                path: "reviews",
                populate: {
                    path: "userId",
                    select: "username photo"
                }
            });
        res.status(200).json({
            success: true,
            message: "Successful get single",
            data: tour,
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: "not found",
        })
    }
}

// getAll tour
export const getAllTour = async (req, res) => {

    // for pagination
    const page = req.query.page ? parseInt(req.query.page) : null;

    let tours;

    try {
        // tours = await Tour.find({}).populate('reviews')
        // .skip(page * 8).limit(8)

        if (page !== null) {
            tours = await Tour.find({})
                .populate('reviews')
                .skip(page * 8)
                .limit(8);
        } else {
            tours = await Tour.find({}).populate('reviews');
        }

        res.status(200).json({
            success: true,
            count: tours.length,
            message: "Successful get all",
            data: tours
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: "not found"
        })
    }
}

// get tour by search
// export const getTourBySearch = async (req, res) => {
//     try {
//         const query = {};

//         if (req.query.city) {
//             query.city = new RegExp(req.query.city, 'i');
//         }

//         if (req.query.duration) {
//             query.duration = parseInt(req.query.duration);  // so sánh chính xác
//         }

//         if (req.query.maxGroupSize) {
//             query.maxGroupSize = { $gte: parseInt(req.query.maxGroupSize) };
//         }

//         // Nếu không có bất kỳ query nào được truyền
//         if (Object.keys(query).length === 0) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Please provide at least one search parameter."
//             });
//         }

//         const tours = await Tour.find(query).populate('reviews');

//         res.status(200).json({
//             success: true,
//             message: "Successful",
//             data: tours,
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Server error",
//         });
//     }
// };

export const getTourBySearch = async (req, res) => {
    try {
        const query = {};

        if (req.query.city) {
            query.city = new RegExp(req.query.city, 'i');
        }

        if (req.query.duration) {
            query.duration = parseInt(req.query.duration);
        }

        if (req.query.maxGroupSize) {
            query.maxGroupSize = { $gte: parseInt(req.query.maxGroupSize) };
        }

        const page = parseInt(req.query.page) || 0;
        const limit = 8;

        const tours = await Tour.find(query)
            .populate('reviews')
            .skip(page * limit)
            .limit(limit);

        const total = await Tour.countDocuments(query);

        res.status(200).json({
            success: true,
            message: "Successful",
            data: tours,
            total,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


// get featured tour
export const getFeaturedTour = async (req, res) => {

    try {
        const tours = await Tour.find({ featured: true }).populate('reviews').limit(8)
        res.status(200).json({
            success: true,
            message: "Successful",
            data: tours
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: "not found",
        })
    }
}


// get tour counts
export const getTourCount = async (req, res) => {
    try {
        const tourCount = await Tour.estimatedDocumentCount()
        res.status(200).json({
            success: true,
            data: tourCount
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "failed to fetch"
        })
    }
}