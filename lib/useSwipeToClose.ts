'use client';

import { useState, useRef, useCallback } from 'react';

interface UseSwipeToCloseOptions {
  onClose: () => void;
  thresholdPx?: number;
  velocityThreshold?: number;
}

/**
 * Hook de gesto físico 1:1 para cerrar ventanas emergentes deslizando hacia abajo.
 * - En la cabecera / handle: permite arrastrar hacia abajo en cualquier momento.
 * - En el contenedor scrolleable: solo captura el arrastre hacia abajo cuando scrollTop <= 0.
 */
export function useSwipeToClose({
  onClose,
  thresholdPx = 90,
  velocityThreshold = 0.45,
}: UseSwipeToCloseOptions) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const gestureRef = useRef<{
    startX: number;
    startY: number;
    startTime: number;
    fromHeader: boolean;
    locked: 'none' | 'drag' | 'scroll';
  } | null>(null);

  const beginTouch = useCallback((e: React.TouchEvent, fromHeader: boolean) => {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    gestureRef.current = {
      startX: t.clientX,
      startY: t.clientY,
      startTime: performance.now(),
      fromHeader,
      locked: 'none',
    };
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const state = gestureRef.current;
    if (!state || e.touches.length !== 1) return;

    const t = e.touches[0];
    const dx = t.clientX - state.startX;
    const dy = t.clientY - state.startY;

    if (state.locked === 'none') {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;

      const isDownward = dy > 0 && dy > Math.abs(dx) * 1.15;
      const scrollTop = scrollContainerRef.current?.scrollTop ?? 0;

      if (isDownward && (state.fromHeader || scrollTop <= 1)) {
        state.locked = 'drag';
        setIsDragging(true);
      } else {
        state.locked = 'scroll';
        return;
      }
    }

    if (state.locked === 'drag') {
      if (dy > 0) {
        setDragY(dy);
      } else {
        setDragY(0);
      }
    }
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const state = gestureRef.current;
      gestureRef.current = null;
      if (!state) return;

      const wasDragging = state.locked === 'drag';
      setIsDragging(false);

      if (!wasDragging) {
        setDragY(0);
        return;
      }

      const t = e.changedTouches[0];
      const dy = Math.max(0, t.clientY - state.startY);
      const elapsed = Math.max(16, performance.now() - state.startTime);
      const velocity = dy / elapsed; // px/ms

      setDragY(0);

      if (dy >= thresholdPx || (velocity >= velocityThreshold && dy >= 40)) {
        onClose();
      }
    },
    [onClose, thresholdPx, velocityThreshold]
  );

  const headerTouchHandlers = {
    onTouchStart: (e: React.TouchEvent) => beginTouch(e, true),
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: () => {
      gestureRef.current = null;
      setIsDragging(false);
      setDragY(0);
    },
  };

  const bodyTouchHandlers = {
    onTouchStart: (e: React.TouchEvent) => beginTouch(e, false),
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: () => {
      gestureRef.current = null;
      setIsDragging(false);
      setDragY(0);
    },
  };

  const sheetStyle: React.CSSProperties = {
    transform: dragY > 0 ? `translate3d(0, ${dragY}px, 0)` : undefined,
    transition: isDragging ? 'none' : 'transform 260ms cubic-bezier(0.23, 1, 0.32, 1)',
  };

  return {
    dragY,
    isDragging,
    scrollContainerRef,
    headerTouchHandlers,
    bodyTouchHandlers,
    sheetStyle,
  };
}
