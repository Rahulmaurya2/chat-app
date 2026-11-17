import { describe, it, expect } from 'vitest';
import {
  formatConversationTime,
  formatMessageTime,
  getDateGroupLabel,
  shouldClusterMessages,
} from '../utils/dateFormatters';

describe('dateFormatters utils', () => {
  it('formats conversation time for today as hour:minute', () => {
    const today = new Date().toISOString();
    const formatted = formatConversationTime(today);
    expect(formatted).toMatch(/\d{1,2}:\d{2}\s[AP]M/i);
  });

  it('formats message time as hour:minute', () => {
    const today = new Date().toISOString();
    const formatted = formatMessageTime(today);
    expect(formatted).toMatch(/\d{1,2}:\d{2}\s[AP]M/i);
  });

  it('formats conversation time for yesterday as "Yesterday"', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const formatted = formatConversationTime(yesterday);
    expect(formatted).toBe('Yesterday');
  });

  it('formats date group label for today as "Today"', () => {
    const today = new Date().toISOString();
    expect(getDateGroupLabel(today)).toBe('Today');
  });

  it('formats date group label for yesterday as "Yesterday"', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    expect(getDateGroupLabel(yesterday)).toBe('Yesterday');
  });

  it('clusters messages sent within 2 minutes of each other', () => {
    const time1 = new Date('2026-11-17T12:00:00.000Z').toISOString();
    const time2 = new Date('2026-11-17T12:01:30.000Z').toISOString();
    const time3 = new Date('2026-11-17T12:05:00.000Z').toISOString();

    expect(shouldClusterMessages(time1, time2, 2)).toBe(true);
    expect(shouldClusterMessages(time1, time3, 2)).toBe(false);
  });
});
