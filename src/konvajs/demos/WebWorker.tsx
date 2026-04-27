import { useEffect, useRef, useState } from 'react';
import { Layer, Text, Rect } from 'react-konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

const W = 720;
const H = 540;

const WORKER_CODE = `
self.onmessage = function(e) {
  var n = e.data.n;
  var primes = [];
  var i = 2;
  while (primes.length < n) {
    var isPrime = true;
    for (var j = 2; j * j <= i; j++) {
      if (i % j === 0) { isPrime = false; break; }
    }
    if (isPrime) primes.push(i);
    i++;
    if (primes.length % 50 === 0) {
      self.postMessage({ type: 'progress', count: primes.length });
    }
  }
  self.postMessage({ type: 'done', primes: primes });
};
`;

export default function WebWorker() {
  const [n, setN] = useState(500);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [primes, setPrimes] = useState<number[]>([]);
  const workerRef = useRef<Worker | null>(null);

  const start = () => {
    stop();
    const blob = new Blob([WORKER_CODE], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const w = new Worker(url);
    workerRef.current = w;
    setRunning(true);
    setProgress(0);
    setPrimes([]);
    w.onmessage = (e) => {
      if (e.data.type === 'progress') setProgress(e.data.count);
      if (e.data.type === 'done') {
        setPrimes(e.data.primes);
        setProgress(e.data.primes.length);
        setRunning(false);
        w.terminate();
        URL.revokeObjectURL(url);
        workerRef.current = null;
      }
    };
    w.postMessage({ n });
  };

  const stop = () => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    setRunning(false);
  };

  useEffect(() => () => stop(), []);

  return (
    <DemoLayout title="🖼️ Web Worker" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group">
          <label>計算質數個數 N: {n}</label>
          <input type="range" min="100" max="5000" step="100" value={n} onChange={e => setN(+e.target.value)} />
        </div>
        <div className="control-group">
          <button type="button" onClick={start} disabled={running}>開始計算</button>
          <button type="button" onClick={stop} disabled={!running}>停止</button>
        </div>
        <div className="control-group"><strong>進度: {progress} / {n}</strong></div>
        <div className="control-group" style={{ maxHeight: 200, overflow: 'auto', fontSize: 12 }}>
          {primes.length > 0 && (
            <div>
              <strong>前 30 個: </strong>
              {primes.slice(0, 30).join(', ')}
              {primes.length > 30 && ' ...'}
            </div>
          )}
        </div>
        <div className="info-box">使用 inline Worker (Blob URL) 將質數計算放到背景執行，主執行緒不會卡頓，Konva Stage 上顯示目前結果。</div>
      </>
    }>
      <div className="stage-wrapper">
        <ResponsiveStage designWidth={W} designHeight={H}>
          <Layer>
            <Rect x={0} y={0} width={W} height={H} fill="#f8fafc" />
            <Text x={40} y={40} text={`Primes computed: ${progress}`} fontSize={28} fill="#0f172a" />
            <Text x={40} y={90} text={running ? '計算中…' : progress > 0 ? '完成' : '按下開始按鈕啟動 Worker'} fontSize={18} fill="#475569" />
            <Text
              x={40}
              y={140}
              width={W - 80}
              text={primes.length ? primes.slice(0, 200).join('  ') : ''}
              fontSize={14}
              fill="#1e293b"
              lineHeight={1.4}
            />
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
