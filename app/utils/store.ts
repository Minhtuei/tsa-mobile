import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@slices/auth.slice';
import appReducer from '@slices/app.slice';
import timerReducer from '@slices/timer.slice';
import { apiService } from '@services/api.service';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer,
    timer: timerReducer,
    [apiService.reducerPath]: apiService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiService.middleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
