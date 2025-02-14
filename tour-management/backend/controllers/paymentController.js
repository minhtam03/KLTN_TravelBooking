import Stripe from 'stripe'
import dotenv from 'dotenv'
import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";

dotenv.config()

const key = process.env.STRIPE_SECRET_KEY || undefined
const stripe = new Stripe(key)

export const createPayment = async (req, res) => {
    try {

        const { bookingId, userId, price, tourName } = req.body;

        if (!bookingId || !userId || !price) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        // tao phien thanh toan tren Stripe
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: req.body.tourName
                        },
                        unit_amount: req.body.price * 100
                    },
                    quantity: 1,

                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:3000/thank-you',
            cancel_url: 'http://localhost:3000/payment-failed'
        })

        // Lưu thông tin thanh toán vào database
        const newPayment = new Payment({
            bookingId: req.body.bookingId,
            userId: req.body.userId,
            amount: req.body.price,
            paymentMethod: "Stripe",
            transactionId: session.id,
            status: "pending",
        });

        const savedPayment = await newPayment.save();

        // Cập nhật trạng thái booking
        await Booking.findByIdAndUpdate(req.body.bookingId, {
            paymentId: savedPayment._id,
            paymentStatus: "pending",
        });

        res
            .status(200)
            .json({
                success: true,
                message: "Payment Successfully",
                session: session
            })
    } catch (error) {
        res
            .status(500)
            .json({
                success: false,
                message: "Failed Payment",
                error: error
            })
    }
}


export const stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    console.log(" Webhook received. Headers:", req.headers);

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
        console.log(" Webhook verified successfully!");
    } catch (err) {
        return res.status(400).json({ success: false, message: "Webhook error", error: err.message });
    }

    console.log("Webhook Event Type:", event.type);
    console.log("Webhook Data:", event.data.object);

    // Xử lý sự kiện thanh toán thành công
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const payment = await Payment.findOne({ transactionId: session.id });

        if (payment) {
            // Cập nhật trạng thái thanh toán thành công
            payment.status = "success";
            await payment.save();

            // Cập nhật trạng thái booking là "paid"
            await Booking.findByIdAndUpdate(payment.bookingId, {
                paymentStatus: "paid",
            });
        }
    }

    res.status(200).json({ success: true, message: "Webhook received" });
};
