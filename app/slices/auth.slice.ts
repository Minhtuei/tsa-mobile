import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Role } from 'app/types/role';

export interface UserInfo {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  createdAt: string;
  verified: boolean;
  email: string;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userInfo: UserInfo | null;
}
const initialState: AuthState = {
  accessToken: '',
  refreshToken: '',
  userInfo: {
    id: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: '',
    createdAt: '',
    verified: false,
    email: '',
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserInfo | null>) {
      state.userInfo = action.payload;
    },
    setToken: (
      state,
      action: PayloadAction<{
        accessToken: string | null;
        refreshToken: string | null;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    removeUser(state) {
      state.userInfo = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { setUser, setToken, removeUser } = authSlice.actions;
export default authSlice.reducer;