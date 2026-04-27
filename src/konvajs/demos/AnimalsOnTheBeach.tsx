import { useState } from 'react';
import { Layer, Rect, Text, Line } from 'react-konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

type Animal = { id: number; emoji: string; x: number; y: number };

const EMOJIS = ['🦀', '🐢', '🐬', '🐠', '🦑', '🐙'];

export default function AnimalsOnTheBeach() {
  const initial: Animal[] = EMOJIS.map((e, i) => ({ id: i + 1, emoji: e, x: 80 + i * 100, y: 300 + (i % 2) * 60 }));
  const [animals, setAnimals] = useState<Animal[]>(initial);
  const [nextId, setNextId] = useState(EMOJIS.length + 1);

  const addRandom = () => {
    const e = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    setAnimals(a => [...a, { id: nextId, emoji: e, x: 80 + Math.random() * 540, y: 200 + Math.random() * 280 }]);
    setNextId(n => n + 1);
  };

  const reset = () => { setAnimals(initial); setNextId(EMOJIS.length + 1); };

  return (
    <DemoLayout title="🖼️ Animals on the Beach" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group"><button type="button" onClick={addRandom}>隨機新增動物</button></div>
        <div className="control-group"><button type="button" onClick={reset}>重設場景</button></div>
        <div className="control-group">
          <label>場景中的動物 ({animals.length})</label>
          <div style={{ fontSize: 20 }}>{animals.map(a => a.emoji).join(' ')}</div>
        </div>
        <div className="info-box">拖曳沙灘上的動物 Emoji 來變換位置，可以隨機新增更多動物或重設整個場景。</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={720} designHeight={540}>
          <Layer>
            <Rect x={0} y={0} width={720} height={260} fill="#7dd3fc" />
            <Rect x={0} y={260} width={720} height={280} fill="#fde68a" />
            <Line points={[0, 260, 720, 260]} stroke="#fbbf24" strokeWidth={2} dash={[8, 6]} />
            <Text x={30} y={30} text="☀️" fontSize={56} />
            <Text x={560} y={60} text="☁️" fontSize={44} />
            <Text x={200} y={80} text="☁️" fontSize={40} />
            {animals.map(a => (
              <Text
                key={a.id}
                x={a.x}
                y={a.y}
                text={a.emoji}
                fontSize={72}
                draggable
                onDragEnd={(e) => {
                  setAnimals(arr => arr.map(x => x.id === a.id ? { ...x, x: e.target.x(), y: e.target.y() } : x));
                }}
              />
            ))}
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
