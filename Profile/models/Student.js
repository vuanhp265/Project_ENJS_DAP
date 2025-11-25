const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: String,
  studentId: String,
  address: String,
  email: String,
  password: String,
  phone: String,
  skills: String
});

module.exports = mongoose.model("Student", StudentSchema);
