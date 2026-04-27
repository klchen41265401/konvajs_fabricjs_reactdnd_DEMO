import { RefObject, useEffect } from 'react';

interface FabricCanvasLike {
  setDimensions: (d: { width: string | number; height: string | number }, opts?: { cssOnly?: boolean }) => void;
}

/**
 * Scales a Fabric.Canvas visually (CSS only) to fit container width while
 * preserving the design coordinate space so hit-testing stays correct.
 *
 * Measures the closest `.demo-stage` ancestor (provided by DemoLayout). Falls
 * back to walking past inline / inline-block ancestors so we don't measure a
 * shrink-to-fit wrapper (which would feed back into our own size).
 */
export default function useFabricResponsive(
  wrapperRef: RefObject<HTMLElement>,
  fabricRef: RefObject<FabricCanvasLike | null>,
  designWidth: number,
  designHeight: number
) {
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = fabricRef.current;
    if (!wrapper || !canvas) return;

    const findContainer = (): HTMLElement | null => {
      const ds = wrapper.closest('.demo-stage');
      if (ds instanceof HTMLElement) return ds;
      let n: HTMLElement | null = wrapper.parentElement;
      while (n) {
        const d = getComputedStyle(n).display;
        if (d && !d.startsWith('inline')) return n;
        n = n.parentElement;
      }
      return wrapper.parentElement;
    };
    const container = findContainer();
    if (!container) return;

    const update = () => {
      const cs = getComputedStyle(container);
      const padX = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
      const inner = container.clientWidth - padX - 2;
      if (inner <= 0) return;
      const scale = Math.min(1, inner / designWidth);
      const width = Math.floor(designWidth * scale);
      const height = Math.floor(designHeight * scale);
      canvas.setDimensions({ width: `${width}px`, height: `${height}px` }, { cssOnly: true });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(container);
    return () => { ro.disconnect(); };
  }, [wrapperRef, fabricRef, designWidth, designHeight]);
}
