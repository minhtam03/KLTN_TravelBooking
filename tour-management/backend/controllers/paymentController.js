import Stripe from 'stripe'
import dotenv from 'dotenv'
import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";
import HotelBooking from "../models/HotelBooking.js";

dotenv.config()

const key = process.env.STRIPE_SECRET_KEY || undefined
const stripe = new Stripe(key)

// cho tour
// export const createPayment = async (req, res) => {
//     try {

//         const { bookingId, userId, price, tourName } = req.body;

//         if (!bookingId || !userId || !price) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Missing required fields",
//             });
//         }

//         // tao phien thanh toan tren Stripe
//         const session = await stripe.checkout.sessions.create({
//             line_items: [
//                 {
//                     price_data: {
//                         currency: 'usd',
//                         product_data: {
//                             name: req.body.tourName
//                         },
//                         unit_amount: req.body.price * 100
//                     },
//                     quantity: 1,

//                 },
//             ],
//             mode: 'payment',
//             success_url: 'http://localhost:3000/thank-you?session_id={CHECKOUT_SESSION_ID}',
//             cancel_url: 'http://localhost:3000/payment-failed'
//         })

//         // Lưu thông tin thanh toán vào database
//         const newPayment = new Payment({
//             bookingId: req.body.bookingId,
//             userId: req.body.userId,
//             amount: req.body.price,
//             paymentMethod: "Stripe",
//             transactionId: session.id,
//             status: "pending",
//         });

//         const savedPayment = await newPayment.save();

//         // Cập nhật trạng thái booking
//         await Booking.findByIdAndUpdate(req.body.bookingId, {
//             paymentId: savedPayment._id,
//             paymentStatus: "pending",
//         });

//         res
//             .status(200)
//             .json({
//                 success: true,
//                 message: "Payment Successfully",
//                 session: session
//             })
//     } catch (error) {
//         res
//             .status(500)
//             .json({
//                 success: false,
//                 message: "Failed Payment",
//                 error: error
//             })
//     }
// }

// cho cả tour và hotel
export const createPayment = async (req, res) => {
    try {
        const { bookingId, userId, price, name, type } = req.body;

        if (!bookingId || !userId || !price || !name || !type) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields (bookingId, userId, price, name, type)",
            });
        }

        // Tạo phiên thanh toán Stripe
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: name,
                        },
                        unit_amount: price * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:3000/thank-you?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:3000/payment-failed',
        });

        // Lưu thông tin thanh toán vào database
        const newPayment = new Payment({
            bookingId,
            userId,
            amount: price,
            paymentMethod: "Stripe",
            transactionId: session.id,
            status: "pending",
        });

        const savedPayment = await newPayment.save();

        // Cập nhật trạng thái booking
        if (type === "tour") {
            await Booking.findByIdAndUpdate(bookingId, {
                paymentId: savedPayment._id,
                paymentStatus: "pending",
            });
        } else if (type === "hotel") {
            await HotelBooking.findByIdAndUpdate(bookingId, {
                paymentId: savedPayment._id,
                paymentStatus: "pending",
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid booking type (must be 'tour' or 'hotel')",
            });
        }

        res.status(200).json({
            success: true,
            message: "Payment session created successfully",
            session: session,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create payment session",
            error: error.message,
        });
    }
};


export const updatePaymentStatus = async (req, res) => {
    try {
        const { transactionId } = req.body;

        if (!transactionId) {
            return res.status(400).json({
                success: false,
                message: "Missing transaction ID",
            });
        }

        // Tìm thanh toán theo transactionId
        const payment = await Payment.findOne({ transactionId });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found",
            });
        }

        if (payment.status === "success") {
            return res.status(400).json({
                success: false,
                message: "Payment is already successful",
            });
        }

        // Cập nhật trạng thái thanh toán
        payment.status = "success";
        await payment.save();

        // Cập nhật trạng thái booking tương ứng
        await Booking.findByIdAndUpdate(payment.bookingId, {
            paymentStatus: "paid",
        });

        res.status(200).json({
            success: true,
            message: "Payment status updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};