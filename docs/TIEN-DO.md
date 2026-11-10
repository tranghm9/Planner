# Tiến độ Sổ Kế Hoạch

Cập nhật: 10/11/2026. Đọc tệp này đầu mỗi phiên mới thay vì đọc lại cả lịch sử.

## Đã xong

- App Sổ Kế Hoạch (artifact riêng tư, đã ghim lên thanh bên Claude): ghi nhanh bằng chữ/ảnh/giọng nói, AI tách việc, học cách phân loại (3 lần chọn thì tự xếp), xếp lịch trong ngày, nhắc hẹn qua Google Lịch hoặc tệp .ics.
- Giao diện hồng pastel kiểu sổ tay vẽ tay, chế độ Sáng/Tối/Theo hệ thống, lịch âm.
- Theo mẫu PandaVocab Planner: Hôm nay (vòng tiến độ, pháo hoa khi xong 100%), Lịch tháng, Kế hoạch tuần, Thói quen, Mục tiêu & tầm nhìn (biểu đồ cân bằng lĩnh vực), Kế hoạch năm, Thống kê.
- Sổ nợ Trang & Dũng: Tổng quan dư nợ + Báo cáo tháng (dự kiến 7 tháng, cơ cấu đơn vị, lịch sử dư nợ, CSV), đọc Google Sheet "Sổ nợ" qua kết nối Google Sheets (chỉ đọc). Khóa PIN cho phần Sổ nợ. Số chuẩn mục 9 khớp.
- Sửa: biểu đồ trên iPhone (màu chuyển sang style), tick thói quen không nhảy trang, bảng thói quen tự cuộn tới hôm nay.
- Hook tự lưu tiến trình + cảnh báo token (`.claude/settings.json`, `.claude/hooks/context-guard.mjs`).

## Chưa kiểm tra trên thiết bị thật

- Biểu đồ và tick thói quen trên ứng dụng Claude cho iPhone; kết nối Google Sheets thật trong artifact (lần đầu Claude hỏi quyền).

## Đề xuất đang chờ người dùng chọn

1. Thói quen: chế độ "Tuần này" (7 cột, không kéo ngang) cho điện thoại.
2. Thói quen: thu gọn biểu đồ trên điện thoại.
3. Thói quen: sắp xếp / đẩy thói quen đã tích xuống dưới.
4. Sổ nợ: các màn Khoản vay, Thẻ, Nhật ký; xuất ảnh PNG (chưa mang sang từ FA-report).
