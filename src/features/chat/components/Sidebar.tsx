import React from 'react';
import {
  MessageSquare,
  Sun,
  Moon,
  UserPlus,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { SearchInput, EmptyState, Avatar } from '@/components/ui';
import { ConversationItem } from './ConversationItem';
import { useConversations } from '../hooks';
import {
  useAppDispatch,
  useAppSelector,
  toggleTheme,
  setSearchQuery,
  setActiveFilter,
  setGroupModalOpen,
  resetState,
  loadBulkMessages,
} from '../slices';
import { getUserById, CURRENT_USER_ID, generateBulkMessages } from '../services';
import type { ConversationFilter } from '../types';

export interface SidebarProps {
  readonly className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);
  const activeConversationId = useAppSelector(
    (state) => state.ui.activeConversationId
  );
  const currentUser = getUserById(CURRENT_USER_ID);

  const {
    filteredConversations,
    activeFilter,
    searchQuery,
    selectConversation,
    totalUnread,
  } = useConversations();

  const handleFilterClick = (filter: ConversationFilter) => {
    dispatch(setActiveFilter(filter));
  };

  const handleCreateGroup = () => {
    dispatch(setGroupModalOpen(true));
  };

  const handleResetData = () => {
    if (window.confirm('Reset all conversations and messages to default state?')) {
      dispatch(resetState());
    }
  };

  const handleLoadBulkMessages = () => {
    if (!activeConversationId) {
      alert('Please select a conversation first to load bulk messages into!');
      return;
    }
    const bulk = generateBulkMessages(activeConversationId, 1000);
    dispatch(loadBulkMessages(bulk));
    alert('Loaded 1,000 mock messages into active conversation! Virtualizer handles it smoothly.');
  };

  const filterTabs: Array<{ id: ConversationFilter; label: string; count?: number }> = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread', count: totalUnread },
    { id: 'groups', label: 'Groups' },
  ];

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 w-full md:w-80 lg:w-96 select-none',
        className
      )}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 text-white shadow-xs">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
              ChatSphere
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">
              Senior Frontend Studio
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Virtualizer benchmark action */}
          <button
            type="button"
            onClick={handleLoadBulkMessages}
            title="Performance Test: Inject 1,000 messages"
            aria-label="Performance Test: Inject 1,000 messages"
            className="p-2 rounded-lg text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          {/* New Group Button */}
          <button
            type="button"
            onClick={handleCreateGroup}
            title="Create New Group"
            aria-label="Create New Group"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={() => dispatch(toggleTheme())}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="px-3 pt-3 pb-2">
        <SearchInput
          value={searchQuery}
          onChange={(query) => dispatch(setSearchQuery(query))}
          placeholder="Search chats, groups or messages..."
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 px-3 py-1.5">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleFilterClick(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
            >
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && tab.count > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-600 text-white font-bold">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={conversation.id === activeConversationId}
              onClick={() => selectConversation(conversation.id)}
            />
          ))
        ) : (
          <EmptyState
            icon={MessageSquare}
            title="No conversations found"
            description={
              searchQuery
                ? `No chats matching "${searchQuery}"`
                : 'No chats match the current filter.'
            }
          />
        )}
      </div>

      {/* User Footer Profile & Reset Action */}
      <div className="flex items-center justify-between p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar
            src={currentUser?.avatar}
            alt={currentUser?.name || 'You'}
            size="sm"
            status="online"
          />
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {currentUser?.name || 'You'}
            </p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              Online
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetData}
          title="Reset to default mock state"
          aria-label="Reset mock data"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
