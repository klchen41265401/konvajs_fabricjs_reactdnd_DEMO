import { useRef, useState } from 'react';
import { Layer, Wedge, Circle, Text, Arrow, Group } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function WheelOfFortune() {
  const [labels, setLabels] = useState<string[]>(['100', '200', '再轉一次', '500', '感謝', '1000', '空', 'JACKPOT']);
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string>('—');
  const groupRef = useRef<Konva.Group | null>(null);

  const cx = 360, cy = 270, radius = 200;
  const n = labels.length;
  const slice = 360 / n;

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setWinner('—');
    const extra = 360 * (4 + Math.random() * 3);
    const target = angle + extra + Math.random() * 360;
    const duration = 3 + Math.random() * 2;
    const g = groupRef.current;
    if (!g) return;
    const tween = new Konva.Tween({
      node: g,
      rotation: target,
      duration,
      easing: Konva.Easings.EaseOut,
      onFinish: () => {
        setAngle(target);
        const normalized = ((target % 360) + 360) % 360;
        const pointerAngle = (360 - normalized + 270) % 360;
        const idx = Math.floor(pointerAngle / slice) % n;
        setWinner(labels[idx] ?? '—');
        setSpinning(false);
      },
    });
    tween.play();
  };

  const updateLabel = (i: number, v: string) => {
    setLabels(arr => arr.map((x, k) => k === i ? v : x));
  };

  return (
    <DemoLayout title="🖼️ Wheel of Fortune" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group"><button type="button" disabled={spinning} onClick={spin}>{spinning ? '轉動中…' : 'SPIN'}</button></div>
        <div className="control-group">
          <label>目前結果</label>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>{winner}</div>
        </div>
        <div className="control-group">
          <label>扇區文字</label>
          {labels.map((l, i) => (
            <input key={i} value={l} onChange={e => updateLabel(i, e.target.value)} style={{ marginTop: 4 }} />
          ))}
        </div>
        <div className="info-box">按下 SPIN 隨機旋轉轉盤 3–5 秒，停下後側邊欄會顯示指針指向的扇區獎項。</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={720} designHeight={540}>
          <Layer>
            <Group ref={groupRef} x={cx} y={cy}>
              {labels.map((l, i) => (
                <Wedge
                  key={'w' + i}
                  radius={radius}
                  angle={slice}
                  fill={COLORS[i % COLORS.length]}
                  stroke="#ffffff"
                  strokeWidth={2}
                  rotation={i * slice}
                />
              ))}
              {labels.map((l, i) => {
                const a = (i + 0.5) * slice;
                const rad = (a * Math.PI) / 180;
                const tx = Math.cos(rad) * (radius * 0.65);
                const ty = Math.sin(rad) * (radius * 0.65);
                return (
                  <Text
                    key={'t' + i}
                    text={l}
                    x={tx}
                    y={ty}
                    fontSize={16}
                    fontStyle="bold"
                    fill="#ffffff"
                    rotation={a}
                    offsetX={30}
                    offsetY={8}
                    width={60}
                    align="center"
                  />
                );
              })}
              <Circle radius={22} fill="#0f172a" stroke="#ffffff" strokeWidth={3} />
            </Group>
            <Arrow points={[cx, cy - radius - 34, cx, cy - radius + 6]} pointerLength={16} pointerWidth={16} fill="#0f172a" stroke="#0f172a" strokeWidth={6} />
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
