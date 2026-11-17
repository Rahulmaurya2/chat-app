/**
 * Mock data layer for the Chat Application.
 * Provides realistic seed data for conversations, users, and messages.
 * Completely isolated from UI components following clean architecture principles.
 */

import { v4 as uuidv4 } from 'uuid';
import type {
  User,
  Conversation,
  Message,
  UserId,
  ConversationId,
} from '../types';

/** Current authenticated user */
export const CURRENT_USER_ID: UserId = 'user-me';

/** All users in the system (including the current user) */
export const mockUsers: User[] = [
  {
    id: CURRENT_USER_ID,
    name: 'You',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix',
    status: 'online',
    email: 'me@chatapp.dev',
    bio: 'Full-stack developer | Coffee enthusiast',
  },
  {
    id: 'user-1',
    name: 'Sarah Chen',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah',
    status: 'online',
    lastSeen: new Date().toISOString(),
    email: 'sarah@example.com',
    bio: 'UX Designer at TechCorp',
  },
  {
    id: 'user-2',
    name: 'Marcus Johnson',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Marcus',
    status: 'away',
    lastSeen: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    email: 'marcus@example.com',
    bio: 'Backend engineer | Rust advocate',
  },
  {
    id: 'user-3',
    name: 'Emily Rodriguez',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Emily',
    status: 'offline',
    lastSeen: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    email: 'emily@example.com',
    bio: 'Product Manager | Dog mom 🐕',
  },
  {
    id: 'user-4',
    name: 'David Kim',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=David',
    status: 'online',
    lastSeen: new Date().toISOString(),
    email: 'david@example.com',
    bio: 'DevOps Engineer',
  },
  {
    id: 'user-5',
    name: 'Lisa Wang',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Lisa',
    status: 'busy',
    lastSeen: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    email: 'lisa@example.com',
    bio: 'Data Scientist | ML enthusiast',
  },
  {
    id: 'user-6',
    name: 'James Taylor',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=James',
    status: 'online',
    lastSeen: new Date().toISOString(),
    email: 'james@example.com',
    bio: 'Frontend Developer',
  },
  {
    id: 'user-7',
    name: 'Priya Sharma',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Priya',
    status: 'offline',
    lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    email: 'priya@example.com',
    bio: 'QA Lead | Testing advocate',
  },
];

/** Helper to get a user by ID */
export function getUserById(userId: UserId): User | undefined {
  return mockUsers.find((u) => u.id === userId);
}

/** Helper to get user map */
export function getUserMap(): ReadonlyMap<UserId, User> {
  return new Map(mockUsers.map((u) => [u.id, u]));
}

// ---- Time helpers for realistic message timestamps ----

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString();
}

function daysAgo(days: number, hours = 0): string {
  return new Date(
    Date.now() - (days * 24 + hours) * 60 * 60 * 1000
  ).toISOString();
}

// ---- Seed messages ----

