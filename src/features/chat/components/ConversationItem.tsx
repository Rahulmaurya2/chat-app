import React from 'react';
import { Pin, Users } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatConversationTime, truncateText } from '@/utils';
import { Avatar, Badge } from '@/components/ui';
import { getUserById, CURRENT_USER_ID } from '../services';
import type { Conversation } from '../types';

export interface ConversationItemProps {
  readonly conversation: Conversation;
  readonly isActive: boolean;
  readonly onClick: () => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = React.memo(
  ({ conversation, isActive, onClick }) => {
    // For direct chats, get the other participant's status
    const isGroup = conversation.type === 'group';
    const otherParticipantId = !isGroup
      ? conversation.participants.find((id) => id !== CURRENT_USER_ID)
      : undefined;
    const otherUser = otherParticipantId
      ? getUserById(otherParticipantId)
      : undefined;

    const userStatus = isGroup ? undefined : otherUser?.status;

    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left select-none relative group',
          isActive
            ? 'bg-blue-50 dark:bg-blue-950/40 text-slate-900 dark:text-white shadow-xs'
            : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
        )}
      >
        <div className="relative shrink-0">
          <Avatar
            src={conversation.avatar}
            alt={conversation.name}
            size="md"
            status={userStatus}
          />
          {isGroup && (
            <div className="absolute -bottom-1 -right-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300">
              <Users className="w-3 h-3" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between gap-1 mb-1">
            <h4
              className={cn(
                'text-sm font-semibold truncate',
                isActive
                  ? 'text-blue-900 dark:text-blue-100 font-bold'
                  : 'text-slate-900 dark:text-slate-100'
              )}
            >
              {conversation.name}
            </h4>
            {conversation.lastMessage && (
              <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0 font-medium">
                {formatConversationTime(conversation.lastMessage.timestamp)}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {conversation.lastMessage
                ? truncateText(conversation.lastMessage.content, 35)
                : 'No messages yet'}
            </p>

            <div className="flex items-center gap-1.5 shrink-0">
              {conversation.isPinned && (
                <Pin className="w-3 h-3 text-slate-400 dark:text-slate-500 rotate-45" />
              )}
              {conversation.unreadCount > 0 && (
                <Badge count={conversation.unreadCount} />
              )}
            </div>
          </div>
        </div>
      </button>
    );
  }
);

ConversationItem.displayName = 'ConversationItem';
