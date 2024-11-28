import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import locationReducer from './slices/locationSlice';
import assetReducer from './slices/assetSlice';
import workOrderReducer from './slices/workOrderSlice';
import authReducer from './reducers/authReducer';
import vendorReducer from './slices/vendorSlice';
import partReducer from './slices/partSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['location', 'asset', 'workOrder'], 
};

const rootReducer = combineReducers({
  location: locationReducer,
  asset: assetReducer,
  workOrder: workOrderReducer, 
  auth: authReducer,
  vendor: vendorReducer,
  part: partReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
