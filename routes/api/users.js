const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const config = require("config");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

// @route      POST api/users
// @desciption Register user
// @access     Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters and must conatin one lowercase and uppercase alphabet"
    )
      .isLength({ min: 6 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z]).*$/), //Atleast 1 lowercase and uppercase alphabet is allowed

    check(
      "registeration",
      "Please enter registeration number containing 6 digits"
    ).isLength({ min: 6, max: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, registeration } = req.body; //user entered attributes

    try {
      //See if user exits
      let user = await User.findOne({ email });
      let user_reg = await User.findOne({ registeration });
      if (user && user_reg) {
        return res.status(400).json({
          errors: [{ msg: "Email or Registeration number already exits" }],
        });
      } else if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Email already exits" }] });
      } else if (user_reg) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Registeration number already exits" }] });
      }

      //Get user gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      //Creating instance of user
      user = new User({
        name,
        email,
        avatar,
        password,
        registeration,
      });

      //Encrypt password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      //Return jsonwebtoken

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) {
            throw err;
          }
          res.json({ token });
        }
      ); //webtoken expires in 360000 seconds
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
