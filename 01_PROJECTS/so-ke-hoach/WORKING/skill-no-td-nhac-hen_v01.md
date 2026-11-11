---
name: "no-td-nhac-hen"
description: "Tạo, cập nhật, hoàn thành nhắc hẹn thiết bị cho khoản nợ/thẻ của Trang & Dũng theo quy tắc đặt tên, giờ nhắc, ghi chú; nhận dữ liệu bàn giao, không đọc lại Sheet."
---

# Nhắc hẹn nợ Trang & Dũng

Đầu vào: dòng bàn giao từ `no-td-cap-nhat-sheet` (mã, chủ, đơn vị, số tiền, hạn, chế độ, dư nợ kỳ, tối thiểu, hạn mức cấp, ngày chốt, nhãn). Không đọc lại cả Sheet; thiếu một số thì chỉ đọc đúng ô đó hoặc hỏi người dùng. Số ước tính thì ghi "(ước tính)" trong ghi chú; không bịa số.

## Quy tắc
- **Mỗi kỳ một nhắc**, không lặp lại. Ngoại lệ: nhắc "Gửi sao kê … cho Claude để tracking" lặp hằng tháng vào ngày chốt từng thẻ (kể cả SPL và Momo VTS ngày 1). Nhắc trước hạn 3 ngày lúc 09:00 (+07:00), ưu tiên cao, báo động seconds_before = 0. Không hỏi có nên đặt nhắc không: cứ đặt.
- **Tên:** `Đơn vị – số tiền – dd/mm` (dd/mm = ngày đến hạn); Dũng thêm tiền tố `[Dũng] `. Đơn vị chuẩn: Thẻ VPB, Thẻ VIB, Thẻ UOB, Thẻ Home, Thẻ SCB, SPL, SEV, Momo VTS, Mcredit Momo, Momo Vay Nhanh, ZLP, Vay Home. Cùng đơn vị, cùng ngày: gộp tổng trong tên, chia theo hợp đồng trong ghi chú.
- **Ghi chú khoản vay** (ngắn): HĐ, số tiền kỳ, kỳ x/N, ngày kết thúc dự kiến. Nhiều HĐ cùng kỳ: bắt đầu bằng "Có x HĐ cùng kỳ…" rồi liệt kê.
- **Ghi chú nhắc thẻ:** `Số tiền dự kiến / Số tiền thực tế: cập nhật lại sau khi hoàn tất / Thanh toán trước … / Hạn mức được cấp / Sao kê chốt: Dư nợ trong kỳ, Tối thiểu`.
- **Xoá nhắc** luôn cần người dùng duyệt rõ ràng. Nhắc đã làm thì chuyển sang hoàn thành (có completion_date), không xoá.
- **Khi đã trả:** chuyển nhắc tương ứng sang hoàn thành; tạo nhắc kỳ kế tiếp nếu chưa có (search trước để tránh trùng).

## Công cụ
- Nạp bằng ToolSearch trong MỘT lần, chỉ các công cụ cần: mcp__claude-device__reminder_create_v0, reminder_update_v0, reminder_search_v0, reminder_delete_v0, reminder_list_search_v0. Mỗi công cụ nhận một danh sách; nạp schema trước khi gọi lần đầu.
- Công cụ nhắc hẹn chỉ chạy trong lượt có tin nhắn từ app, và hay mất kết nối ("No result received from client-side tool execution").
- Danh sách Trang: "Nhắc nhở" id `<GIỮ NGUYÊN ID ĐANG CÓ>`. Danh sách Dũng: "Công Việc" id `<GIỮ NGUYÊN ID ĐANG CÓ>`. Dùng id, không dùng tên. Tạo ở danh sách Dũng lỗi thì tạo ở danh sách Trang rồi chuyển.
- Làm theo lô tối đa 5 nhắc/lần. Sau lỗi: không gọi lại trong cùng lượt; lượt sau search trước rồi mới tạo lại để tránh trùng. Update có tính lũy đẳng.

## Kiểm tra trước khi báo xong
Search lại để chắc không trùng; số tiền và ngày trên nhắc khớp dòng bàn giao; không xoá gì khi chưa được duyệt. Chưa kiểm tra được thì nói rõ "chưa kiểm tra".
