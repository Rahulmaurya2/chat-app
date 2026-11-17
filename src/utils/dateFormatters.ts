import {
  format,
  isToday,
  isYesterday,
  differenceInMinutes,
  parseISO,
} from 'date-fns';

/**
 * Format a timestamp for display in the sidebar conversation list.
 * Shows time for today, "Yesterday" for yesterday, or the date otherwise.
 */
export function formatConversationTime(isoDate: string): string {
  const date = parseISO(isoDate);

  if (isToday(date)) {
    return format(date, 'h:mm a');
  }

  if (isYesterday(date)) {
    return 'Yesterday';
  }

  return format(date, 'MMM d, yyyy');
}

/**
 * Format a timestamp for message display.
 * Shows hours and minutes (e.g., "2:30 PM").
 */
export function formatMessageTime(isoDate: string): string {
  return format(parseISO(isoDate), 'h:mm a');
}

/**
 * Generate a date group label for grouping messages by date.
 * Returns "Today", "Yesterday", or a formatted date string.
 */
export function getDateGroupLabel(isoDate: string): string {
  const date = parseISO(isoDate);

  if (isToday(date)) {
    return 'Today';
  }

  if (isYesterday(date)) {
    return 'Yesterday';
  }

  return format(date, 'MMMM d, yyyy');
}

/**
 * Check if two message timestamps are close enough to cluster
 * (within 2 minutes of each other from the same sender).
 */
export function shouldClusterMessages(
  prevTimestamp: string,
  currTimestamp: string,
  maxMinutes = 2
): boolean {
  return (
    differenceInMinutes(parseISO(currTimestamp), parseISO(prevTimestamp)) <=
    maxMinutes
  );
}

/**
 * Format "last seen" time for user profiles.
 */
export function formatLastSeen(isoDate: string): string {
  const date = parseISO(isoDate);

  if (isToday(date)) {
    return `last seen today at ${format(date, 'h:mm a')}`;
  }

  if (isYesterday(date)) {
    return `last seen yesterday at ${format(date, 'h:mm a')}`;
  }

  return `last seen ${format(date, 'MMM d')} at ${format(date, 'h:mm a')}`;
}
