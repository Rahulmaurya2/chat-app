import React, { useEffect, useMemo } from 'react';
import { MessageSquare } from 'lucide-react';
import { EmptyState } from '@/components/ui';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useChat, useConversations } from '../hooks';
import {
  useAppSelector,
  useAppDispatch,
  setActiveConversation,
  setGroupModalOpen,
} from '../slices';

export const ChatWindow: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeConversation, activeConversationId } = useConversations();
  const currentUserId = useAppSelector((state) => state.chat.currentUserId);
  const typingIndicators = useAppSelector(
    (state) => state.chat.typingIndicators
  );

  const {
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
  } = useChat(activeConversationId);

  // Automatically mark conversation as read when opened
  useEffect(() => {
    if (activeConversationId) {
      handleMarkAsRead(activeConversationId);
    }
  }, [activeConversationId, handleMarkAsRead]);

  // Compute users actively typing in this conversation
  const typingUsersInChat = useMemo(() => {
    return typingIndicators
      .filter((t) => t.conversationId === activeConversationId)
      .map((t) => t.userId);
  }, [typingIndicators, activeConversationId]);

  // Find messages for reply and edit previews
  const replyToMessage = useMemo(() => {
    return activeMessages.find((m) => m.id === replyingToMessageId);
  }, [activeMessages, replyingToMessageId]);

  const editingMessage = useMemo(() => {
    return activeMessages.find((m) => m.id === editingMessageId);
  }, [activeMessages, editingMessageId]);

  const handleBackToSidebar = () => {
    dispatch(setActiveConversation(null));
  };

  const handleOpenGroupInfo = () => {
    dispatch(setGroupModalOpen(true));
  };

  if (!activeConversation) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center h-full bg-slate-50 dark:bg-slate-950 p-6 select-none">
        <EmptyState
          icon={MessageSquare}
          title="Select a conversation"
          description="Choose a chat from the sidebar to view message history, share media, and collaborate with your team."
        />
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-slate-900">
      {/* Chat Header */}
      <ChatHeader
        conversation={activeConversation}
        typingUsers={typingUsersInChat}
        onBack={handleBackToSidebar}
        onGroupInfo={handleOpenGroupInfo}
      />

      {/* Message History (Virtualized + Smart Auto-Scroll) */}
      <MessageList
        messages={activeMessages}
        currentUserId={currentUserId}
        typingUsers={typingUsersInChat}
        onEdit={handleStartEdit}
        onDelete={handleDeleteMessage}
        onReply={handleReply}
        onReaction={handleToggleReaction}
      />

      {/* Rich Message Composer */}
      <MessageInput
        onSend={handleSendMessage}
        onEditSubmit={handleEditMessage}
        replyToMessage={replyToMessage}
        editingMessage={editingMessage}
        onCancelReply={handleCancelReply}
        onCancelEdit={handleCancelEdit}
      />
    </main>
  );
};
