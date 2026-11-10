# Sổ nợ: lớp tính toán

Chép nguyên văn từ `tranghm9/FA-report` (nhánh `main`, commit `328df30`), thư mục `public/js/`:
`parse.js`, `schema.js`, `data.js`, `validate.js`, `format.js`, `overview.js`, `report.js`, `history.js`, `export.js`.
Không sửa các tệp này; nếu repo gốc cập nhật thì chép lại nguyên tệp và chạy `npm test`.

Tệp riêng của Sổ Kế Hoạch: `sheets-source.js`. Nó thay `fetchRaw` (Apps Script) bằng kết nối Google Sheets của Claude,
vì trang trong Claude không gọi được máy chủ ngoài. Nó trả đúng dạng thô mà `normalize()` nhận.

Quy tắc nghiệp vụ: mục 5 của `docs/INTEGRATION.md` trong repo gốc (nhãn Đã xác nhận / Ước tính / Gồm ước tính,
"Chưa có" thay cho 0, cảnh báo mâu thuẫn, tách Trang và Dũng). Số chuẩn mục 9 được kiểm tra trong `tests/no/so-chuan.test.mjs`,
cả với dữ liệu mẫu lẫn với cùng dữ liệu đi qua đường Google Sheets.

Mã Google Sheet không nằm trong mã nguồn: người dùng dán trong Cài đặt, lưu ở dữ liệu riêng tư của artifact (`meta/debt`).
