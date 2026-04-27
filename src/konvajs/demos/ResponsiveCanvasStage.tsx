import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import DemoLayout from '../../components/DemoLayout';

export default function ResponsiveCanvasStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 720, height: 540 });

  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setSize({
        width: Math.max(200, Math.floor(rect.width)),
        height: Math.max(200, Math.floor(rect.height)),
      });
    };

    updateSize();

    const ro = new ResizeObserver(updateSize);
    ro.observe(containerRef.current);
    window.addEventListener('resize', updateSize);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  const rectW = size.width * 0.7;
  const rectH = size.height * 0.6;

  return (
    <DemoLayout
      title="📐 Responsive Canvas Stage"
      backTo="/konvajs"
      backLabel="← Konva.js 目錄"
      sidebar={
        <>
          <div className="control-group">
            <label>目前 Stage 尺寸</label>
            <div style={{ fontFamily: 'monospace', fontSize: 14 }}>
              {size.width} × {size.height}
            </div>
          </div>
          <div className="info-box">
            <h4>說明</h4>
            <p>使用 ResizeObserver 監聽容器尺寸變化，Stage 會隨視窗大小自動調整。試著拉動瀏覽器窗口！</p>
          </div>
        </>
      }
    >
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '540px',
          resize: 'both',
          overflow: 'hidden',
          border: '2px dashed #888',
          borderRadius: 8,
          background: '#1a1a1a',
        }}
      >
        <Stage width={size.width} height={size.height}>
          <Layer>
            <Rect
              x={(size.width - rectW) / 2}
              y={(size.height - rectH) / 2}
              width={rectW}
              height={rectH}
              fill="#4dabf7"
              cornerRadius={12}
              shadowColor="#000"
              shadowBlur={20}
              shadowOpacity={0.5}
            />
            <Text
              x={0}
              y={size.height / 2 - 12}
              width={size.width}
              align="center"
              text={`${size.width} × ${size.height}`}
              fontSize={24}
              fontStyle="bold"
              fill="#fff"
            />
          </Layer>
        </Stage>
      </div>
    </DemoLayout>
  );
}
