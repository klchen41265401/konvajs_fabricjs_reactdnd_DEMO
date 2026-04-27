import { useCallback, useMemo, useRef, useState } from 'react';
import { Stage, Layer, Rect, Text, Line, Group } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';

const ROWS = 30;
const COLS = 12;
const HEADER_H = 26;
const HEADER_W = 44;
const ROW_H = 24;
const DEFAULT_COL_W = 92;

type CellMap = Record<string, string>;

function colLabel(c: number): string {
  let s = '';
  let n = c;
  while (n >= 0) { s = String.fromCharCode(65 + (n % 26)) + s; n = Math.floor(n / 26) - 1; }
  return s;
}

function parseRef(ref: string): { r: number; c: number } | null {
  const m = ref.trim().toUpperCase().match(/^([A-Z]+)(\d+)$/);
  if (!m) return null;
  const letters = m[1];
  let c = 0;
  for (let i = 0; i < letters.length; i++) c = c * 26 + (letters.charCodeAt(i) - 64);
  c -= 1;
  const r = parseInt(m[2], 10) - 1;
  return { r, c };
}

function evalFormula(expr: string, cells: CellMap, seen = new Set<string>()): string {
  let s = expr.trim();
  if (!s.startsWith('=')) return expr;
  s = s.slice(1);

  const SUM = /SUM\(([A-Z]+\d+):([A-Z]+\d+)\)/gi;
  const AVG = /AVG\(([A-Z]+\d+):([A-Z]+\d+)\)/gi;
  const MAX_RE = /MAX\(([A-Z]+\d+):([A-Z]+\d+)\)/gi;
  const MIN_RE = /MIN\(([A-Z]+\d+):([A-Z]+\d+)\)/gi;
  const CNT_RE = /COUNT\(([A-Z]+\d+):([A-Z]+\d+)\)/gi;

  const collect = (a: string, b: string): number[] => {
    const A = parseRef(a); const B = parseRef(b);
    if (!A || !B) return [];
    const rs = Math.min(A.r, B.r), re = Math.max(A.r, B.r);
    const cs = Math.min(A.c, B.c), ce = Math.max(A.c, B.c);
    const values: number[] = [];
    for (let r = rs; r <= re; r++) for (let c = cs; c <= ce; c++) {
      const key = `${r}:${c}`;
      const raw = cells[key] ?? '';
      const v = raw.startsWith('=') ? evalFormula(raw, cells, seen) : raw;
      const num = Number(v);
      if (!Number.isNaN(num) && v !== '') values.push(num);
    }
    return values;
  };

  s = s.replace(SUM, (_m, a, b) => String(collect(a, b).reduce((x, y) => x + y, 0)));
  s = s.replace(AVG, (_m, a, b) => { const vs = collect(a, b); return vs.length ? String(vs.reduce((x, y) => x + y, 0) / vs.length) : '0'; });
  s = s.replace(MAX_RE, (_m, a, b) => { const vs = collect(a, b); return vs.length ? String(Math.max(...vs)) : '0'; });
  s = s.replace(MIN_RE, (_m, a, b) => { const vs = collect(a, b); return vs.length ? String(Math.min(...vs)) : '0'; });
  s = s.replace(CNT_RE, (_m, a, b) => String(collect(a, b).length));

  s = s.replace(/[A-Z]+\d+/g, ref => {
    if (seen.has(ref)) return '0';
    seen.add(ref);
    const p = parseRef(ref); if (!p) return '0';
    const raw = cells[`${p.r}:${p.c}`] ?? '';
    if (raw === '') return '0';
    if (raw.startsWith('=')) return String(evalFormula(raw, cells, seen));
    const n = Number(raw);
    return Number.isNaN(n) ? '0' : String(n);
  });

  try {
    const allowed = /^[\d+\-*/().,\s]+$/.test(s);
    if (!allowed) return '#ERR';
    // eslint-disable-next-line no-new-func
    const v = Function(`"use strict"; return (${s || '0'});`)();
    if (typeof v === 'number' && !Number.isFinite(v)) return '#ERR';
    return String(v);
  } catch {
    return '#ERR';
  }
}

