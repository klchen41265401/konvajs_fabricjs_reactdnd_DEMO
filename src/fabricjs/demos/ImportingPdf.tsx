import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import DemoLayout from '../../components/DemoLayout';
import useFabricResponsive from '../../components/useFabricResponsive';

// 純前端用 pdf.js (CDN 版) 動態載入，將 PDF 每頁轉成 fabric Image

const PDFJS_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
const PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

declare global { interface Window { pdfjsLib?: any; } }

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    if ([...document.scripts].some(s => s.src === src)) return resolve();
    const s = document.createElement('script');
    s.src = src; s.onload = () => resolve(); s.onerror = () => reject(new Error('load failed'));
    document.head.appendChild(s);
  });
}

export default function ImportingPdf() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabRef = useRef<fabric.Canvas | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [status, setStatus] = useState('請選擇一個 PDF 檔案 (本地)');

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!);
    fabRef.current = canvas;
    return () => { canvas.dispose(); };
  }, []);

  useFabricResponsive(wrapperRef, fabRef, 900, 600);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setStatus('載入 pdf.js 中...');
    await loadScript(PDFJS_SRC);
    const pdfjs = window.pdfjsLib;
    pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
    setStatus('解析 PDF 中...');
    const buf = await file.arrayBuffer();
    const doc = await pdfjs.getDocument({ data: buf }).promise;
    setPageCount(doc.numPages);
    const canvas = fabRef.current!;
    canvas.clear();
    let offsetY = 10;
    for (let i = 1; i <= doc.numPages; i++) {
      setStatus(`渲染第 ${i}/${doc.numPages} 頁`);
      const page = await doc.getPage(i);
      const viewport = page.getViewport({ scale: 1.2 });
      const tmp = document.createElement('canvas');
      tmp.width = viewport.width; tmp.height = viewport.height;
      await page.render({ canvasContext: tmp.getContext('2d')!, viewport }).promise;
      const img = new fabric.Image(tmp, { left: 10, top: offsetY, selectable: true });
      canvas.add(img);
      offsetY += viewport.height + 16;
    }
    canvas.setHeight(Math.max(560, offsetY + 20));
    canvas.requestRenderAll();
    setStatus(`完成 · ${doc.numPages} 頁`);
  };

  return (
    <DemoLayout title="🎨 Importing PDF files" backTo="/fabricjs" backLabel="← Fabric.js 目錄" sidebar={
      <>
        <h3>匯入</h3>
        <div className="control-group">
          <input type="file" accept="application/pdf" onChange={onFile} />
        </div>
        <div className="info-box">{status}{pageCount ? ` · 共 ${pageCount} 頁` : ''}</div>
        <div className="info-box">透過 pdf.js (CDN) 把每頁渲染到離線 canvas，再以 <strong>fabric.Image</strong> 加入 fabric canvas，可自由縮放、旋轉。</div>
      </>
    }>
      <div className="stage-wrapper" ref={wrapperRef}><canvas ref={canvasRef} width={900} height={600} /></div>
    </DemoLayout>
  );
}
