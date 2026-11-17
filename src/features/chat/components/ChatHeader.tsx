import React from 'react';
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Users,
  Info,
  Trash2,
} from 'lucide-react';
import { Avatar, Dropdown } from '@/components/ui';
import { formatLastSeen } from '@/utils';
import { getUserById, CURRENT_USER_ID, mockUsers } from '../services';
import type { Conversation, User } from '../types';

export interface ChatHeaderProps {
  readonly conversation: Conversation;
  readonly typingUsers?: readonly string[];
  readonly onBack: () => void;
  readonly onGroupInfo?: () => void;
  readonly onClearChat?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  typingUsers = [],
  onBack,
  onGroupInfo,
  onClearChat,
}) => {
  const isGroup = conversation.type === 'group';

  // For direct chats, find the partner user
  const otherUserId = !isGroup
    ? conversation.participants.find((id) => id !== CURRENT_USER_ID)
    : undefined;
  const otherUser: User | undefined = otherUserId
    ? getUserById(otherUserId)
    : undefined;

  // Calculate online count for groups
  const onlineCount = isGroup
    ? conversation.participants.filter((id) => {
        const u = getUserById(id) || mockUsers.find((user) => user.id === id);
        return u?.status === 'online';
      }).length
    : 0;

  const renderSubtitle = () => {
    // If someone is actively typing
    if (typingUsers.length > 0) {
      const names = typingUsers
        .map((id) => getUserById(id)?.name || 'Someone')
        .join(', ');
      return (
        <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
          <span>{names} is typing</span>
          <span className="flex gap-0.5">
            <span className="typing-dot w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400" />
            <span className="typing-dot w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400" />
            <span className="typing-dot w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400" />
          </span>
        </span>
      );
    }

    if (isGroup) {
      return (
        <button
          type="button"
          onClick={onGroupInfo}
          className="hover:underline text-left text-slate-500 dark:text-slate-400"
        >
          {conversation.participants.length} members
          {onlineCount > 0 && ` • ${onlineCount} online`}
        </button>
      );
    }

    if (otherUser) {
      if (otherUser.status === 'online') {
        return (
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
            Active now
          </span>
        );
      }
      if (otherUser.lastSeen) {
        return <span>{formatLastSeen(otherUser.lastSeen)}</span>;
      }
      return <span className="capitalize">{otherUser.status}</span>;
    }

    return null;
  };

  const dropdownItems = [
    ...(isGroup && onGroupInfo
      ? [
          {
            label: 'Group Information',
            icon: <Info className="w-4 h-4" />,
            onClick: onGroupInfo,
          },
        ]
      : []),
    ...(onClearChat
      ? [
          {
            label: 'Clear Chat History',
            icon: <Trash2 className="w-4 h-4" />,
            onClick: onClearChat,
            danger: true,
          },
        ]
      : []),
  ];

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 z-10">
      <div className="flex items-center gap-3 min-w-0">
        {/* Back button for mobile */}
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to conversations"
          className="p-1.5 -ml-1 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Avatar with status */}
        <div
          role="button"
          tabIndex={0}
          onClick={isGroup ? onGroupInfo : undefined}
          className={isGroup ? 'cursor-pointer' : ''}
        >
          <Avatar
            src={conversation.avatar}
            alt={conversation.name}
            size="md"
            status={isGroup ? undefined : otherUser?.status}
          />
        </div>

        {/* Name and subtitle */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3
              onClick={isGroup ? onGroupInfo : undefined}
              className={`text-sm font-bold text-slate-900 dark:text-white truncate ${
                isGroup ? 'cursor-pointer hover:underline' : ''
              }`}
            >
              {conversation.name}
            </h3>
            {isGroup && (
              <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {renderSubtitle()}
          </div>
        </div>
      </div>

      {/* Header action icons */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          title="Start voice call (mock)"
          aria-label="Start voice call"
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Phone className="w-4 h-4" />
        </button>
        <button
          type="button"
          title="Start video call (mock)"
          aria-label="Start video call"
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Video className="w-4 h-4" />
        </button>

        {dropdownItems.length > 0 && (
          <Dropdown
            trigger={
              <button
                type="button"
                aria-label="More conversation options"
                className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            }
            items={dropdownItems}
          />
        )}
      </div>
    </header>
  );
};
