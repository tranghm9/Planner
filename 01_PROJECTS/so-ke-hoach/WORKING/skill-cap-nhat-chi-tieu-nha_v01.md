---
name: "cap-nhat-chi-tieu-nha"
description: "Cập nhật chi tiêu tháng cho Google Sheet \"Nhà Chúng Mình 🥰\" (Dũng, Chan, Nho): ghi khoản cố định + biến động, cập nhật thống kê, báo cáo và tự kiểm tra."
---

# Cập nhật chi tiêu "Nhà Chúng Mình 🥰"

Mỗi lần cập nhật: ghi đúng chi phí tháng; giữ khoản cố định như tháng trước; khoản biến động chỉ lấy từ người dùng; cập nhật thống kê và báo cáo; tự kiểm tra trước khi báo xong.
Khi xung đột, ưu tiên: dữ liệu chính xác → toàn vẹn → tính đúng → nhất quán với lịch sử → dễ dùng → đẹp.
Công cụ: kết nối Google Sheets (tìm file bằng Google Drive search_files, tên "Nhà Chúng Mình"). Chưa kết nối thì nhắc người dùng bật.
**Không đoán** số tiền, người chịu, tỷ lệ chia, tháng, loại chi phí. Chỉ dùng khi chắc chắn từ lịch sử hoặc cấu trúc file; không chắc thì hỏi.

## 1. Cấu trúc file
### 1.1 Sheet "Câu trả lời biểu mẫu 1" — dữ liệu gốc (table Form_Responses)
| Cột | Tên | Quy tắc |
|---|---|---|
| A, B | Dấu thời gian, Email | Để trống khi nhập tay |
| C | Tháng Ngân sách | Số YYYYMM, ví dụ 202609 |
| D | Mục đích | Tiền nhà / Đồ tiêu dùng / Thực phẩm / Nhà hàng. Khoản đặc biệt ghi tên riêng (tự vào nhóm "Khác") |
| E | Tổng số tiền | Số thuần, định dạng #,##0 đ. Được âm (hoàn/ứng tiền) |
| F | Nội dung | "<Tên khoản> - <số người 2 chữ số>", ví dụ "Tiền điện - 03", "Sữa - 02" |
| G | Dành cho | Tên cách nhau bằng dấu cách: "Dũng Chan Nho", "Chan Nho", "Nho". Riêng Tiền thuê - 02 ghi "Dũng, Chan" |
| H | Hóa đơn/Biên lai | Trống nếu không có |
| I | Ghi chú | Ngắn. Mọi điều chỉnh/giải thích ghi ở đây, KHÔNG ghi vào cột F |
| J | Đơn giá/người | CÔNG THỨC, không nhập tay: =IF(C<202506; E/(số người); ROUND(E/(số người);0)); số người = số dấu cách trong G + 1 |

- Thứ tự dòng: tháng mới nhất trên cùng; trong tháng sắp theo Mục đích rồi Nội dung.
- Sheet đang được BẢO VỆ ("Nhập form nha"). Không ghi được thì xem mục 6.
- Không xóa, không sửa dữ liệu tháng trước. Không đổi tên cột hay cấu trúc table.

### 1.2 Sheet "Bảng tổng hợp 1" — thống kê
- Dòng 4: các tháng (B4 trở đi, mỗi cột +1 tháng).
- Dòng 5–10: tổng theo nhóm (Tiền nhà, Đồ tiêu dùng, Thực phẩm, Nhà hàng, Khác = phần còn lại, TỔNG CỘNG), SUMIFS từ Form_Responses.
- Dòng 14–17: phần từng người (Dũng, Chan, Nho) = SUMIFS cột "Đơn giá/người" với tên có trong cột G.
- Dòng 13 và 18–20: trạng thái chốt sổ / số tiền / ngày thanh toán. KHÔNG tự sửa. Bỏ qua nhãn "Chưa chốt sổ" của các tháng ≤ 202606.
- Thêm tháng mới: copy cột tháng cuối sang cột kế tiếp (giữ công thức, định dạng). Không tạo cột trùng tháng.

