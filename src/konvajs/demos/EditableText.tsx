import { useRef, useState } from 'react';
import { Layer, Text } from 'react-konva';
import Konva from 'konva';
import DemoLayout from '../../components/DemoLayout';
import ResponsiveStage from '../../components/ResponsiveStage';

export default function EditableText() {
  const stageRef = useRef<Konva.Stage | null>(null);
  const textRef = useRef<Konva.Text | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [text, setText] = useState('Double click to edit');
  const [editing, setEditing] = useState(false);
  const [editorValue, setEditorValue] = useState('');
  const [editorStyle, setEditorStyle] = useState<React.CSSProperties>({});

  const startEdit = () => {
    const node = textRef.current;
    const wrapper = wrapperRef.current;
    if (!node || !wrapper) return;
    const pos = node.getAbsolutePosition();
    setEditorStyle({
      position: 'absolute',
      left: pos.x + 'px',
      top: pos.y + 'px',
      width: Math.max(220, node.width()) + 'px',
      height: Math.max(40, node.height()) + 'px',
      fontSize: node.fontSize() + 'px',
      fontFamily: node.fontFamily(),
      color: node.fill() as string,
      border: '1px dashed #888',
      padding: '2px',
      background: '#fff',
      resize: 'none',
      outline: 'none',
      zIndex: 10,
    });
    setEditorValue(text);
    setEditing(true);
  };

  const commit = () => {
    setText(editorValue);
    setEditing(false);
  };

  return (
    <DemoLayout title="✏️ Editable Text" backTo="/konvajs" backLabel="← Konva.js 目錄" sidebar={
      <>
        <div className="control-group"><label>目前文字</label><div>{text}</div></div>
        <div className="control-group">
          <button type="button" onClick={startEdit}>手動編輯</button>
          <button type="button" onClick={() => setText('Double click to edit')}>重置</button>
        </div>
        <div className="info-box">雙擊 Konva Text 後會隱藏文字，並在 Stage 上方疊一個 HTML textarea 以便編輯，失焦 (blur) 即寫回。</div>
      </>
    }>
      <div ref={wrapperRef} className="stage-wrapper" style={{ position: 'relative' }}>
        <ResponsiveStage ref={stageRef} designWidth={720} designHeight={360}>
          <Layer>
            <Text
              ref={textRef}
              text={text}
              x={60}
              y={140}
              fontSize={36}
              fontFamily="Arial"
              fill="#222"
              visible={!editing}
              onDblClick={startEdit}
              onDblTap={startEdit}
            />
          </Layer>
        </ResponsiveStage>
        {editing && (
          <textarea
            autoFocus
            style={editorStyle}
            value={editorValue}
            onChange={e => setEditorValue(e.target.value)}
            onBlur={commit}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commit(); } }}
          />
        )}
      </div>
    </DemoLayout>
  );
}
