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

    // Find the closest ancestor whose width is determined by layout (not by its
    // shrink-to-fit content). Walk past inline / inline-block / inline-flex parents
    // (e.g. the .stage-wrapper) so we don't create a feedback loop where the
    // parent shrinks because we shrank, causing us to shrink again.
    const findContainer = (): HTMLElement | null => {
      let n: HTMLElement | null = el.parentElement;
      while (n) {
        const d = getComputedStyle(n).display;
        if (d && !d.startsWith('inline')) return n;
        n = n.parentElement;
      }
      return el.parentElement;
    };
    const container = findContainer();

    const update = () => {
      let parentW = designWidth;
      if (container) {
        const cs = getComputedStyle(container);
        const padX = parseFloat(cs.paddingLeft || '0') + parseFloat(cs.paddingRight || '0');
        parentW = container.clientWidth - padX;
      }
      const availW = Math.max(120, parentW - 2);
      const cap = maxWidth ?? designWidth;
      const targetW = Math.min(availW, allowUpscale ? Infinity : cap);
      const scale = Math.max(minScale, targetW / designWidth);
      const width = designWidth * scale;
      const height = designHeight * scale;
      setSize(prev => (Math.abs(prev.width - width) < 0.5 ? prev : { width, height, scale }));
    };
    update();
    const ro = new ResizeObserver(update);
    if (container) ro.observe(container);
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
