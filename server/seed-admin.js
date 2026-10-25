require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const passwordHash = await bcrypt.hash("admin12345", 12);
  await User.create({
    name: "Admin",
    email: "admin@test.com",
    passwordHash,
    role: "admin",
  });
  console.log("Admin created");
  await mongoose.disconnect();
}
run();
