// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import axios from "axios";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Vui lòng nhập đầy đủ email và mật khẩu!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/login", {
        email: email.toLowerCase().trim(),
        password: password,
      });

      if (response.data.success) {
        alert("Đăng nhập thành công! Chào mừng bạn trở lại");
        
        // Lưu thông tin user vào localStorage (dùng cho trang Profile sau này)
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
        // Chuyển hướng về trang chủ hoặc dashboard
        navigate("/"); // hoặc "/profile" tùy bạn
      }
    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error);
      const msg =
        error.response?.data?.message ||
        "Đăng nhập thất bại. Kiểm tra email/mật khẩu hoặc backend!";
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <LogIn size={36} />
        </div>

        <h1 className={styles.title}>Đăng Nhập</h1>
        <p className={styles.subtitle}>Chào mừng bạn trở lại Student Portal</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <Mail className={styles.icon} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email của bạn"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <Lock className={styles.icon} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Mật khẩu"
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

          <div className={styles.options}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" />
              <span>Ghi nhớ đăng nhập</span>
            </label>
            <a href="#" className={styles.forgotLink}>
              Quên mật khẩu?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? (
              <div className={styles.spinner} />
            ) : (
              <>
                <LogIn size={20} />
                Đăng Nhập Ngay
              </>
            )}
          </button>
        </form>

        {/* Chuyển sang Đăng ký */}
        <div className={styles.authSwitch}>
          <p className={styles.switchText}>
            Chưa có tài khoản?{" "}
            <Link to="/register" className={styles.switchLink}>
              Đăng ký ngay
            </Link>
          </p>
        </div>

        {/* Nút quay lại trang chủ (tùy chọn) */}
        <div className={styles.authSwitch} style={{ marginTop: "12px" }}>
          <Link to="/" className={styles.switchLink}>
            <ArrowLeft size={16} /> Quay lại trang chủ
          </Link>
        </div>

        <div className={styles.footer}>
          © 2025 Student Portal – Hệ thống quản lý sinh viên & việc làm
        </div>
      </div>
    </div>
  );
};

export default LoginPage;