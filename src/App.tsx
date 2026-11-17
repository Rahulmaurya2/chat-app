import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './features/chat/slices/store';
import {
  useAppSelector,
  useAppDispatch,
  setGroupModalOpen,
  setIsMobile,
} from './features/chat/slices';
import { Sidebar, ChatWindow, GroupModal } from './features/chat/components';

const ChatAppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);
  const isMobile = useAppSelector((state) => state.ui.isMobile);
  const activeConversationId = useAppSelector(
    (state) => state.ui.activeConversationId
  );
  const isGroupModalOpen = useAppSelector(
    (state) => state.ui.isGroupModalOpen
  );

  // Sync dark class on <html>
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Responsive breakpoint tracking
  useEffect(() => {
    const checkMobile = () => {
      dispatch(setIsMobile(window.innerWidth < 768));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [dispatch]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 antialiased">
      {/* Mobile view logic: switch between Sidebar and ChatWindow */}
      {isMobile ? (
        activeConversationId ? (
          <ChatWindow />
        ) : (
          <Sidebar />
        )
      ) : (
        /* Desktop view: side by side layout */
        <>
          <Sidebar />
          <ChatWindow />
        </>
      )}

      {/* Group Modal for creating / managing members */}
      <GroupModal
        isOpen={isGroupModalOpen}
        onClose={() => dispatch(setGroupModalOpen(false))}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ChatAppContent />
    </Provider>
  );
};

export default App;
