import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Socket } from 'socket.io-client';
import { WritableDraft } from 'immer';

interface SocketState {
  socket: WritableDraft<Socket> | null;
  messages: string[];
}

const initialState: SocketState = {
  socket: null,
  messages: []
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocket(state, action: PayloadAction<WritableDraft<Socket> | null>) {
      state.socket = action.payload;
    },
    addMessage(state, action: PayloadAction<string>) {
      state.messages.push(action.payload);
    }
  }
});

export const { setSocket, addMessage } = socketSlice.actions;
export default socketSlice.reducer;
