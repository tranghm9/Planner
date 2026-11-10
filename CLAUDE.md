# Sổ Kế Hoạch (repo Planner)

- Người dùng nói tiếng Việt và không rành kỹ thuật: trả lời bằng tiếng Việt dễ hiểu, tự làm phần kỹ thuật, chỉ nhờ người dùng việc chắc chắn không tự làm được.
- App: `app/so-ke-hoach.html` (một tệp, ~180 KB). Đăng thành artifact riêng tư https://claude.ai/artifact/Wemqe6QXbDUAJRH7dGWNHP bằng công cụ Artifact với cùng `file_path` (lần đầu đăng kèm `files`: `lib/no/*.js`, `fixtures/no/sample.json`).
- `app/lib/no/`: lớp tính toán Sổ nợ chép **nguyên văn** từ `tranghm9/FA-report` (không sửa, xem README trong thư mục). Tệp riêng: `sheets-source.js`, `vault-store.js`.
- Test: `npm test` (74 test). Số chuẩn mục 9 của FA-report nằm trong `tests/no/so-chuan.test.mjs`.
- Làm trên nhánh làm việc, không commit lên `main`. Tiến độ và việc còn dở: `docs/TIEN-DO.md`.

## Tiết kiệm token

1. Không đọc cả `app/so-ke-hoach.html` (~50 nghìn token). Dùng Grep `-n` tìm chỗ cần sửa rồi Read theo `offset`/`limit`; sửa nhỏ bằng Edit hoặc `edits` của Artifact.
2. Không đọc lại các tệp chép nguyên văn trong `app/lib/no/`. Chạy test và chỉ in dòng tổng: `npm test 2>&1 | grep -E "^# (pass|fail)"`.
3. Kiểm tra giao diện: tối đa một ảnh chụp cho mỗi thay đổi, khổ 400px, `deviceScaleFactor: 1`. Ưu tiên kiểm tra bằng số liệu/DOM thay cho ảnh.
4. Không mở lại PDF, ảnh hay tài liệu dài đã đọc; ghi phần cần nhớ vào `docs/TIEN-DO.md`.
5. Mỗi phiên một nhóm việc. Xong thì commit + push, cập nhật `docs/TIEN-DO.md`, và đề nghị người dùng mở phiên mới cho yêu cầu tiếp theo.
6. Hook `.claude/hooks/context-guard.mjs` báo độ đầy ngữ cảnh: từ 60% thì cảnh báo người dùng 1–2 câu kèm đề xuất cụ thể; từ 80% thì hook đã tự commit + push, hãy cập nhật `docs/TIEN-DO.md` và đề nghị mở phiên mới trước việc lớn.
