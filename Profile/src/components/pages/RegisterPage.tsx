// src/pages/RegisterPage.tsx
import React, { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Code,
  Briefcase,
  FolderGit2,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./RegisterPage.module.css";
import axios from "axios";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    skills: "",
    projects: "",
    experience: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra mật khẩu
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (formData.password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        skills: formData.skills,
        projects: formData.projects || "",
        experience: formData.experience || "",
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (response.data.success) {
        alert("Đăng ký thành công! Chào mừng bạn đến với Student Portal");
        navigate("/login");
      } else {
        alert(response.data.message || "Đăng ký thất bại!");
      }
    } catch (error: any) {
      console.error("Lỗi đăng ký:", error);
      const msg =
        error.response?.data?.message ||
        "Không thể kết nối đến server. Vui lòng kiểm tra backend!";
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <User size={36} />
        </div>

        <h1 className={styles.title}>Tạo Tài Khoản Sinh Viên</h1>
        <p className={styles.subtitle}>
          Điền đầy đủ thông tin để hoàn tất hồ sơ
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Họ và tên */}
          <div className={styles.inputGroup}>
            <User className={styles.icon} />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Họ và tên đầy đủ"
              className={styles.input}
            />
          </div>

          {/* Email */}
          <div className={styles.inputGroup}>
            <Mail className={styles.icon} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email sinh viên"
              className={styles.input}
            />
          </div>

          {/* Số điện thoại */}
          <div className={styles.inputGroup}>
            <Phone className={styles.icon} />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Số điện thoại (10 số)"
              pattern="[0-9]{10}"
              className={styles.input}
            />
          </div>

          {/* Địa chỉ */}
          <div className={styles.inputGroup}>
            <MapPin className={styles.icon} />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Địa chỉ hiện tại"
              className={styles.input}
            />
          </div>

          {/* Kỹ năng */}
          <div className={styles.textareaGroup}>
            <Code className={styles.icon} />
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Kỹ năng của bạn (React, Python, Figma...)"
              className={styles.textarea}
            />
          </div>

          {/* Dự án */}
          <div className={styles.textareaGroup}>
            <FolderGit2 className={styles.icon} />
            <textarea
              name="projects"
              value={formData.projects}
              onChange={handleChange}
              rows={3}
              placeholder="Dự án đã tham gia (không bắt buộc)"
              className={styles.textarea}
            />
          </div>

          {/* Kinh nghiệm */}
          <div className={styles.textareaGroup}>
            <Briefcase className={styles.icon} />
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              rows={3}
              placeholder="Kinh nghiệm làm việc (không bắt buộc)"
              className={styles.textarea}
            />
          </div>

          {/* Mật khẩu */}
          <div className={styles.inputGroup}>
            <Lock className={styles.icon} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Mật khẩu (tối thiểu 6 ký tự)"
              className={styles.input}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.eyeButton}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Xác nhận mật khẩu */}
          <div className={styles.inputGroup}>
            <Lock className={styles.icon} />
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Nhập lại mật khẩu"
              className={styles.input}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className={styles.eyeButton}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Nút Đăng ký */}
          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? (
              <div className={styles.spinner} />
            ) : (
              "Hoàn Tất Đăng Ký"
            )}
          </button>
        </form>

        <div className={styles.authSwitch}>
          <p className={styles.switchText}>
            <Link to="/login" className={styles.switchLink}>
              <ArrowLeft size={16} /> Quay lại Đăng nhập
            </Link>
          </p>
        </div>

        <div className={styles.footer}>
          © 2025 Student Portal – Hệ thống quản lý sinh viên & việc làm
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;