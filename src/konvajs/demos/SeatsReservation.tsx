import { useState } from 'react';
import { Layer, Rect, Circle, Text, Group } from 'react-konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

const ROWS = 8, COLS = 12;
type State = 'free' | 'reserved' | 'selected';

export default function SeatsReservation() {
  const [seats, setSeats] = useState<State[][]>(() => {
    const arr: State[][] = [];
    for (let r = 0; r < ROWS; r++) {
      const row: State[] = [];
      for (let c = 0; c < COLS; c++) row.push(Math.random() < 0.25 ? 'reserved' : 'free');
      arr.push(row);
    }
    return arr;
  });

  const toggle = (r: number, c: number) => {
    if (seats[r][c] === 'reserved') return;
    setSeats(s => s.map((row, ri) => row.map((v, ci) => ri === r && ci === c ? (v === 'selected' ? 'free' : 'selected') : v)));
  };

  const selected = seats.flatMap((row, ri) => row.map((v, ci) => v === 'selected' ? `R${ri + 1}-S${ci + 1}` : null)).filter(Boolean);

  return (
    <DemoLayout title="🖼️ Seats Reservation" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <h3>圖例</h3>
        <div className="info-box">
          <div><span style={{ color: '#4ade80' }}>●</span> 可選</div>
          <div><span style={{ color: '#f87171' }}>●</span> 已訂</div>
          <div><span style={{ color: '#38bdf8' }}>●</span> 已選</div>
        </div>
        <h3>已選 ({selected.length})</h3>
        <div className="log">{selected.join(', ')}</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={780} designHeight={500}>
          <Layer>
            <Rect x={80} y={40} width={620} height={24} fill="#334155" cornerRadius={4} />
            <Text x={300} y={44} text="SCREEN" fill="#fff" fontSize={14} />
            {seats.map((row, ri) => row.map((state, ci) => {
              const x = 100 + ci * 50, y = 100 + ri * 44;
              const fill = state === 'free' ? '#4ade80' : state === 'reserved' ? '#f87171' : '#38bdf8';
              return (
                <Group key={ri + '-' + ci} onClick={() => toggle(ri, ci)} onTap={() => toggle(ri, ci)}>
                  <Circle x={x + 16} y={y + 16} radius={14} fill={fill} />
                  <Text x={x + 8} y={y + 10} text={String(ci + 1)} fontSize={11} fill="#0f172a" />
                </Group>
              );
            }))}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
