/**
 * Chat Slice - Redux Toolkit slice for managing messages and conversations.
 * Handles all message CRUD operations, conversation state, typing indicators,
 * and optimistic updates.
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import type {
  Message,
  Conversation,
  MessageStatus,
  ConversationId,
  MessageId,
  UserId,
  Reaction,
  Attachment,
} from '../types';
import { chatService } from '../services/chatService';

/** Typing indicator entry */
interface TypingEntry {
  userId: UserId;
  conversationId: ConversationId;
}

/** Chat state shape */
interface ChatState {
  conversations: Conversation[];
  messages: Message[];
  typingIndicators: TypingEntry[];
  currentUserId: UserId;
}

/** Load initial data from service (localStorage or mock) */
const initialData = chatService.getInitialData();

const initialState: ChatState = {
  conversations: initialData.conversations as Conversation[],
  messages: initialData.messages as Message[],
  typingIndicators: [],
  currentUserId: chatService.getCurrentUserId(),
};

/** Payload for sending a new message */
interface SendMessagePayload {
  conversationId: ConversationId;
  content: string;
  replyTo?: MessageId;
  attachments?: Attachment[];
}

/** Payload for updating message status */
interface UpdateStatusPayload {
  messageId: MessageId;
  status: MessageStatus;
}

/** Payload for editing a message */
interface EditMessagePayload {
  messageId: MessageId;
  content: string;
}

/** Payload for toggling a reaction */
interface ToggleReactionPayload {
  messageId: MessageId;
  emoji: string;
}

/** Payload for typing indicator */
interface TypingPayload {
  conversationId: ConversationId;
  userId: UserId;
}

/** Payload for adding/removing group members */
interface GroupMemberPayload {
  conversationId: ConversationId;
  userId: UserId;
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    /**
     * Send a new message (optimistic update).
     * Message is immediately added with 'sending' status.
     */
    sendMessage: (state, action: PayloadAction<SendMessagePayload>) => {
      const { conversationId, content, replyTo, attachments } = action.payload;

      const newMessage: Message = {
        id: uuidv4(),
        conversationId,
        senderId: state.currentUserId,
        content,
        timestamp: new Date().toISOString(),
        type: attachments?.some((a) => a.type.startsWith('image/'))
          ? 'image'
          : 'text',
        status: 'sending',
        replyTo,
        isEdited: false,
        reactions: [],
        attachments: attachments ?? [],
      };

      state.messages.push(newMessage);

      // Update the conversation's last message and move to top
      const convIndex = state.conversations.findIndex(
        (c) => c.id === conversationId
      );
      if (convIndex !== -1) {
        const conv = state.conversations[convIndex]!;
        state.conversations[convIndex] = {
          ...conv,
          lastMessage: newMessage,
          updatedAt: newMessage.timestamp,
        };
      }

      // Persist to localStorage
      chatService.saveState({
        messages: state.messages,
        conversations: state.conversations,
      });
    },

    /**
     * Receive an incoming message from another user.
     */
    receiveMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      state.messages.push(message);

      const convIndex = state.conversations.findIndex(
        (c) => c.id === message.conversationId
      );
      if (convIndex !== -1) {
        const conv = state.conversations[convIndex]!;
        state.conversations[convIndex] = {
          ...conv,
          lastMessage: message,
          unreadCount: conv.unreadCount + 1,
          updatedAt: message.timestamp,
        };
      }

