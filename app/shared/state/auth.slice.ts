import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Role } from 'app/shared/types/role';

export interface UserInfo {
  id: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role: string;
  createdAt: string;
  verified: boolean;
  email: string;
  photoUrl?: string;
  dormitory?: string;
  building?: string;
  room?: string;
  status: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
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
    photoUrl: '',
    dormitory: '',
    building: '',
    room: '',
    status: 'AVAILABLE'
  }
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
    }
  }
});

export const { setUser, setToken, removeUser } = authSlice.actions;
export default authSlice.reducer;
