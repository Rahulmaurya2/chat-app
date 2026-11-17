import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MessageItem } from '../features/chat/components/MessageItem';
import type { Message, User } from '../features/chat/types';

describe('MessageItem Component', () => {
  const sampleMessage: Message = {
    id: 'msg-item-1',
    conversationId: 'conv-1',
    senderId: 'user-1',
    content: 'Hello from Sarah!',
    timestamp: new Date().toISOString(),
    type: 'text',
    status: 'delivered',
    isEdited: true,
    reactions: [{ emoji: '👍', userIds: ['user-me'] }],
    attachments: [],
  };

  const sampleSender: User = {
    id: 'user-1',
    name: 'Sarah Chen',
    avatar: 'avatar.png',
    status: 'online',
  };

  it('renders message content, edited badge, and reaction count', () => {
    render(
      <MessageItem
        message={sampleMessage}
        isOwn={false}
        showAvatar={true}
        sender={sampleSender}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onReply={vi.fn()}
        onReaction={vi.fn()}
        currentUserId="user-me"
      />
    );

    expect(screen.getByText('Hello from Sarah!')).toBeInTheDocument();
    expect(screen.getByText('edited')).toBeInTheDocument();
    expect(screen.getByText('👍')).toBeInTheDocument();
    expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
  });

  it('triggers reaction callback on click', () => {
    const handleReaction = vi.fn();

    render(
      <MessageItem
        message={sampleMessage}
        isOwn={false}
        showAvatar={true}
        sender={sampleSender}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onReply={vi.fn()}
        onReaction={handleReaction}
        currentUserId="user-me"
      />
    );

    const reactionBtn = screen.getByText('👍').closest('button')!;
    fireEvent.click(reactionBtn);

    expect(handleReaction).toHaveBeenCalledWith('msg-item-1', '👍');
  });
});
