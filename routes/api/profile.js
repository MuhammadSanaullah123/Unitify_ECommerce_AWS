const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const { SENDGRID_API } = require("../../config/prod");
const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key: SENDGRID_API,
    },
  })
);

const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Cart = require("../../models/Cart");

// @route      GET api/profile/me
// @desciption Get current user's profile
// @access     Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route      POST api/profile
// @desciption Create or update user profile
// @access     Private

router.post(
  "/",
  [
    auth,
    [
      check("name", "Name is required").not().isEmpty(),
      check("email", "Email is required").isEmail(),
      check("address", "Address is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, address } = req.body;

    //Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;

    if (name) {
      profileFields.name = name;
    }
    if (email) {
      profileFields.email = email;
    }
    if (address) {
      profileFields.address = address;
    }

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      //Create Profile
      profile = new Profile(profileFields);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route      GET api/profile
// @desciption Get all profile
// @access     Public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route      GET api/profile/user/:user_id
// @desciption Get profile by user ID
// @access     Public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "Profile not found" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);

    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route      Delete api/profile
// @desciption Delete profile, user & posts
// @access     Private

router.delete("/", auth, async (req, res) => {
  try {
    // Remove profile
    await Profile.findOneAndRemove({
      user: req.user.id,
    });
    // Remove User
    await User.findOneAndRemove({
      _id: req.user.id,
    });
    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route      PUT api/profile/history
// @desciption Add history
// @access     Private

router.put("/history", auth, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user.id });
  const items = cart.items;
  const { name, email, address } = req.body;

  const newHist = {
    name,
    email,
    address,
    items: [],
  };

  // Populate the items field of the newHist object
  for (let i = 0; i < items.length; i++) {
    const cartItem = items[i];
    const item = {
      productname: cartItem.productname,
      productprice: cartItem.productprice,
      productquantity: cartItem.productquantity,
      productimg: cartItem.productimg,
    };
    newHist.items.push(item);
  }

  try {
    const profile = await Profile.findOne({ user: req.user.id });

    profile.history.unshift(newHist);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route      DELETE api/profile/history/:hist_id
// @desciption Delete history from profile
// @access     Private

router.delete("/history/:hist_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    //Get remove index
    const removeIndex = profile.history
      .map((item) => item.id)
      .indexOf(req.params.hist_id);

    profile.history.splice(removeIndex, 1);
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route      POST api/profile/sendmail
// @desciption Send email to customer after checking out
// @access     Private

router.post(
  "/sendmail",
  [
    auth,
    [
      check("name", "Name is required").not().isEmpty(),
      check("email", "Email is required").isEmail(),
    ],
  ],
  async (req, res) => {
    const { name, email } = req.body;
    const profile = await Profile.findOne({ user: req.user.id });

    const htmlMessage = `
  <div style="background-color: #f5f5f5; padding: 20px;">
    <div style="background-color: #ffffff; padding: 20px; border-radius: 5px;">
      <h1 style="color: #333333; font-size: 20px;">Thankyou ${name} for shopping at UnitifyMarket!</h1>
      <p style="color: #666666; font-size: 16px;">Your order id is #${profile.history[0]._id}</p>
      <p style="color: #666666; font-size: 16px;">Click on the following link to see your order list:  
      http://localhost:3000/thankyou
      </p>

      
    </div>
  </div>
`;
    const mail = transporter
      .sendMail({
        to: email,
        from: "muhammed14336@gmail.com",
        subject: "UnitifyShop Purchase",
        html: /* `<h3 style="color:red;">${name}</h3>
        <p>${message}</p>` */ htmlMessage,
      })
      .then((resp) => {
        res.json({ resp });
      })
      .catch((err) => {
        console.error(err.message);
        res.status(500).send("Server Error");
      });
  }
);
module.exports = router;
