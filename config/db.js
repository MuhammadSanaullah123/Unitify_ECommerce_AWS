const { mongoURI } = require("./prod.js");

const mongoose = require("mongoose");
const config = require("config");
//const db = config.get("mongoURI");
const db = mongoURI;

const connectDB = async () => {
  mongoose.set("strictQuery", false);

  try {
    await mongoose.connect(db);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    //Exit proces with failure
    process.exit(1);
  }
};

module.exports = connectDB;
