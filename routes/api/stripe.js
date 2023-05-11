const express = require("express");
const router = express.Router();

const { STRIPE_KEY } = require("../../config/keys");
const stripe = require("stripe")(STRIPE_KEY);
/* router.post("/payment", (req, res) => {
  try {
    stripe.charges.create({
      source: req.body.id,
      amount: req.body.totalPrice,
      currency: "usd",
    });
    res.status(200).json(stripeRes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
  /* STRIPE_KEY.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  ); 
}); */

router.post("/payment", async (req, res) => {
  const { items } = req.body;

  const line_items = items.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.productname,
          images: [item.productimg],
          metadata: {
            id: item._id,
          },
        },
        unit_amount: item.productprice * 100,
      },
      quantity: item.productquantity,
    };
  });

  const session = await stripe.checkout.sessions.create({
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 700,
            currency: "usd",
          },
          display_name: "Estimate",
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 5,
            },
            maximum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },
    ],
    line_items,
    mode: "payment",
    success_url: "http://localhost:3000/checkout/true",
    cancel_url: "http://localhost:3000/checkout/false",
  });

  res.send({ url: session.url });
});
module.exports = router;
