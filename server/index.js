require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const { verifyToken, requireRole } = require("./middleware/auth");
const userRoutes = require("./routes/users");
// console.log(verifyToken, requireRole);

app.use(cors());
app.use(express.json());

connectDB();

// auth routes
app.use("/api/auth", authRoutes);

app.use("/users", userRoutes);

// course route
app.use("/courses", require("./routes/courses"));

// middleware
app.get("/me", verifyToken, (req, res) => res.json(req.user));
app.get("/admin-only", verifyToken, requireRole("admin"), (req, res) =>
  res.json({ message: "Hello admin" }),
);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
