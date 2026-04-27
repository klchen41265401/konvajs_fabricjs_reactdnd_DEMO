import { ComponentProps, ReactNode, forwardRef, useLayoutEffect, useRef, useState } from 'react';
import { Stage } from 'react-konva';
import type Konva from 'konva';

type StageOwnProps = ComponentProps<typeof Stage>;
type ExtraProps = {
  designWidth: number;
  designHeight: number;
  children: ReactNode;
  className?: string;
  maxWidth?: number;
  minScale?: number;
  allowUpscale?: boolean;
};
type Props = ExtraProps & Omit<StageOwnProps, 'width' | 'height' | 'scaleX' | 'scaleY' | 'children'>;

/**
 * Auto-fits a react-konva Stage to its parent width while preserving the design
 * aspect ratio. Returns a Stage whose scaleX/scaleY and width/height are driven
 * by the container's measured size.
 */
const ResponsiveStage = forwardRef<Konva.Stage, Props>(function ResponsiveStage(props, ref) {
  const { designWidth, designHeight, children, className, maxWidth, minScale = 0.25, allowUpscale = false, ...stageProps } = props;
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: designWidth, height: designHeight, scale: 1 });

  useLayoutEffect(() => {
    const el = wrapperRef.current; if (!el) return;
    const update = () => {
      const parentW = el.parentElement?.clientWidth ?? designWidth;
      const availW = Math.max(120, parentW - 2);
      const cap = maxWidth ?? designWidth;
      const targetW = Math.min(availW, allowUpscale ? Infinity : cap);
      const scale = Math.max(minScale, targetW / designWidth);
      const width = designWidth * scale;
      const height = designHeight * scale;
      setSize(prev => (prev.width === width && prev.height === height ? prev : { width, height, scale }));
    };
    update();
    const ro = new ResizeObserver(update);
    if (el.parentElement) ro.observe(el.parentElement);
    window.addEventListener('resize', update);
    return () => { ro.disconnect(); window.removeEventListener('resize', update); };
  }, [designWidth, designHeight, maxWidth, minScale, allowUpscale]);

  return (
    <div ref={wrapperRef} className={`responsive-stage ${className || ''}`} style={{ width: size.width, height: size.height }}>
      <Stage
        ref={ref}
        width={size.width}
        height={size.height}
        scaleX={size.scale}
        scaleY={size.scale}
        {...stageProps}
      >
        {children}
      </Stage>
    </div>
  );
});

export default ResponsiveStage;
