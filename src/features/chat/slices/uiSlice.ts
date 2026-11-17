/**
 * UI Slice - Redux Toolkit slice for managing UI state.
 * Handles sidebar visibility, theme, search, filters, modals, and
 * responsive layout state.
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  ConversationId,
  ConversationFilter,
  ThemeMode,
  MessageId,
  UIState,
} from '../types';

/** Detect initial theme from system preference or localStorage */
function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';

  const stored = localStorage.getItem('chat-app-theme') as ThemeMode | null;
  if (stored === 'dark' || stored === 'light') return stored;

  if (typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  return 'light';
}

/** Detect if the viewport is mobile-sized */
function getIsMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

const initialState: UIState = {
  isSidebarOpen: true,
  isMobile: getIsMobile(),
  activeConversationId: null,
  theme: getInitialTheme(),
  searchQuery: '',
  activeFilter: 'all',
  isGroupModalOpen: false,
  isProfileModalOpen: false,
  editingMessageId: null,
  replyingToMessageId: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    /** Toggle sidebar visibility */
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },

    /** Set sidebar open/closed explicitly */
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },

    /** Set active conversation */
    setActiveConversation: (
      state,
      action: PayloadAction<ConversationId | null>
    ) => {
      state.activeConversationId = action.payload;
      // On mobile, close sidebar when selecting a conversation
      if (state.isMobile && action.payload !== null) {
        state.isSidebarOpen = false;
      }
      // Clear edit/reply state when switching conversations
      state.editingMessageId = null;
      state.replyingToMessageId = null;
    },

    /** Toggle theme between light and dark */
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('chat-app-theme', state.theme);
    },

    /** Set theme explicitly */
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
      localStorage.setItem('chat-app-theme', state.theme);
    },

    /** Update search query */
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    /** Set active filter tab */
    setActiveFilter: (state, action: PayloadAction<ConversationFilter>) => {
      state.activeFilter = action.payload;
    },

    /** Toggle group creation/management modal */
    toggleGroupModal: (state) => {
      state.isGroupModalOpen = !state.isGroupModalOpen;
    },

    /** Set group modal open state */
    setGroupModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isGroupModalOpen = action.payload;
    },

    /** Toggle profile modal */
    toggleProfileModal: (state) => {
      state.isProfileModalOpen = !state.isProfileModalOpen;
    },

    /** Set which message is being edited */
    setEditingMessage: (state, action: PayloadAction<MessageId | null>) => {
      state.editingMessageId = action.payload;
      // Can't reply and edit at the same time
      if (action.payload !== null) {
        state.replyingToMessageId = null;
      }
    },

    /** Set which message is being replied to */
    setReplyingToMessage: (state, action: PayloadAction<MessageId | null>) => {
      state.replyingToMessageId = action.payload;
      // Can't edit and reply at the same time
      if (action.payload !== null) {
        state.editingMessageId = null;
      }
    },

    /** Update mobile detection state */
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
      // Ensure sidebar is visible on desktop
      if (!action.payload) {
        state.isSidebarOpen = true;
      }
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setActiveConversation,
  toggleTheme,
  setTheme,
  setSearchQuery,
  setActiveFilter,
  toggleGroupModal,
  setGroupModalOpen,
  setEditingMessage,
  setReplyingToMessage,
  setIsMobile,
  toggleProfileModal,
} = uiSlice.actions;

export default uiSlice.reducer;
