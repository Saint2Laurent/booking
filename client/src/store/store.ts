import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';
import { usePersistFn } from '@umijs/hooks';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth ']
};

const rootReducer = combineReducers({
  auth: authReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer
});

const persistor = persistStore(store);
export { store, persistor };
