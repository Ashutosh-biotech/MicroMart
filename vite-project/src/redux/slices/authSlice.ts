import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../api/services/auth.services';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  token: string | null;
  refreshToken: string | null;
  error: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  error: null,
  loading: false,
};

// Async thunk for logout
export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState };
    const { token, refreshToken } = state.auth;
    
    try {
      if (token || refreshToken) {
        await authService.logout(token, refreshToken);
      }
      // Only clear localStorage on successful backend call
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

// Async thunk for token validation with refresh fallback
export const validateToken = createAsyncThunk(
  'auth/validateToken',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { auth: AuthState };
    const { token, refreshToken } = state.auth;
    
    if (!token) return rejectWithValue('No token found');
    
    try {
      const response = await authService.validateToken(token);
      return response;
    } catch (error: any) {
      // Token expired, try refresh
      if (refreshToken) {
        try {
          const refreshResponse = await authService.refreshToken(refreshToken);
          localStorage.setItem('token', refreshResponse.token);
          localStorage.setItem('refreshToken', refreshResponse.refreshToken);
          return {
            user: {
              fullName: refreshResponse.fullName,
              email: refreshResponse.email
            },
            token: refreshResponse.token,
            refreshToken: refreshResponse.refreshToken
          };
        } catch (refreshError: any) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          return rejectWithValue('Session expired');
        }
      }
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      return rejectWithValue('Token validation failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<{ user: any; token: string; refreshToken: string }>) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.error = null;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
    },
    loginFailure(state, action: PayloadAction<{ error: string }>) {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload.error;
      state.token = null;
      localStorage.removeItem('token');
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validateToken.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        if ('token' in action.payload && action.payload.token) {
          state.token = action.payload.token;
        }
        if ('refreshToken' in action.payload && action.payload.refreshToken) {
          state.refreshToken = action.payload.refreshToken;
        }
        state.error = null;
      })
      .addCase(validateToken.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.error = action.payload as string;
      })
      .addCase(logoutAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.error = null;
        state.loading = false;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Don't clear auth state on logout failure
      });
  }
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setToken
} = authSlice.actions;
export default authSlice.reducer;
