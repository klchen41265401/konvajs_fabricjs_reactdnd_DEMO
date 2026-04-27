import { useState } from 'react';
import { Layer, Rect, Text, Group } from 'react-konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

interface Room { id: string; name: string; x: number; y: number; w: number; h: number; status: 'free' | 'busy'; }

const ROOMS: Room[] = [
  { id: 'A1', name: 'A1 會議室', x: 40, y: 40, w: 160, h: 120, status: 'free' },
  { id: 'A2', name: 'A2 會議室', x: 220, y: 40, w: 140, h: 120, status: 'busy' },
  { id: 'A3', name: 'A3 儲藏', x: 380, y: 40, w: 120, h: 80, status: 'free' },
  { id: 'B1', name: 'B1 辦公', x: 40, y: 180, w: 200, h: 160, status: 'busy' },
  { id: 'B2', name: 'B2 辦公', x: 260, y: 180, w: 180, h: 160, status: 'free' },
  { id: 'C1', name: 'C1 茶水', x: 460, y: 180, w: 120, h: 160, status: 'free' },
  { id: 'D1', name: 'D1 大廳', x: 40, y: 360, w: 540, h: 80, status: 'free' }
];

export default function InteractiveBuildingMap() {
  const [hover, setHover] = useState<string | null>(null);
  const [sel, setSel] = useState<Room | null>(null);

  return (
    <DemoLayout title="🖼️ Interactive Building Map" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="info-box">滑鼠移到房間看 tooltip，點擊看詳細。</div>
        {sel && (
          <>
            <h3>{sel.name}</h3>
            <div className="kv">
              <strong>ID:</strong><span>{sel.id}</span>
              <strong>尺寸:</strong><span>{sel.w} × {sel.h}</span>
              <strong>狀態:</strong><span style={{ color: sel.status === 'free' ? '#4ade80' : '#f87171' }}>{sel.status}</span>
            </div>
          </>
        )}
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={620} designHeight={480}>
          <Layer>
            <Rect width={620} height={480} fill="#f5f5f4" />
            {ROOMS.map(r => (
              <Group key={r.id} x={r.x} y={r.y}
                onMouseEnter={() => setHover(r.id)} onMouseLeave={() => setHover(null)}
                onClick={() => setSel(r)} onTap={() => setSel(r)}>
                <Rect width={r.w} height={r.h} fill={r.status === 'free' ? '#dcfce7' : '#fee2e2'} stroke={hover === r.id ? '#38bdf8' : '#525252'} strokeWidth={hover === r.id ? 3 : 1} cornerRadius={4} />
                <Text text={r.name} x={8} y={8} fontSize={14} fill="#0f172a" />
              </Group>
            ))}
            {hover && (() => {
              const r = ROOMS.find(x => x.id === hover)!;
              return <Text text={r.name + ' · ' + r.status} x={r.x} y={r.y - 22} fontSize={12} fill="#0f172a" padding={4} />;
            })()}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
