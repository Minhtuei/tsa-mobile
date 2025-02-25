import { PayloadAction, createSlice } from '@reduxjs/toolkit';
type TimerType = {
  remainingTime: number;
  currentTime: number;
  isActive: boolean;
  timerData?: any;
};

const initialState: TimerType = {
  remainingTime: 0,
  currentTime: 0,
  isActive: false
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    startTimer: (state, action: PayloadAction<{ time: number }>) => {
      state.remainingTime = action.payload.time;
      state.currentTime = Date.now();
      state.isActive = true;
    },
    updateTimer: (state) => {
      if (state.remainingTime > 0) {
        state.remainingTime -= Math.round((Date.now() - state.currentTime) / 1000);
        state.currentTime = Date.now();
      } else {
        state.isActive = false;
        state.remainingTime = 0;
      }
    },
    stopTimer: (state) => {
      state.isActive = false;
    }
  }
});

export const { startTimer, updateTimer, stopTimer } = timerSlice.actions;
export default timerSlice.reducer;