### 1.3 Sheet "Báo cáo chi phí" — bảng tổng quan (đã có, chỉ làm mới)
- B2: ô chọn tháng (YYYYMM); cả báo cáo tính theo tháng này. Sau khi cập nhật: đặt B2 = tháng mới nhất.
- Dòng 4–6: chỉ số chính và ô tự đối soát với Bảng tổng hợp 1 (B6 phải là "✅ Khớp").
- Dòng 8–15: cơ cấu theo nhóm. Dòng 17–27: chi tiết Tiền nhà. Dòng 29 trở đi: tổng quan theo tháng (tự mở rộng). Có 3 biểu đồ.

### 1.4 Các sheet ẩn ("Tổng hợp chi tiêu", "Thang 11"…"Thang 5")
Dữ liệu cũ, không sửa.

## 2. Chi phí cố định
Nguồn là **tháng gần nhất trong file**. Bảng dưới chỉ là số tham khảo để phát hiện thay đổi, không phải số để ghi:
| Mục đích | Nội dung | Số tham khảo | Dành cho |
|---|---|---|---|
| Tiền nhà | Tiền thuê - 01 | 2.200.000 | Nho |
| Tiền nhà | Tiền thuê - 02 | 5.800.000 | Dũng, Chan |
| Tiền nhà | Tiền wifi - 03 | 305.000 | Dũng Chan Nho |

Tháng gần nhất khác bảng này: KHÔNG tự coi là cố định, báo người dùng. Lịch sử cho thấy có thêm khoản ổn định: đề xuất để người dùng xác nhận.

## 3. Chi phí biến động (chỉ từ người dùng)
Đưa về đúng cú pháp đang có, viết hoa chữ đầu, đúng chính tả theo lịch sử (Nước xả, Nước rửa chén…):
- "Điện - 03 - 850000" → Tiền nhà | Tiền điện - 03 | Dũng Chan Nho
- "nước giặt - 03" → Đồ tiêu dùng | Nước giặt - 03
- "sữa - 02 (Chan Nho)" → Thực phẩm | Sữa - 02 | Chan Nho

Quy tắc riêng:
- **Tiền nước** = hóa đơn + 2.200 đ phí thanh toán (phí thật). Khi người dùng gửi lịch sử hóa đơn: mỗi tháng = hóa đơn tháng đó + 2.200; so các tháng đã ghi với (hóa đơn + 2.200), tổng chênh lệch cộng/trừ vào dòng tiền nước tháng hiện tại; ghi chi tiết ở Ghi chú, ví dụ "HĐ 197.856 + phí 2.200 + bù 5.000 (T2/2026 ghi thiếu; T5–T6 lệch bù trừ nhau)".
- **Tiền rác**: 67.000 đ/tháng, có thể gom nhiều tháng vào một tháng. Ghi chú dạng "Tiền rác 56789" (các tháng được tính).
- **Tiền điện có thể có 2 dòng** cùng tháng khi tỷ lệ chia khác nhau (ví dụ "Tiền điện - 02" cho Dũng Chan + "Tiền điện - 03"). KHÔNG phải trùng lặp.
- Không có thông tin thì KHÔNG tự bịa số. Thiếu tháng, người, khoản hoặc số tiền: dừng phần đó và hỏi lại.

## 4. Quy trình bắt buộc
1. **Xem trước** (không sửa): cấu trúc, tháng gần nhất, khoản cố định tháng trước, cú pháp, vùng bảo vệ.
2. **Chốt danh sách**: bảng nội bộ Loại | Khoản | Giá trị | Nguồn (Tháng trước / Người dùng / Hóa đơn). Rõ hết mới đi tiếp.
3. **Ghi**: chèn dòng mới lên đầu table theo mục 1.1. Kiểm tra trùng (cùng tháng + khoản + người) trước khi thêm.
4. **Đối chiếu**: thêm hoặc cập nhật cột tháng ở "Bảng tổng hợp 1".
5. **Báo cáo**: làm mới "Báo cáo chi phí", đặt B2 = tháng mới nhất.
6. **Kiểm tra → sửa → kiểm tra lại** (mục 5).
7. **Trả kết quả** (mục 7).

