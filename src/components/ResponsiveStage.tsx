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
 * aspect ratio.
 *
 * Why this is non-trivial: our app wraps Stages in `.stage-wrapper { display: inline-block }`
 * so the wrapper hugs the canvas size. If we measure el.parentElement (the wrapper),
 * we hit a feedback loop: we size down → wrapper hugs smaller → we measure smaller →
 * we size down again, until minScale.
 *
 * Strategy: prefer `el.closest('.demo-stage')` (the layout-controlled <main> from
 * DemoLayout, guaranteed in our app). Fallback: walk up past inline / inline-block
 * ancestors. Round all sizes to integers so sub-pixel ResizeObserver fires don't
 * trigger extra renders.
 */
const ResponsiveStage = forwardRef<Konva.Stage, Props>(function ResponsiveStage(props, ref) {
  const { designWidth, designHeight, children, className, maxWidth, minScale = 0.25, allowUpscale = false, ...stageProps } = props;
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: designWidth, height: designHeight, scale: 1 });

  useLayoutEffect(() => {
    const el = wrapperRef.current; if (!el) return;

    const findContainer = (): HTMLElement | null => {
      // Preferred: the well-known DemoLayout main element. Block-level, padded,
      // grid-controlled width — never feeds back into our own size.
      const ds = el.closest('.demo-stage');
      if (ds instanceof HTMLElement) return ds;
      // Fallback: walk past inline / inline-block ancestors.
      let n: HTMLElement | null = el.parentElement;
      while (n) {
        const d = getComputedStyle(n).display;
        if (d && !d.startsWith('inline')) return n;
        n = n.parentElement;
      }
      return el.parentElement;
    };
    const container = findContainer();
    if (!container) return;

    const update = () => {
      const cs = getComputedStyle(container);
      const padX = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
      const inner = container.clientWidth - padX;
      if (inner <= 0) return;
      const cap = allowUpscale ? Number.POSITIVE_INFINITY : (maxWidth ?? designWidth);
      const targetW = Math.min(inner, cap);
      const rawScale = Math.max(minScale, targetW / designWidth);
      // Floor to integer pixels so sub-pixel measurement noise doesn't keep
      // re-triggering renders.
      const width = Math.floor(designWidth * rawScale);
      const height = Math.floor(designHeight * rawScale);
      const scale = width / designWidth;
      setSize(prev => (prev.width === width && prev.height === height ? prev : { width, height, scale }));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(container);
    return () => { ro.disconnect(); };
  }, [designWidth, designHeight, maxWidth, minScale, allowUpscale]);

  return (
    <div
      ref={wrapperRef}
      className={`responsive-stage ${className || ''}`}
      style={{ width: size.width, height: size.height }}
    >
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
