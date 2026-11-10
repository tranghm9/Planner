# Sổ nợ Trang & Dũng — tóm tắt tài liệu bàn giao

Nguồn: https://github.com/tranghm9/FA-report (`docs/INTEGRATION.md`, commit 328df30).

- **Lớp tính toán** (chép nguyên văn vào `app/lib/no/`): parse, schema, data, validate, format, overview, report, history, export, secure, settings.
- **Quy tắc mục 5 (bắt buộc):** mỗi số có nhãn Đã xác nhận / Ước tính / Gồm ước tính; thiếu → "Chưa có"; mâu thuẫn → cảnh báo, không tự chọn; tách Trang và Dũng; công thức thẻ Toàn bộ/Đáo (phí 3% ngân sách = ước tính); dư nợ = vay còn lại (ước tính) + dư nợ kỳ thẻ (xác nhận), không gồm trả góp chưa lên sao kê; báo cáo tháng: thẻ các tháng sau là ước tính; lịch sử: không dựng ngược thẻ; quá hạn chưa ghi nhận khi Nhật ký không có dòng cùng Mã + Hạn.
- **Số chuẩn mục 9** (fixtures/sample.json, today 2026-11-07): kiểm tra tự động trong `tests/no/so-chuan.test.mjs`.
- **Màu mục 6:** Đã xác nhận xanh mint, Ước tính vàng đào, cảnh báo đỏ; biểu đồ: Khoản vay = ch-0, Thẻ = ch-4, sọc chéo = ước tính.
