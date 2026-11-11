# DECISIONS — Quyết định đã chốt

Mỗi dòng: ngày · quyết định · lý do. Không đổi quyết định cũ khi chưa nhắc lại và được xác nhận.

- 10/11/2026 · Chạy app dạng artifact trong Claude · Miễn phí, AI nằm sẵn trong gói Claude, dữ liệu riêng tư theo tài khoản, không cần máy chủ.
- 10/11/2026 · Học phân loại: một nhóm được chọn 3 lần thì tự xếp việc tương tự · Đúng yêu cầu "thời gian đầu hỏi, sau đó tự sắp xếp".
- 10/11/2026 · Nhắc hẹn qua Google Lịch / tệp .ics · Artifact không tự gửi thông báo khi đóng.
- 10/11/2026 · Giao diện hồng pastel kiểu sổ tay vẽ tay, có Sáng/Tối/Theo hệ thống · Người dùng yêu cầu, tham khảo PandaVocab Planner.
- 10/11/2026 · Sổ nợ chỉ đọc Google Sheet, app không tạo nhắc nợ · Tránh nhắc trùng với skill no-td-nhac-hen ("mỗi kỳ một nhắc"); Sheet là nguồn gốc.
- 10/11/2026 · Lớp tính toán FA-report chép nguyên văn; nguồn đọc qua kết nối Google Sheets thay Apps Script · Giữ test và quy tắc mục 5; artifact không gọi được máy chủ ngoài.
- 10/11/2026 · Khóa PIN chỉ áp cho phần Sổ nợ · Quên PIN phải xóa dữ liệu khóa; khóa cả sổ thì ai cũng mở được bằng "Quên PIN".
- 10/11/2026 · Màu biểu đồ theo thực thể (khoản vay / thẻ), ước tính tô sọc chéo · Quy ước mục 6 của FA-report, bộ màu đã kiểm tra mù màu.
- 10/11/2026 · Hook: 60% ngữ cảnh cảnh báo, 80% tự commit + push, không commit lên main · Không mất việc khi phiên đầy hoặc bị tóm tắt.
- 10/11/2026 · Áp dụng bộ quy tắc Claude Workspace (CLAUDE.md, CURRENT, MEMORY, 01_PROJECTS…) cho repo này · Người dùng yêu cầu.
- 11/11/2026 · Khung "Giúp mình phân loại" có nút Lưu chốt danh mục gợi ý; chạm danh mục khác vẫn chốt ngay · Đã có gợi ý thì chỉ cần xác nhận, không bắt chọn lại.
- 11/11/2026 · Hook giả định ngữ cảnh 1 triệu token (`PLANNER_CONTEXT_WINDOW` trong `.claude/settings.json`); đổi sang mô hình ngữ cảnh nhỏ hơn thì phải đổi số này · Nếu không, mức cảnh báo 60%/80% không bao giờ hiện.
- 11/11/2026 · Không bật "tự lưu cuối mọi lượt"; giữ tự lưu từ 80% và trước khi tóm tắt · Tránh lịch sử git quá vụn, vẫn không mất việc.
- 11/11/2026 · Gỡ skill `watch` (xem video) khỏi repo · Không liên quan Sổ Kế Hoạch; cần thì cài lại.
- 11/11/2026 · Một bộ nhãn số liệu ở mọi nơi (app, skill, tài liệu): Đã xác nhận / Ước tính / Gồm ước tính / Chưa có · Trước đó skill dùng "Chưa biết".
- 11/11/2026 · Sổ nợ: tổng bằng 0 thì ghi "Chưa có" khi thiếu dữ liệu, "Không có" khi không có khoản nào, "0 đ" chỉ khi thật sự bằng 0 · Theo nguyên tắc không ghi 0 thay cho số thiếu.
- 11/11/2026 · "Quá hạn" = hạn trước hôm nay và Nhật ký chưa có dòng "Đã trả" cho đúng Mã + Hạn; đến hạn hôm nay là "đến hạn" · Thống nhất skill và app. Phần app cần sửa `overview.js` ở repo gốc FA-report rồi chép lại (chưa làm).
- 11/11/2026 · Chưa tách tệp app; tách khi làm tính năng lớn tiếp theo · Tách tốn một phiên và phải thử lại toàn bộ.
