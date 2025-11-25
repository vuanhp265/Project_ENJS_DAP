// routes/auth.js
const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// API login
router.post("/login", async (req, res) => {
  const { email, studentId } = req.body; // Bạn có thể dùng email + studentId hoặc mật khẩu nếu có

  try {
    const student = await Student.findOne({ email: email, studentId: studentId });
    if (!student) {
      return res.json({ success: false, message: "Email hoặc mã số sinh viên không chính xác" });
    }

    // Lưu session hoặc token nếu cần (hiện tại dùng localStorage)
    res.json({ success: true, student });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

module.exports = router;
