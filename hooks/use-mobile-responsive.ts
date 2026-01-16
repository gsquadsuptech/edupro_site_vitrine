'use client';

import { useState, useEffect } from 'react';

export interface BreakpointConfig {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

const defaultBreakpoints: BreakpointConfig = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

export interface ResponsiveInfo {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  breakpoint: keyof BreakpointConfig | 'xs';
  devicePixelRatio: number;
  isTouchDevice: boolean;
}

export function useMobileResponsive(breakpoints: BreakpointConfig = defaultBreakpoints): ResponsiveInfo {
  const [responsiveInfo, setResponsiveInfo] = useState<ResponsiveInfo>(() => {
    if (typeof window === 'undefined') {
      return {
        width: 0,
        height: 0,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isLandscape: true,
        isPortrait: false,
        breakpoint: 'lg' as const,
        devicePixelRatio: 1,
        isTouchDevice: false
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const devicePixelRatio = window.devicePixelRatio || 1;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    return {
      width,
      height,
      isMobile: width < breakpoints.md,
      isTablet: width >= breakpoints.md && width < breakpoints.lg,
      isDesktop: width >= breakpoints.lg,
      isLandscape: width > height,
      isPortrait: height >= width,
      breakpoint: getBreakpoint(width, breakpoints),
      devicePixelRatio,
      isTouchDevice
    };
  });

  useEffect(() => {
    const updateResponsiveInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const devicePixelRatio = window.devicePixelRatio || 1;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      setResponsiveInfo({
        width,
        height,
        isMobile: width < breakpoints.md,
        isTablet: width >= breakpoints.md && width < breakpoints.lg,
        isDesktop: width >= breakpoints.lg,
        isLandscape: width > height,
        isPortrait: height >= width,
        breakpoint: getBreakpoint(width, breakpoints),
        devicePixelRatio,
        isTouchDevice
      });
    };

    // Debounce the resize handler
    let timeoutId: NodeJS.Timeout;
    const debouncedHandler = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateResponsiveInfo, 150);
    };

    window.addEventListener('resize', debouncedHandler);
    window.addEventListener('orientationchange', updateResponsiveInfo);

    return () => {
      window.removeEventListener('resize', debouncedHandler);
      window.removeEventListener('orientationchange', updateResponsiveInfo);
      clearTimeout(timeoutId);
    };
  }, [breakpoints]);

  return responsiveInfo;
}

function getBreakpoint(width: number, breakpoints: BreakpointConfig): keyof BreakpointConfig | 'xs' {
  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
}

// Hook for detecting specific screen sizes
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQueryList.addEventListener('change', handleChange);
    setMatches(mediaQueryList.matches);

    return () => {
      mediaQueryList.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

// Predefined media queries
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
export const useIsLandscape = () => useMediaQuery('(orientation: landscape)');
export const useIsPortrait = () => useMediaQuery('(orientation: portrait)');
export const useIsTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);
  
  return isTouchDevice;
};

// Hook for safe area insets (iPhone notch, etc.)
export function useSafeAreaInsets() {
  const [insets, setInsets] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  });

  useEffect(() => {
    const updateInsets = () => {
      const computedStyle = getComputedStyle(document.documentElement);
      
      setInsets({
        top: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)') || '0'),
        right: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-right)') || '0'),
        bottom: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
        left: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-left)') || '0')
      });
    };

    updateInsets();
    window.addEventListener('orientationchange', updateInsets);
    
    return () => {
      window.removeEventListener('orientationchange', updateInsets);
    };
  }, []);

  return insets;
}