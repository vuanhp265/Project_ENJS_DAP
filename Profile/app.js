// Load dữ liệu trang chủ
async function loadHome() {
  try {
    const res = await fetch('/api/home');
    const data = await res.json();

    const scheduleEl = document.getElementById('schedule');
    const attendanceEl = document.getElementById('attendance');
    const gradesEl = document.getElementById('grades');

    if (scheduleEl) {
      scheduleEl.innerHTML = data.schedule.map(s =>
        `<div class="small"><strong>${s.day}</strong> • ${s.time} — ${s.subject}</div>`
      ).join('');
    }

    if (attendanceEl) {
      attendanceEl.innerHTML = data.attendance.map(a =>
        `<li>${a.date} — ${a.status}</li>`
      ).join('');
    }

    if (gradesEl) {
      gradesEl.innerHTML = data.grades.map(g =>
        `<li>${g.subject}: ${g.score}</li>`
      ).join('');
    }
  } catch (err) {
    console.error('Lỗi tải dữ liệu:', err);
  }
}

// Chat box
function sendMessage() {
  const input = document.getElementById('chatMessage');
  const chatBox = document.getElementById('chatBox');
  if (!input.value.trim()) return;

  const msg = document.createElement('div');
  msg.className = 'chat-message user';
  msg.textContent = input.value;
  chatBox.appendChild(msg);

  const botReply = document.createElement('div');
  botReply.className = 'chat-message bot';
  botReply.textContent = 'Cảm ơn bạn! Bộ phận hỗ trợ sẽ phản hồi sớm.';
  chatBox.appendChild(botReply);

  input.value = '';
  chatBox.scrollTop = chatBox.scrollHeight;
}