export const mockMessages: Message[] = [
  // Conversation with Sarah Chen (user-1)
  {
    id: uuidv4(),
    conversationId: 'conv-1',
    senderId: 'user-1',
    content: 'Hey! Have you seen the new design specs for the dashboard?',
    timestamp: daysAgo(1, 5),
    type: 'text',
    status: 'read',
    isEdited: false,
    reactions: [{ emoji: '👍', userIds: [CURRENT_USER_ID] }],
    attachments: [],
  },
  {
    id: uuidv4(),
    conversationId: 'conv-1',
    senderId: CURRENT_USER_ID,
    content: 'Yes! The new layout looks great. I especially like the sidebar navigation changes.',
    timestamp: daysAgo(1, 4.5),
    type: 'text',
    status: 'read',
    isEdited: false,
    reactions: [],
    attachments: [],
  },
  {
    id: uuidv4(),
    conversationId: 'conv-1',
    senderId: 'user-1',
    content: 'Right? The collapsible panels were my idea 😄',
    timestamp: daysAgo(1, 4),
    type: 'text',
    status: 'read',
    isEdited: false,
    reactions: [{ emoji: '🎉', userIds: [CURRENT_USER_ID] }],
    attachments: [],
  },
  {
    id: uuidv4(),
    conversationId: 'conv-1',
    senderId: CURRENT_USER_ID,
    content: "Nice work! I'll start implementing the frontend components tomorrow.",
    timestamp: daysAgo(1, 3.5),
    type: 'text',
    status: 'read',
    isEdited: false,
    reactions: [],
    attachments: [],
  },
  {
    id: uuidv4(),
    conversationId: 'conv-1',
    senderId: 'user-1',
    content: 'Sounds perfect. Let me know if you need the Figma tokens exported.',
    timestamp: hoursAgo(2),
    type: 'text',
    status: 'read',
    isEdited: false,
    reactions: [],
    attachments: [],
  },
  {
    id: uuidv4(),
    conversationId: 'conv-1',
    senderId: CURRENT_USER_ID,
    content: 'Will do, thanks Sarah! 🙌',
    timestamp: hoursAgo(1),
    type: 'text',
    status: 'read',
    isEdited: false,
    reactions: [],
    attachments: [],
  },

  // Conversation with Marcus Johnson (user-2)
  {
    id: uuidv4(),
    conversationId: 'conv-2',
    senderId: 'user-2',
    content: 'The API endpoint for user auth is ready for testing.',
    timestamp: daysAgo(2, 8),
    type: 'text',
    status: 'read',
    isEdited: false,
    reactions: [],
    attachments: [],
  },
  {
    id: uuidv4(),
    conversationId: 'conv-2',
    senderId: CURRENT_USER_ID,
    content: 'Awesome! What\'s the base URL for the staging environment?',
    timestamp: daysAgo(2, 7),
    type: 'text',
    status: 'read',
    isEdited: false,
    reactions: [],
    attachments: [],
  },
  {
    id: uuidv4(),
    conversationId: 'conv-2',
    senderId: 'user-2',
    content: 'staging-api.example.com/v2 — I\'ve updated the Postman collection too.',
    timestamp: daysAgo(2, 6),
    type: 'text',
    status: 'read',
    isEdited: true,
    reactions: [{ emoji: '🔥', userIds: [CURRENT_USER_ID] }],
    attachments: [],
  },
  {
    id: uuidv4(),
    conversationId: 'conv-2',
    senderId: 'user-2',
    content: 'Also, I refactored the middleware to use async/await properly. No more callback hell 🎉',
    timestamp: hoursAgo(5),
    type: 'text',
    status: 'read',
    isEdited: false,
    reactions: [],
    attachments: [],
  },
  {
    id: uuidv4(),
    conversationId: 'conv-2',
    senderId: CURRENT_USER_ID,
    content: 'That\'s great to hear! The error handling was pretty rough before.',
    timestamp: hoursAgo(4),
    type: 'text',
    status: 'delivered',
    isEdited: false,
    reactions: [],
    attachments: [],
  },

  // Conversation with Emily Rodriguez (user-3)
  {
    id: uuidv4(),
    conversationId: 'conv-3',
    senderId: 'user-3',
    content: 'Sprint planning at 3 PM today. Can you prep the backlog items?',
    timestamp: hoursAgo(6),
    type: 'text',
    status: 'read',
    isEdited: false,
    reactions: [],
    attachments: [],
  },
  {
    id: uuidv4(),
    conversationId: 'conv-3',
    senderId: CURRENT_USER_ID,
    content: 'Sure! I\'ll have the estimates ready. Should I include the tech debt items too?',
    timestamp: hoursAgo(5.5),
    type: 'text',
    status: 'read',
    isEdited: false,
    reactions: [],
    attachments: [],
  },
  {
    id: uuidv4(),
    conversationId: 'conv-3',
    senderId: 'user-3',
    content: 'Yes please, we need to allocate at least 20% of the sprint for tech debt.',
    timestamp: hoursAgo(5),
    type: 'text',
    status: 'read',
    isEdited: false,
    reactions: [{ emoji: '✅', userIds: [CURRENT_USER_ID] }],
    attachments: [],
  },

  // Group: Engineering Team (conv-group-1)
  {
    id: uuidv4(),
    conversationId: 'conv-group-1',
    senderId: 'user-4',
    content: 'Team standup notes: CI pipeline is green again after the fix.',
    timestamp: daysAgo(1, 2),
    type: 'text',
    status: 'read',
    isEdited: false,
    reactions: [{ emoji: '🎉', userIds: ['user-1', 'user-2'] }],
    attachments: [],
  },
  {
    id: uuidv4(),
    conversationId: 'conv-group-1',
    senderId: 'user-1',
    content: 'Great job David! The flaky test was driving everyone crazy.',
    timestamp: daysAgo(1, 1.5),
    type: 'text',
    status: 'read',
    isEdited: false,
    reactions: [],
    attachments: [],
  },
  {
    id: uuidv4(),
    conversationId: 'conv-group-1',
    senderId: CURRENT_USER_ID,
    content: 'I\'ve pushed the PR for the new feature flag system. Can someone review?',
    timestamp: hoursAgo(3),
    type: 'text',
    status: 'delivered',
    isEdited: false,
    reactions: [],
    attachments: [],
  },
  {
    id: uuidv4(),
    conversationId: 'conv-group-1',
    senderId: 'user-2',
    content: 'I\'ll take a look after lunch. Ping me the PR link?',
    timestamp: hoursAgo(2.5),
    type: 'text',
    status: 'read',
    isEdited: false,
    reactions: [],
    attachments: [],
  },
  {
    id: uuidv4(),
    conversationId: 'conv-group-1',
    senderId: 'user-6',
    content: 'Also, reminder: we have the architecture review meeting on Thursday.',
    timestamp: minutesAgo(45),
    type: 'text',
    status: 'read',
    isEdited: false,
    reactions: [{ emoji: '👀', userIds: [CURRENT_USER_ID, 'user-4'] }],
    attachments: [],
  },

  // Group: Design Sync (conv-group-2)
  {
    id: uuidv4(),
    conversationId: 'conv-group-2',
    senderId: 'user-1',
    content: 'I\'ve uploaded the new brand guidelines to the shared drive.',
    timestamp: daysAgo(3, 2),
    type: 'text',
    status: 'read',
    isEdited: false,
    reactions: [],
    attachments: [],
  },
  {
    id: uuidv4(),
    conversationId: 'conv-group-2',
    senderId: 'user-5',
    content: 'Thanks Sarah! The color palette looks much more cohesive now.',
    timestamp: daysAgo(3, 1),
    type: 'text',
    status: 'read',
    isEdited: false,
    reactions: [{ emoji: '💜', userIds: ['user-1'] }],
    attachments: [],
  },
  {
    id: uuidv4(),
    conversationId: 'conv-group-2',
    senderId: CURRENT_USER_ID,
    content: 'Should we update the component library tokens to match?',
    timestamp: daysAgo(2, 5),
    type: 'text',
    status: 'read',
    isEdited: false,
    reactions: [],
    attachments: [],
  },
  {
    id: uuidv4(),
    conversationId: 'conv-group-2',
    senderId: 'user-1',
    content: 'Yes, I\'ll export the design tokens this week. We can use Style Dictionary to auto-generate the CSS variables.',
    timestamp: daysAgo(1, 8),
    type: 'text',
    status: 'read',
    isEdited: false,
    reactions: [{ emoji: '🚀', userIds: [CURRENT_USER_ID, 'user-5'] }],
    attachments: [],
  },

  // Conversation with David Kim (user-4)
  {
    id: uuidv4(),
    conversationId: 'conv-4',
    senderId: 'user-4',
    content: 'Hey, the Docker build is failing on the new Dockerfile. Can you check?',
    timestamp: minutesAgo(30),
    type: 'text',
    status: 'read',
    isEdited: false,
    reactions: [],
    attachments: [],
  },
  {
    id: uuidv4(),
    conversationId: 'conv-4',
    senderId: CURRENT_USER_ID,
    content: 'Looking into it now. Might be the multi-stage build config.',
    timestamp: minutesAgo(25),
    type: 'text',
    status: 'delivered',
    isEdited: false,
    reactions: [],
    attachments: [],
  },

  // Conversation with Lisa Wang (user-5)
  {
    id: uuidv4(),
    conversationId: 'conv-5',
    senderId: 'user-5',
    content: 'The ML model accuracy improved to 94.2% after the new training data! 📊',
    timestamp: daysAgo(1, 6),
    type: 'text',
    status: 'read',
    isEdited: false,
    reactions: [{ emoji: '🔥', userIds: [CURRENT_USER_ID] }],
    attachments: [],
  },
  {
    id: uuidv4(),
    conversationId: 'conv-5',
    senderId: CURRENT_USER_ID,
    content: 'Wow, that\'s a huge improvement! What was the key change?',
    timestamp: daysAgo(1, 5),
    type: 'text',
    status: 'read',
    isEdited: false,
    reactions: [],
    attachments: [],
  },
  {
    id: uuidv4(),
    conversationId: 'conv-5',
    senderId: 'user-5',
    content: 'Added augmented samples for edge cases. The confusion matrix looks much cleaner now.',
    timestamp: daysAgo(1, 4),
    type: 'text',
    status: 'read',
    isEdited: false,
    reactions: [],
    attachments: [],
  },

  // Conversation with James Taylor (user-6) - unread
  {
    id: uuidv4(),
    conversationId: 'conv-6',
    senderId: 'user-6',
    content: 'Hey, quick question about the React context setup.',
    timestamp: minutesAgo(15),
    type: 'text',
    status: 'delivered',
    isEdited: false,
    reactions: [],
    attachments: [],
  },
  {
    id: uuidv4(),
    conversationId: 'conv-6',
    senderId: 'user-6',
    content: 'Should we use a single provider or split it by feature?',
    timestamp: minutesAgo(14),
    type: 'text',
    status: 'delivered',
    isEdited: false,
    reactions: [],
    attachments: [],
  },
  {
    id: uuidv4(),
    conversationId: 'conv-6',
    senderId: 'user-6',
    content: 'I was thinking feature-level providers to avoid unnecessary re-renders.',
    timestamp: minutesAgo(10),
    type: 'text',
    status: 'delivered',
    isEdited: false,
    reactions: [],
    attachments: [],
  },
];

