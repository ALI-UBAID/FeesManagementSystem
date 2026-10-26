const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    batch: { type: String, required: true },
    totalFee: { type: Number, required: true, min: 0 },
    startDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["active", "completed", "dropped"],
      default: "active",
    },
    installments: [
      {
        dueDate: { type: Date, required: true },
        amount: { type: Number, required: true, min: 1 },
      },
    ],
  },
  { timestamps: true },
);

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

module.exports = Enrollment;
