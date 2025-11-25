// routes/student.js
const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// API đăng ký
router.post("/register", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.json({ success: true, student });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

// API lấy profile theo studentId
router.get("/profile/:studentId", async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.studentId });
    if (!student) return res.json({ success: false, message: "Không tìm thấy sinh viên" });
    res.json({ success: true, student });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

module.exports = router;
