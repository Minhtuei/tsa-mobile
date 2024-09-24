import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface AppState {
  colorScheme: string;
}
const initialState: AppState = {
  colorScheme: 'light',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setColorScheme(state, action: PayloadAction<string>) {
      state.colorScheme = action.payload;
    },
  },
});
export const { setColorScheme } = appSlice.actions;
export default appSlice.reducer;