/** Sorted conversation list with computed last messages */
export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    type: 'direct',
    name: 'Sarah Chen',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah',
    participants: [CURRENT_USER_ID, 'user-1'],
    lastMessage: mockMessages.filter((m) => m.conversationId === 'conv-1').at(-1),
    unreadCount: 0,
    isPinned: true,
    isMuted: false,
    createdAt: daysAgo(30),
    updatedAt: hoursAgo(1),
  },
  {
    id: 'conv-2',
    type: 'direct',
    name: 'Marcus Johnson',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Marcus',
    participants: [CURRENT_USER_ID, 'user-2'],
    lastMessage: mockMessages.filter((m) => m.conversationId === 'conv-2').at(-1),
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    createdAt: daysAgo(20),
    updatedAt: hoursAgo(4),
  },
  {
    id: 'conv-3',
    type: 'direct',
    name: 'Emily Rodriguez',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Emily',
    participants: [CURRENT_USER_ID, 'user-3'],
    lastMessage: mockMessages.filter((m) => m.conversationId === 'conv-3').at(-1),
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    createdAt: daysAgo(15),
    updatedAt: hoursAgo(5),
  },
  {
    id: 'conv-4',
    type: 'direct',
    name: 'David Kim',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=David',
    participants: [CURRENT_USER_ID, 'user-4'],
    lastMessage: mockMessages.filter((m) => m.conversationId === 'conv-4').at(-1),
    unreadCount: 1,
    isPinned: false,
    isMuted: false,
    createdAt: daysAgo(10),
    updatedAt: minutesAgo(25),
  },
  {
    id: 'conv-5',
    type: 'direct',
    name: 'Lisa Wang',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Lisa',
    participants: [CURRENT_USER_ID, 'user-5'],
    lastMessage: mockMessages.filter((m) => m.conversationId === 'conv-5').at(-1),
    unreadCount: 0,
    isPinned: false,
    isMuted: true,
    createdAt: daysAgo(25),
    updatedAt: daysAgo(1, 4),
  },
  {
    id: 'conv-6',
    type: 'direct',
    name: 'James Taylor',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=James',
    participants: [CURRENT_USER_ID, 'user-6'],
    lastMessage: mockMessages.filter((m) => m.conversationId === 'conv-6').at(-1),
    unreadCount: 3,
    isPinned: false,
    isMuted: false,
    createdAt: daysAgo(5),
    updatedAt: minutesAgo(10),
  },
  {
    id: 'conv-group-1',
    type: 'group',
    name: 'Engineering Team',
    avatar: 'https://api.dicebear.com/9.x/identicon/svg?seed=engineering',
    participants: [CURRENT_USER_ID, 'user-1', 'user-2', 'user-4', 'user-6'],
    lastMessage: mockMessages
      .filter((m) => m.conversationId === 'conv-group-1')
      .at(-1),
    unreadCount: 2,
    isPinned: true,
    isMuted: false,
    createdAt: daysAgo(60),
    updatedAt: minutesAgo(45),
  },
  {
    id: 'conv-group-2',
    type: 'group',
    name: 'Design Sync',
    avatar: 'https://api.dicebear.com/9.x/identicon/svg?seed=design',
    participants: [CURRENT_USER_ID, 'user-1', 'user-3', 'user-5'],
    lastMessage: mockMessages
      .filter((m) => m.conversationId === 'conv-group-2')
      .at(-1),
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    createdAt: daysAgo(45),
    updatedAt: daysAgo(1, 8),
  },
];