## 5. Kiểm tra sau mỗi lần cập nhật
1. Trùng: không có bản ghi trùng, không có 2 cột hoặc 2 bảng cho cùng một tháng.
2. Thiếu: đủ khoản cố định, đủ khoản người dùng đưa, không dòng nào thiếu tháng/khoản/người/số tiền.
3. Khoản cố định: so tháng trước với tháng này. Khác thì báo: "Khoản X trước đây là …, tháng này là …. Tôi chưa tự sửa vì chưa rõ là thay đổi chủ động hay lỗi dữ liệu."
4. Tính toán: tổng = tổng các dòng chi tiết. Dũng + Chan + Nho ≈ tổng chi phí. Chênh lệch phải chỉ ra dòng hoặc công thức gây ra.
5. Giữa các sheet: Form_Responses = Bảng tổng hợp 1 = Báo cáo chi phí (B6 = "✅ Khớp").
6. Tháng cũ: tổng, phần từng người, công thức, định dạng không đổi.
7. Báo cáo: không có #REF!, #VALUE!, #N/A; không thiếu hoặc trùng tháng; biểu đồ trỏ đúng vùng.

Chênh lệch đã biết, không phải lỗi mới:
- 202506 trở đi: lệch ±1–4 đ do làm tròn.
- 202412–202504: lệch do có người ngoài (Cumtee) và tên lặp ("Dũng Chan Chan Nho").
- 202510: lệch phân bổ 134.413 đ do cột J của điện/nước/rác là số gõ tay chép từ 202509. Tháng đã chốt, không sửa trừ khi người dùng yêu cầu.

Phân loại:
- **Lỗi** (tự sửa rồi kiểm tra lại): công thức sai, tham chiếu sai, trùng lặp hoặc định dạng sai do chính thao tác vừa làm.
- **Cảnh báo** (báo, không tự sửa): khoản cố định thay đổi, thông tin mơ hồ, nhiều cách hiểu, số tiền bất thường so với lịch sử.
- **Ghi nhận**: không cần dừng.

## 6. Khi không ghi được dữ liệu gốc (vùng bảo vệ)
- Không tìm cách gỡ bảo vệ.
- Ghi sẵn các dòng cần nhập vào một sheet tạm, ví dụ "Tạm - Nhập T07-T09" (tab màu cam): cùng tiêu đề, cùng thứ tự cột A–I và thứ tự dòng như sheet gốc; tháng và số tiền ở dạng số.
- Người dùng dùng điện thoại: KHÔNG đưa dữ liệu dạng chữ có tab (app không tự tách cột). Hướng dẫn copy vùng ô A2:I… từ sheet tạm sang sheet gốc: (1) chèn đủ số dòng trống dưới tiêu đề; (2) dán vào A2; (3) kiểm tra cột J có công thức (trống thì copy từ dòng bên dưới).
- Người dùng nhập xong: kiểm tra đầy đủ (mục 5), rồi xóa sheet tạm.

## 7. Kết quả trả về (ngắn, không mô tả kỹ thuật dài)
1. **Đã cập nhật**: tháng, khoản biến động đã thêm, khoản cố định được giữ, bảng/báo cáo đã cập nhật.
2. **Kết quả kiểm tra**: một dòng cho mỗi mục 1–7 ở trên, ✅ Đạt hoặc ❌ kèm lý do.
3. **Cảnh báo**: ⚠️ … hoặc "Không còn cảnh báo nào."

Kèm tổng chi phí dự kiến từng tháng để đối soát. Chỉ báo "Hoàn tất" khi vòng kiểm tra cuối không còn lỗi chưa xử lý.
