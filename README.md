# ChatSphere

A responsive chat app inspired by WhatsApp Web. Built with React, TypeScript, and Redux Toolkit, it includes conversation search, group chats, message reactions, and a simulated messaging service.

## Features

- Search conversations and filter by **All**, **Unread**, or **Groups**
- Send, edit, delete, and react to messages
- Create group conversations and manage their members
- Preview file and image attachments
- See simulated typing and message delivery status updates
- Switch between light and dark themes
- Use the responsive layout on desktop and mobile
- Browse long conversations with virtualized message rendering
- Keep chat and theme state in browser `localStorage`

> **Note:** Messaging is simulated locally; this project does not connect to a chat backend.

## Quick start

### Requirements

- Node.js 18 or later
- npm 9 or later

### Install and run

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |
| `npx vitest run` | Run the test suite |

## Tech stack

| Technology | Use |
| --- | --- |
| React 19 + TypeScript | User interface and type-safe application code |
| Vite | Development server and production build |
| Tailwind CSS 4 | Styling |
| Redux Toolkit | Chat and UI state |
| React Hook Form + Zod | Form handling and validation |
| TanStack Virtual | Virtualized message lists |
| Vitest + Testing Library | Unit and component tests |

## Project structure

```text
src/
├── components/ui/        # Shared UI components
├── features/chat/
│   ├── components/       # Chat interface
│   ├── hooks/            # Chat and responsive behavior
│   ├── services/         # Mock data and messaging simulation
│   ├── slices/           # Redux store and state slices
│   └── types/            # Chat types
├── tests/                # Unit and component tests
├── utils/                # Shared utilities
├── App.tsx
└── main.tsx
```

## How it works

Chat components use feature hooks to read and update Redux state. The chat service simulates message delivery, typing indicators, and automated replies. Chat data and theme preferences are stored in the browser, so they persist between visits to the same browser.

## Try it out

1. Search for a conversation or use the sidebar filters.
2. Select a chat and send a message. Use **Enter** to send or **Shift + Enter** for a new line.
3. Use the message actions to react, edit, copy, reply, or delete.
4. Create a group from the sidebar and manage its members from the group conversation.
5. Toggle the theme and resize the browser to try the responsive layout.