export default function Spreadsheet() {
  const [cells, setCells] = useState<CellMap>(() => ({
    '0:0': 'Product', '0:1': 'Qty', '0:2': 'Price', '0:3': 'Total',
    '1:0': 'Apple', '1:1': '12', '1:2': '30', '1:3': '=B2*C2',
    '2:0': 'Banana', '2:1': '8', '2:2': '15', '2:3': '=B3*C3',
    '3:0': 'Cherry', '3:1': '5', '3:2': '60', '3:3': '=B4*C4',
    '4:0': 'Subtotal', '4:3': '=SUM(D2:D4)',
    '5:0': 'Average', '5:3': '=AVG(D2:D4)',
    '6:0': 'Count', '6:3': '=COUNT(D2:D4)'
  }));
  const [colWidths, setColWidths] = useState<number[]>(() => Array(COLS).fill(DEFAULT_COL_W));
  const [sel, setSel] = useState<{ r: number; c: number } | null>({ r: 1, c: 3 });
  const [editing, setEditing] = useState<{ r: number; c: number } | null>(null);
  const [editValue, setEditValue] = useState('');
  const stageRef = useRef<Konva.Stage | null>(null);

  const colX = useMemo(() => {
    const xs = [HEADER_W];
    for (let i = 0; i < COLS; i++) xs.push(xs[xs.length - 1] + colWidths[i]);
    return xs;
  }, [colWidths]);

  const rowY = useMemo(() => {
    const ys = [HEADER_H];
    for (let i = 0; i < ROWS; i++) ys.push(ys[ys.length - 1] + ROW_H);
    return ys;
  }, []);

  const width = colX[COLS];
  const height = rowY[ROWS];

  const display = useCallback((r: number, c: number) => {
    const raw = cells[`${r}:${c}`] ?? '';
    if (!raw.startsWith('=')) return raw;
    return evalFormula(raw, cells);
  }, [cells]);

  const startEdit = (r: number, c: number) => {
    if (r < 0 || c < 0) return;
    setSel({ r, c });
    setEditing({ r, c });
    setEditValue(cells[`${r}:${c}`] ?? '');
  };

  const commitEdit = () => {
    if (!editing) return;
    const key = `${editing.r}:${editing.c}`;
    setCells(prev => {
      const next = { ...prev };
      if (editValue === '') delete next[key]; else next[key] = editValue;
      return next;
    });
    setEditing(null);
  };
  const cancelEdit = () => setEditing(null);

  const moveSel = (dr: number, dc: number) => {
    if (!sel) return;
    const r = Math.max(0, Math.min(ROWS - 1, sel.r + dr));
    const c = Math.max(0, Math.min(COLS - 1, sel.c + dc));
    setSel({ r, c });
  };

  const clearAll = () => setCells({});
  const resetDemo = () => setCells({
    '0:0': 'Product', '0:1': 'Qty', '0:2': 'Price', '0:3': 'Total',
    '1:0': 'Apple', '1:1': '12', '1:2': '30', '1:3': '=B2*C2',
    '2:0': 'Banana', '2:1': '8', '2:2': '15', '2:3': '=B3*C3',
    '3:0': 'Cherry', '3:1': '5', '3:2': '60', '3:3': '=B4*C4',
    '4:0': 'Subtotal', '4:3': '=SUM(D2:D4)',
    '5:0': 'Average', '5:3': '=AVG(D2:D4)',
    '6:0': 'Count', '6:3': '=COUNT(D2:D4)'
  });
  const exportCsv = () => {
    const rows: string[] = [];
    for (let r = 0; r < ROWS; r++) {
      const line: string[] = [];
      for (let c = 0; c < COLS; c++) {
        const v = display(r, c);
        line.push(/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
      }
      rows.push(line.join(','));
    }
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'spreadsheet.csv'; a.click();
  };

  const onCellClick = (r: number, c: number) => setSel({ r, c });
  const onCellDouble = (r: number, c: number) => startEdit(r, c);

  const resizeDragRef = useRef<{ col: number; startX: number; startW: number } | null>(null);

  const editPos = editing
    ? { x: colX[editing.c], y: rowY[editing.r], w: colWidths[editing.c], h: ROW_H }
    : null;

  const formulaBarValue = sel ? (editing && editing.r === sel.r && editing.c === sel.c ? editValue : (cells[`${sel.r}:${sel.c}`] ?? '')) : '';

  const onFormulaBarChange = (v: string) => {
    if (!sel) return;
    if (!editing || editing.r !== sel.r || editing.c !== sel.c) {
      setEditing({ r: sel.r, c: sel.c });
    }
    setEditValue(v);
  };

  return (
    <DemoLayout
      title="🖼️ Spreadsheet (Excel-like grid)"
      backTo="/konvajs"
      backLabel="← Konva.js 目錄"
      sidebar={
        <>
          <h3>動作</h3>
          <div className="control-group">
            <button onClick={resetDemo}>重設範例資料</button>
            <button onClick={clearAll}>清空</button>
            <button onClick={exportCsv}>匯出 CSV</button>
          </div>
          <h3>選取儲存格</h3>
          <div className="control-group">
            <label>位置</label>
            <div>{sel ? `${colLabel(sel.c)}${sel.r + 1}` : '—'}</div>
          </div>
          <div className="control-group">
            <label>Formula / Value</label>
            <input
              type="text"
              value={formulaBarValue}
              disabled={!sel}
              onChange={e => onFormulaBarChange(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { commitEdit(); } else if (e.key === 'Escape') { cancelEdit(); } }}
              onBlur={() => { if (editing) commitEdit(); }}
            />
          </div>
          <h3>支援公式</h3>
          <div className="info-box">
            <strong>=A1+B1*2</strong><br />
            <strong>=SUM(D2:D4)</strong>, <strong>=AVG()</strong>, <strong>=MAX()</strong>, <strong>=MIN()</strong>, <strong>=COUNT()</strong><br />
            雙擊儲存格或直接輸入；拖欄標題右側可調整欄寬。
          </div>
          <div className="info-box"><strong>Spreadsheet</strong> — 用 Konva 繪製所有儲存格與格線，模仿 rowsncolumns.app (Konva 官首頁 showcase) 的 Excel-like 介面。</div>
        </>
      }
    >
      <div
        tabIndex={0}
        className="ss-grid"
        style={{ position: 'relative', width: width, height: height, outline: 'none' }}
        onKeyDown={e => {
          if (editing) return;
          if (e.key === 'ArrowUp') { moveSel(-1, 0); e.preventDefault(); }
          if (e.key === 'ArrowDown' || e.key === 'Enter') { moveSel(1, 0); e.preventDefault(); }
          if (e.key === 'ArrowLeft') { moveSel(0, -1); e.preventDefault(); }
          if (e.key === 'ArrowRight' || e.key === 'Tab') { moveSel(0, 1); e.preventDefault(); }
          if ((e.key === 'Delete' || e.key === 'Backspace') && sel) {
            setCells(prev => { const next = { ...prev }; delete next[`${sel.r}:${sel.c}`]; return next; });
          }
          if (e.key === 'F2' && sel) startEdit(sel.r, sel.c);
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && sel) startEdit(sel.r, sel.c);
        }}
      >
        <Stage
          ref={stageRef}
          width={width}
          height={height}
        >
          <Layer>
            <Rect x={0} y={0} width={width} height={height} fill="#ffffff" />

            <Rect x={0} y={0} width={HEADER_W} height={HEADER_H} fill="#e2e8f0" />
            {Array.from({ length: COLS }).map((_, c) => (
              <Group key={`colh-${c}`}>
                <Rect x={colX[c]} y={0} width={colWidths[c]} height={HEADER_H} fill="#e2e8f0" stroke="#cbd5e1" strokeWidth={0.5} />
                <Text x={colX[c]} y={0} width={colWidths[c]} height={HEADER_H} text={colLabel(c)} align="center" verticalAlign="middle" fontStyle="bold" fontSize={12} fill="#0f172a" />
                <Rect
                  x={colX[c] + colWidths[c] - 4}
                  y={0}
                  width={8}
                  height={HEADER_H}
                  onMouseEnter={e => { const st = e.target.getStage(); if (st) st.container().style.cursor = 'col-resize'; }}
                  onMouseLeave={e => { const st = e.target.getStage(); if (st) st.container().style.cursor = 'default'; }}
                  draggable
                  dragBoundFunc={pos => ({ x: Math.max(colX[c] + 24 - 4, pos.x), y: 0 })}
                  onDragStart={e => { resizeDragRef.current = { col: c, startX: e.target.x(), startW: colWidths[c] }; }}
                  onDragMove={e => {
                    const ctx = resizeDragRef.current; if (!ctx) return;
                    const delta = e.target.x() - ctx.startX;
                    const newW = Math.max(24, ctx.startW + delta);
                    setColWidths(prev => prev.map((w, i) => i === ctx.col ? newW : w));
                  }}
                  onDragEnd={() => { resizeDragRef.current = null; }}
                />
              </Group>
            ))}

            {Array.from({ length: ROWS }).map((_, r) => (
              <Group key={`rowh-${r}`}>
                <Rect x={0} y={rowY[r]} width={HEADER_W} height={ROW_H} fill="#e2e8f0" stroke="#cbd5e1" strokeWidth={0.5} />
                <Text x={0} y={rowY[r]} width={HEADER_W} height={ROW_H} text={String(r + 1)} align="center" verticalAlign="middle" fontStyle="bold" fontSize={12} fill="#0f172a" />
              </Group>
            ))}

            {Array.from({ length: ROWS * COLS }).map((_, idx) => {
              const r = Math.floor(idx / COLS);
              const c = idx % COLS;
              const isSel = sel?.r === r && sel?.c === c;
              return (
                <Group key={`cell-${r}-${c}`}>
                  <Rect
                    x={colX[c]}
                    y={rowY[r]}
                    width={colWidths[c]}
                    height={ROW_H}
                    fill={isSel ? '#dbeafe' : '#ffffff'}
                    stroke="#e2e8f0"
                    strokeWidth={0.5}
                    onClick={() => onCellClick(r, c)}
                    onTap={() => onCellClick(r, c)}
                    onDblClick={() => onCellDouble(r, c)}
                    onDblTap={() => onCellDouble(r, c)}
                  />
                  <Text
                    x={colX[c] + 4}
                    y={rowY[r]}
                    width={colWidths[c] - 8}
                    height={ROW_H}
                    text={editing && editing.r === r && editing.c === c ? '' : display(r, c)}
                    fontSize={12}
                    fill="#0f172a"
                    verticalAlign="middle"
                    listening={false}
                    ellipsis
                    wrap="none"
                  />
                </Group>
              );
            })}

            {sel && (
              <Rect
                x={colX[sel.c]}
                y={rowY[sel.r]}
                width={colWidths[sel.c]}
                height={ROW_H}
                stroke="#0284c7"
                strokeWidth={2}
                listening={false}
              />
            )}

            {Array.from({ length: COLS + 1 }).map((_, i) => (
              <Line key={`vl-${i}`} points={[colX[i], 0, colX[i], height]} stroke="#cbd5e1" strokeWidth={0.5} />
            ))}
            {Array.from({ length: ROWS + 1 }).map((_, i) => (
              <Line key={`hl-${i}`} points={[0, rowY[i], width, rowY[i]]} stroke="#cbd5e1" strokeWidth={0.5} />
            ))}
          </Layer>
        </Stage>

        {editPos && (
          <input
            autoFocus
            type="text"
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={e => {
              if (e.key === 'Enter') { commitEdit(); moveSel(1, 0); }
              else if (e.key === 'Escape') { cancelEdit(); }
              else if (e.key === 'Tab') { commitEdit(); moveSel(0, e.shiftKey ? -1 : 1); e.preventDefault(); }
            }}
            style={{
              position: 'absolute',
              left: editPos.x,
              top: editPos.y,
              width: editPos.w,
              height: editPos.h,
              padding: '0 4px',
              border: '2px solid #0284c7',
              outline: 'none',
              fontSize: 12,
              fontFamily: 'inherit',
              color: '#0f172a',
              background: '#ffffff',
              boxSizing: 'border-box'
            }}
          />
        )}
      </div>
    </DemoLayout>
  );
}
