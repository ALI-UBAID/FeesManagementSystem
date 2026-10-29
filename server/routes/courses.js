const express = require("express");
const Course = require("../models/Course");
const { verifyToken, requireRole } = require("../middleware/auth");

const router = express.Router();

const getCourses = async (req, res) => {
  try {
    const filter = {};
    if (req.query.active === "true") filter.isActive = true;
    if (req.query.active === "false") filter.isActive = false;

    const courses = await Course.find(filter).sort({ name: 1 });
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const createCourse = async (req, res) => {
  try {
    const { name, durationMonths, baseFee } = req.body;

    if (!name || !durationMonths || baseFee == undefined) {
      return res
        .status(400)
        .json({ message: "Name, durationMonths and baseFee required" });
    }
    const course = await Course.create({
      name,
      durationMonths,
      baseFee,
    });

    await course.save();

    return res
      .status(201)
      .json({ message: "Course Created Successfully", course });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Course already exists" });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const editCourse = async (req, res) => {
  try {
    // picking only the fields that are allowed to be changed
    const allowed = ["name", "durationMonths", "baseFee", "isActive"];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    // checking if anything valid is sent or  not
    if (Object.keys(updates).length == 0)
      return res.status(400).json({ message: "Nothing to update" });

    // finding by id and updating the selected course
    const course = await Course.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    //checking if course with that id is available or not
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json(course);
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid course id" });
    }
    if (err.code === 11000) {
      return res.status(409).json({ message: "Course name already exists" });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    console.error(err);
    res.status(400).json({ message: "Server error!" });
  }
};

router.get("/", verifyToken, getCourses);
router.post("/", verifyToken, requireRole("admin"), createCourse);
router.put("/:id", verifyToken, requireRole("admin"), editCourse);

module.exports = router;
