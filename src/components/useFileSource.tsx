import { ChangeEvent, useEffect, useRef, useState } from 'react';

/**
 * Lets a demo accept a local file (image / video / font / svg / pdf) as the
 * source. Defaults to `defaultUrl` so demos still load remote sample assets.
 *
 * Usage:
 *   const { src, FileInput } = useFileSource('https://picsum.photos/...', 'image/*');
 *   // pass `src` to useImage / fabric.Image.fromURL / video.src
 *   // render <FileInput /> somewhere in your sidebar
 */
export function useFileSource(defaultUrl: string, accept: string = 'image/*') {
  const [src, setSrc] = useState(defaultUrl);
  const [filename, setFilename] = useState<string | null>(null);
  const blobRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (blobRef.current) {
        URL.revokeObjectURL(blobRef.current);
        blobRef.current = null;
      }
    };
  }, []);

  const choose = (file: File) => {
    if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    const url = URL.createObjectURL(file);
    blobRef.current = url;
    setSrc(url);
    setFilename(file.name);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) choose(f);
  };

  const reset = () => {
    if (blobRef.current) {
      URL.revokeObjectURL(blobRef.current);
      blobRef.current = null;
    }
    setSrc(defaultUrl);
    setFilename(null);
  };

  const FileInput = ({ label = '本地檔案' }: { label?: string }) => (
    <div className="control-group">
      <label>{label}</label>
      <input type="file" accept={accept} onChange={onChange} />
      {filename && (
        <div style={{ marginTop: 6, fontSize: 12, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--muted)', wordBreak: 'break-all' }}>📎 {filename}</span>
          <button type="button" onClick={reset}>還原預設</button>
        </div>
      )}
    </div>
  );

  return { src, filename, onChange, reset, choose, FileInput };
}

export default useFileSource;
