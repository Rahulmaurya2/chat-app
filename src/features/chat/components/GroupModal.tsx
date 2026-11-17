import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, UserMinus, Check, Users } from 'lucide-react';
import { Modal, Button, Avatar } from '@/components/ui';
import {
  useAppSelector,
  useAppDispatch,
  addGroupMember,
  removeGroupMember,
  createGroupConversation,
} from '../slices';
import { mockUsers, CURRENT_USER_ID, getUserById } from '../services';
import type { UserId } from '../types';

const createGroupSchema = z.object({
  name: z
    .string()
    .min(2, 'Group name must be at least 2 characters')
    .max(50, 'Group name must be under 50 characters'),
});

type CreateGroupFormValues = z.infer<typeof createGroupSchema>;

export interface GroupModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export const GroupModal: React.FC<GroupModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const activeConversationId = useAppSelector(
    (state) => state.ui.activeConversationId
  );
  const conversations = useAppSelector((state) => state.chat.conversations);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );
  const isEditingExisting = activeConversation?.type === 'group';

  // Toggle between Manage existing group and Create new group
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>(
    isEditingExisting ? 'manage' : 'create'
  );

  // Selected participants for group creation
  const [selectedUserIds, setSelectedUserIds] = useState<UserId[]>([]);

  // Selected user to add to existing group
  const [userToAdd, setUserToAdd] = useState<UserId>('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateGroupFormValues>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: { name: '' },
  });

  const availableUsers = mockUsers.filter((u) => u.id !== CURRENT_USER_ID);

  const toggleSelectUser = (id: UserId) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uId) => uId !== id) : [...prev, id]
    );
  };

  const handleCreateGroup = (data: CreateGroupFormValues) => {
    if (selectedUserIds.length === 0) {
      alert('Please select at least one other participant!');
      return;
    }

    dispatch(
      createGroupConversation({
        name: data.name,
        participants: selectedUserIds,
      })
    );

    reset();
    setSelectedUserIds([]);
    onClose();
  };

  const handleAddMember = () => {
    if (!userToAdd || !activeConversation) return;
    dispatch(
      addGroupMember({
        conversationId: activeConversation.id,
        userId: userToAdd,
      })
    );
    setUserToAdd('');
  };

  const handleRemoveMember = (userId: UserId) => {
    if (!activeConversation) return;
    dispatch(
      removeGroupMember({
        conversationId: activeConversation.id,
        userId,
      })
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEditingExisting && activeTab === 'manage'
          ? `Manage "${activeConversation.name}"`
          : 'Create New Group'
      }
      size="md"
    >
      {/* Mode Switch tabs if active chat is a group */}
      {isEditingExisting && (
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-5 pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('manage')}
            className={`flex-1 py-2 text-sm font-semibold text-center border-b-2 transition-colors ${
              activeTab === 'manage'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Manage Members
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-2 text-sm font-semibold text-center border-b-2 transition-colors ${
              activeTab === 'create'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Create New Group
          </button>
        </div>
      )}

      {/* Tab 1: Manage Existing Group */}
      {isEditingExisting && activeTab === 'manage' ? (
        <div className="space-y-5">
          {/* Add member select */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Add Member to Group
            </label>
            <div className="flex gap-2">
              <select
                value={userToAdd}
                onChange={(e) => setUserToAdd(e.target.value)}
                className="flex-1 h-10 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="">Select a user to add...</option>
                {availableUsers
                  .filter((u) => !activeConversation.participants.includes(u.id))
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.status})
                    </option>
                  ))}
              </select>
              <Button
                type="button"
                onClick={handleAddMember}
                disabled={!userToAdd}
                size="sm"
                className="h-10"
              >
                <UserPlus className="w-4 h-4 mr-1.5" />
                Add
              </Button>
            </div>
          </div>

          {/* Members List */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
              Current Members ({activeConversation.participants.length})
            </h4>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto pr-1">
              {activeConversation.participants.map((userId) => {
                const member = getUserById(userId);
                const isMe = userId === CURRENT_USER_ID;
                if (!member) return null;

                return (
                  <div
                    key={userId}
                    className="flex items-center justify-between py-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar
                        src={member.avatar}
                        alt={member.name}
                        size="sm"
                        status={member.status}
                      />
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{member.name}</span>
                          {isMe && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">{member.email}</p>
                      </div>
                    </div>

                    {!isMe && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(userId)}
                        title="Remove from group"
                        aria-label={`Remove ${member.name} from group`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: Create New Group */
        <form onSubmit={handleSubmit(handleCreateGroup)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Group Name *
            </label>
            <input
              type="text"
              {...register('name')}
              placeholder="e.g. Design Sync, Project Alpha..."
              className="w-full h-10 px-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Select Participants ({selectedUserIds.length} selected)
            </label>
            <div className="max-h-56 overflow-y-auto space-y-1.5 border border-slate-200 dark:border-slate-800 rounded-xl p-2 bg-slate-50/50 dark:bg-slate-900/50">
              {availableUsers.map((user) => {
                const isSelected = selectedUserIds.includes(user.id);
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => toggleSelectUser(user.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors text-left ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar
                        src={user.avatar}
                        alt={user.name}
                        size="sm"
                        status={user.status}
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-400">{user.bio}</p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={selectedUserIds.length === 0}
            >
              <Users className="w-4 h-4 mr-1.5" />
              Create Group
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
