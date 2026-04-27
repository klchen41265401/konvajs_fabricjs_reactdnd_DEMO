import { useState } from 'react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend, NativeTypes } from 'react-dnd-html5-backend';
import DemoLayout from '../../components/DemoLayout';

type FileInfo = { name: string; size: number; type: string };

function humanSize(n: number) {
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
  if (n < 1024 * 1024 * 1024) return (n / (1024 * 1024)).toFixed(1) + ' MB';
  return (n / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

function FileDropZone({ onFiles }: { onFiles: (f: FileInfo[]) => void }) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: [NativeTypes.FILE],
    drop: (item: { files: File[] }) => {
      const files = item.files || [];
      const infos: FileInfo[] = files.map(f => ({ name: f.name, size: f.size, type: f.type || '（未知類型）' }));
      onFiles(infos);
    },
    collect: (m) => ({ isOver: m.isOver(), canDrop: m.canDrop() }),
  }));

  return (
    <div
      ref={drop as any}
      style={{
        maxWidth: '100%',
        width: '100%',
        height: 260,
        border: '2px dashed ' + (isOver ? '#2ecc71' : '#666'),
        borderRadius: 8,
        background: isOver ? 'rgba(46,204,113,.1)' : canDrop ? 'rgba(52,152,219,.06)' : '#111',
        color: '#ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 16,
        textAlign: 'center',
        padding: 20,
      }}
    >
      {isOver ? '放開即可載入' : '將檔案從電腦拖到此處（不會上傳，只顯示檔名與大小）'}
    </div>
  );
}

export default function NativeFiles() {
  const [files, setFiles] = useState<FileInfo[]>([]);

  return (
    <DemoLayout
      title="Other · Native Files"
      backTo="/reactdnd"
      backLabel="← React-DnD 目錄"
      sidebar={
        <>
          <div className="info-box">
            <strong>Native Files</strong><br />
            使用 <code>NativeTypes.FILE</code> 接收 OS 拖進來的檔案。
            <code>monitor.getItem().files</code> 即為 <code>File[]</code>。此 demo 僅顯示 metadata，未實際上傳。
          </div>
          <button type="button" className="back-btn" onClick={() => setFiles([])}>清空列表</button>
          <div style={{ fontSize: 12, marginTop: 10 }}>
            已讀取 {files.length} 個檔案
          </div>
          <div style={{ fontSize: 12, marginTop: 6, maxHeight: 260, overflow: 'auto' }}>
            {files.map((f, i) => (
              <div key={i} style={{ borderBottom: '1px solid #333', padding: '4px 0' }}>
                <div style={{ color: '#fff' }}>{f.name}</div>
                <div style={{ color: '#888' }}>{humanSize(f.size)} · {f.type}</div>
              </div>
            ))}
          </div>
        </>
      }
    >
      <DndProvider backend={HTML5Backend}>
        <div className="dnd-stage">
          <FileDropZone onFiles={(fs) => setFiles(prev => [...prev, ...fs])} />
        </div>
      </DndProvider>
    </DemoLayout>
  );
}
