import React, { useState } from 'react';
import {
  Check,
  CheckCheck,
  Clock,
  Reply,
  Pencil,
  Trash2,
  Copy,
  SmilePlus,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatMessageTime, copyToClipboard } from '@/utils';
import { Avatar } from '@/components/ui';
import type { Message, User, MessageId } from '../types';

export interface MessageItemProps {
  readonly message: Message;
  readonly isOwn: boolean;
  readonly showAvatar: boolean;
  readonly sender?: User;
  readonly replyMessage?: Message;
  readonly replySender?: User;
  readonly onEdit: (messageId: MessageId) => void;
  readonly onDelete: (messageId: MessageId) => void;
  readonly onReply: (messageId: MessageId) => void;
  readonly onReaction: (messageId: MessageId, emoji: string) => void;
  readonly currentUserId: string;
}

const QUICK_REACTIONS = ['👍', '❤️', '😂', '🔥', '🚀', '👀'];

export const MessageItem: React.FC<MessageItemProps> = React.memo(
  ({
    message,
    isOwn,
    showAvatar,
    sender,
    replyMessage,
    replySender,
    onEdit,
    onDelete,
    onReply,
    onReaction,
    currentUserId,
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showReactionPicker, setShowReactionPicker] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      await copyToClipboard(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    };

    const renderStatusIcon = () => {
      if (!isOwn) return null;

      switch (message.status) {
        case 'sending':
          return <Clock className="w-3 h-3 text-blue-200 animate-pulse" />;
        case 'sent':
          return <Check className="w-3.5 h-3.5 text-blue-200" />;
        case 'delivered':
          return <CheckCheck className="w-3.5 h-3.5 text-blue-200" />;
        case 'read':
          return <CheckCheck className="w-3.5 h-3.5 text-cyan-300" />;
        default:
          return null;
      }
    };

    return (
      <div
        data-message-id={message.id}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowReactionPicker(false);
        }}
        className={cn(
          'group relative flex gap-2.5 my-1.5 px-3 py-1 animate-message-in transition-colors',
          isOwn ? 'flex-row-reverse' : 'flex-row',
          isHovered ? 'bg-slate-50/60 dark:bg-slate-800/20' : ''
        )}
      >
        {/* Avatar or spacing */}
        <div className="w-8 shrink-0 flex flex-col justify-end">
          {!isOwn && showAvatar && sender && (
            <Avatar
              src={sender.avatar}
              alt={sender.name}
              size="sm"
              status={sender.status}
            />
          )}
        </div>

        {/* Message body container */}
        <div
          className={cn(
            'relative max-w-[80%] sm:max-w-[70%] flex flex-col',
            isOwn ? 'items-end' : 'items-start'
          )}
        >
          {/* Sender Name in group chats for others */}
          {!isOwn && showAvatar && sender && (
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 px-1">
              {sender.name}
            </span>
          )}

          {/* Message Bubble */}
          <div
            className={cn(
              'relative rounded-2xl px-4 py-2.5 shadow-xs overflow-hidden break-words text-sm',
              isOwn
                ? 'bg-blue-600 text-white rounded-br-xs'
                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/60 rounded-bl-xs'
            )}
          >
            {/* Quoted Reply Preview */}
            {replyMessage && (
              <div
                className={cn(
                  'mb-2 p-2 rounded-lg text-xs border-l-2',
                  isOwn
                    ? 'bg-blue-700/60 border-white/60 text-blue-100'
                    : 'bg-slate-100 dark:bg-slate-700/50 border-blue-500 text-slate-600 dark:text-slate-300'
                )}
              >
                <div className="font-semibold mb-0.5">
                  {replySender ? replySender.name : 'Replied message'}
                </div>
                <div className="truncate opacity-90">{replyMessage.content}</div>
              </div>
            )}

            {/* Attachments (e.g. Images) */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mb-2 space-y-1.5">
                {message.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="overflow-hidden rounded-xl border border-black/10 dark:border-white/10"
                  >
                    {att.type.startsWith('image/') ? (
                      <img
                        src={att.url}
                        alt={att.name}
                        className="max-h-60 max-w-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-black/10 rounded-lg text-xs">
                        <span className="font-medium truncate">{att.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Message Content */}
            <p className="whitespace-pre-wrap leading-relaxed select-text">
              {message.content}
            </p>

            {/* Timestamp & Status Metadata */}
            <div
              className={cn(
                'flex items-center justify-end gap-1 mt-1 text-[10px]',
                isOwn ? 'text-blue-100/90' : 'text-slate-400 dark:text-slate-400'
              )}
            >
              {message.isEdited && (
                <span className="italic opacity-80 mr-0.5">edited</span>
              )}
              <span>{formatMessageTime(message.timestamp)}</span>
              {renderStatusIcon()}
            </div>
          </div>

          {/* Emoji Reactions display */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {message.reactions.map((reaction) => {
                const hasReacted = reaction.userIds.includes(currentUserId);
                return (
                  <button
                    key={reaction.emoji}
                    type="button"
                    onClick={() => onReaction(message.id, reaction.emoji)}
                    className={cn(
                      'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium border transition-colors shadow-2xs',
                      hasReacted
                        ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-950/60 dark:border-blue-700 dark:text-blue-300'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                    )}
                  >
                    <span>{reaction.emoji}</span>
                    <span className="text-[10px]">{reaction.userIds.length}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Hover Floating Action Bar */}
          <div
            className={cn(
              'absolute top-0 -translate-y-1/2 flex items-center gap-0.5 p-1 rounded-lg bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 transition-opacity z-20',
              isOwn ? 'right-2' : 'left-2',
              isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            )}
          >
            {/* Quick emoji reaction toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowReactionPicker((p) => !p)}
                className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                title="Add Reaction"
                aria-label="Add reaction"
              >
                <SmilePlus className="w-3.5 h-3.5" />
              </button>

              {showReactionPicker && (
                <div className="absolute bottom-full left-0 mb-1 flex items-center gap-1 p-1 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 z-30 animate-in fade-in zoom-in-95">
                  {QUICK_REACTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        onReaction(message.id, emoji);
                        setShowReactionPicker(false);
                      }}
                      className="p-1 hover:scale-125 transition-transform text-sm"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Reply action */}
            <button
              type="button"
              onClick={() => onReply(message.id)}
              className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title="Reply"
              aria-label="Reply to message"
            >
              <Reply className="w-3.5 h-3.5" />
            </button>

            {/* Copy action */}
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title={copied ? 'Copied!' : 'Copy'}
              aria-label="Copy message text"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>

            {/* Edit (only for own messages) */}
            {isOwn && (
              <button
                type="button"
                onClick={() => onEdit(message.id)}
                className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                title="Edit message"
                aria-label="Edit message"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Delete (only for own messages) */}
            {isOwn && (
              <button
                type="button"
                onClick={() => onDelete(message.id)}
                className="p-1.5 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 transition-colors"
                title="Delete message"
                aria-label="Delete message"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

MessageItem.displayName = 'MessageItem';
