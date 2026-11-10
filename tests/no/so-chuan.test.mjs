// Số chuẩn ở mục 9 của docs/INTEGRATION.md (repo FA-report), today = 2026-11-07, dữ liệu fixtures/sample.json.
// Chạy hai lần: dữ liệu mẫu đọc thẳng (dạng Apps Script) và cùng dữ liệu đó đi qua đường đọc Google Sheet của Sổ Kế Hoạch
// (giá trị đã định dạng kiểu Việt Nam như kết nối Google Sheets trả về). Hai đường phải ra đúng các số này.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalize } from '../../app/lib/no/data.js';
import { validate } from '../../app/lib/no/validate.js';
import { debtSummary, dueItems, upcoming, overdueUnlogged } from '../../app/lib/no/overview.js';
import { buildReport, unitShares } from '../../app/lib/no/report.js';
import { buildHistory } from '../../app/lib/no/history.js';
import { forecastRows } from '../../app/lib/no/export.js';
import { rawFromValues, readSheet, sheetIdFrom, rangeFor, SHEET_TABS } from '../../app/lib/no/sheets-source.js';

const TODAY = '2026-11-07';
const rawOf = (n) => JSON.parse(readFileSync(new URL(`../../app/fixtures/no/${n}.json`, import.meta.url), 'utf8'));

// Giả lập kết nối Google Sheets: số "229.300", phần trăm "3,0%", ngày "dd/mm/yyyy", bỏ ô trống cuối dòng.
const nf = new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 6 });
function asSheetCell(v, tab) {
  if (v === null || v === undefined || v === '') return '';
  if (typeof v === 'number') return tab === 'Thông số' && v > 0 && v < 1 ? `${(v * 100).toFixed(1).replace('.', ',')}%` : nf.format(v);
  const m = String(v).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : String(v);
}
const trimEnd = (r) => { const a = [...r]; while (a.length && a[a.length - 1] === '') a.pop(); return a; };
function asSheetValues(raw) {
  const out = {};
  for (const [name, t] of Object.entries(raw.tabs)) out[name] = [t.headers, ...t.rows.map((r) => trimEnd(r.map((c) => asSheetCell(c, name))))];
  return out;
}
const viaSheet = (n) => rawFromValues(asSheetValues(rawOf(n)), '2026-11-07T03:00:00.000Z');

for (const [label, load] of [['dữ liệu mẫu', (n) => normalize(rawOf(n))], ['qua Google Sheets', (n) => normalize(viaSheet(n))]]) {
  test(`mục 9 (${label}): validate`, () => {
    assert.deepEqual(validate(load('sample')), []);
    assert.equal(validate(load('sample-conflict')).length, 4);
  });

  test(`mục 9 (${label}): debtSummary`, () => {
    const d = load('sample');
    const t = debtSummary(d, 'Trang');
    assert.equal(t.loans.total, 2200000);
    assert.equal(t.cards.total, 8600000);
    assert.equal(t.total, 10800000);
    assert.equal(t.dueNow, 9450000);
    const g = debtSummary(d, 'Dũng');
    assert.equal(g.total, 12110000);
    assert.equal(g.dueNow, 10470000);
  });

  test(`mục 9 (${label}): đến hạn 7 ngày và quá hạn chưa ghi nhận`, () => {
    const { items } = dueItems(load('sample'));
    assert.deepEqual(upcoming(items, TODAY, 7).map((i) => i.ma), ['T01', 'T04', 'V01', 'T03']);
    assert.deepEqual(overdueUnlogged(items, TODAY).map((i) => i.ma), ['V02']);
  });

  test(`mục 9 (${label}): báo cáo 7 tháng`, () => {
    const r = buildReport(load('sample'), 'Tất cả', TODAY, 7);
    const m = Object.fromEntries(r.months.map((x) => [x.key, x]));
    assert.equal(m['2026-11'].vay, 2070000);
    assert.equal(m['2026-11'].theOk, 4850000);
    assert.equal(m['2026-11'].theEst, 467600);
    assert.equal(m['2026-11'].total, 7387600);
    assert.equal(m['2026-12'].vay, 2070000);
    assert.equal(m['2026-12'].theEst, 5317600);
    for (const k of ['2027-02', '2027-03', '2027-04', '2027-05']) { assert.equal(m[k].vay, 0); assert.equal(m[k].theEst, 5317600); }
    assert.equal(r.totals.all, 42283200);
  });

  test(`mục 9 (${label}): cơ cấu theo đơn vị`, () => {
    const sh = unitShares(buildReport(load('sample'), 'Tất cả', TODAY, 7), 'month');
    assert.equal(sh.rows.length, 7);
    assert.equal(sh.rows[0].name, 'Thẻ VPB');
    assert.equal(sh.rows[0].total, 3000000);
    assert.ok(sh.rows[6].other);
  });

  test(`mục 9 (${label}): lịch sử dư nợ`, () => {
    const h = buildHistory(load('sample'), 'Tất cả', TODAY, 12);
    assert.deepEqual(h.points.map((p) => p.key), ['2026-08', '2026-09', '2026-10', '2026-11']);
    assert.deepEqual(h.points.map((p) => p.vay), [6000000, 7130000, 5060000, 5060000]);
    assert.deepEqual(h.points.map((p) => p.the), [null, 15420000, 16540000, 17850000]);
    assert.deepEqual(h.points.map((p) => p.total), [null, 22550000, 21600000, 22910000]);
    const d = load('sample');
    assert.equal(h.points.at(-1).total, debtSummary(d, 'Trang').total + debtSummary(d, 'Dũng').total);
  });

  test(`mục 9 (${label}): forecastRows Trang`, () => {
    const row = forecastRows(load('sample'), 'Trang', TODAY).find((r) => r[1] === '2026-11');
    assert.deepEqual(row, ['Trang', '2026-11', 850000, 'Đã xác nhận', 3827600, 'Gồm ước tính', 4677600, 'Gồm ước tính']);
  });
}

