from datetime import datetime
from db import kb_docs_col, kb_chunks_col

# 🔹 Ví dụ vài tài liệu mô phỏng quy chế / hướng dẫn trường
docs = [
    {
        "title": "Quy định học phí và đóng tiền",
        "source": "Quy chế học vụ 2024",
        "content": """
Học phí được tính theo số tín chỉ đăng ký mỗi học kỳ. 
Sinh viên phải hoàn thành việc đóng học phí trước hạn quy định. 
Quá hạn sẽ bị tính phí phạt hoặc không được dự thi.

Thông thường hạn đóng học phí là trước tuần thứ 2 của học kỳ. 
Thông tin chính xác được công bố trên cổng sinh viên và email trường.

Sinh viên có thể đóng học phí qua ngân hàng, ví điện tử hoặc trực tiếp tại quầy tài vụ.
        """,
    },
    {
        "title": "Đăng ký môn học và hủy / rút môn",
        "source": "Hướng dẫn đăng ký môn học",
        "content": """
Đăng ký môn học thường mở 1–2 tuần trước khi bắt đầu học kỳ mới.
Sinh viên cần kiểm tra kế hoạch đào tạo để chọn môn phù hợp.

Trong thời hạn add/drop, sinh viên được phép đổi lớp, hủy môn hoặc bổ sung môn.
Sau thời hạn này, việc rút môn có thể bị tính là học lại hoặc có ký hiệu W trên bảng điểm.

Mọi thao tác đăng ký môn đều thực hiện qua cổng sinh viên. 
Trong trường hợp lỗi hệ thống, sinh viên liên hệ phòng đào tạo để được hỗ trợ.
        """,
    },
    {
        "title": "Xem lịch thi và quy định khi đi thi",
        "source": "Quy định thi cử",
        "content": """
Lịch thi được công bố trên cổng sinh viên tại mục Lịch thi.
Sinh viên cần theo dõi thường xuyên để tránh nhầm lẫn ca thi hoặc phòng thi.

Khi đi thi, sinh viên phải mang theo thẻ sinh viên. 
Trường hợp quên thẻ, có thể dùng CCCD hoặc hộ chiếu để xác minh, 
tùy theo quy định cụ thể của trường và giám thị.

Sinh viên đến muộn quá thời gian cho phép có thể không được vào phòng thi.
Việc vi phạm quy chế thi (mang tài liệu, sử dụng điện thoại, trao đổi bài, ...) 
sẽ bị lập biên bản và xử lý theo quy định.
        """,
    },
]


def main():
    if kb_docs_col().count_documents({}) > 0:
        print("KB documents đã tồn tại, bỏ qua seeding.")
        return

    # Insert tài liệu gốc
    res = kb_docs_col().insert_many(
        [
            {
                "title": d["title"],
                "source": d["source"],
                "content": d["content"].strip(),
                "created_at": datetime.utcnow(),
            }
            for d in docs
        ]
    )

    # Với demo này, mỗi document = 1 chunk (cho đơn giản).
    chunks = []
    for doc_id, d in zip(res.inserted_ids, docs):
        chunks.append(
            {
                "doc_id": doc_id,
                "title": d["title"],
                "source": d["source"],
                "text": d["content"].strip(),
                "created_at": datetime.utcnow(),
            }
        )

    kb_chunks_col().insert_many(chunks)
    print("Seeded KB documents & chunks ✅")


if __name__ == "__main__":
    main()
