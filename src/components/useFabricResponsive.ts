import { RefObject, useEffect } from 'react';

interface FabricCanvasLike {
  setDimensions: (d: { width: string | number; height: string | number }, opts?: { cssOnly?: boolean }) => void;
}

/**
 * Scales a Fabric.Canvas visually (CSS only) to fit container width
 * while preserving coordinate space so hit-testing stays correct.
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

    // Walk up past inline / inline-block ancestors so we measure a layout-sized
    // container (e.g. .demo-stage) instead of the shrink-to-fit .stage-wrapper,
    // avoiding a feedback loop.
    const findContainer = (): HTMLElement | null => {
      let n: HTMLElement | null = wrapper.parentElement;
      while (n) {
        const d = getComputedStyle(n).display;
        if (d && !d.startsWith('inline')) return n;
        n = n.parentElement;
      }
      return wrapper.parentElement;
    };
    const container = findContainer();

    const update = () => {
      let availW = designWidth;
      if (container) {
        const cs = getComputedStyle(container);
        const padX = parseFloat(cs.paddingLeft || '0') + parseFloat(cs.paddingRight || '0');
        availW = Math.max(120, container.clientWidth - padX - 2);
      }
      const scale = Math.min(1, availW / designWidth);
      const width = designWidth * scale;
      const height = designHeight * scale;
      canvas.setDimensions({ width: `${width}px`, height: `${height}px` }, { cssOnly: true });
    };

    update();
    const ro = new ResizeObserver(update);
    if (container) ro.observe(container);
    window.addEventListener('resize', update);
    return () => { ro.disconnect(); window.removeEventListener('resize', update); };
  }, [wrapperRef, fabricRef, designWidth, designHeight]);
}
