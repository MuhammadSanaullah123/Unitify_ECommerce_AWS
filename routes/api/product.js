const mongoose = require("mongoose");

const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Product = require("../../models/Products");

// @route      POST api/product
// @desciption Create or enter product in database or in website
// @access     public

router.post(
  "/",
  [
    [
      check("producttype", "Type is required").not().isEmpty(),
      check("productname", "Name is required").not().isEmpty(),
      check("productdesc", "Description is required").not().isEmpty(),
      check("productprice", "Price is required").not().isEmpty(),
      check("productquantity", "Quantity is required").not().isEmpty(),
      check("productimg", "Image is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      producttype,
      productname,
      productprice,
      productquantity,
      productimg,
      productdesc,
    } = req.body;

    //Build profile object
    const productFields = {};
    if (producttype) {
      productFields.producttype = producttype;
    }
    if (productdesc) {
      productFields.productdesc = productdesc;
    }
    if (productname) {
      productFields.productname = productname;
    }
    if (productprice) {
      productFields.productprice = productprice;
    }
    if (productquantity) {
      productFields.productquantity = productquantity;
    }
    if (productimg) {
      productFields.productimg = productimg;
    }

    try {
      //Create Product
      let product = new Products(productFields);

      await product.save();
      product = await Product.find();
      res.json(product);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route      Delete api/product
// @desciption Delete product from website
// @access     Private

router.delete("/", async (req, res) => {
  const { id } = req.query.id;

  try {
    await Product.findOneAndRemove({
      _id: id,
    });
    const product = await Product.find();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route     GET api/product
//@desc      Get all product
//@access    Public
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route      GET api/product/:product_id
// @desciption Get product by product ID
// @access     Public

router.get("/:product_id", async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.product_id,
    });
    if (!product) {
      return res.status(400).json({ msg: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);

    res.status(500).send("Server Error");
  }
});

module.exports = router;
