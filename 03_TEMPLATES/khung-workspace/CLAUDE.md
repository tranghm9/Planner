# CLAUDE.md — Quy tắc vận hành Claude Workspace

Tệp này là bộ quy tắc chung cho toàn bộ Workspace. Claude phải đọc tệp này đầu tiên trong mỗi phiên làm việc. Mỗi dự án đặt trong `01_PROJECTS/<tên-dự-án>/`.

## 1. Khi bắt đầu phiên làm việc
1. Đọc `CURRENT.md` để biết ưu tiên và dự án đang hoạt động, và `MEMORY.md` (giọng văn, nguyên tắc).
2. Xác định dự án liên quan đến yêu cầu.
3. Đọc `PROJECT.md`, `DECISIONS.md`, `TASKS.md` của dự án đó.
4. Chỉ lấy reference cần thiết cho công việc đang làm.
5. Báo lại ngắn gọn: dự án nào, trạng thái gì, bước tiếp theo, có điểm nghẽn nào không.

**Không** đọc toàn bộ `02_REFERENCES/` trong mỗi phiên. **Không** đọc `99_ARCHIVE/` trừ khi người dùng yêu cầu rõ ràng.

## 2. Khi làm việc
- Không sửa tệp trong `02_REFERENCES/` và `03_TEMPLATES/`. Nếu thấy cần sửa, đề xuất và chờ duyệt.
- Mọi bản nháp lưu vào `WORKING/` của dự án, đặt tên `<tên>_v01.md`, `_v02`, `_v03`…
- Không ghi đè bản nháp cũ. Luôn tạo bản mới.
- Không thay đổi quyết định đã ghi trong `DECISIONS.md`. Nếu được yêu cầu đổi: nhắc lại quyết định cũ kèm ngày và lý do, rồi hỏi xác nhận trước khi làm.
- Không tự di chuyển hoặc xóa tệp trong `04_INBOX/`. Chỉ đề xuất, chờ duyệt.
- Khi viết nội dung, luôn áp dụng `MEMORY.md` (giọng văn, đối tượng, nguyên tắc).
- Khi tạo đầu ra có template tương ứng trong `03_TEMPLATES/`, theo đúng template đó.

## 3. Khi kết thúc phiên làm việc
- Cập nhật `TASKS.md`: chuyển trạng thái các việc đã làm.
- Ghi quyết định mới (nếu có) vào `DECISIONS.md`, kèm ngày và lý do trong một dòng.
- Cập nhật `CURRENT.md` nếu trạng thái dự án hoặc bước tiếp theo thay đổi.
- Báo cho người dùng những tệp nào đã được tạo hoặc sửa.

## 4. Khi chốt bản cuối ("Chốt bản này" hoặc tương đương)
1. Copy bản nháp đó sang `OUTPUT/` với tên `<tên>_final.md`.
2. Giữ nguyên toàn bộ tệp trong `WORKING/`, không xóa.
3. Cập nhật `TASKS.md` và `CURRENT.md`.

## 5. Khi hoàn thành dự án ("Archive dự án này")
1. Kiểm tra `OUTPUT/` đã có tệp final chưa. Nếu chưa, cảnh báo và dừng lại.
2. Gỡ dự án khỏi `CURRENT.md`.
3. Ghi một dòng tổng kết vào cuối `PROJECT.md`.
4. Di chuyển thư mục dự án sang `99_ARCHIVE/<năm>/`.

## 6. Nguyên tắc chung
- Thà hỏi lại một câu còn hơn đoán sai bối cảnh.
- Số liệu không có nguồn thì không đưa vào bản nháp.
- Không tìm thấy thông tin trong Workspace thì nói rõ là không có, không tự suy diễn.
