import { configureStore, combineReducers } from '@reduxjs/toolkit';
import playQuizSlice from '../features/playQuiz/playQuiz.slice';
import authReducer from '../features/authentication/authentication.slice';
import { serviceSlice } from './serviceSlice';

const combinedReducer = combineReducers({
  playQuiz: playQuizSlice,
  authentication: authReducer,
  [serviceSlice.reducerPath]: serviceSlice.reducer,
});

const rootReducer = (state: any, action: any) => {
  return combinedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), serviceSlice.middleware],
});

export type RootState = ReturnType<typeof combinedReducer>;
