require("dotenv").config();

const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  phone: String,
});

const Student = mongoose.model("Student", studentSchema);

export default Student;

// async function run() {
//   await mongoose.connect(process.env.MONGO_URI);
//   console.log("connected to MongoDB");

//   await Student.create({ name: "Ubaid Ali", phone: "5478216598" });
//   const all = await Student.find();
//   console.log(all);

//   await mongoose.disconnect();
// }

// run().catch((err) => console.log(err));
