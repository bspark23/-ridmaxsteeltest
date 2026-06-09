import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserCreate, UserUpdateInput } from '@/models/user';
import { UserSettings } from '@/models/settings';
import { AuthService } from '@/services/auth.service';

interface AuthState {
  user: User | null;
  userSettings: UserSettings;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  userSettings: {
    locale: 'en-US',
    language: 'en',
    timezone: 'UTC',
    theme: 'light',
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: true,
    },
    boarded: false,
    currency: 'NGN', // Default to NGN
  },
  isAuthenticated: false,
  loading: true,
  error: null,
};

interface SignInCredentials {
  email: string;
  password: string;
}

// Async Thunks
export const signIn = createAsyncThunk<User, SignInCredentials, { rejectValue: string }>(
  'auth/signIn',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await AuthService.signIn(credentials);
      return response.user;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Sign in failed';
      return rejectWithValue(message);
    }
  }
);

export const signUp = createAsyncThunk<User, UserCreate, { rejectValue: string }>(
  'auth/signUp',
  async (data, { rejectWithValue }) => {
    try {
      const response = await AuthService.signUp(data);
      return response;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Sign up failed';
      return rejectWithValue(message);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk<User, void, { rejectValue: string }>(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      return await AuthService.getProfile();
    } catch (error: unknown) {
      // AuthService.signOut(); // Use signOut to clear localStorage
      const message =
        error instanceof Error ? error.message : 'Failed to fetch user';
      return rejectWithValue(message);
    }
  }
);

export const updateProfile = createAsyncThunk<User, UserUpdateInput, { rejectValue: string }>(
  'auth/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      return await AuthService.updateProfile(data);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Update profile failed';
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      AuthService.signOut();
    },
    updateUserSettings: (
      state,
      action: PayloadAction<Partial<UserSettings>>,
    ) => {
      state.userSettings = { ...state.userSettings, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    // Sign In
    builder.addCase(signIn.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(signIn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Sign Up
    builder.addCase(signUp.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(signUp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Current User
    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(fetchCurrentUser.rejected, (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    });

    // Update Profile
    builder.addCase(updateProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setUser, setLoading, logout, updateUserSettings } =
  authSlice.actions;
export default authSlice.reducer;
