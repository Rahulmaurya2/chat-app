import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ArrowDown, MessageSquare } from 'lucide-react';
import { getDateGroupLabel, shouldClusterMessages } from '@/utils';
import { EmptyState } from '@/components/ui';
import { MessageItem } from './MessageItem';
import { getUserById } from '../services';
import type {
  Message,
  MessageId,
  UserId,
  User,
} from '../types';

export interface MessageListProps {
  readonly messages: readonly Message[];
  readonly currentUserId: UserId;
  readonly typingUsers?: readonly string[];
  readonly onEdit: (messageId: MessageId) => void;
  readonly onDelete: (messageId: MessageId) => void;
  readonly onReply: (messageId: MessageId) => void;
  readonly onReaction: (messageId: MessageId, emoji: string) => void;
}

type ListItem =
  | { readonly kind: 'date'; readonly id: string; readonly label: string }
  | {
      readonly kind: 'message';
      readonly id: string;
      readonly message: Message;
      readonly isOwn: boolean;
      readonly showAvatar: boolean;
      readonly sender?: User;
      readonly replyMessage?: Message;
      readonly replySender?: User;
    };

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  typingUsers = [],
  onEdit,
  onDelete,
  onReply,
  onReaction,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const isAtBottomRef = useRef(true);

  // Map messages to quick lookup map for replies
  const messageMap = useMemo(() => {
    return new Map(messages.map((m) => [m.id, m]));
  }, [messages]);

  // Flatten messages into a stream containing Date dividers and Messages
  const items: ListItem[] = useMemo(() => {
    const list: ListItem[] = [];
    let lastDateLabel = '';

    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i]!;
      const dateLabel = getDateGroupLabel(msg.timestamp);

      // Insert date divider when day changes
      if (dateLabel !== lastDateLabel) {
        lastDateLabel = dateLabel;
        list.push({
          kind: 'date',
          id: `date-${dateLabel}-${i}`,
          label: dateLabel,
        });
      }

      const nextMsg = messages[i + 1];
      const isOwn = msg.senderId === currentUserId;

      // Determine clustering: show avatar on last message of a continuous cluster
      const isNextSameSender =
        nextMsg &&
        nextMsg.senderId === msg.senderId &&
        shouldClusterMessages(msg.timestamp, nextMsg.timestamp);
      const showAvatar = !isNextSameSender;

      const sender = getUserById(msg.senderId);
      const replyMessage = msg.replyTo ? messageMap.get(msg.replyTo) : undefined;
      const replySender = replyMessage ? getUserById(replyMessage.senderId) : undefined;

      list.push({
        kind: 'message',
        id: msg.id,
        message: msg,
        isOwn,
        showAvatar,
        sender,
        replyMessage,
        replySender,
      });
    }

    return list;
  }, [messages, currentUserId, messageMap]);

  // Virtualizer for smooth handling of 10,000+ items
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => containerRef.current,
    estimateSize: (index) => {
      const item = items[index];
      if (item?.kind === 'date') return 40;
      if (item?.message.attachments && item.message.attachments.length > 0) return 160;
      return 68;
    },
    overscan: 10,
  });

  // Track scroll position for smart auto-scroll & jump button
  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const atBottom = distanceToBottom < 100;
    isAtBottomRef.current = atBottom;
    setShowScrollBottom(!atBottom);
  };

  // Auto-scroll when new messages arrive if user was already at bottom
  useEffect(() => {
    if (isAtBottomRef.current && items.length > 0) {
      // Defer slightly to ensure virtualizer layout recalculation
      const timer = setTimeout(() => {
        virtualizer.scrollToIndex(items.length - 1, { align: 'end' });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [items.length, virtualizer]);

  const scrollToBottom = () => {
    if (items.length > 0) {
      virtualizer.scrollToIndex(items.length - 1, { align: 'end', behavior: 'smooth' });
    }
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <EmptyState
          icon={MessageSquare}
          title="No messages yet"
          description="Send a message to start the conversation! You can also share files and images."
        />
      </div>
    );
  }

  return (
    <div className="relative flex-1 overflow-hidden bg-slate-50 dark:bg-slate-950/50">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-full overflow-y-auto px-2 sm:px-4 py-4"
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const item = items[virtualRow.index];
            if (!item) return null;

            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {item.kind === 'date' ? (
                  <div className="flex items-center justify-center my-3 select-none">
                    <span className="px-3 py-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-200/70 dark:bg-slate-800/80 rounded-full shadow-2xs backdrop-blur-xs">
                      {item.label}
                    </span>
                  </div>
                ) : (
                  <MessageItem
                    message={item.message}
                    isOwn={item.isOwn}
                    showAvatar={item.showAvatar}
                    sender={item.sender}
                    replyMessage={item.replyMessage}
                    replySender={item.replySender}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onReply={onReply}
                    onReaction={onReaction}
                    currentUserId={currentUserId}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Typing indicator bubble */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 mt-2 text-xs text-slate-500 dark:text-slate-400 animate-in fade-in">
            <div className="flex gap-1 p-2 rounded-xl bg-white dark:bg-slate-800 shadow-2xs border border-slate-200 dark:border-slate-700">
              <span className="typing-dot w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="typing-dot w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="typing-dot w-1.5 h-1.5 rounded-full bg-blue-500" />
            </div>
            <span>
              {typingUsers.map((id) => getUserById(id)?.name || 'Someone').join(', ')} is typing...
            </span>
          </div>
        )}
      </div>

      {/* Floating Scroll to Bottom button */}
      {showScrollBottom && (
        <button
          type="button"
          onClick={scrollToBottom}
          aria-label="Scroll to bottom"
          className="absolute bottom-4 right-4 p-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all hover:scale-105 active:scale-95 z-20"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
