import Stripe from 'stripe'
import dotenv from 'dotenv'

dotenv.config()
const key = process.env.STRIPE_SECRET_KEY || undefined
const stripe = new Stripe(key)

export const createPayment = async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: req.body.title
                        },
                        unit_amount: req.body.price * 100
                    },
                    quantity: 1,

                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:3000/thank-you',
            cancel_url: 'https://www.google.com/'
        })


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