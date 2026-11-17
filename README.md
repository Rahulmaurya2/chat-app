# ChatSphere — Modern Production-Grade Chat Application

A high-performance, accessible, responsive chat application built with **React 19**, **TypeScript (Strict Mode)**, **Tailwind CSS v4**, **Redux Toolkit**, **React Hook Form + Zod**, **Lucide Icons**, and **Vitest**. Inspired by Slack and WhatsApp Web.

Designed and implemented with Senior / Principal Frontend engineering standards: immaculate type safety, domain-driven modular feature architecture, decoupled mock simulation layer, and virtualized message rendering for 10,000+ items.

---

## 🚀 Live Demo & Key Highlights

- **⚡ Blazing Fast Architecture**: Zero `any` types, strict TypeScript configuration, sub-millisecond Redux slice updates.
- **🎨 Modern UI/UX**: Slack/WhatsApp-inspired design with seamless dark/light mode toggle, custom scrollbars, and micro-animations.
- **📜 10,000+ Virtualized Messages**: Integrated `@tanstack/react-virtual` with dynamic height measurement, smart auto-scrolling, and scroll-to-bottom indicators.
- **💬 Real-Time Simulation Engine**: Completely isolated `chatService` powering realistic automated replies, typing indicators, and delivery progression (`sending` → `sent` → `delivered` → `read`).
- **🛡️ Resilient Data Persistence**: Automatic state synchronization with `localStorage`, with atomic restore and instant data reset.
- **🧪 100% Passing Test Suite**: 29 comprehensive unit & integration tests covering reducers, date helpers, debounced search, and UI components via Vitest & React Testing Library.

---

## 🛠️ Tech Stack & Decisions

| Technology | Purpose | Rationale / Engineering Trade-off |
| :--- | :--- | :--- |
| **Vite 6 + React 19** | Core Framework | Instant HMR, minimal build overhead, modern ES module bundling. |
| **TypeScript (Strict Mode)** | Type Safety | Zero `any`, typed IDs (`UserId`, `ConversationId`, `MessageId`), strict null checks, and immutable contract types. |
| **Tailwind CSS v4** | Design System | CSS variables, container queries, native `@custom-variant dark`, zero runtime CSS-in-JS performance penalty. |
| **Redux Toolkit (RTK)** | Global State | Predictable state mutations, Immer-powered drafts, DevTools inspectability, and clear separation of domain slices (`chat` vs `ui`). |
| **@tanstack/react-virtual** | Virtualization | Renders only visible message nodes + buffer, preventing DOM bloat with 10,000+ items without layout jitter. |
| **React Hook Form + Zod** | Form Management | Uncontrolled form inputs for minimum re-renders, strongly typed validation schemas for message composer & group forms. |
| **Lucide Icons** | Iconography | Tree-shakeable SVG icons adhering to clean modern design language. |
| **Vitest + Testing Library** | Unit & Integration Tests | Native Vite integration, blazing fast execution, JSDOM environment. |

---

## 📁 Architecture & Folder Structure

We adhere to a **domain-driven feature-based architecture** where business logic, presentation, and services remain strictly decoupled:

