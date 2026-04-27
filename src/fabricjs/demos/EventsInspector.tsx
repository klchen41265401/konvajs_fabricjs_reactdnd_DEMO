import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import DemoLayout from '../../components/DemoLayout';
import useFabricResponsive from '../../components/useFabricResponsive';

const EVENTS = [
  'object:added', 'object:modified', 'object:moving', 'object:scaling', 'object:rotating',
  'selection:created', 'selection:updated', 'selection:cleared',
  'mouse:down', 'mouse:up', 'mouse:over', 'mouse:out', 'mouse:wheel',
  'path:created', 'after:render'
] as const;
type Ev = typeof EVENTS[number];

export default function EventsInspector() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabRef = useRef<fabric.Canvas | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [enabled, setEnabled] = useState<Record<Ev, boolean>>(() =>
    Object.fromEntries(EVENTS.map(e => [e, !e.startsWith('mouse:') && e !== 'after:render'])) as Record<Ev, boolean>
  );
  const enabledRef = useRef(enabled); enabledRef.current = enabled;

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!);
    fabRef.current = canvas;
    canvas.add(new fabric.Rect({ left: 60, top: 60, width: 120, height: 80, fill: '#f59e0b' }));
    canvas.add(new fabric.Circle({ left: 260, top: 80, radius: 45, fill: '#38bdf8' }));
    canvas.add(new fabric.Textbox('拖我 / 改我 / 選我', { left: 60, top: 220, width: 260, fontSize: 22, fill: '#111827' }));

    const handlers: Record<string, any> = {};
    EVENTS.forEach(ev => {
      handlers[ev] = (e: any) => {
        if (!enabledRef.current[ev]) return;
        const tgt = e?.target?.type || (e?.selected?.length ? e.selected.length + ' selected' : '');
        const entry = `[${new Date().toLocaleTimeString()}] ${ev}${tgt ? ` · ${tgt}` : ''}`;
        setLog(list => [entry, ...list].slice(0, 80));
      };
      canvas.on(ev, handlers[ev]);
    });
    return () => { EVENTS.forEach(ev => canvas.off(ev, handlers[ev])); canvas.dispose(); };
  }, []);

  useFabricResponsive(wrapperRef, fabRef, 680, 460);

  return (
    <DemoLayout title="🎨 Events inspector" backTo="/fabricjs" backLabel="← Fabric.js 目錄" sidebar={
      <>
        <h3>開啟事件</h3>
        <div className="control-group">
          {EVENTS.map(ev => (
            <label key={ev}>
              <input type="checkbox" checked={enabled[ev]} onChange={() => setEnabled(s => ({ ...s, [ev]: !s[ev] }))} /> {ev}
            </label>
          ))}
        </div>
        <h3>事件紀錄</h3>
        <div className="log">{log.join('\n')}</div>
        <div className="control-group"><button type="button" onClick={() => setLog([])}>清空</button></div>
      </>
    }>
      <div className="stage-wrapper" ref={wrapperRef}><canvas ref={canvasRef} width={680} height={460} /></div>
    </DemoLayout>
  );
}
