/**
 * useResponsive - Hook for responsive layout management.
 * Detects viewport size changes and updates mobile state accordingly.
 */

import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector, setIsMobile } from '../slices';

const MOBILE_BREAKPOINT = 768;

interface UseResponsiveReturn {
  isMobile: boolean;
  isSidebarOpen: boolean;
}

export function useResponsive(): UseResponsiveReturn {
  const dispatch = useAppDispatch();
  const isMobile = useAppSelector((state) => state.ui.isMobile);
  const isSidebarOpen = useAppSelector((state) => state.ui.isSidebarOpen);

  const handleResize = useCallback(() => {
    const mobile = window.innerWidth < MOBILE_BREAKPOINT;
    dispatch(setIsMobile(mobile));
  }, [dispatch]);

  useEffect(() => {
    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return { isMobile, isSidebarOpen };
}
