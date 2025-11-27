import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, TrendingUp, Bell, Calendar, BookMarked } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function Home() {
  const announcements = [
    {
      id: 1,
      title: 'Thông Báo Đăng Ký Học Kỳ 2',
      date: '20/11/2025',
      content: 'Sinh viên bắt đầu đăng ký môn học cho học kỳ 2 từ ngày 25/11/2025.',
      type: 'important'
    },
    {
      id: 2,
      title: 'Lịch Thi Cuối Kỳ',
      date: '18/11/2025',
      content: 'Lịch thi cuối kỳ đã được công bố. Vui lòng kiểm tra lịch thi của bạn.',
      type: 'info'
    },
    {
      id: 3,
      title: 'Hội Thảo Khoa Học',
      date: '15/11/2025',
      content: 'Hội thảo khoa học dành cho sinh viên sẽ được tổ chức vào ngày 30/11/2025.',
      type: 'event'
    }
  ];

  const features = [
    {
      icon: <BookOpen size={40} />,
      title: 'Chất Lượng Giáo Dục',
      description: 'Đội ngũ giảng viên giàu kinh nghiệm, chương trình đào tạo hiện đại'
    },
    {
      icon: <Users size={40} />,
      title: 'Cộng Đồng Sinh Viên',
      description: 'Môi trường học tập năng động, cộng đồng sinh viên đông đảo'
    },
    {
      icon: <Award size={40} />,
      title: 'Thành Tích Xuất Sắc',
      description: 'Nhiều giải thưởng trong các cuộc thi học thuật và nghiên cứu'
    },
    {
      icon: <TrendingUp size={40} />,
      title: 'Cơ Hội Nghề Nghiệp',
      description: 'Kết nối với doanh nghiệp, tỷ lệ việc làm cao sau tốt nghiệp'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1631599143424-5bc234fbebf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzY0MDYyMjMzfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="University Campus"
          className="hero-image"
        />
        <div className="hero-content">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <h1 className="hero-title animate-fade-in">
                  Chào Mừng Đến Với <br />
                  <span className="text-gradient">Cổng Thông Tin Sinh Viên</span>
                </h1>
                <p className="hero-subtitle animate-fade-in-delay">
                  Nơi kết nối tri thức, phát triển năng lực và xây dựng tương lai
                </p>
                <div className="hero-buttons animate-fade-in-delay-2">
                  <Link to="/profile" className="btn btn-primary btn-lg me-3">
                    Xem Profile
                  </Link>
                  <Link to="/chatbox" className="btn btn-outline-light btn-lg">
                    Chatbox Hỗ Trợ
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About University Section */}
      <section className="about-section py-5">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <div className="about-image-wrapper">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1620063487586-c3f97749bb84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBncmFkdWF0aW9ufGVufDF8fHx8MTc2NDA3ODQ2NXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Students"
                  className="about-image"
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="section-badge">Về Trường</div>
              <h2 className="section-title">Đại Học Uy Tín Hàng Đầu</h2>
              <p className="section-description">
                Đại học ABC là một trong những trường đại học hàng đầu Việt Nam với hơn 50 năm 
                kinh nghiệm đào tạo. Chúng tôi cam kết mang đến chất lượng giáo dục tốt nhất, 
                trang bị kiến thức và kỹ năng cần thiết cho sinh viên.
              </p>
              <div className="stats-row">
                <div className="stat-item">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Năm Kinh Nghiệm</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">10,000+</div>
                  <div className="stat-label">Sinh Viên</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Giảng Viên</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <div className="section-badge">Điểm Nổi Bật</div>
            <h2 className="section-title">Tại Sao Chọn Chúng Tôi?</h2>
          </div>
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h4 className="feature-title">{feature.title}</h4>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="announcements-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="d-flex align-items-center mb-4">
                <Bell className="me-3 text-primary" size={32} />
                <h2 className="section-title mb-0">Thông Báo Mới Nhất</h2>
              </div>

              <div className="announcements-list">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className={`announcement-card ${announcement.type}`}>
                    <div className="announcement-header">
                      <div className="d-flex align-items-center">
                        {announcement.type === 'important' && <Bell size={20} className="me-2" />}
                        {announcement.type === 'event' && <Calendar size={20} className="me-2" />}
                        {announcement.type === 'info' && <BookMarked size={20} className="me-2" />}
                        <h4 className="announcement-title mb-0">{announcement.title}</h4>
                      </div>
                      <span className="announcement-date">{announcement.date}</span>
                    </div>
                    <p className="announcement-content mb-0">{announcement.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5">
        <div className="container">
          <div className="cta-card">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h3 className="cta-title">Khám Phá Thêm Về Sinh Viên</h3>
                <p className="cta-text">
                  Xem thông tin chi tiết về profile, kỹ năng và thành tích của sinh viên
                </p>
              </div>
              <div className="col-lg-4 text-lg-end">
                <Link to="/profile" className="btn btn-light btn-lg">
                  Xem Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
