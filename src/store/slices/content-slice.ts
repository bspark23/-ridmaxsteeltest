import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { Content } from '@/models/content';
import { ContentService } from '@/services/content.service';
import { SITE_CONTENT, SYSTEM_SETTINGS } from '@/constants/content';

interface ContentState {
  content: Content;
  isLoading: boolean;
  error: string | null;
}

const initialState: ContentState = {
  content: {
    siteContent: {
      home: {
        section1: {
          title: '',
          body: '',
        },
      },
    },
    systemSettings: {
      siteName: '',
      siteLogo: '',
      siteIcon: '',
      siteUrl: '',
      siteSlogan: '',
      siteGraphImage: '',
      siteKeywords: [],
      siteDescription: '',
      siteAuthor: '',
      siteLocale: '',
      siteType: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      ogImageAlt: '',
      twitterCard: '',
      twitterSite: '',
      twitterCreator: '',
      twitterTitle: '',
      twitterDescription: '',
      twitterImage: '',
      maintenanceMode: false,
      headerLinks: [],
      footerLinks: [],
      socialLinks: [],
      contact: {
        email: '',
        phones: [],
        whatsappPhone: '',
        addresses: [],
        map: '',
      },
    },
  },
  isLoading: true,
  error: null,
};

// Async thunks
export const fetchSiteContent = createAsyncThunk(
  'content/fetchSiteContent',
  async () => {
    try {
      return await ContentService.getContent();
    } catch (error: unknown) {      
      return {
        siteContent: SITE_CONTENT,
        systemSettings: SYSTEM_SETTINGS,
      };
    }
  },
);

export const updateSiteContent = createAsyncThunk<
  Content,
  Partial<Content['siteContent']>
>(
  'content/updateSiteContent',
  async (
    siteContent: Partial<Content['siteContent']>,
    { rejectWithValue },
  ) => {
    try {
      return await ContentService.updateSiteContent(siteContent);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to update site content';
      return rejectWithValue(message);
    }
  },
);

export const updateSystemSettings = createAsyncThunk<
  Content,
  Partial<Content['systemSettings']>
>(
  'content/updateSystemSettings',
  async (
    systemSettings: Partial<Content['systemSettings']>,
    { rejectWithValue },
  ) => {
    try {
      return await ContentService.updateSystemSettings(systemSettings);
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to update system settings';
      return rejectWithValue(message);
    }
  },
);

// Content Slice
const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setSiteContent: (state, action: PayloadAction<Content>) => {
      state.content = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch System Settings
    builder.addCase(fetchSiteContent.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchSiteContent.fulfilled, (state, action) => {
      state.isLoading = false;
      state.content = action.payload;
    });
    builder.addCase(fetchSiteContent.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
    // Update Site Content
    builder.addCase(updateSiteContent.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateSiteContent.fulfilled, (state, action) => {
      state.isLoading = false;
      state.content = action.payload;
    });
    builder.addCase(updateSiteContent.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(updateSystemSettings.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateSystemSettings.fulfilled, (state, action) => {
      state.isLoading = false;
      state.content = action.payload;
    });
    builder.addCase(updateSystemSettings.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setSiteContent } = contentSlice.actions;

export default contentSlice.reducer;
