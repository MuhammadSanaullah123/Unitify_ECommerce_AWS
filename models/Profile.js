const mongoose = require("mongoose");
const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  history: [
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },

      date: {
        type: Date,
        default: Date.now,
      }, // We can also add description if we want
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
        },
      ],
    },
  ],
});

module.exports = Profile = mongoose.model("profile", ProfileSchema);
