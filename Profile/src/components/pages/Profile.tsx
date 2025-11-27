import { 
  User, Mail, Phone, MapPin, Calendar, Award, 
  Briefcase, GraduationCap, Code, Database, Globe, 
  Palette, Trophy, Star 
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function Profile() {
  const studentInfo = {
    name: 'Nguyễn Văn A',
    studentId: 'SV2021001',
    major: 'Công Nghệ Thông Tin',
    year: 'Năm 3',
    email: 'nguyenvana@student.edu.vn',
    phone: '+84 123 456 789',
    address: 'TP. Hồ Chí Minh, Việt Nam',
    birthDate: '01/01/2003',
    gpa: '3.75/4.0'
  };

  const skills = [
    { name: 'ReactJS', level: 90 },
    { name: 'Node.js', level: 85 },
    { name: 'TypeScript', level: 80 },
    { name: 'Python', level: 75 },
    { name: 'SQL', level: 85 },
    { name: 'UI/UX Design', level: 70 }
  ];

  const education = [
    {
      degree: 'Cử Nhân Công Nghệ Thông Tin',
      school: 'Đại học ABC',
      period: '2021 - 2025',
      description: 'GPA: 3.75/4.0 - Chuyên ngành Phát triển Phần mềm'
    },
    {
      degree: 'Trung Học Phổ Thông',
      school: 'THPT XYZ',
      period: '2018 - 2021',
      description: 'Tốt nghiệp loại Xuất sắc'
    }
  ];

  const experience = [
    {
      position: 'Frontend Developer Intern',
      company: 'Tech Company ABC',
      period: '06/2024 - 09/2024',
      description: 'Phát triển web application với React, TypeScript và Tailwind CSS'
    },
    {
      position: 'Web Developer',
      company: 'Freelance',
      period: '01/2024 - Present',
      description: 'Thiết kế và phát triển website cho các dự án cá nhân và khách hàng'
    }
  ];

  const projects = [
    {
      name: 'E-commerce Platform',
      description: 'Nền tảng thương mại điện tử với React, Node.js và MongoDB',
      tech: ['React', 'Node.js', 'MongoDB', 'Express']
    },
    {
      name: 'Task Management App',
      description: 'Ứng dụng quản lý công việc với tính năng real-time',
      tech: ['React', 'Firebase', 'Material-UI']
    },
    {
      name: 'Weather Forecast App',
      description: 'Ứng dụng dự báo thời tiết sử dụng API',
      tech: ['React', 'OpenWeather API', 'Chart.js']
    }
  ];

  const achievements = [
    {
      title: 'Giải Nhất Cuộc Thi Lập Trình',
      organization: 'Đại học ABC',
      year: '2024'
    },
    {
      title: 'Học Bổng Khuyến Khích Học Tập',
      organization: 'Đại học ABC',
      year: '2023, 2024'
    },
    {
      title: 'Chứng Chỉ React Developer',
      organization: 'Udemy',
      year: '2024'
    }
  ];

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <section className="profile-header">
        <div className="profile-banner">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1623679116710-78b05d2fe2f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2UlMjBkZXNrfGVufDF8fHx8MTc2NDA3MjYyM3ww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Profile Banner"
            className="banner-image"
          />
        </div>
        
        <div className="container">
          <div className="profile-info-card">
            <div className="row align-items-center">
              <div className="col-lg-3 text-center">
                <div className="profile-avatar">
                  <User size={80} />
                </div>
              </div>
              <div className="col-lg-6">
                <h1 className="profile-name">{studentInfo.name}</h1>
                <p className="profile-subtitle">
                  {studentInfo.major} - {studentInfo.year}
                </p>
                <div className="profile-meta">
                  <span className="meta-item">
                    <strong>MSSV:</strong> {studentInfo.studentId}
                  </span>
                  <span className="meta-item">
                    <strong>GPA:</strong> {studentInfo.gpa}
                  </span>
                </div>
              </div>
              <div className="col-lg-3 text-lg-end mt-3 mt-lg-0">
                <button className="btn btn-primary btn-lg w-100">
                  <Mail size={20} className="me-2" />
                  Liên Hệ
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-5">
        <div className="row g-4">
          {/* Left Column - Info & Skills */}
          <div className="col-lg-4">
            {/* Contact Info */}
            <div className="profile-card">
              <h3 className="card-title">
                <User size={24} className="me-2" />
                Thông Tin Cá Nhân
              </h3>
              <div className="contact-info">
                <div className="info-item">
                  <Mail size={18} />
                  <span>{studentInfo.email}</span>
                </div>
                <div className="info-item">
                  <Phone size={18} />
                  <span>{studentInfo.phone}</span>
                </div>
                <div className="info-item">
                  <MapPin size={18} />
                  <span>{studentInfo.address}</span>
                </div>
                <div className="info-item">
                  <Calendar size={18} />
                  <span>{studentInfo.birthDate}</span>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="profile-card">
              <h3 className="card-title">
                <Code size={24} className="me-2" />
                Kỹ Năng
              </h3>
              <div className="skills-list">
                {skills.map((skill, index) => (
                  <div key={index} className="skill-item">
                    <div className="skill-header">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-percent">{skill.level}%</span>
                    </div>
                    <div className="skill-bar">
                      <div 
                        className="skill-progress" 
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="profile-card stats-card">
              <div className="stat-box">
                <GraduationCap size={32} className="stat-icon" />
                <div className="stat-number">3.75</div>
                <div className="stat-label">GPA</div>
              </div>
              <div className="stat-box">
                <Briefcase size={32} className="stat-icon" />
                <div className="stat-number">2+</div>
                <div className="stat-label">Năm Kinh Nghiệm</div>
              </div>
              <div className="stat-box">
                <Trophy size={32} className="stat-icon" />
                <div className="stat-number">5+</div>
                <div className="stat-label">Giải Thưởng</div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="col-lg-8">
            {/* Education */}
            <div className="profile-card">
              <h3 className="card-title">
                <GraduationCap size={24} className="me-2" />
                Học Vấn
              </h3>
              <div className="timeline">
                {education.map((edu, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h4 className="timeline-title">{edu.degree}</h4>
                      <p className="timeline-subtitle">{edu.school}</p>
                      <span className="timeline-period">{edu.period}</span>
                      <p className="timeline-description">{edu.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="profile-card">
              <h3 className="card-title">
                <Briefcase size={24} className="me-2" />
                Kinh Nghiệm Làm Việc
              </h3>
              <div className="timeline">
                {experience.map((exp, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h4 className="timeline-title">{exp.position}</h4>
                      <p className="timeline-subtitle">{exp.company}</p>
                      <span className="timeline-period">{exp.period}</span>
                      <p className="timeline-description">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="profile-card">
              <h3 className="card-title">
                <Code size={24} className="me-2" />
                Dự Án Nổi Bật
              </h3>
              <div className="row g-3">
                {projects.map((project, index) => (
                  <div key={index} className="col-md-6">
                    <div className="project-card">
                      <h4 className="project-title">{project.name}</h4>
                      <p className="project-description">{project.description}</p>
                      <div className="project-tech">
                        {project.tech.map((tech, idx) => (
                          <span key={idx} className="tech-badge">{tech}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="profile-card">
              <h3 className="card-title">
                <Award size={24} className="me-2" />
                Thành Tích & Giải Thưởng
              </h3>
              <div className="achievements-list">
                {achievements.map((achievement, index) => (
                  <div key={index} className="achievement-item">
                    <div className="achievement-icon">
                      <Star size={24} />
                    </div>
                    <div className="achievement-content">
                      <h4 className="achievement-title">{achievement.title}</h4>
                      <p className="achievement-org">{achievement.organization}</p>
                      <span className="achievement-year">{achievement.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
