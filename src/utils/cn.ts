import { clsx, type ClassValue } from 'clsx';

/**
 * Utility to merge Tailwind CSS class names conditionally.
 * Wraps clsx for clean conditional class composition.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
