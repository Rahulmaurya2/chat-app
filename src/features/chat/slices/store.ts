/**
 * Redux Store Configuration.
 * Combines chat and UI slices into a single store with proper TypeScript types.
 */

import { configureStore } from '@reduxjs/toolkit';
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from 'react-redux';
import chatReducer from './chatSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    ui: uiReducer,
  },
  devTools: import.meta.env.DEV,
});

/** Root state type inferred from the store */
export type RootState = ReturnType<typeof store.getState>;

/** Dispatch type inferred from the store */
export type AppDispatch = typeof store.dispatch;

/** Pre-typed useDispatch hook */
export const useAppDispatch: () => AppDispatch = useDispatch;

/** Pre-typed useSelector hook */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
