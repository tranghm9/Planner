// Chỗ lưu cho secure.js/settings.js trong Sổ Kế Hoạch (tệp riêng, không có trong FA-report).
// secure.js cần một "storage" kiểu localStorage (getItem/setItem/removeItem, đồng bộ). Ở đây là bộ nhớ trong,
// mỗi lần đổi thì gọi onChange để trang ghi xuống dữ liệu riêng tư của artifact (meta/debt), nhờ vậy
// mã PIN dùng được trên mọi thiết bị đăng nhập cùng tài khoản. Khi bật PIN, chỉ còn bản đã mã hóa ("sono.vault").
// Nguồn dữ liệu Sổ nợ lưu theo đúng dạng của settings.js: { dataUrl: <link Google Sheet>, dataKey: '' }.

export const sheetLink = (id) => `https://docs.google.com/spreadsheets/d/${id}`;

export function createKvStore(onChange = () => {}) {
  const mem = new Map();
  const emit = () => onChange(Object.fromEntries(mem));
  return {
    getItem: (k) => (mem.has(k) ? mem.get(k) : null),
    setItem: (k, v) => { mem.set(k, String(v)); emit(); },
    removeItem: (k) => { if (mem.delete(k)) emit(); },
    /** Nạp lại toàn bộ từ dữ liệu đã lưu (không gọi onChange). */
    load(kv) { mem.clear(); for (const [k, v] of Object.entries(kv || {})) if (typeof v === 'string') mem.set(k, v); },
    snapshot: () => Object.fromEntries(mem),
  };
}

/** Bản lưu cũ của Sổ Kế Hoạch là { sheetId }; đổi sang khóa 'sono.cfg' mà settings.js đọc. */
export function migrateLegacy(doc) {
  if (doc && doc.kv && typeof doc.kv === 'object') return doc.kv;
  if (doc && typeof doc.sheetId === 'string' && doc.sheetId) return { 'sono.cfg': JSON.stringify({ dataUrl: sheetLink(doc.sheetId), dataKey: '' }) };
  return {};
}
