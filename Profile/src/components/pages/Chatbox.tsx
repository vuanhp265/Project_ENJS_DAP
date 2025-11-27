import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function Chatbox() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Xin chào! Tôi là trợ lý ảo. Tôi có thể giúp bạn tìm hiểu thông tin về sinh viên. Hãy hỏi tôi bất cứ điều gì!',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    'Thông tin sinh viên là gì?',
    'MSSV của sinh viên?',
    'Chuyên ngành học gì?',
    'Kỹ năng của sinh viên?',
    'GPA bao nhiêu?',
    'Kinh nghiệm làm việc?'
  ];

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    // Thông tin cơ bản
    if (message.includes('tên') || message.includes('họ')) {
      return 'Sinh viên tên là Nguyễn Văn A, MSSV: SV2021001';
    }
    if (message.includes('mssv') || message.includes('mã số')) {
      return 'Mã số sinh viên là: SV2021001';
    }
    if (message.includes('email') || message.includes('mail')) {
      return 'Email của sinh viên: nguyenvana@student.edu.vn';
    }
    if (message.includes('số điện thoại') || message.includes('sđt') || message.includes('phone')) {
      return 'Số điện thoại: +84 123 456 789';
    }
    if (message.includes('địa chỉ') || message.includes('ở đâu')) {
      return 'Địa chỉ: TP. Hồ Chí Minh, Việt Nam';
    }

    // Học vấn
    if (message.includes('chuyên ngành') || message.includes('ngành học')) {
      return 'Sinh viên đang học chuyên ngành Công Nghệ Thông Tin tại Đại học ABC';
    }
    if (message.includes('năm') || message.includes('khóa')) {
      return 'Sinh viên đang học năm thứ 3, khóa 2021-2025';
    }
    if (message.includes('gpa') || message.includes('điểm')) {
      return 'GPA hiện tại của sinh viên là 3.75/4.0 - mức điểm xuất sắc';
    }
    if (message.includes('học bổng') || message.includes('giải thưởng')) {
      return 'Sinh viên đã đạt được Giải Nhất Cuộc Thi Lập Trình và Học Bổng Khuyến Khích Học Tập trong năm 2023, 2024';
    }

    // Kỹ năng
    if (message.includes('kỹ năng') || message.includes('skill')) {
      return 'Kỹ năng của sinh viên bao gồm:\n- ReactJS (90%)\n- Node.js (85%)\n- TypeScript (80%)\n- Python (75%)\n- SQL (85%)\n- UI/UX Design (70%)';
    }
    if (message.includes('react') || message.includes('frontend')) {
      return 'Sinh viên có kỹ năng ReactJS ở mức 90%, có kinh nghiệm phát triển web applications với React và TypeScript';
    }
    if (message.includes('backend') || message.includes('node')) {
      return 'Sinh viên có kinh nghiệm làm việc với Node.js (85%), Express và MongoDB để phát triển backend applications';
    }

    // Kinh nghiệm
    if (message.includes('kinh nghiệm') || message.includes('làm việc') || message.includes('experience')) {
      return 'Sinh viên có kinh nghiệm:\n- Frontend Developer Intern tại Tech Company ABC (06/2024 - 09/2024)\n- Web Developer Freelance (01/2024 - Hiện tại)';
    }
    if (message.includes('intern') || message.includes('thực tập')) {
      return 'Sinh viên đã thực tập tại Tech Company ABC với vị trí Frontend Developer từ 06/2024 - 09/2024, phát triển web application với React, TypeScript và Tailwind CSS';
    }

    // Dự án
    if (message.includes('dự án') || message.includes('project')) {
      return 'Sinh viên đã thực hiện các dự án:\n- E-commerce Platform (React, Node.js, MongoDB)\n- Task Management App (React, Firebase)\n- Weather Forecast App (React, API)';
    }

    // Mặc định
    return 'Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Bạn có thể hỏi về:\n- Thông tin cá nhân (tên, MSSV, email, SĐT)\n- Học vấn (chuyên ngành, GPA, học bổng)\n- Kỹ năng (React, Node.js, TypeScript...)\n- Kinh nghiệm làm việc\n- Dự án đã thực hiện';
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot typing and response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getBotResponse(inputText),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chatbox-page">
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Chat Header */}
            <div className="chat-header">
              <div className="d-flex align-items-center">
                <div className="chat-avatar">
                  <Bot size={32} />
                </div>
                <div>
                  <h2 className="chat-title mb-0">Trợ Lý Ảo Sinh Viên</h2>
                  <p className="chat-subtitle mb-0">
                    <span className="status-dot"></span>
                    Đang hoạt động
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Container */}
            <div className="chat-container">
              {/* Messages */}
              <div className="messages-wrapper">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${message.sender === 'user' ? 'message-user' : 'message-bot'}`}
                  >
                    <div className="message-avatar">
                      {message.sender === 'bot' ? (
                        <Bot size={24} />
                      ) : (
                        <User size={24} />
                      )}
                    </div>
                    <div className="message-content">
                      <div className="message-bubble">
                        {message.text.split('\n').map((line, index) => (
                          <p key={index} className="mb-1">{line}</p>
                        ))}
                      </div>
                      <span className="message-time">
                        {message.timestamp.toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="message message-bot">
                    <div className="message-avatar">
                      <Bot size={24} />
                    </div>
                    <div className="message-content">
                      <div className="message-bubble typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              {messages.length <= 1 && (
                <div className="quick-questions">
                  <div className="d-flex align-items-center mb-3">
                    <Sparkles size={20} className="me-2 text-primary" />
                    <span className="quick-questions-title">Câu hỏi gợi ý</span>
                  </div>
                  <div className="quick-questions-grid">
                    {quickQuestions.map((question, index) => (
                      <button
                        key={index}
                        className="quick-question-btn"
                        onClick={() => handleQuickQuestion(question)}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="chat-input-area">
                <div className="chat-input-wrapper">
                  <textarea
                    className="chat-input"
                    placeholder="Nhập câu hỏi của bạn..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    rows={1}
                  />
                  <button
                    className="chat-send-btn"
                    onClick={handleSendMessage}
                    disabled={inputText.trim() === ''}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
