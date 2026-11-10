// Khóa PIN của Sổ nợ trong Sổ Kế Hoạch: secure.js (nguyên văn từ FA-report) chạy trên chỗ lưu vault-store.js.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSecure } from '../../app/lib/no/secure.js';
import { createKvStore, migrateLegacy, sheetLink } from '../../app/lib/no/vault-store.js';
import { sheetIdFrom } from '../../app/lib/no/sheets-source.js';

const ID = 'MaSheetGiaLapKhongPhaiThat_0123456789abc';

test('bật PIN: chỗ lưu chỉ còn bản mã hóa, không lộ mã Sheet; mỗi thay đổi đều được báo để ghi xuống', async () => {
  const writes = [];
  const kv = createKvStore((snap) => writes.push(JSON.stringify(snap)));
  const sec = createSecure(kv);
  assert.equal(await sec.setCfg({ dataUrl: sheetLink(ID), dataKey: '' }), true);
  assert.equal(sheetIdFrom(sec.getCfg().dataUrl), ID);
  await sec.enable('246810');
  const snap = JSON.stringify(kv.snapshot());
  assert.ok(!snap.includes(ID), 'lộ mã Sheet trong chỗ lưu');
  assert.ok(!snap.includes('docs.google.com'), 'lộ link Sheet trong chỗ lưu');
  assert.ok(!writes.at(-1).includes(ID), 'lần ghi cuối còn mã Sheet');
  assert.deepEqual(Object.keys(kv.snapshot()), ['sono.vault']);
});

test('khóa / mở khóa / tắt khóa / quên PIN', async () => {
  const kv = createKvStore();
  const sec = createSecure(kv);
  await sec.setCfg({ dataUrl: sheetLink(ID), dataKey: '' });
  await sec.enable('246810');
  sec.lock();
  assert.equal(sec.locked, true);
  assert.equal(sec.getCfg(), null);
  assert.equal(await sec.unlock('111111'), false);
  assert.equal(await sec.unlock('246810'), true);
  assert.equal(sheetIdFrom(sec.getCfg().dataUrl), ID);
  // máy khác: nạp lại cùng dữ liệu đã lưu, mở bằng cùng PIN
  const kv2 = createKvStore(); kv2.load(kv.snapshot());
  const sec2 = createSecure(kv2);
  assert.equal(sec2.locked, true);
  assert.equal(await sec2.unlock('246810'), true);
  assert.equal(sheetIdFrom(sec2.getCfg().dataUrl), ID);
  // tắt khóa: trả lại bản thường
  assert.equal(await sec.disable('000000'), false);
  assert.equal(await sec.disable('246810'), true);
  assert.equal(sec.enabled, false);
  assert.equal(sheetIdFrom(sec.getCfg().dataUrl), ID);
  // quên PIN: xóa sạch
  await sec.enable('135790'); sec.lock(); sec.wipe();
  assert.equal(sec.enabled, false);
  assert.equal(sec.getCfg(), null);
  assert.deepEqual(kv.snapshot(), {});
});

test('chuyển bản lưu cũ { sheetId } sang dạng của settings.js', () => {
  const kv = createKvStore(); kv.load(migrateLegacy({ sheetId: ID }));
  assert.equal(sheetIdFrom(createSecure(kv).getCfg().dataUrl), ID);
  assert.deepEqual(migrateLegacy(null), {});
  assert.deepEqual(migrateLegacy({ kv: { a: 'b' } }), { a: 'b' });
});
