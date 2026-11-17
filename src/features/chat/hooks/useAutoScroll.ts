/**
 * useAutoScroll - Smart auto-scroll hook for the message list.
 * Only auto-scrolls to the latest message when the user is already
 * near the bottom. Preserves scroll position when reading history.
 */

import { useRef, useCallback, useEffect } from 'react';

/** Distance from bottom (in pixels) to consider "at bottom" */
const SCROLL_THRESHOLD = 150;

interface UseAutoScrollReturn {
  /** Ref to attach to the scrollable container */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Ref to attach to the bottom anchor element */
  bottomRef: React.RefObject<HTMLDivElement | null>;
  /** Whether the user is currently near the bottom */
  isAtBottom: () => boolean;
  /** Programmatically scroll to bottom */
  scrollToBottom: (smooth?: boolean) => void;
}

export function useAutoScroll(deps: readonly unknown[]): UseAutoScrollReturn {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const wasAtBottomRef = useRef(true);

  const isAtBottom = useCallback((): boolean => {
    const container = containerRef.current;
    if (!container) return true;

    const { scrollTop, scrollHeight, clientHeight } = container;
    return scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD;
  }, []);

  const scrollToBottom = useCallback((smooth = true) => {
    bottomRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'instant',
    });
  }, []);

  // Track scroll position to know if user is at bottom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      wasAtBottomRef.current = isAtBottom();
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isAtBottom]);

  // Auto-scroll when messages change, but only if user was at bottom
  useEffect(() => {
    if (wasAtBottomRef.current) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        scrollToBottom(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    containerRef,
    bottomRef,
    isAtBottom,
    scrollToBottom,
  };
}
