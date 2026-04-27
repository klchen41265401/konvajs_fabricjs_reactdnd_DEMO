import { useState } from 'react';
import { Layer, Circle, Text } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

export default function TouchGestures() {
  const [log, setLog] = useState<string[]>([]);
  const [pos, setPos] = useState({ x: 360, y: 270 });

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setLog((prev) => [`[${time}] ${msg}`, ...prev].slice(0, 30));
  };

  const handleTap = (_e: Konva.KonvaEventObject<Event>) => {
    addLog('👆 tap');
  };
  const handleDblTap = (_e: Konva.KonvaEventObject<Event>) => {
    addLog('✌️ doubletap');
  };
  const handleClick = (_e: Konva.KonvaEventObject<MouseEvent>) => {
    addLog('🖱️ click');
  };
  const handleDblClick = (_e: Konva.KonvaEventObject<MouseEvent>) => {
    addLog('🖱️🖱️ dblclick');
  };

  let pressTimer: ReturnType<typeof setTimeout> | null = null;
  const handleDown = (_e: Konva.KonvaEventObject<Event>) => {
    addLog('⬇️ down');
    if (pressTimer) clearTimeout(pressTimer);
    pressTimer = setTimeout(() => {
      addLog('⏱️ longpress');
    }, 600);
  };
  const handleUp = (_e: Konva.KonvaEventObject<Event>) => {
    addLog('⬆️ up');
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
  };

  return (
    <DemoLayout
      title="👆 Touch Gestures"
      backTo="/konvajs"
      backLabel="← Konva.js 目錄"
      sidebar={
        <>
          <div className="info-box">
            <h4>說明</h4>
            <p>支援 tap / doubletap / longpress / drag 等手勢事件。可在觸控裝置上測試，桌面上則以滑鼠模擬。</p>
          </div>
          <div className="control-group">
            <label>事件日誌</label>
            <div
              className="log"
              style={{
                maxHeight: 280,
                overflowY: 'auto',
                background: '#111',
                color: '#0f0',
                fontFamily: 'monospace',
                fontSize: 12,
                padding: 8,
                borderRadius: 4,
              }}
            >
              {log.length === 0 ? (
                <div style={{ color: '#666' }}>（尚無事件）</div>
              ) : (
                log.map((l, i) => <div key={i}>{l}</div>)
              )}
            </div>
            <button type="button" onClick={() => setLog([])} style={{ marginTop: 8 }}>
              清除日誌
            </button>
          </div>
        </>
      }
    >
      <div className="stage-wrapper dark">
        <ResponsiveStage designWidth={720} designHeight={540}>
          <Layer>
            <Text
              x={20}
              y={20}
              text="請拖曳、點擊或長按此圓圈"
              fontSize={16}
              fill="#888"
            />
            <Circle
              x={pos.x}
              y={pos.y}
              radius={60}
              fill="#ff6b6b"
              stroke="#fff"
              strokeWidth={3}
              draggable
              onDragStart={() => addLog('🚀 dragstart')}
              onDragEnd={(e) => {
                setPos({ x: e.target.x(), y: e.target.y() });
                addLog('🏁 dragend');
              }}
              onClick={handleClick}
              onDblClick={handleDblClick}
              onTap={handleTap}
              onDblTap={handleDblTap}
              onMouseDown={handleDown}
              onMouseUp={handleUp}
              onTouchStart={handleDown}
              onTouchEnd={handleUp}
            />
          </Layer>
        </ResponsiveStage>
      </div>
    </DemoLayout>
  );
}
