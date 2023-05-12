const express = require("express");
const connectDB = require("./config/db.js");
const path = require("path");

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.redirect("/home"));

// Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/admin", require("./routes/api/admin"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/cart", require("./routes/api/cart"));
app.use("/api/product", require("./routes/api/product"));
app.use("/api/stripe", require("./routes/api/stripe"));

const _dirname = path.dirname("");
const buildPath = path.join(_dirname, "./client/build");

app.use(express.static(buildPath));
app.get("/*", function (req, res) {
  res.sendFile(
    path.join(__dirname, "./client/build/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

const PORT = process.env.PORT || 5000;

//app.listen();
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
