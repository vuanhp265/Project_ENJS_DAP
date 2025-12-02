from datetime import datetime
from db import faqs_col

# 🔹 Danh sách FAQ mẫu để khởi tạo hệ thống
faqs = [
    {
        "intent": "hoc_phi",
        "question": "Học phí mỗi tín chỉ là bao nhiêu?",
        "answer": "Học phí được tính theo từng tín chỉ và thay đổi theo ngành. Bạn có thể xem chi tiết trên cổng sinh viên tại mục Học phí.",
        "tags": ["học phí", "tín chỉ"],
    },
    {
        "intent": "hoc_phi",
        "question": "Hạn đóng học phí là khi nào?",
        "answer": "Thông thường hạn đóng học phí là trước tuần thứ 2 của học kỳ. Bạn nên theo dõi thông báo từ phòng tài vụ.",
        "tags": ["học phí", "đóng tiền"],
    },
    {
        "intent": "dang_ky_mon",
        "question": "Đăng ký môn ở đâu?",
        "answer": "Sinh viên đăng ký môn trên cổng sinh viên trong mục Đăng ký học phần.",
        "tags": ["đăng ký môn", "add course"],
    },
    {
        "intent": "dang_ky_mon",
        "question": "Khi nào mở đăng ký môn?",
        "answer": "Đăng ký môn thường mở trước khi bắt đầu học kỳ mới 1-2 tuần. Thời gian cụ thể tùy từng học kỳ.",
        "tags": ["đăng ký môn"],
    },
    {
        "intent": "lich_thi",
        "question": "Xem lịch thi ở đâu?",
        "answer": "Bạn có thể xem lịch thi trên cổng sinh viên tại mục Lịch thi.",
        "tags": ["lịch thi", "exam"],
    },
    {
        "intent": "lich_thi",
        "question": "Nếu trùng lịch thi thì sao?",
        "answer": "Nếu phát hiện trùng lịch thi, bạn cần liên hệ phòng đào tạo ngay để được hỗ trợ đổi lịch thi.",
        "tags": ["lịch thi", "trùng lịch"],
    },
]


def main():
    if faqs_col().count_documents({}) > 0:
        print("FAQ đã tồn tại, bỏ qua seeding.")
        return

    data = []
    for f in faqs:
        data.append(
            {
                "intent": f["intent"],
                "question": f["question"],
                "answer": f["answer"],
                "tags": f["tags"],
                "updated_at": datetime.utcnow(),
            }
        )

    faqs_col().insert_many(data)
    print("Seeded FAQ mẫu thành công! ✅")


if __name__ == "__main__":
    main()
