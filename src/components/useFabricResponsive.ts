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

    const update = () => {
      const parent = wrapper.parentElement; if (!parent) return;
      const availW = Math.max(120, parent.clientWidth - 2);
      const scale = Math.min(1, availW / designWidth);
      const width = designWidth * scale;
      const height = designHeight * scale;
      canvas.setDimensions({ width: `${width}px`, height: `${height}px` }, { cssOnly: true });
    };

    update();
    const ro = new ResizeObserver(update);
    if (wrapper.parentElement) ro.observe(wrapper.parentElement);
    window.addEventListener('resize', update);
    return () => { ro.disconnect(); window.removeEventListener('resize', update); };
  }, [wrapperRef, fabricRef, designWidth, designHeight]);
}
