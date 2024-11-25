import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface AppState {
  colorScheme: string;
  isHideTabBar: boolean;
}
const initialState: AppState = {
  colorScheme: 'light',
  isHideTabBar: false
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
    }
  }
});
export const { setColorScheme, setHideTabBar } = appSlice.actions;
export default appSlice.reducer;
