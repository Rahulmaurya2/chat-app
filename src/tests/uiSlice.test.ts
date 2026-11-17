import { describe, it, expect, beforeEach } from 'vitest';
import uiReducer, {
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
} from '../features/chat/slices/uiSlice';
import type { UIState } from '../features/chat/types';

describe('uiSlice Redux reducer', () => {
  const initialState: UIState = {
    isSidebarOpen: true,
    isMobile: false,
    activeConversationId: null,
    theme: 'light',
    searchQuery: '',
    activeFilter: 'all',
    isGroupModalOpen: false,
    isProfileModalOpen: false,
    editingMessageId: null,
    replyingToMessageId: null,
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('toggles sidebar state', () => {
    const s1 = uiReducer(initialState, toggleSidebar());
    expect(s1.isSidebarOpen).toBe(false);

    const s2 = uiReducer(s1, toggleSidebar());
    expect(s2.isSidebarOpen).toBe(true);
  });

  it('sets sidebar explicitly', () => {
    const s1 = uiReducer(initialState, setSidebarOpen(false));
    expect(s1.isSidebarOpen).toBe(false);
  });

  it('sets active conversation and resets message edit/reply states', () => {
    const stateWithDraft = {
      ...initialState,
      editingMessageId: 'msg-1',
      replyingToMessageId: 'msg-2',
    };

    const nextState = uiReducer(
      stateWithDraft,
      setActiveConversation('conv-123')
    );

    expect(nextState.activeConversationId).toBe('conv-123');
    expect(nextState.editingMessageId).toBeNull();
    expect(nextState.replyingToMessageId).toBeNull();
  });

  it('toggles theme and updates localStorage', () => {
    const darkState = uiReducer(initialState, toggleTheme());
    expect(darkState.theme).toBe('dark');
    expect(localStorage.getItem('chat-app-theme')).toBe('dark');

    const explicitLightState = uiReducer(darkState, setTheme('light'));
    expect(explicitLightState.theme).toBe('light');

    const toggledState = uiReducer(explicitLightState, toggleTheme());
    expect(toggledState.theme).toBe('dark');
  });

  it('sets search query and filter tabs', () => {
    const searchedState = uiReducer(initialState, setSearchQuery('sarah'));
    expect(searchedState.searchQuery).toBe('sarah');

    const filteredState = uiReducer(searchedState, setActiveFilter('unread'));
    expect(filteredState.activeFilter).toBe('unread');
  });

  it('manages modal open state', () => {
    const openState = uiReducer(initialState, setGroupModalOpen(true));
    expect(openState.isGroupModalOpen).toBe(true);

    const toggledState = uiReducer(openState, toggleGroupModal());
    expect(toggledState.isGroupModalOpen).toBe(false);
  });

  it('manages mobile view and mutual exclusivity of edit/reply', () => {
    const mobileSetup = uiReducer(initialState, setIsMobile(true));
    expect(mobileSetup.isMobile).toBe(true);

    // When mobile and selecting conversation, sidebar closes
    const mobileState: UIState = {
      ...mobileSetup,
      isSidebarOpen: true,
    };
    const s1 = uiReducer(mobileState, setActiveConversation('conv-1'));
    expect(s1.isSidebarOpen).toBe(false);

    // Setting reply clears edit
    const s2 = uiReducer(s1, setEditingMessage('msg-edit'));
    expect(s2.editingMessageId).toBe('msg-edit');
    expect(s2.replyingToMessageId).toBeNull();

    const s3 = uiReducer(s2, setReplyingToMessage('msg-reply'));
    expect(s3.replyingToMessageId).toBe('msg-reply');
    expect(s3.editingMessageId).toBeNull();
  });
});
