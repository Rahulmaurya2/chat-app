/**
 * useConversations - Hook for managing conversation list filtering and search.
 * Extracts sidebar business logic from the component.
 */

import { useMemo, useCallback } from 'react';
import { useAppSelector, useAppDispatch, setActiveConversation } from '../slices';
import type { Conversation, ConversationFilter, ConversationId } from '../types';

interface UseConversationsReturn {
  /** Filtered and searched conversations */
  filteredConversations: readonly Conversation[];
  /** Active conversation object */
  activeConversation: Conversation | undefined;
  /** Active conversation ID */
  activeConversationId: ConversationId | null;
  /** Current filter tab */
  activeFilter: ConversationFilter;
  /** Current search query */
  searchQuery: string;
  /** Set the active conversation */
  selectConversation: (id: ConversationId) => void;
  /** Total unread count across all conversations */
  totalUnread: number;
}

export function useConversations(): UseConversationsReturn {
  const dispatch = useAppDispatch();
  const conversations = useAppSelector((state) => state.chat.conversations);
  const activeConversationId = useAppSelector(
    (state) => state.ui.activeConversationId
  );
  const searchQuery = useAppSelector((state) => state.ui.searchQuery);
  const activeFilter = useAppSelector((state) => state.ui.activeFilter);

  /** Apply filter and search to conversation list */
  const filteredConversations = useMemo(() => {
    let result = [...conversations];

    // Apply filter
    switch (activeFilter) {
      case 'unread':
        result = result.filter((c) => c.unreadCount > 0);
        break;
      case 'groups':
        result = result.filter((c) => c.type === 'group');
        break;
      case 'all':
      default:
        break;
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.lastMessage?.content.toLowerCase().includes(query)
      );
    }

    // Sort: pinned first, then by updatedAt descending
    result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return result;
  }, [conversations, activeFilter, searchQuery]);

  /** Currently active conversation object */
  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeConversationId),
    [conversations, activeConversationId]
  );

  /** Total unread messages across all conversations */
  const totalUnread = useMemo(
    () => conversations.reduce((sum, c) => sum + c.unreadCount, 0),
    [conversations]
  );

  /** Set the active conversation */
  const selectConversation = useCallback(
    (id: ConversationId) => {
      dispatch(setActiveConversation(id));
    },
    [dispatch]
  );

  return {
    filteredConversations,
    activeConversation,
    activeConversationId,
    activeFilter,
    searchQuery,
    selectConversation,
    totalUnread,
  };
}