/** Automated reply messages for simulating incoming responses */
export const autoReplyMessages: readonly string[] = [
  'Got it, thanks! 👍',
  "I'll look into this and get back to you.",
  'That makes sense. Let me check with the team.',
  'Sounds good! When do you need this by?',
  'Perfect, I was thinking the same thing.',
  "Great idea! Let's discuss this in our next standup.",
  "I've seen this before — try clearing the cache first.",
  'On it! Should be done by end of day.',
  "Can you share more details? I want to make sure I understand correctly.",
  "Absolutely! I'll create a ticket for this.",
  "That's a good catch. I'll fix it right away.",
  'Let me pull up the latest data and compare.',
];

/**
 * Get a random auto-reply message.
 */
export function getRandomReply(): string {
  const index = Math.floor(Math.random() * autoReplyMessages.length);
  return autoReplyMessages[index] ?? autoReplyMessages[0]!;
}

/**
 * Generate a large batch of mock messages for virtualization testing.
 * Creates `count` messages distributed across the given conversation.
 */
export function generateBulkMessages(
  conversationId: ConversationId,
  count: number
): Message[] {
  const senderIds: UserId[] = [CURRENT_USER_ID, 'user-1', 'user-2'];
  const sampleContents = [
    'Hey, how\'s the progress on the feature?',
    'Just pushed a new commit, check it out.',
    'The tests are passing now 🎉',
    'Can we schedule a quick sync?',
    'I found a bug in the payment flow.',
    'Fixed! The issue was in the validation logic.',
    'LGTM, approved the PR.',
    'Let\'s refactor this module next sprint.',
    'The deployment went smoothly.',
    'Great work team! 🚀',
    'Need help with the database migration.',
    'Documentation has been updated.',
    'The client loved the demo!',
    'Working on the mobile responsive layout.',
    'Code review comments addressed.',
  ];

  const messages: Message[] = [];

  for (let i = 0; i < count; i++) {
    const senderId = senderIds[i % senderIds.length]!;
    const content = sampleContents[i % sampleContents.length]!;
    const hoursOffset = count - i; // Older messages first

    messages.push({
      id: uuidv4(),
      conversationId,
      senderId,
      content: `${content} (#${i + 1})`,
      timestamp: new Date(
        Date.now() - hoursOffset * 5 * 60 * 1000
      ).toISOString(),
      type: 'text',
      status: 'read',
      isEdited: false,
      reactions: [],
      attachments: [],
    });
  }

  return messages;
}
