const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const Cart = require("../../models/Cart");
const Profile = require("../../models/Profile");
const Products = require("../../models/Products");

// @route      POST api/cart
// @desciption Create cart for current logged in user
// @access     Private

router.post("/", auth, async (req, res) => {
  //Build item object
  const itemFields = {};

  itemFields.user = req.user.id;

  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      //Create Profile
      let item = new Cart(itemFields);

      await item.save();

      res.json(item);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route      PUT api/cart/item
// @desciption Add item to cart
// @access     Private

router.put("/items", auth, async (req, res) => {
  const { product_id, productname, productprice, productquantity, productimg } =
    req.body;

  const newitem = {
    productname,
    productprice,
    productquantity,
    productimg,
    product_id,
  };

  try {
    const cart = await Cart.findOne({ user: req.user.id });

    cart.items.unshift(newitem);

    await cart.save();

    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route      GET api/cart/me
// @desciption Get current user's cart
// @access     Private
router.get("/me", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(400).json({ msg: "There is no cart for this user" });
    }

    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route      DELETE api/cart/items/:item_id
// @desciption Delete item from cart
// @access     Private

router.delete("/:item_id", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    //Get remove index
    const removeIndex = cart.items
      .map((item) => item.id)
      .indexOf(req.params.item_id);

    cart.items.splice(removeIndex, 1);
    await cart.save();

    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route      Delete api/cart
// @desciption Delete cart
// @access     Private

router.delete("/", auth, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });

  try {
    for (let i = 0; i < cart.items.length; i++) {
      const product = await Products.findById(cart.items[i].product_id);
      product.productquantity =
        product.productquantity - cart.items[i].productquantity;
      await product.save();
    }
    // Remove cart
    await Cart.findOneAndRemove({
      user: req.user.id,
    });

    res.json({ msg: "Cart deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
