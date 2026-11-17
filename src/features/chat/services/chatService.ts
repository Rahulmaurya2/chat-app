/**
 * Chat Service - Mock simulation layer.
 * Handles simulated real-time events: typing indicators, message delivery
 * status progression, and automatic replies.
 * Completely isolated from UI components.
 */

import { v4 as uuidv4 } from 'uuid';
import type {
  Message,
  MessageStatus,
  ConversationId,
  UserId,
  Conversation,
} from '../types';
import {
  CURRENT_USER_ID,
  mockConversations,
  mockMessages,
  mockUsers,
  getRandomReply,
} from './mockData';

/** Persistence key for localStorage */
const STORAGE_KEY = 'chat-app-state';

/** Event callbacks for simulated real-time events */
export interface ChatServiceCallbacks {
  onTypingStart: (conversationId: ConversationId, userId: UserId) => void;
  onTypingStop: (conversationId: ConversationId, userId: UserId) => void;
  onMessageStatusUpdate: (messageId: string, status: MessageStatus) => void;
  onIncomingMessage: (message: Message) => void;
}

/** Persisted state shape */
interface PersistedState {
  messages: Message[];
  conversations: Conversation[];
}

/**
 * ChatService class encapsulates all mock simulation logic.
 * Manages typing indicators, delivery status progression, auto-replies,
 * and localStorage persistence.
 */
class ChatService {
  private callbacks: ChatServiceCallbacks | null = null;
  private activeTimers: Set<ReturnType<typeof setTimeout>> = new Set();

  /** Register event callbacks */
  setCallbacks(callbacks: ChatServiceCallbacks): void {
    this.callbacks = callbacks;
  }

  /** Clean up all active timers */
  destroy(): void {
    this.activeTimers.forEach((timer) => clearTimeout(timer));
    this.activeTimers.clear();
    this.callbacks = null;
  }

  /**
   * Simulate message delivery status progression:
   * sending -> sent (500ms) -> delivered (1500ms) -> read (3000ms)
   */
  simulateStatusProgression(messageId: string): void {
    const sentTimer = setTimeout(() => {
      this.callbacks?.onMessageStatusUpdate(messageId, 'sent');
      this.activeTimers.delete(sentTimer);
    }, 500);
    this.activeTimers.add(sentTimer);

    const deliveredTimer = setTimeout(() => {
      this.callbacks?.onMessageStatusUpdate(messageId, 'delivered');
      this.activeTimers.delete(deliveredTimer);
    }, 1500);
    this.activeTimers.add(deliveredTimer);

    const readTimer = setTimeout(() => {
      this.callbacks?.onMessageStatusUpdate(messageId, 'read');
      this.activeTimers.delete(readTimer);
    }, 3000);
    this.activeTimers.add(readTimer);
  }

  /**
   * Simulate an auto-reply from the conversation partner.
   * Triggers typing indicator, then sends a message after a delay.
   */
  simulateAutoReply(
    conversationId: ConversationId,
    participantIds: readonly UserId[]
  ): void {
    // Pick a random participant that isn't the current user
    const otherParticipants = participantIds.filter(
      (id) => id !== CURRENT_USER_ID
    );
    const responderId =
      otherParticipants[Math.floor(Math.random() * otherParticipants.length)];

    if (!responderId) return;

    // Start typing after 1-2 seconds
    const typingDelay = 1000 + Math.random() * 1000;
    const typingTimer = setTimeout(() => {
      this.callbacks?.onTypingStart(conversationId, responderId);
      this.activeTimers.delete(typingTimer);
    }, typingDelay);
    this.activeTimers.add(typingTimer);

    // Send message after 2-4 seconds of "typing"
    const messageDelay = typingDelay + 2000 + Math.random() * 2000;
    const messageTimer = setTimeout(() => {
      this.callbacks?.onTypingStop(conversationId, responderId);

      const incomingMessage: Message = {
        id: uuidv4(),
        conversationId,
        senderId: responderId,
        content: getRandomReply(),
        timestamp: new Date().toISOString(),
        type: 'text',
        status: 'delivered',
        isEdited: false,
        reactions: [],
        attachments: [],
      };

      this.callbacks?.onIncomingMessage(incomingMessage);
      this.activeTimers.delete(messageTimer);
    }, messageDelay);
    this.activeTimers.add(messageTimer);
  }

  /** Save state to localStorage */
  saveState(state: PersistedState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save chat state to localStorage:', error);
    }
  }

  /** Load state from localStorage */
  loadState(): PersistedState | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      return JSON.parse(stored) as PersistedState;
    } catch (error) {
      console.warn('Failed to load chat state from localStorage:', error);
      return null;
    }
  }

  /** Clear persisted state */
  clearState(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  /** Get initial data - from localStorage or mock data */
  getInitialData(): PersistedState {
    const persisted = this.loadState();
    if (persisted) return persisted;

    return {
      messages: [...mockMessages],
      conversations: [...mockConversations],
    };
  }

  /** Get all users */
  getUsers() {
    return mockUsers;
  }

  /** Get the current user ID */
  getCurrentUserId(): UserId {
    return CURRENT_USER_ID;
  }
}

/** Singleton instance */
export const chatService = new ChatService();
