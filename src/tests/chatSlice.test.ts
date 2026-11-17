import { describe, it, expect, beforeEach } from 'vitest';
import chatReducer, {
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
} from '../features/chat/slices/chatSlice';
import type { Message } from '../features/chat/types';

describe('chatSlice Redux reducer', () => {
  const initialTestState = {
    conversations: [
      {
        id: 'conv-test-1',
        type: 'direct' as const,
        name: 'Sarah Chen',
        avatar: 'avatar.svg',
        participants: ['user-me', 'user-1'],
        unreadCount: 2,
        isPinned: false,
        isMuted: false,
        createdAt: '2026-11-17T00:00:00.000Z',
        updatedAt: '2026-11-17T00:00:00.000Z',
      },
    ],
    messages: [
      {
        id: 'msg-1',
        conversationId: 'conv-test-1',
        senderId: 'user-1',
        content: 'Hello World',
        timestamp: '2026-11-17T00:00:00.000Z',
        type: 'text' as const,
        status: 'delivered' as const,
        isEdited: false,
        reactions: [],
        attachments: [],
      },
    ],
    typingIndicators: [],
    currentUserId: 'user-me',
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('handles sending a message with optimistic sending status', () => {
    const nextState = chatReducer(
      initialTestState,
      sendMessage({
        conversationId: 'conv-test-1',
        content: 'Hey there!',
      })
    );

    expect(nextState.messages).toHaveLength(2);
    const sentMsg = nextState.messages[1]!;
    expect(sentMsg.content).toBe('Hey there!');
    expect(sentMsg.status).toBe('sending');
    expect(sentMsg.senderId).toBe('user-me');
    expect(nextState.conversations[0]?.lastMessage?.content).toBe('Hey there!');
  });

  it('handles receiving an incoming message', () => {
    const incoming: Message = {
      id: 'msg-incoming-1',
      conversationId: 'conv-test-1',
      senderId: 'user-1',
      content: 'New message from friend',
      timestamp: '2026-11-17T00:05:00.000Z',
      type: 'text',
      status: 'delivered',
      isEdited: false,
      reactions: [],
      attachments: [],
    };

    const nextState = chatReducer(initialTestState, receiveMessage(incoming));

    expect(nextState.messages).toHaveLength(2);
    expect(nextState.conversations[0]?.unreadCount).toBe(3);
    expect(nextState.conversations[0]?.lastMessage?.content).toBe(
      'New message from friend'
    );
  });

  it('updates message delivery status progression', () => {
    const nextState = chatReducer(
      initialTestState,
      updateMessageStatus({
        messageId: 'msg-1',
        status: 'read',
      })
    );

    expect(nextState.messages[0]?.status).toBe('read');
  });

  it('edits a message and marks it as isEdited', () => {
    const nextState = chatReducer(
      initialTestState,
      editMessage({
        messageId: 'msg-1',
        content: 'Updated content',
      })
    );

    expect(nextState.messages[0]?.content).toBe('Updated content');
    expect(nextState.messages[0]?.isEdited).toBe(true);
  });

  it('deletes a message', () => {
    const nextState = chatReducer(initialTestState, deleteMessage('msg-1'));
    expect(nextState.messages).toHaveLength(0);
  });

  it('toggles an emoji reaction', () => {
    // Add reaction
    const reactedState = chatReducer(
      initialTestState,
      toggleReaction({
        messageId: 'msg-1',
        emoji: '👍',
      })
    );

    expect(reactedState.messages[0]?.reactions).toHaveLength(1);
    expect(reactedState.messages[0]?.reactions[0]?.emoji).toBe('👍');
    expect(reactedState.messages[0]?.reactions[0]?.userIds).toContain('user-me');

    // Remove reaction
    const unreactedState = chatReducer(
      reactedState,
      toggleReaction({
        messageId: 'msg-1',
        emoji: '👍',
      })
    );

    expect(unreactedState.messages[0]?.reactions).toHaveLength(0);
  });

  it('marks a conversation as read and resets unread count', () => {
    const nextState = chatReducer(
      initialTestState,
      markConversationAsRead('conv-test-1')
    );

    expect(nextState.conversations[0]?.unreadCount).toBe(0);
  });

  it('manages typing indicators', () => {
    const typingState = chatReducer(
      initialTestState,
      setTyping({ conversationId: 'conv-test-1', userId: 'user-1' })
    );

    expect(typingState.typingIndicators).toHaveLength(1);
    expect(typingState.typingIndicators[0]?.userId).toBe('user-1');

    const stoppedState = chatReducer(
      typingState,
      clearTyping({ conversationId: 'conv-test-1', userId: 'user-1' })
    );

    expect(stoppedState.typingIndicators).toHaveLength(0);
  });

  it('adds and removes group members', () => {
    const groupState = {
      ...initialTestState,
      conversations: [
        {
          id: 'conv-group-test',
          type: 'group' as const,
          name: 'Engineers',
          avatar: 'group.svg',
          participants: ['user-me', 'user-1'],
          unreadCount: 0,
          isPinned: false,
          isMuted: false,
          createdAt: '2026-11-17T00:00:00.000Z',
          updatedAt: '2026-11-17T00:00:00.000Z',
        },
      ],
    };

    // Add member
    const addedState = chatReducer(
      groupState,
      addGroupMember({
        conversationId: 'conv-group-test',
        userId: 'user-2',
      })
    );
    expect(addedState.conversations[0]?.participants).toContain('user-2');

    // Remove member
    const removedState = chatReducer(
      addedState,
      removeGroupMember({
        conversationId: 'conv-group-test',
        userId: 'user-1',
      })
    );
    expect(removedState.conversations[0]?.participants).not.toContain('user-1');
  });

  it('creates a new group conversation', () => {
    const nextState = chatReducer(
      initialTestState,
      createGroupConversation({
        name: 'Designers Guild',
        participants: ['user-1', 'user-2'],
      })
    );

    expect(nextState.conversations).toHaveLength(2);
    const newGroup = nextState.conversations[0]!;
    expect(newGroup.name).toBe('Designers Guild');
    expect(newGroup.type).toBe('group');
    expect(newGroup.participants).toContain('user-me');
    expect(newGroup.participants).toContain('user-1');
  });
});
