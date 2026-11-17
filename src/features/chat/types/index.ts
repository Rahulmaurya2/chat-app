/**
 * Core domain types for the Chat Application.
 * All types are strictly typed with zero `any` usage.
 */

/** Unique identifier type aliases for clarity */
export type UserId = string;
export type ConversationId = string;
export type MessageId = string;

/** User online/offline status */
export type UserStatus = 'online' | 'offline' | 'away' | 'busy';

/** Message delivery status progression: sent -> delivered -> read */
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

/** Supported message content types */
export type MessageType = 'text' | 'image' | 'file' | 'system';

/** Conversation type discriminator */
export type ConversationType = 'direct' | 'group';

/** Emoji reaction on a message */
export interface Reaction {
  emoji: string;
  userIds: UserId[];
}

/** Attachment metadata for files/images */
export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  previewUrl?: string;
}

/** A single message within a conversation */
export interface Message {
  id: MessageId;
  conversationId: ConversationId;
  senderId: UserId;
  content: string;
  timestamp: string; // ISO 8601
  type: MessageType;
  status: MessageStatus;
  replyTo?: MessageId;
  isEdited: boolean;
  reactions: Reaction[];
  attachments: Attachment[];
}

/** A user/contact in the system */
export interface User {
  id: UserId;
  name: string;
  avatar: string;
  status: UserStatus;
  lastSeen?: string; // ISO 8601
  email?: string;
  bio?: string;
}

/** A conversation (direct or group) */
export interface Conversation {
  id: ConversationId;
  type: ConversationType;
  name: string;
  avatar: string;
  participants: UserId[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

/** Typing indicator state */
export interface TypingIndicator {
  conversationId: ConversationId;
  userId: UserId;
  isTyping: boolean;
}

/** Filter tabs for the sidebar */
export type ConversationFilter = 'all' | 'unread' | 'groups';

/** Theme mode */
export type ThemeMode = 'light' | 'dark';

/** UI state for responsive layout */
export interface UIState {
  isSidebarOpen: boolean;
  isMobile: boolean;
  activeConversationId: ConversationId | null;
  theme: ThemeMode;
  searchQuery: string;
  activeFilter: ConversationFilter;
  isGroupModalOpen: boolean;
  isProfileModalOpen: boolean;
  editingMessageId: MessageId | null;
  replyingToMessageId: MessageId | null;
}

/** Form schema for creating a group */
export interface CreateGroupForm {
  name: string;
  participants: UserId[];
}

/** Form schema for editing a message */
export interface EditMessageForm {
  content: string;
}

/** Date group label for message display */
export interface DateGroup {
  label: string;
  messages: Message[];
}
