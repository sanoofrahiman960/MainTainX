import { configureStore, combineReducers } from '@reduxjs/toolkit';
import locationReducer from './reducers/locationReducer';
import workorderReducer from './reducers/workorderReducer';

const rootReducer = combineReducers({
  location: locationReducer,
  workorder: workorderReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
