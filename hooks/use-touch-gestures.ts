'use client';

import { useEffect, useRef } from 'react';

export interface TouchGestureHandlers {
  onTap?: (event: TouchEvent) => void;
  onDoubleTap?: (event: TouchEvent) => void;
  onSwipeLeft?: (event: TouchEvent) => void;
  onSwipeRight?: (event: TouchEvent) => void;
  onSwipeUp?: (event: TouchEvent) => void;
  onSwipeDown?: (event: TouchEvent) => void;
  onPinch?: (scale: number, event: TouchEvent) => void;
}

export interface TouchGestureConfig {
  swipeThreshold?: number;
  doubleTapThreshold?: number;
  pinchThreshold?: number;
}

export function useTouchGestures(
  elementRef: React.RefObject<HTMLElement>,
  handlers: TouchGestureHandlers,
  config: TouchGestureConfig = {}
) {
  const {
    swipeThreshold = 50,
    doubleTapThreshold = 300,
    pinchThreshold = 0.1
  } = config;

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTapRef = useRef<{ time: number; x: number; y: number } | null>(null);
  const initialPinchDistanceRef = useRef<number | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const getTouchDistance = (touch1: Touch, touch2: Touch): number => {
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        const touch = event.touches[0];
        touchStartRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          time: Date.now()
        };
      } else if (event.touches.length === 2) {
        // Pinch gesture start
        initialPinchDistanceRef.current = getTouchDistance(event.touches[0], event.touches[1]);
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 2 && initialPinchDistanceRef.current && handlers.onPinch) {
        // Pinch gesture
        const currentDistance = getTouchDistance(event.touches[0], event.touches[1]);
        const scale = currentDistance / initialPinchDistanceRef.current;
        
        if (Math.abs(scale - 1) > pinchThreshold) {
          handlers.onPinch(scale, event);
        }
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (!touchStartRef.current) return;

      const touchEnd = event.changedTouches[0];
      const touchStart = touchStartRef.current;
      
      const deltaX = touchEnd.clientX - touchStart.x;
      const deltaY = touchEnd.clientY - touchStart.y;
      const deltaTime = Date.now() - touchStart.time;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Check for swipe gestures
      if (distance > swipeThreshold) {
        const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
        
        if (Math.abs(angle) < 45) {
          // Swipe right
          handlers.onSwipeRight?.(event);
        } else if (Math.abs(angle) > 135) {
          // Swipe left
          handlers.onSwipeLeft?.(event);
        } else if (angle > 45 && angle < 135) {
          // Swipe down
          handlers.onSwipeDown?.(event);
        } else if (angle > -135 && angle < -45) {
          // Swipe up
          handlers.onSwipeUp?.(event);
        }
      } else if (distance < 10 && deltaTime < 500) {
        // Potential tap or double tap
        const currentTap = {
          time: Date.now(),
          x: touchEnd.clientX,
          y: touchEnd.clientY
        };

        if (lastTapRef.current && 
            currentTap.time - lastTapRef.current.time < doubleTapThreshold &&
            Math.abs(currentTap.x - lastTapRef.current.x) < 50 &&
            Math.abs(currentTap.y - lastTapRef.current.y) < 50) {
          // Double tap
          handlers.onDoubleTap?.(event);
          lastTapRef.current = null;
        } else {
          // Single tap (delayed to check for double tap)
          setTimeout(() => {
            if (lastTapRef.current === currentTap) {
              handlers.onTap?.(event);
            }
          }, doubleTapThreshold);
          lastTapRef.current = currentTap;
        }
      }

      touchStartRef.current = null;
      initialPinchDistanceRef.current = null;
    };

    // Add event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [elementRef, handlers, swipeThreshold, doubleTapThreshold, pinchThreshold]);

  return null;
}