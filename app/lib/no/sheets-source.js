// Nguồn dữ liệu cho Sổ Kế Hoạch: đọc Google Sheet "Sổ nợ" qua kết nối Google Sheets của Claude
// (thay cho fetchRaw/Apps Script của app gốc, vì trang trong Claude không gọi được máy chủ ngoài).
// Trả về đúng dạng thô mà normalize() trong data.js nhận: { ok, generatedAt, tabs: { 'Tên tab': { headers, rows } } }.
// Kết nối trả giá trị đã định dạng kiểu Việt Nam ("229.300", "3,0%", "01/12/2026"); parse.js đã đọc được các dạng này.
import { TAB_NAMES, PARAM_TAB } from './schema.js';

export const SERVER = 'Google Sheets';
export const TOOL = 'get_values';
export const SHEET_TABS = [PARAM_TAB, ...Object.values(TAB_NAMES)];

/** Nhận link Google Sheet hoặc mã Sheet; trả mã hoặc null. */
export function sheetIdFrom(input) {
  const s = String(input ?? '').trim();
  const m = s.match(/\/spreadsheets\/d\/([A-Za-z0-9_-]{20,})/);
  if (m) return m[1];
  return /^[A-Za-z0-9_-]{20,}$/.test(s) ? s : null;
}

/** Vùng ô cần đọc cho một tab (tên tab có dấu nháy được nhân đôi theo chuẩn A1). */
export const rangeFor = (tab) => `'${String(tab).replace(/'/g, "''")}'!A1:Z2000`;

/**
 * valuesByTab: { 'Tên tab': string[][] (dòng 1 là tiêu đề) | undefined (tab không đọc được) }
 * Kết nối bỏ các ô trống cuối dòng, nên mỗi dòng được bù "" cho đủ số cột tiêu đề.
 */
export function rawFromValues(valuesByTab, generatedAt = null) {
  const tabs = {};
  for (const [name, values] of Object.entries(valuesByTab)) {
    if (!Array.isArray(values)) continue;
    const [headers = [], ...rows] = values;
    const w = headers.length;
    tabs[name] = {
      headers: headers.map((h) => (h == null ? '' : h)),
      rows: rows.map((r) => Array.from({ length: Math.max(w, (r || []).length) }, (_, i) => (r && r[i] != null ? r[i] : ''))),
    };
  }
  return { ok: true, generatedAt, tabs };
}

/**
 * Đọc 5 tab qua `mcp.callTool`. Tab không tồn tại (tool_error) được bỏ qua để normalize() báo "thiếu tab".
 * Nếu mọi tab đều lỗi tool_error thì coi là sai mã Sheet hoặc không có quyền xem.
 * Lỗi khác của kết nối (chưa kết nối, cần đăng nhập lại, bị từ chối…) được ném ra nguyên mã để giao diện xử lý.
 */
export async function readSheet(mcp, sheetId, { refresh = false } = {}) {
  const valuesByTab = {};
  let failed = 0, oldest = null;
  await Promise.all(SHEET_TABS.map(async (tab) => {
    try {
      const res = await mcp.callTool(SERVER, TOOL, { spreadsheetId: sheetId, range: rangeFor(tab) },
        { cache: { staleTime: 60000, gcTime: 600000, refresh } });
      const p = res && res.payload;
      valuesByTab[tab] = p && Array.isArray(p.values) ? p.values : [];
      const at = res && res.cache && res.cache.storedAt;
      if (at && (oldest == null || at < oldest)) oldest = at;
    } catch (e) {
      if (e && e.code === 'tool_error') { failed++; return; }
      throw e;
    }
  }));
  if (failed === SHEET_TABS.length) {
    const err = new Error('Không đọc được Sheet: sai mã Sheet hoặc tài khoản Google đang kết nối không có quyền xem.');
    err.code = 'sheet_unreadable';
    throw err;
  }
  return rawFromValues(valuesByTab, new Date(oldest ?? Date.now()).toISOString());
}
