const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/home', (req, res) => {
  res.json({
    schedule: [
      { day: 'Thứ 2', time: '7:00 - 9:00', subject: 'Toán cao cấp' },
      { day: 'Thứ 3', time: '9:30 - 11:30', subject: 'Lập trình Java' },
      { day: 'Thứ 5', time: '13:00 - 15:00', subject: 'Cơ sở dữ liệu' }
    ],
    attendance: [
      { date: '01/11/2025', status: 'Có mặt' },
      { date: '02/11/2025', status: 'Vắng có phép' },
      { date: '03/11/2025', status: 'Có mặt' }
    ],
    grades: [
      { subject: 'Toán cao cấp', score: 9 },
      { subject: 'Java', score: 8.5 },
      { subject: 'Cơ sở dữ liệu', score: 9.2 }
    ]
  });
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/profile', (req, res) => res.sendFile(path.join(__dirname, 'public', 'profile.html')));
app.get('/chat', (req, res) => res.sendFile(path.join(__dirname, 'public', 'chat.html')));

app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));
