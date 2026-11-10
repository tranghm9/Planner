#!/usr/bin/env node
// Canh độ đầy ngữ cảnh của phiên Claude Code và tự lưu tiến trình lên git.
// Gọi từ .claude/settings.json:
//   prompt     (UserPromptSubmit) : từ 60% trở lên thì nhắc Claude cảnh báo + đề xuất tiết kiệm token; từ 80% tự lưu trước.
//   precompact (PreCompact)       : luôn tự lưu trước khi Claude tóm tắt cuộc trò chuyện.
//   stop       (Stop)             : từ 80% trở lên, tự lưu khi Claude trả lời xong mỗi lượt.
// "Tự lưu" = commit mọi thay đổi chưa lưu + push lên nhánh đang làm. Không bao giờ commit lên main/master.
// Không bao giờ làm hỏng lượt làm việc: lỗi gì cũng chỉ ghi chú, thoát mã 0.
import { readFileSync, openSync, readSync, fstatSync, closeSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

const mode = process.argv[2] || 'prompt';
let input = {};
try { input = JSON.parse(readFileSync(0, 'utf8') || '{}'); } catch { /* bỏ qua */ }
const cwd = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
const WARN = Number(process.env.PLANNER_CONTEXT_WARN) || 0.6;
const CRIT = Number(process.env.PLANNER_CONTEXT_CRIT) || 0.8;
const STATE = join(cwd, '.claude', '.context-guard-state.json');

/** Ngữ cảnh hiện tại = token đầu vào của lượt trả lời gần nhất (input + cache đọc + cache ghi), đọc từ cuối transcript. */
export function lastContext(path) {
  if (!path || !existsSync(path)) return null;
  const fd = openSync(path, 'r');
  try {
    const size = fstatSync(fd).size, len = Math.min(size, 4 * 1024 * 1024), buf = Buffer.alloc(len);
    readSync(fd, buf, 0, len, size - len);
    const lines = buf.toString('utf8').split('\n');
    for (let i = lines.length - 1; i >= 0; i--) {
      const l = lines[i]; if (!l.includes('"usage"')) continue;
      let o; try { o = JSON.parse(l); } catch { continue; }
      const u = o && o.type === 'assistant' && o.message && o.message.usage;
      if (u) return { tokens: (u.input_tokens || 0) + (u.cache_read_input_tokens || 0) + (u.cache_creation_input_tokens || 0), model: o.message.model || '' };
    }
  } finally { closeSync(fd); }
  return null;
}
export function windowFor(tokens) {
  const cfg = Number(process.env.PLANNER_CONTEXT_WINDOW) || 1000000;
  return tokens > cfg ? 1000000 : cfg; // cấu hình thấp hơn thực tế thì tự nâng
}

const git = (...a) => execFileSync('git', a, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 45000 }).trim();
function autosave(reason, pct) {
  try {
    const branch = git('rev-parse', '--abbrev-ref', 'HEAD');
    if (['main', 'master', 'HEAD'].includes(branch)) return `Không tự lưu: đang ở nhánh "${branch}" (chỉ tự lưu trên nhánh làm việc).`;
    let note = '';
    if (git('status', '--porcelain')) {
      git('add', '-A');
      git('commit', '-q', '-m', `Tự lưu tiến trình (${reason}${pct != null ? `, ngữ cảnh ${pct}%` : ''})`, '-m', 'Commit tự động bởi .claude/hooks/context-guard.mjs để không mất việc đang làm.');
      note = 'Đã commit thay đổi chưa lưu. ';
    }
    let ahead = 1;
    try { ahead = Number(git('rev-list', '--count', '@{u}..HEAD')); } catch { ahead = 1; }
    if (ahead > 0) {
      try { git('push', '-q', '-u', 'origin', branch); note += `Đã push lên origin/${branch}.`; }
      catch (e) { note += `Chưa push được (${String(e.stderr || e.message).split('\n')[0]}); commit vẫn nằm trên máy.`; }
    }
    return note || 'Không có gì mới cần lưu.';
  } catch (e) { return `Không tự lưu được: ${String(e.stderr || e.message).split('\n')[0]}`; }
}
function readState() { try { return JSON.parse(readFileSync(STATE, 'utf8')); } catch { return {}; } }
function writeState(s) { try { writeFileSync(STATE, JSON.stringify(s)); } catch { /* bỏ qua */ } }
const out = (o) => { process.stdout.write(JSON.stringify(o)); process.exit(0); };

try {
  const ctx = lastContext(input.transcript_path);
  const win = ctx ? windowFor(ctx.tokens) : null;
  const ratio = ctx ? ctx.tokens / win : null;
  const pct = ratio != null ? Math.round(ratio * 100) : null;
  const fmt = (n) => n.toLocaleString('vi-VN');

  if (mode === 'precompact') {
    const r = autosave('trước khi tóm tắt cuộc trò chuyện', pct);
    out({ systemMessage: `Sắp tóm tắt cuộc trò chuyện. ${r}` });
  }
  if (mode === 'stop') {
    if (ratio == null || ratio < CRIT) out({});
    const r = autosave('cuối lượt, ngữ cảnh gần đầy', pct);
    out({ systemMessage: `Ngữ cảnh ${pct}%: ${r}` });
  }
  // prompt
  if (ratio == null || ratio < WARN) out({});
  const st = readState(), sid = input.session_id || 'x', band = Math.floor(pct / 10) * 10;
  let saved = '';
  if (ratio >= CRIT) saved = autosave('ngữ cảnh gần đầy', pct);
  const already = st[sid] && st[sid] >= band;
  if (!already) { st[sid] = band; writeState(st); }
  const level = ratio >= CRIT ? 'CAO' : 'TRUNG BÌNH';
  const ctxMsg = [
    `[context-guard] Ngữ cảnh phiên đã dùng ~${pct}% (${fmt(ctx.tokens)}/${fmt(win)} token), mức ${level}.`,
    saved ? `Tiến trình đã được tự lưu: ${saved}` : '',
    already ? 'Đã cảnh báo người dùng ở mức này; chỉ nhắc lại một dòng nếu việc sắp làm sẽ tốn nhiều token.'
      : 'Ở đầu câu trả lời, cảnh báo ngắn bằng tiếng Việt về độ đầy ngữ cảnh và đề xuất cách tiết kiệm token phù hợp với việc đang làm (xem mục "Tiết kiệm token" trong CLAUDE.md), ví dụ: làm xong và commit việc dở, mở phiên mới cho yêu cầu tiếp theo, tránh đọc lại tệp lớn.',
    ratio >= CRIT ? 'Trước việc lớn tiếp theo: commit + push, ghi trạng thái vào docs/TIEN-DO.md, và đề nghị người dùng mở phiên mới.' : '',
  ].filter(Boolean).join(' ');
  out({
    systemMessage: `Ngữ cảnh đã dùng ~${pct}%${saved ? ` · ${saved}` : ''}`,
    hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: ctxMsg },
  });
} catch (e) {
  out({});
}
