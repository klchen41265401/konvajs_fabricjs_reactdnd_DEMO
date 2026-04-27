import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import DemoLayout from '../../components/DemoLayout';

const KNIGHT = 'knight';

function canMoveKnight(fx: number, fy: number, tx: number, ty: number) {
  const dx = Math.abs(tx - fx);
  const dy = Math.abs(ty - fy);
  return (dx === 1 && dy === 2) || (dx === 2 && dy === 1);
}

function KnightPiece() {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: KNIGHT,
    item: {},
    collect: (m) => ({ isDragging: m.isDragging() }),
  }));
  return (
    <span
      ref={drag as any}
      style={{
        fontSize: 36,
        cursor: 'grab',
        opacity: isDragging ? 0.4 : 1,
        userSelect: 'none',
        lineHeight: 1,
      }}
    >
      ♞
    </span>
  );
}

function Square({
  x,
  y,
  knightX,
  knightY,
  onMove,
}: {
  x: number;
  y: number;
  knightX: number;
  knightY: number;
  onMove: (x: number, y: number) => void;
}) {
  const isLight = (x + y) % 2 === 1;
  const hasKnight = x === knightX && y === knightY;

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: KNIGHT,
    canDrop: () => canMoveKnight(knightX, knightY, x, y),
    drop: () => onMove(x, y),
    collect: (m) => ({ isOver: m.isOver(), canDrop: m.canDrop() }),
  }), [knightX, knightY]);

  let overlay: React.ReactNode = null;
  if (canDrop) overlay = <div style={{ position: 'absolute', inset: 0, background: isOver ? 'rgba(46,204,113,.55)' : 'rgba(255,255,0,.25)' }} />;

  return (
    <div ref={drop as any} className={`square ${isLight ? 'light' : 'dark'}`} style={{ position: 'relative' }}>
      {overlay}
      {hasKnight && <div style={{ position: 'relative', zIndex: 1 }}><KnightPiece /></div>}
    </div>
  );
}

export default function Chessboard() {
  const [pos, setPos] = useState<[number, number]>([1, 7]);
  const [moves, setMoves] = useState(0);

  const squares: React.ReactNode[] = [];
  for (let y = 7; y >= 0; y--) {
    for (let x = 0; x < 8; x++) {
      squares.push(
        <Square key={`${x}-${y}`} x={x} y={y} knightX={pos[0]} knightY={pos[1]} onMove={(nx, ny) => {
          setPos([nx, ny]);
          setMoves(m => m + 1);
        }} />
      );
    }
  }

  return (
    <DemoLayout
      title="Other · Chessboard Tutorial"
      backTo="/reactdnd"
      backLabel="← React-DnD 目錄"
      sidebar={
        <>
          <div className="info-box">
            <strong>西洋棋騎士教學</strong><br />
            官方 react-dnd 的 "Chessboard" 教學：拖曳 ♞，只能放到合法的 L 形格（黃色為可放、綠色為 hover）。
            用 <code>canDrop</code> 檢查 knight move rule。
          </div>
          <div>騎士位置：({pos[0]}, {pos[1]})</div>
          <div>移動次數：<strong>{moves}</strong></div>
          <button type="button" className="back-btn" style={{ marginTop: 8 }} onClick={() => { setPos([1, 7]); setMoves(0); }}>重設</button>
        </>
      }
    >
      <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true, delayTouchStart: 50 }}>
        <div className="dnd-stage">
          <div className="chessboard">{squares}</div>
        </div>
      </DndProvider>
    </DemoLayout>
  );
}
