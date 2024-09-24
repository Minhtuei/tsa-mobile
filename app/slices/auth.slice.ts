import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Role } from 'app/types/role';
export interface UserType {
  name: string | null;
  token: string | null;
  role: Role | null;
  refreshToken: string | null;
}

interface AuthState {
  user: UserType;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: {
    name: null,
    token: null,
    role: null,
    refreshToken: null,
  },
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserType>) {
      state.user = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setToken: (
      state,
      action: PayloadAction<{ token: string; refreshToken: string }>
    ) => {
      state.user.token = action.payload.token;
      state.user.refreshToken = action.payload.refreshToken;
    },
    removeUser(state) {
      state.user = {
        name: null,
        token: null,
        refreshToken: null,
        role: null,
      };
    },
  },
});

export const { setUser, setLoading, setToken, removeUser } = authSlice.actions;
export default authSlice.reducer;
