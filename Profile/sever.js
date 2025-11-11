const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 3000


// Serve static files from public
app.use(express.static(path.join(__dirname, 'public')))


// Example profile data (thay đổi ở đây để cập nhật thông tin)
const profile = {
name: 'Le Minh',
title: 'Fullstack Developer (Node.js)',
location: 'Hà Nội, Việt Nam',
email: 'leminh@example.com',
phone: '+84 912 345 678',
bio: 'Mình là một lập trình viên thích xây dựng ứng dụng web đơn giản, rõ ràng và dễ mở rộng.',
skills: ['JavaScript', 'Node.js', 'Express', 'HTML', 'CSS', 'React'],
avatar: '/avatar.png' // nếu muốn, bạn có thể đặt ảnh vào public/avatar.png
}


// API trả về profile dưới dạng JSON
app.get('/api/profile', (req, res) => {
res.json(profile)
})


// Fallback to index.html for SPA-style routing (không bắt buộc)
app.get('*', (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'index.html'))
})


app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`)
})