---
name: "no-td-cap-nhat-sheet"
description: "Trích xuất dữ liệu từ ảnh/SMS/sao kê/tin báo đã trả của Trang & Dũng và cập nhật Google Sheet Sổ nợ (Thẻ, Khoản vay, Nhật ký), rồi kiểm tra ô đã ghi."
---

# Trích xuất & cập nhật Sheet nợ Trang & Dũng

Nhắc nhanh trung thực: gắn nhãn Đã xác nhận / Ước tính / Gồm ước tính / Chưa có; không bịa số; thiếu thì hỏi; mâu thuẫn thì nêu ra; chưa kiểm tra thì không nói "xong".
Mã Sheet: lấy ở mục 2 của skill `theo-doi-no-trang-dung` (không chép lại ở đây). Trước lần ghi đầu tiên trong phiên: nạp skill google-workspace và đọc references/sheets.md (một lần). Chỉ đọc/ghi đúng dải ô cần.

## Bước 1 — Trích xuất (đọc ảnh/tin nhắn đúng một lần)
Lấy các trường: đơn vị + 4 số cuối thẻ (chỉ ghi 4 số cuối), ngày chốt, dư nợ trong kỳ, số tiền tối thiểu, hạn thanh toán, hạn mức khả dụng, hạn mức. Trường nào không đọc rõ: ghi "Chưa có" và hỏi, không đoán. Không chép lại toàn bộ nội dung ảnh; chỉ trả về bảng nhỏ các trường đã lấy khi cần người dùng xác nhận.

## Bước 2 — Ghi Sheet
- **Thẻ** (mỗi dòng một thẻ): T01 VPB 8643, T02 VIB 7993, T03 SCB 0184, T04 UOB 2101, T05 Home 0748, T06 SPL Trang, T07 SPL Dũng, T08 Momo VTS Trang. Hạn mức, ngày chốt, hạn thanh toán của từng thẻ: đọc ở dòng thẻ đó trong Sheet, không dùng số nhớ sẵn. Cột nhập: dư nợ kỳ, tối thiểu, hạn thanh toán, hạn mức khả dụng, chế độ kỳ này (Toàn bộ / Đáo). Các cột số nạp, phí, số tiền dự kiến là công thức: giữ nguyên, chỉ sửa ô đầu vào.
- **Khoản vay**: mỗi hợp đồng một dòng. Khi trả xong một kỳ, chỉ tăng "Kỳ kế tiếp (chưa trả)" thêm 1. Kỳ 1 = tháng liền sau ngày giải ngân; khoản mới: tổng phải trả = số dư ban đầu theo app.
- **Nhật ký**: mọi quyết định/xác nhận ghi cùng ngày; cột: ngày ghi, chủ, mã, đơn vị, hạn thực tế, dự kiến, thực tế, trạng thái, chế độ thẻ, phí đáo thực tế, dư nợ kỳ đáo, ghi chú.
- **Linh hoạt**: trống; không ghi SPL/Momo VTS ở đây (tránh tính trùng).
- Định dạng khi ghi bằng công cụ Sheets: dấu chấm phẩy (;) phân cách đối số công thức (dấu phẩy gây #ERROR!); ngày =DATE(y;m;d); ô số #,##0, ngày dd/mm/yyyy. Gặp lỗi quota thì đợi rồi đọc lại.

## Bước 3 — Chế độ thanh toán
- Thẻ ngân hàng (VPB, VIB, SCB, UOB, Home): hỏi người dùng "toàn bộ hay đáo" TRƯỚC khi tạo nhắc; chế độ các kỳ trước xem ở Nhật ký. Nếu đáo: không bao giờ trả tối thiểu. Hai thông số lấy ở tab **Thông số**: M = "Hạn mức khả dụng mục tiêu để đáo thẻ", P = "Phí đáo thẻ dùng làm ngân sách". Số nạp A = max(0; M − hạn mức khả dụng); phí ngân sách = P × (dư nợ kỳ − A); số tiền nhắc = A + phí (nhãn Ước tính). Phí thực tế thường thấp hơn ngân sách; ghi phí thực tế vào Nhật ký khi đã trả.
- Nếu toàn bộ: số tiền = dư nợ kỳ (nhãn Đã xác nhận).
- SPL (Trang, Dũng) và Momo VTS: luôn trả toàn bộ, số tiền = dư nợ kỳ, không hỏi "đáo"; SPL không có tối thiểu. Nếu dùng số ước tính trước khi có sao kê ngày 1: ghi rõ "Ước tính".

## Bước 4 — Khi người dùng báo đã trả
Hỏi số tiền thực tế và trạng thái nếu chưa có → ghi Nhật ký (thực tế, trạng thái Đã trả, phí đáo thực tế) → tăng kỳ kế tiếp (Khoản vay) hoặc cập nhật dòng Thẻ.

## Bước 5 — Kiểm tra
Đọc lại các ô vừa ghi: không có #ERROR!, số đúng, số tiền dự kiến khớp công thức. Chưa đọc lại được thì nói "chưa kiểm tra".

## Bàn giao cho nhắc hẹn (ngắn, mỗi khoản một dòng)
`Mã | chủ | đơn vị | số tiền | dd/mm hạn | chế độ | dư nợ kỳ | tối thiểu | hạn mức cấp | ngày chốt | nhãn (Đã xác nhận/Ước tính)`
Sau đó nạp `no-td-nhac-hen` nếu cần tạo/sửa/hoàn thành nhắc; không bắt skill đó đọc lại Sheet.
