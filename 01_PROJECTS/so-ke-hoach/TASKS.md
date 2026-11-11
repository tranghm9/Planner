# TASKS — Sổ Kế Hoạch

## Đã xong
- [x] App cơ bản: ghi nhanh (chữ, ảnh, giọng nói), AI tách việc, học phân loại, xếp lịch, nhắc hẹn Google Lịch / .ics.
- [x] Giao diện hồng pastel, Sáng/Tối/Theo hệ thống, lịch âm.
- [x] Theo mẫu PandaVocab: Hôm nay (vòng tiến độ, pháo hoa), Lịch, Tuần, Thói quen, Mục tiêu, Năm, Thống kê.
- [x] Sổ nợ: Tổng quan + Báo cáo tháng (đọc Google Sheet, số chuẩn mục 9 khớp), khóa PIN, hướng dẫn kết nối.
- [x] Sửa biểu đồ trên iPhone; tick thói quen không nhảy trang; bảng thói quen tự cuộn tới hôm nay.
- [x] Hook tự lưu + cảnh báo token; áp dụng quy tắc Claude Workspace.
- [x] Khung vàng "Giúp mình phân loại": thêm nút Lưu để chốt luôn danh mục AI gợi ý (vẫn chạm danh mục khác để đổi).
- [x] Rà soát toàn dự án 11/11: sửa đoán ngày giờ khi gõ nhanh ("2 hộp", "chị Mai", "3.5 triệu", "9 giờ 30"), năm can chi theo âm lịch, so sánh tuần cùng kỳ, đếm "Nợ cần chú ý", nút Bỏ có Hoàn tác; hook và tài liệu.
- [x] Người dùng duyệt cả 19 đề xuất của báo cáo rà soát (11/11): báo khi lưu thất bại, Sổ nợ "Không có/Chưa có", ghi chú thẻ Gộp, việc lặp cuối tháng trong lịch, xếp lịch đủ việc, PIN nhớ số lần sai, tệp lịch ngắt dòng đúng chuẩn; gỡ skill watch; sửa khung mẫu; soạn lại 4 skill.

## Đang chờ người dùng
- [ ] Cập nhật 4 skill trong tài khoản Claude theo bản soạn sẵn ở `WORKING/skill-*_v01.md` (Claude không sửa được skill tài khoản từ repo).
- [ ] Thử tải một nhắc hẹn có ghi chú dài trên iPhone (tệp lịch đã sửa cách ngắt dòng).
- [ ] Thử trên iPhone: biểu đồ, tick thói quen, kết nối Google Sheets thật (lần đầu Claude hỏi quyền).

## Đề xuất (chưa làm)
- [ ] Thói quen: chế độ "Tuần này" 7 cột cho điện thoại.
- [ ] Thói quen: thu gọn biểu đồ trên điện thoại.
- [ ] Thói quen: sắp xếp / đẩy thói quen đã tích xuống dưới.
- [ ] Sổ nợ: màn Khoản vay, Thẻ, Nhật ký; xuất ảnh PNG. Khi làm thì tách tệp app thành vài tệp nhỏ (xem DECISIONS 11/11).
- [ ] Sổ nợ: đổi định nghĩa "quá hạn" trong `overview.js` ở repo FA-report (chỉ dòng "Đã trả" mới xóa cảnh báo), rồi chép lại sang `app/lib/no/` và chạy test.
