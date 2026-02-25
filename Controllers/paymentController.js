const Stripe = require("stripe");
const dotenv = require("dotenv");
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent =  async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createPaymentIntent };