require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "the program is working!" });
});

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1); // Exit the process with an error code
  }
}

start();