test('đường Google Sheets cho ra đúng dữ liệu chuẩn hóa như dữ liệu mẫu', () => {
  for (const n of ['sample', 'sample-conflict']) {
    const a = normalize(rawOf(n)), b = normalize(viaSheet(n));
    delete a.generatedAt; delete b.generatedAt;
    assert.deepEqual(b, a);
  }
});

test('sheetIdFrom: nhận link hoặc mã, từ chối chuỗi lạ', () => {
  const id = 'AbCdEfGhIjKlMnOpQrStUvWxYz_0123456789-ab';
  assert.equal(sheetIdFrom(`https://docs.google.com/spreadsheets/d/${id}/edit#gid=0`), id);
  assert.equal(sheetIdFrom(`  ${id} `), id);
  assert.equal(sheetIdFrom('không phải mã'), null);
  assert.equal(sheetIdFrom(''), null);
});

test('rangeFor và danh sách tab', () => {
  assert.equal(rangeFor('Khoản vay'), "'Khoản vay'!A1:Z2000");
  assert.equal(rangeFor("O'Neil"), "'O''Neil'!A1:Z2000");
  assert.deepEqual(SHEET_TABS, ['Thông số', 'Khoản vay', 'Thẻ', 'Linh hoạt', 'Nhật ký']);
});

test('readSheet: thiếu một tab thì bỏ qua; mọi tab lỗi thì báo sai mã Sheet; lỗi kết nối thì ném nguyên mã', async () => {
  const values = asSheetValues(rawOf('sample'));
  const fake = (mode) => ({
    async callTool(server, tool, input) {
      assert.equal(server, 'Google Sheets'); assert.equal(tool, 'get_values');
      const tab = input.range.slice(1, input.range.indexOf("'!"));
      if (mode === 'allbad' || (mode === 'nolinh' && tab === 'Linh hoạt')) throw { code: 'tool_error', message: 'x' };
      if (mode === 'auth') throw { code: 'needs_reauth', message: 'x' };
      return { content: [], payload: { range: input.range, values: values[tab] } };
    },
  });
  const ok = normalize(await readSheet(fake('ok'), 'id'));
  assert.equal(debtSummary(ok, 'Trang').total, 10800000);
  const partial = normalize(await readSheet(fake('nolinh'), 'id'));
  assert.deepEqual(partial.missingTabs, ['Linh hoạt']);
  await assert.rejects(readSheet(fake('allbad'), 'id'), (e) => e.code === 'sheet_unreadable');
  await assert.rejects(readSheet(fake('auth'), 'id'), (e) => e.code === 'needs_reauth');
});
