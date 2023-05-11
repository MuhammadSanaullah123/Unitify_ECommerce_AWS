const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const config = require("config");
const { check, validationResult } = require("express-validator");

const Admin = require("../../models/Admin");

// @route      POST api/admin
// @desciption Register admin
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
      let admin = await Admin.findOne({ email });
      let admin_reg = await Admin.findOne({ registeration });

      if (admin && admin_reg) {
        return res.status(400).json({
          errors: [{ msg: "Email or Registeration number already exits" }],
        });
      } else if (admin) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Email already exits" }] });
      } else if (admin_reg) {
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
      admin = new Admin({
        name,
        email,
        avatar,
        password,
        registeration,
      });

      //Encrypt password
      const salt = await bcrypt.genSalt(10);

      admin.password = await bcrypt.hash(password, salt);

      await admin.save();

      //Return jsonwebtoken

      const payload = {
        admin: {
          id: admin.id,
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

// @route      GET api/admin
// @desciption Get all admins
// @access     Public

router.get("/", async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
