import { Facebook, Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-wrapper">
      <div className="container">
        <div className="row g-4">
          {/* About Section */}
          <div className="col-lg-4 col-md-6">
            <h5 className="footer-title">Về Chúng Tôi</h5>
            <p className="footer-text">
              Website profile sinh viên cung cấp thông tin chi tiết về học vấn, 
              kỹ năng và thành tích của sinh viên. Nền tảng kết nối và chia sẻ thông tin.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-lg-4 col-md-6">
            <h5 className="footer-title">Liên Kết Nhanh</h5>
            <ul className="footer-links">
              <li><a href="/">Trang Chủ</a></li>
              <li><a href="/profile">Profile</a></li>
              <li><a href="/chatbox">Chatbox</a></li>
              <li><a href="#about">Giới Thiệu</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-4 col-md-6">
            <h5 className="footer-title">Thông Tin Liên Hệ</h5>
            <ul className="footer-contact">
              <li>
                <MapPin size={18} />
                <span>Đại học ABC, TP.HCM</span>
              </li>
              <li>
                <Phone size={18} />
                <span>+84 123 456 789</span>
              </li>
              <li>
                <Mail size={18} />
                <span>student@university.edu.vn</span>
              </li>
            </ul>

            {/* Social Links */}
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <p className="mb-0">
            © {currentYear} Student Portal. Designed with ❤️ by Students
          </p>
        </div>
      </div>
    </footer>
  );
}
