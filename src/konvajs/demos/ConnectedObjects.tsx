import { useState } from 'react';
import { Layer, Circle, Arrow, Rect, Text } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

const W = 720;
const H = 540;

type Node = { id: string; x: number; y: number; color: string; label: string };

export default function ConnectedObjects() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: 'a', x: 150, y: 150, color: '#ef4444', label: 'A' },
    { id: 'b', x: 550, y: 200, color: '#3b82f6', label: 'B' },
    { id: 'c', x: 360, y: 420, color: '#22c55e', label: 'C' },
  ]);

  const edges: [string, string][] = [
    ['a', 'b'],
    ['b', 'c'],
    ['c', 'a'],
  ];

  const getNode = (id: string) => nodes.find(n => n.id === id)!;

  const updateNode = (id: string, x: number, y: number) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, x, y } : n));
  };

  return (
    <DemoLayout title="🖼️ Connected Objects" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group"><strong>節點座標</strong></div>
        {nodes.map(n => (
          <div key={n.id} className="control-group" style={{ fontSize: 13 }}>
            {n.label}: ({n.x.toFixed(0)}, {n.y.toFixed(0)})
          </div>
        ))}
        <div className="info-box">拖曳任一圓點，連接線會即時以 state 中的新座標重新計算端點，形成自動跟隨的連線。</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={W} designHeight={H}>
          <Layer>
            <Rect x={0} y={0} width={W} height={H} fill="#f8fafc" listening={false} />
            {edges.map(([a, b], i) => {
              const na = getNode(a);
              const nb = getNode(b);
              return (
                <Arrow
                  key={i}
                  points={[na.x, na.y, nb.x, nb.y]}
                  stroke="#475569"
                  fill="#475569"
                  strokeWidth={2}
                  pointerLength={10}
                  pointerWidth={10}
                  listening={false}
                />
              );
            })}
            {nodes.map(n => (
              <Circle
                key={n.id}
                x={n.x}
                y={n.y}
                radius={30}
                fill={n.color}
                stroke="#0f172a"
                strokeWidth={2}
                draggable
                onDragMove={(e: Konva.KonvaEventObject<DragEvent>) => {
                  updateNode(n.id, e.target.x(), e.target.y());
                }}
              />
            ))}
            {nodes.map(n => (
              <Text
                key={n.id + '-l'}
                x={n.x - 6}
                y={n.y - 8}
                text={n.label}
                fontSize={18}
                fill="#fff"
                fontStyle="bold"
                listening={false}
              />
            ))}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
