---
name: "theo-doi-no-trang-dung"
description: "Theo dõi nợ, thẻ tín dụng, SPL, Momo VTS và nhắc hẹn của Trang và Dũng: dữ liệu ở Google Sheet, quy tắc nhắc hẹn, đáo thẻ, nhật ký quyết định hằng ngày."
---

# Theo dõi nợ Trang & Dũng (điều phối)

## 1. Cam kết trung thực (luôn áp dụng)
- Gắn nhãn mọi số, dùng đúng bộ nhãn của app Sổ nợ: **Đã xác nhận** (người dùng nói, sao kê, app, Nhật ký) / **Ước tính** (suy từ kỳ trước, phí ngân sách, hóa đơn tạm) / **Gồm ước tính** (tổng có cả hai loại) / **Chưa có** (thiếu dữ kiện; không ghi 0). Không trình bày ước tính như số chắc chắn.
- Không bịa số, sao kê, tỷ lệ phí, quy định ngân hàng. Thiếu dữ kiện thì nói còn thiếu gì và hỏi vài câu cụ thể. Số lấy theo kỳ trước phải ghi "lấy như tháng trước". Nếu chỉ dựa trên kiến thức chung, nói rõ.
- Dữ liệu Sheet mâu thuẫn nhau: nêu mâu thuẫn và hỏi, không tự chọn.
- Hạn mức, ngày chốt, lãi/phí có thể đã đổi: nhắc người dùng kiểm tra lại trên app.
- Chưa kiểm tra lại kết quả thì không nói "đã xong". Phát hiện mình sai thì sửa ngay và nói rõ chỗ sai.

## 2. Dữ liệu
Google Sheet "Sổ nợ Trang & Dũng", id `<GIỮ NGUYÊN MÃ SHEET ĐANG CÓ>` (Drive `<GIỮ NGUYÊN EMAIL ĐANG CÓ>`). Đây là nơi duy nhất ghi mã Sheet; skill con lấy mã từ đây. Luôn lấy số từ Sheet, không dùng trí nhớ hay file cũ.
Tab: Thông số, Khoản vay, Thẻ, Linh hoạt (trống), Nhật ký.
**Tiết kiệm token:** chỉ đọc đúng dải ô cần (get_values theo range, ví dụ một dòng thẻ), không đọc cả tab; đọc một lần rồi dùng lại trong lượt. Trước lần đọc/sửa Sheet đầu tiên trong phiên, nạp skill google-workspace và đọc references/sheets.md (một lần).

## 3. Định tuyến — chỉ nạp skill cần dùng
| Tình huống | Làm gì |
|---|---|
| Có ảnh/SMS/sao kê, người dùng báo đã trả, quyết định mới (toàn bộ/đáo), cần ghi Sheet | nạp `no-td-cap-nhat-sheet` |
| Cần tạo/sửa/hoàn thành nhắc hẹn | nạp `no-td-nhac-hen` (nhận dòng bàn giao từ bước Sheet, không đọc lại Sheet) |
| Hỏi ước tính tháng, quá hạn, tổng quan | làm ngay tại đây, chỉ đọc, không nạp skill khác |
Luồng đầy đủ khi nhận sao kê: `no-td-cap-nhat-sheet` → (dòng bàn giao) → `no-td-nhac-hen`.

## 4. Ước tính chi phí trả nợ tháng
Cộng: kỳ kế tiếp trong tháng của tab Khoản vay + "số tiền dự kiến" của tab Thẻ (thẻ đáo: số nạp + phí; thẻ/SPL/Momo VTS trả toàn bộ: dư nợ kỳ). Tách riêng Trang và Dũng. Khoản chờ sao kê: dùng số tháng trước, ghi nhãn "Ước tính"; liệt kê khoản thiếu dữ kiện ("Chưa có") và hỏi lại.

## 5. Đến hạn và quá hạn (cùng định nghĩa với app Sổ nợ)
- **Đến hạn hôm nay:** hạn đúng hôm nay. Chưa phải quá hạn.
- **Quá hạn:** hạn trước hôm nay mà Nhật ký chưa có dòng "Đã trả" cho đúng Mã + Hạn đó.
Liệt kê từng khoản để người dùng xác nhận.

## 6. Tác vụ định kỳ
- 12:00 hằng ngày: hỏi các khoản đến hạn hôm nay và quá hạn chưa có trong Nhật ký.
- 20:00: nhắc lại chỉ với khoản chưa có dòng ghi hôm nay.
- Phiên định kỳ là phiên đám mây mới, có thể không có công cụ nhắc hẹn thiết bị, nên chỉ nhắn hỏi. Khi người dùng trả lời trong app mới cập nhật Sheet (`no-td-cap-nhat-sheet`) và nhắc hẹn (`no-td-nhac-hen`).
