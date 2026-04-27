const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_KEY);

async function createCheckout(user, plan) {
  return await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [{ price: plan, quantity: 1 }],
    success_url: "http://localhost:5173/success"
  });
}

module.exports = { createCheckout };
