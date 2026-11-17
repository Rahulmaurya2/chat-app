import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConversationItem } from '../features/chat/components/ConversationItem';
import type { Conversation } from '../features/chat/types';

describe('ConversationItem Component', () => {
  const mockConversation: Conversation = {
    id: 'conv-test-1',
    type: 'direct',
    name: 'Sarah Chen',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah',
    participants: ['user-me', 'user-1'],
    lastMessage: {
      id: 'm1',
      conversationId: 'conv-test-1',
      senderId: 'user-1',
      content: 'Hey! Have you seen the new design specs?',
      timestamp: new Date().toISOString(),
      type: 'text',
      status: 'read',
      isEdited: false,
      reactions: [],
      attachments: [],
    },
    unreadCount: 3,
    isPinned: true,
    isMuted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('renders conversation name, last message snippet, and unread count', () => {
    const handleClick = vi.fn();

    render(
      <ConversationItem
        conversation={mockConversation}
        isActive={false}
        onClick={handleClick}
      />
    );

    expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
    expect(
      screen.getByText(/Hey! Have you seen the new design/i)
    ).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('fires onClick when clicked', () => {
    const handleClick = vi.fn();

    render(
      <ConversationItem
        conversation={mockConversation}
        isActive={false}
        onClick={handleClick}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