```text
chat-app/
├── src/
│   ├── components/                 # Global / shared UI primitives (Dumb components)
│   │   └── ui/
│   │       ├── Avatar.tsx          # Status dot, size variants, image error fallback
│   │       ├── Badge.tsx           # Unread counts & numerical pills
│   │       ├── Button.tsx          # Polymorphic button with variants & loading state
│   │       ├── Dropdown.tsx        # Accessible dropdown menu with click-outside
│   │       ├── EmptyState.tsx      # Graceful fallbacks for empty searches/lists
│   │       ├── LoadingSkeleton.tsx # Shimmer skeletons for conversations and messages
│   │       ├── Modal.tsx           # Portal-based modal with backdrop & escape key
│   │       ├── SearchInput.tsx     # Debounced input with clear button
│   │       └── index.ts            # Public barrel export
│   │
│   ├── features/                   # Domain feature modules
│   │   └── chat/
│   │       ├── components/         # Chat-specific domain components
│   │       │   ├── ChatHeader.tsx       # Participant status, typing banner, call actions
│   │       │   ├── ChatWindow.tsx       # Main layout orchestrator
│   │       │   ├── ConversationItem.tsx # Sidebar row (memoized, status, unread badge)
│   │       │   ├── GroupModal.tsx       # Create group & manage members modal
│   │       │   ├── MessageInput.tsx     # Auto-growing textarea, attachments, reply preview
│   │       │   ├── MessageItem.tsx      # Bubble, status ticks, hover toolbar, reactions
│   │       │   ├── MessageList.tsx      # Virtualized list, date dividers, auto-scroll
│   │       │   ├── Sidebar.tsx          # Conversation list, search, filters, user footer
│   │       │   └── index.ts
│   │       ├── hooks/              # Custom hooks isolating business logic
│   │       │   ├── useAutoScroll.ts     # Intelligent scroll-to-bottom behavior
│   │       │   ├── useChat.ts           # Message sending, editing, reactions, auto-reply
│   │       │   ├── useConversations.ts  # Filtering, searching, sorting conversations
│   │       │   ├── useResponsive.ts     # Window resize & mobile breakpoint sync
│   │       │   └── index.ts
│   │       ├── services/           # Decoupled mock data & simulation service
│   │       │   ├── chatService.ts       # Timers, delivery progression, persistence
│   │       │   ├── mockData.ts          # Realistic users, seed conversations, bulk generator
│   │       │   └── index.ts
│   │       ├── slices/             # Redux Toolkit store & domain slices
│   │       │   ├── chatSlice.ts         # Messages, conversations, reactions, groups
│   │       │   ├── uiSlice.ts           # Sidebar state, theme, filters, active modal
│   │       │   ├── store.ts             # Redux root configuration & typed hooks
│   │       │   └── index.ts
│   │       └── types/              # Comprehensive TypeScript interfaces
│   │           └── index.ts
│   │
│   ├── utils/                      # Pure functional utilities
│   │   ├── cn.ts                   # Tailwind class merge helper
│   │   ├── dateFormatters.ts       # Date clustering & human-readable formatting
│   │   ├── helpers.ts              # Clipboard, debounce, file size, initials
│   │   └── index.ts
│   │
│   ├── tests/                      # Automated Vitest test suite
│   │   ├── setup.ts                # JSDOM polyfills & matchMedia mocks
│   │   ├── chatSlice.test.ts       # 10 unit tests for chat actions
│   │   ├── uiSlice.test.ts         # 7 unit tests for UI state & theme
│   │   ├── dateFormatters.test.ts  # 5 unit tests for date logic
│   │   ├── SearchInput.test.tsx    # 3 unit tests for debounced search
│   │   ├── ConversationItem.test.tsx # 2 component integration tests
│   │   └── MessageItem.test.tsx    # 2 component integration tests
│   │
│   ├── App.tsx                     # Top-level layout & theme coordinator
│   ├── index.css                   # Tailwind v4 directives & keyframe animations
│   └── main.tsx                    # React DOM root mounting
```

---

## 📊 System Architecture & Data Flow Diagram

The application implements strict unidirectional data flow. UI components do not handle timers or raw storage directly; custom hooks orchestrate Redux dispatches and interface with the mock service layer:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                               USER ACTIONS                             │
│       (Type message, click reaction, toggle theme, search chat)        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                            REACT COMPONENTS                            │
│    (Sidebar, ConversationItem, MessageList, MessageItem, MessageInput)  │
│                                                                        │
│       • Completely "Dumb" & memoized                                   │
│       • No inline simulation timers                                    │
│       • Delegate handlers to custom hooks                              │
└───────────────────────────────────▲────────────────────────────────────┘
                                    │ Call actions / Select state
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                              CUSTOM HOOKS                              │
│         (useChat, useConversations, useAutoScroll, useResponsive)      │
│                                                                        │
│       • Encapsulate UI state & memoized selectors                      │
│       • Provide debounced search & active conversation filtering       │
│       • Trigger mock simulation events                                 │
└──────────────────┬─────────────────────────────────┬───────────────────┘
                   │ Dispatch actions                │ Register / Trigger
                   ▼                                 ▼
┌───────────────────────────────────┐    ┌───────────────────────────────┐
│         REDUX TOOLKIT STORE       │    │      CHAT SERVICE LAYER       │
│                                   │    │       (chatService.ts)        │
│   • chatSlice:                    │    │                               │
│     - messages (Optimistic state) │    │   • Status Progression:       │
│     - conversations & unreads     │◀───│     sending -> sent -> read   │
│     - reactions & group members   │    │   • Auto-reply simulation     │
│   • uiSlice:                      │    │   • Typing indicator timers   │
│     - theme, activeConversation   │    │   • localStorage Sync         │
│     - searchQuery, activeFilter   │    │   • Bulk message generator    │
└──────────────────┬────────────────┘    └───────────────┬───────────────┘
                   │                                     │
                   └──────────────────┬──────────────────┘
                                      │ Read / Write
                                      ▼
                         ┌─────────────────────────┐
                         │   BROWSER LOCALSTORAGE  │
                         │   (Persistence Engine)  │
                         └─────────────────────────┘
