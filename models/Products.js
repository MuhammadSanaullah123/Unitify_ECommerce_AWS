const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  producttype: {
    type: String,
    required: true,
  },
  productname: {
    type: String,
    required: true,
  },
  productdesc: {
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
});

module.exports = Products = mongoose.model("product", ProductSchema);
