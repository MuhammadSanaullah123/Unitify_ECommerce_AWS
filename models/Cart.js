const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  items: [
    {
      productname: {
        type: String,
        required: true,
      },
      productprice: {
        type: String,
        required: true,
      },
      productquantity: {
        type: String,
        required: true,
      },
      productimg: {
        type: String,
        required: true,
      },
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    },
  ],
});

module.exports = Cart = mongoose.model("cart", CartSchema);
