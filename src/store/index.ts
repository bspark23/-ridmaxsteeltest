import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import type { PersistPartial } from 'redux-persist/es/persistReducer';
import storage from '@/lib/redux-storage';

import auth from './slices/auth-slice';
import content from './slices/content-slice';
import blog from './slices/blog-slice';
import ui from './slices/ui-slice';

// IMPORT OTHERS HERE

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'content', 'blog', 'ui'],
};

const rootReducer = combineReducers({
  auth,
  content,
  blog,
  ui,
});

const persistedReducer = persistReducer<ReturnType<typeof rootReducer>>(
  persistConfig,
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/FLUSH',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PERSIST',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer> & PersistPartial;
