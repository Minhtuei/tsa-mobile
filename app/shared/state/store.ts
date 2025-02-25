import { configureStore } from '@reduxjs/toolkit';
import authReducer from 'app/shared/state/auth.slice';
import appReducer from 'app/shared/state/app.slice';
import timerReducer from 'app/shared/state/timer.slice';
import socketReducer from 'app/shared/state/socket.slice';
import { apiService } from '@services/api.service';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    app: appReducer,
    timer: timerReducer,
    socket: socketReducer,
    [apiService.reducerPath]: apiService.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiService.middleware)
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
