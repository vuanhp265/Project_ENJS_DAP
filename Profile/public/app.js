async function loadProfile() {
const res = await fetch('/api/profile')
const p = await res.json()


document.getElementById('name').textContent = p.name
document.getElementById('title').textContent = p.title
document.getElementById('bio').textContent = p.bio


const skillsEl = document.getElementById('skills')
skillsEl.innerHTML = ''
p.skills.forEach(s => {
const li = document.createElement('li')
li.textContent = s
skillsEl.appendChild(li)
})


const emailEl = document.getElementById('email')
emailEl.href = `mailto:${p.email}`
emailEl.textContent = p.email


const phoneEl = document.getElementById('phone')
phoneEl.href = `tel:${p.phone}`
phoneEl.textContent = p.phone


const avatar = document.getElementById('avatar')
if (p.avatar) avatar.src = p.avatar
}


loadProfile()


// Ví dụ chỉnh sửa nhanh (local only)
document.getElementById('editBtn').addEventListener('click', () => {
const newName = prompt('Nhập tên mới:', document.getElementById('name').textContent)
if (newName) document.getElementById('name').textContent = newName
})