const express = require("express");
const Student = require("../models/Student");
const { verifyToken, requireRole } = require("../middleware/auth");

const router = express.Router();

const createStudent = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
      return res.status(400).json({ message: "Request body is required" });
    }

    const { name, phone, guardianName } = req.body;
    const fields = [name, phone, guardianName];

    if (fields.some((value) => typeof value !== "string" || !value.trim())) {
      return res
        .status(400)
        .json({ message: "Name, phone and guardianName are required" });
    }

    const student = await Student.create({
      name: name.trim(),
      phone: phone.trim(),
      guardianName: guardianName.trim(),
    });

    return res
      .status(201)
      .json({ message: "Student Created Successfully", student });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: "Student with this phone number already exists" });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

router.post("/", verifyToken, requireRole("admin", "staff"), createStudent);

module.exports = router;