      chatService.saveState({
        messages: state.messages,
        conversations: state.conversations,
      });
    },

    /**
     * Update a message's delivery status (sent -> delivered -> read).
     */
    updateMessageStatus: (
      state,
      action: PayloadAction<UpdateStatusPayload>
    ) => {
      const { messageId, status } = action.payload;
      const msgIndex = state.messages.findIndex((m) => m.id === messageId);
      if (msgIndex !== -1) {
        const msg = state.messages[msgIndex]!;
        state.messages[msgIndex] = { ...msg, status };
      }

      chatService.saveState({
        messages: state.messages,
        conversations: state.conversations,
      });
    },

    /**
     * Edit an existing message's content.
     */
    editMessage: (state, action: PayloadAction<EditMessagePayload>) => {
      const { messageId, content } = action.payload;
      const msgIndex = state.messages.findIndex((m) => m.id === messageId);
      if (msgIndex !== -1) {
        const msg = state.messages[msgIndex]!;
        state.messages[msgIndex] = { ...msg, content, isEdited: true };
      }

      chatService.saveState({
        messages: state.messages,
        conversations: state.conversations,
      });
    },

    /**
     * Delete a message from the conversation.
     */
    deleteMessage: (state, action: PayloadAction<MessageId>) => {
      const messageId = action.payload;
      state.messages = state.messages.filter((m) => m.id !== messageId);

      chatService.saveState({
        messages: state.messages,
        conversations: state.conversations,
      });
    },

    /**
     * Toggle an emoji reaction on a message.
     * Adds the reaction if the user hasn't reacted with that emoji,
     * removes it if they have.
     */
    toggleReaction: (state, action: PayloadAction<ToggleReactionPayload>) => {
      const { messageId, emoji } = action.payload;
      const msgIndex = state.messages.findIndex((m) => m.id === messageId);
      if (msgIndex === -1) return;

      const msg = state.messages[msgIndex]!;
      const reactions = [...msg.reactions];
      const existingIdx = reactions.findIndex((r) => r.emoji === emoji);

      if (existingIdx !== -1) {
        const existing = reactions[existingIdx]!;
        const userIds = existing.userIds.filter(
          (id) => id !== state.currentUserId
        );

        if (userIds.length === 0) {
          reactions.splice(existingIdx, 1);
        } else {
          reactions[existingIdx] = { ...existing, userIds };
        }

        // Check if user was actually in the reaction
        if (!existing.userIds.includes(state.currentUserId)) {
          reactions[existingIdx] = {
            ...existing,
            userIds: [...existing.userIds, state.currentUserId],
          };
        }
      } else {
        reactions.push({
          emoji,
          userIds: [state.currentUserId],
        } as Reaction);
      }

      state.messages[msgIndex] = { ...msg, reactions };

      chatService.saveState({
        messages: state.messages,
        conversations: state.conversations,
      });
    },

    /**
     * Mark all messages in a conversation as read and reset unread count.
     */
    markConversationAsRead: (
      state,
      action: PayloadAction<ConversationId>
    ) => {
      const convId = action.payload;
      const convIndex = state.conversations.findIndex((c) => c.id === convId);
      if (convIndex !== -1) {
        const conv = state.conversations[convIndex]!;
        state.conversations[convIndex] = { ...conv, unreadCount: 0 };
      }

      chatService.saveState({
        messages: state.messages,
        conversations: state.conversations,
      });
    },

    /**
     * Set typing indicator for a user in a conversation.
     */
    setTyping: (state, action: PayloadAction<TypingPayload>) => {
      const { conversationId, userId } = action.payload;
      const exists = state.typingIndicators.some(
        (t) => t.conversationId === conversationId && t.userId === userId
      );
      if (!exists) {
        state.typingIndicators.push({ conversationId, userId });
      }
    },

    /**
     * Clear typing indicator for a user in a conversation.
     */
    clearTyping: (state, action: PayloadAction<TypingPayload>) => {
      const { conversationId, userId } = action.payload;
      state.typingIndicators = state.typingIndicators.filter(
        (t) =>
          !(t.conversationId === conversationId && t.userId === userId)
      );
    },

    /**
     * Add a member to a group conversation.
     */
    addGroupMember: (state, action: PayloadAction<GroupMemberPayload>) => {
      const { conversationId, userId } = action.payload;
      const convIndex = state.conversations.findIndex(
        (c) => c.id === conversationId
      );
      if (convIndex !== -1) {
        const conv = state.conversations[convIndex]!;
        if (!conv.participants.includes(userId)) {
          state.conversations[convIndex] = {
            ...conv,
            participants: [...conv.participants, userId],
          };
        }
      }

      chatService.saveState({
        messages: state.messages,
        conversations: state.conversations,
      });
    },

    /**
     * Remove a member from a group conversation.
     */
    removeGroupMember: (
      state,
      action: PayloadAction<GroupMemberPayload>
    ) => {
      const { conversationId, userId } = action.payload;
      const convIndex = state.conversations.findIndex(
        (c) => c.id === conversationId
      );
      if (convIndex !== -1) {
        const conv = state.conversations[convIndex]!;
        state.conversations[convIndex] = {
          ...conv,
          participants: conv.participants.filter((id) => id !== userId),
        };
      }

      chatService.saveState({
        messages: state.messages,
        conversations: state.conversations,
      });
    },

    /**
     * Create a new group conversation.
     */
    createGroupConversation: (
      state,
      action: PayloadAction<{ name: string; participants: UserId[] }>
    ) => {
      const { name, participants } = action.payload;
      const allParticipants = Array.from(new Set([state.currentUserId, ...participants]));
      const newConv: Conversation = {
        id: `conv-group-${uuidv4().slice(0, 8)}`,
        type: 'group',
        name,
        avatar: `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(name)}`,
        participants: allParticipants,
        unreadCount: 0,
        isPinned: false,
        isMuted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      state.conversations.unshift(newConv);

      chatService.saveState({
        messages: state.messages,
        conversations: state.conversations,
      });
    },

    /**
     * Load bulk messages (for virtualization testing).
     */
    loadBulkMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = [...state.messages, ...action.payload];
    },

    /**
     * Reset state to initial mock data (clears localStorage).
     */
    resetState: (state) => {
      chatService.clearState();
      const freshData = chatService.getInitialData();
      state.messages = freshData.messages as Message[];
      state.conversations = freshData.conversations as Conversation[];
      state.typingIndicators = [];
    },
  },
});

export const {
  sendMessage,
  receiveMessage,
  updateMessageStatus,
  editMessage,
  deleteMessage,
  toggleReaction,
  markConversationAsRead,
  setTyping,
  clearTyping,
  addGroupMember,
  removeGroupMember,
  createGroupConversation,
  loadBulkMessages,
  resetState,
} = chatSlice.actions;

export default chatSlice.reducer;
