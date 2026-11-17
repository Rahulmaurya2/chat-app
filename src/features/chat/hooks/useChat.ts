/**
 * useChat - Core hook for chat operations.
 * Encapsulates all message sending, editing, deleting, reaction toggling,
 * and auto-reply simulation logic. Keeps components "dumb".
 */

import { useCallback, useEffect, useRef } from 'react';
import {
  useAppDispatch,
  useAppSelector,
  sendMessage,
  receiveMessage,
  updateMessageStatus,
  editMessage,
  deleteMessage,
  toggleReaction,
  markConversationAsRead,
  setTyping,
  clearTyping,
  setEditingMessage,
  setReplyingToMessage,
} from '../slices';
import { chatService } from '../services/chatService';
import type {
  ConversationId,
  MessageId,
  Attachment,
  Message,
  MessageStatus,
} from '../types';

interface UseChatReturn {
  /** Send a new message in the active conversation */
  handleSendMessage: (
    content: string,
    attachments?: Attachment[]
  ) => void;
  /** Edit an existing message */
  handleEditMessage: (messageId: MessageId, content: string) => void;
  /** Delete a message */
  handleDeleteMessage: (messageId: MessageId) => void;
  /** Toggle an emoji reaction */
  handleToggleReaction: (messageId: MessageId, emoji: string) => void;
  /** Start replying to a message */
  handleReply: (messageId: MessageId) => void;
  /** Cancel reply mode */
  handleCancelReply: () => void;
  /** Start editing a message */
  handleStartEdit: (messageId: MessageId) => void;
  /** Cancel edit mode */
  handleCancelEdit: () => void;
  /** Mark conversation as read */
  handleMarkAsRead: (conversationId: ConversationId) => void;
  /** Messages for the active conversation */
  activeMessages: readonly Message[];
  /** Currently editing message ID */
  editingMessageId: MessageId | null;
  /** Currently replying to message ID */
  replyingToMessageId: MessageId | null;
  /** The message being replied to (if any) */
  replyToMessage: Message | undefined;
}

export function useChat(
  activeConversationId: ConversationId | null
): UseChatReturn {
  const dispatch = useAppDispatch();
  const messages = useAppSelector((state) => state.chat.messages);
  const conversations = useAppSelector((state) => state.chat.conversations);
  const editingMessageId = useAppSelector(
    (state) => state.ui.editingMessageId
  );
  const replyingToMessageId = useAppSelector(
    (state) => state.ui.replyingToMessageId
  );

  // Track the last sent message to trigger auto-reply
  const lastSentRef = useRef<string | null>(null);

  // Filter messages for the active conversation
  const activeMessages = messages.filter(
    (m) => m.conversationId === activeConversationId
  );

  // Get the message being replied to
  const replyToMessage = replyingToMessageId
    ? messages.find((m) => m.id === replyingToMessageId)
    : undefined;

  // Set up chat service callbacks
  useEffect(() => {
    chatService.setCallbacks({
      onTypingStart: (conversationId: ConversationId, userId: string) => {
        dispatch(setTyping({ conversationId, userId }));
      },
      onTypingStop: (conversationId: ConversationId, userId: string) => {
        dispatch(clearTyping({ conversationId, userId }));
      },
      onMessageStatusUpdate: (messageId: string, status: MessageStatus) => {
        dispatch(updateMessageStatus({ messageId, status }));
      },
      onIncomingMessage: (message: Message) => {
        dispatch(receiveMessage(message));
      },
    });

    return () => {
      chatService.destroy();
    };
  }, [dispatch]);

  const handleSendMessage = useCallback(
    (content: string, attachments?: Attachment[]) => {
      if (!activeConversationId || !content.trim()) return;

      dispatch(
        sendMessage({
          conversationId: activeConversationId,
          content: content.trim(),
          replyTo: replyingToMessageId ?? undefined,
          attachments,
        })
      );

      // Clear reply mode after sending
      if (replyingToMessageId) {
        dispatch(setReplyingToMessage(null));
      }

      // Find the latest message ID (the one we just sent)
      // We use a ref to track and trigger status progression + auto-reply
      const latestMsgId =
        messages.length > 0 ? messages[messages.length - 1]?.id : null;
      if (latestMsgId !== lastSentRef.current) {
        lastSentRef.current = latestMsgId ?? null;
      }

      // Trigger status progression for the sent message
      // We need to get the new message ID, so we use a small delay
      setTimeout(() => {
        const currentMessages =
          document.querySelectorAll('[data-message-id]');
        const lastMsgEl = currentMessages[currentMessages.length - 1];
        const msgId = lastMsgEl?.getAttribute('data-message-id');
        if (msgId) {
          chatService.simulateStatusProgression(msgId);
        }
      }, 50);

      // Trigger auto-reply simulation
      const conv = conversations.find(
        (c) => c.id === activeConversationId
      );
      if (conv) {
        chatService.simulateAutoReply(
          activeConversationId,
          conv.participants
        );
      }
    },
    [
      activeConversationId,
      conversations,
      dispatch,
      messages,
      replyingToMessageId,
    ]
  );

  const handleEditMessage = useCallback(
    (messageId: MessageId, content: string) => {
      dispatch(editMessage({ messageId, content }));
      dispatch(setEditingMessage(null));
    },
    [dispatch]
  );

  const handleDeleteMessage = useCallback(
    (messageId: MessageId) => {
      dispatch(deleteMessage(messageId));
    },
    [dispatch]
  );

  const handleToggleReaction = useCallback(
    (messageId: MessageId, emoji: string) => {
      dispatch(toggleReaction({ messageId, emoji }));
    },
    [dispatch]
  );

  const handleReply = useCallback(
    (messageId: MessageId) => {
      dispatch(setReplyingToMessage(messageId));
    },
    [dispatch]
  );

  const handleCancelReply = useCallback(() => {
    dispatch(setReplyingToMessage(null));
  }, [dispatch]);

  const handleStartEdit = useCallback(
    (messageId: MessageId) => {
      dispatch(setEditingMessage(messageId));
    },
    [dispatch]
  );

  const handleCancelEdit = useCallback(() => {
    dispatch(setEditingMessage(null));
  }, [dispatch]);

  const handleMarkAsRead = useCallback(
    (conversationId: ConversationId) => {
      dispatch(markConversationAsRead(conversationId));
    },
    [dispatch]
  );

  return {
    handleSendMessage,
    handleEditMessage,
    handleDeleteMessage,
    handleToggleReaction,
    handleReply,
    handleCancelReply,
    handleStartEdit,
    handleCancelEdit,
    handleMarkAsRead,
    activeMessages,
    editingMessageId,
    replyingToMessageId,
    replyToMessage,
  };
}