```

---

## 💡 Key Architectural Trade-offs & Engineering Decisions

### 1. State Management: Redux Toolkit vs. Zustand
- **Decision**: Implemented **Redux Toolkit** with modular feature slices (`chatSlice`, `uiSlice`).
- **Rationale**: Redux Toolkit's opinionated structure enforces explicit action types, immutable state updates through Immer, and time-travel debugging in Redux DevTools. Slices allow separation between persistent chat domain state and ephemeral UI states (such as active search queries and modal visibility).

### 2. Message Virtualization with Dynamic Height
- **Decision**: Integrated `@tanstack/react-virtual` instead of a static list.
- **Challenge**: Chat messages have variable heights depending on text length, image attachments, replied quote previews, and emoji reactions.
- **Solution**: The list items are modeled as a unified stream of `Date` dividers and `Message` items. The virtualizer measures elements dynamically via `virtualizer.measureElement`, supporting instant scrolling through **10,000+ messages** at 60 FPS without DOM thrashing.

### 3. Smart Auto-Scroll vs. Aggressive Snapping
- **Decision**: Implemented a proximity-based threshold auto-scroll in `useAutoScroll`.
- **Rationale**: In real-world chat apps, forcing scroll to the bottom when the user has scrolled up to inspect message history frustrates users. Our hook tracks whether the user is within 150px of the bottom:
  - If at bottom: automatically pins to the latest incoming message.
  - If scrolled up: retains scroll position and displays a floating "Jump to Latest" button.

### 4. Optimistic UI Updates & Delivery Progression
- **Decision**: Messages appear instantaneously in the chat history with a `'sending'` status.
- **Rationale**: Eliminates perceived network latency. A decoupled background timer progression in `chatService` transitions the message status:
  1. `sending` (clock icon) immediately on submit.
  2. `sent` (single checkmark) at 500ms.
  3. `delivered` (double checkmark) at 1500ms.
  4. `read` (double blue checkmarks) at 3000ms.
  5. Auto-reply simulation triggers realistic typing indicators before responding.

### 5. Separation of Concerns & Clean Code
- **Components are "dumb"**: `MessageItem` and `ConversationItem` only render props and pass events upward.
- **Zero Business Logic in JSX**: All state alterations, confirmation alerts, and service invocations reside within `useChat` and Redux reducers.
- **Complete Test Isolation**: Unit tests test pure reducer functions and individual components with mocked environments, yielding sub-second execution.

---

## 📦 Installation & Setup Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Clone & Navigate
```bash
git clone <repository-url>
cd QuantumHeapsAssisment/chat-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
The application will be accessible at: `http://localhost:5173/`

### 4. Run TypeScript Check
```bash
npx tsc --noEmit
```

### 5. Run Vitest Test Suite
```bash
npx vitest run
```

### 6. Build for Production
```bash
npm run build
npm run preview
```

---

## 🧪 Automated Test Coverage Summary

Our test suite consists of **29 passing tests across 6 suites**:

```text
✓ src/tests/uiSlice.test.ts (7 tests)
  - toggles sidebar state
  - sets sidebar explicitly
  - sets active conversation and resets message edit/reply states
  - toggles theme and updates localStorage
  - sets search query and filter tabs
  - manages modal open state
  - manages mobile view and mutual exclusivity of edit/reply

✓ src/tests/chatSlice.test.ts (10 tests)
  - handles sending a message with optimistic sending status
  - handles receiving an incoming message
  - updates message delivery status progression
  - edits a message and marks it as isEdited
  - deletes a message
  - toggles an emoji reaction
  - marks a conversation as read and resets unread count
  - manages typing indicators
  - adds and removes group members
  - creates a new group conversation

✓ src/tests/SearchInput.test.tsx (3 tests)
  - renders input with placeholder and search icon
  - debounces onChange events by specified ms
  - clears input when clicking clear button

✓ src/tests/dateFormatters.test.ts (5 tests)
  - formats conversation time for today as hour:minute
  - formats conversation time for yesterday as "Yesterday"
  - formats date group label for today as "Today"
  - formats date group label for yesterday as "Yesterday"
  - clusters messages sent within 2 minutes of each other

✓ src/tests/ConversationItem.test.tsx (2 tests)
  - renders conversation name, last message snippet, and unread count
  - fires onClick when clicked

✓ src/tests/MessageItem.test.tsx (2 tests)
  - renders message content, edited badge, and reaction count
  - triggers reaction callback on click

Test Files:  6 passed (6)
Tests:       29 passed (29)
```

---

## 🌟 Interactive Feature Tour

1. **Sidebar Navigation**:
   - Filter conversations between **All**, **Unread**, and **Groups**.
   - Search contacts, groups, and message snippets with real-time 300ms debouncing.
   - Pinned chats always remain at the top.
   - Click the **Sparkles** icon in the sidebar header to test performance by dynamically injecting **1,000 mock messages** into the active conversation.

2. **Messaging & Media**:
   - Send messages with `Enter` (or `Shift + Enter` for new lines).
   - Attach images or files with preview thumbnail cards generated via `URL.createObjectURL`.
   - Hover over any message to access quick emoji reactions, copy to clipboard, quote reply, edit (for your own messages), or delete.
   - Watch status checkmarks dynamically progress from single check to double blue checks.

3. **Group Management**:
   - Click the **UserPlus** icon to open the **Group Modal**.
   - Validate group creation with Zod (enforces non-empty names and member selection).
   - In active group chats, click the group header to inspect members, add new teammates, or remove participants.

4. **Appearance & Responsiveness**:
   - Toggle seamlessly between **Light Mode** and **Dark Mode** via the Sun/Moon button; preferences persist across reloads.
   - Responsive layout automatically switches to a mobile single-pane drawer when viewport width `< 768px`.
#   c h a t - a p p  
 