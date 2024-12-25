import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface AppState {
  colorScheme: string;
  isHideTabBar: boolean;
  unReadNotificationCount: number;
}
const initialState: AppState = {
  colorScheme: 'light',
  isHideTabBar: false,
  unReadNotificationCount: 0
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setColorScheme(state, action: PayloadAction<string>) {
      state.colorScheme = action.payload;
    },
    setHideTabBar(state, action: PayloadAction<boolean>) {
      state.isHideTabBar = action.payload;
    },
    setUnReadNotificationCount(state, action: PayloadAction<number>) {
      state.unReadNotificationCount = action.payload;
    },
    setReadNotifcation(state) {
      if (state.unReadNotificationCount > 0) {
        state.unReadNotificationCount -= 1;
      }
    },
    setReadAllNotification(state) {
      state.unReadNotificationCount = 0;
    }
  }
});
export const {
  setColorScheme,
  setHideTabBar,
  setReadNotifcation,
  setReadAllNotification,
  setUnReadNotificationCount
} = appSlice.actions;
export default appSlice.reducer;
