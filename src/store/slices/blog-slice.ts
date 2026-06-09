import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { PostService } from '@/services/post.service';
import {
  Post,
  PostCreateInput,
  PostUpdateInput,
  PostFilters,
  PostSortBy,
  PostCommentCreateInput,
} from '@/models/post';

interface BlogState {
  posts: Post[];
  currentPost: Post | null;
  relatedPosts: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  error: string | null;
  filters: PostFilters;
  sortBy: PostSortBy;
  sortOrder: 'asc' | 'desc';
}

const initialState: BlogState = {
  posts: [],
  currentPost: null,
  relatedPosts: [],
  pagination: {
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0,
  },
  isLoading: false,
  error: null,
  filters: {},
  sortBy: PostSortBy.publishedAt,
  sortOrder: 'desc',
};

// Async thunks
export const fetchPosts = createAsyncThunk(
  'blog/fetchPosts',
  async ({
    filters,
    page = 1,
    limit = 9,
  }: {
    filters?: PostFilters;
    page?: number;
    limit?: number;
  } = {}) => {
      try {
        return await PostService.getPosts({ ...filters, page, limit });
      } catch {
      return {
        posts: [],
        pagination: {
          page: 1,
          limit: 9,
          total: 0,
          totalPages: 0,
        },
      };
    }
  }
);

export const fetchPostBySlug = createAsyncThunk(
  'blog/fetchPostBySlug',
  async ({ slug }: { slug: string }, { rejectWithValue }) => {
    try {
      return await PostService.getPost(slug);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch post';
      return rejectWithValue(message);
    }
  }
);

export const fetchRelatedPosts = createAsyncThunk(
  'blog/fetchRelatedPosts',
  async (slug: string, { rejectWithValue }) => {
    try {
      return await PostService.getRelatedPosts(slug);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch related posts';
      return rejectWithValue(message);
    }
  }
);

export const createPost = createAsyncThunk(
  'blog/createPost',
  async (postData: PostCreateInput, { rejectWithValue }) => {
    try {
      return await PostService.createPost(postData);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create post';
      return rejectWithValue(message);
    }
  }
);

export const updatePost = createAsyncThunk(
  'blog/updatePost',
  async (
    { id, postData }: { id: string; postData: PostUpdateInput },
    { rejectWithValue }
  ) => {
    try {
      return await PostService.updatePost(id, postData);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update post';
      return rejectWithValue(message);
    }
  }
);

export const deletePost = createAsyncThunk(
  'blog/deletePost',
  async (id: string, { rejectWithValue }) => {
    try {
      await PostService.deletePost(id);
      return id;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete post';
      return rejectWithValue(message);
    }
  }
);

export const incrementPostViews = createAsyncThunk(
  'blog/incrementPostViews',
  async (postId: string, { rejectWithValue }) => {
    try {
      const data = await PostService.incrementPostViews(postId);
      return { postId, views: data.views };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to increment views';
      return rejectWithValue(message);
    }
  }
);

export const togglePostLike = createAsyncThunk(
  'blog/togglePostLike',
  async (postId: string, { rejectWithValue }) => {
    try {
      const data = await PostService.togglePostLike(postId);
      return { postId, likes: data.likes, isLiked: data.isLiked };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to toggle like';
      return rejectWithValue(message);
    }
  }
);

export const fetchComments = createAsyncThunk(
  'blog/fetchComments',
  async (postId: string, { rejectWithValue }) => {
    try {
      const data = await PostService.getComments(postId);
      return { postId, comments: data };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch comments';
      return rejectWithValue(message);
    }
  }
);

export const addComment = createAsyncThunk(
  'blog/addComment',
  async (
    { postId, input }: { postId: string; input: PostCommentCreateInput },
    { rejectWithValue }
  ) => {
    try {
      const data = await PostService.addComment(postId, input);
      return { postId, comment: data };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to add comment';
      return rejectWithValue(message);
    }
  }
);

// Blog Slice
const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setCurrentPost: (state, action: PayloadAction<Post | null>) => {
      state.currentPost = action.payload;
    },
    setFilters: (state, action: PayloadAction<PostFilters>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setSortBy: (state, action: PayloadAction<BlogState['sortBy']>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<BlogState['sortOrder']>) => {
      state.sortOrder = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetBlogState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Fetch Posts
    builder.addCase(fetchPosts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.isLoading = false;
      
      const sortedPosts = [...action.payload.posts].sort((a, b) => {
        let aValue: number | string = 0;
        let bValue: number | string = 0;

        if (state.sortBy === 'stats.views') {
          aValue = a.stats.views;
          bValue = b.stats.views;
        } else if (state.sortBy === 'stats.likes') {
          aValue = a.stats.likes;
          bValue = b.stats.likes;
        } else {
          const key = state.sortBy as keyof Post;
          const aRaw = a[key];
          const bRaw = b[key];
          aValue = typeof aRaw === 'number' || typeof aRaw === 'string' ? aRaw : 0;
          bValue = typeof bRaw === 'number' || typeof bRaw === 'string' ? bRaw : 0;
        }

        if (state.sortOrder === 'asc') {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        } else {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
      });

      state.posts = sortedPosts;
      state.pagination = action.payload.pagination;
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch Post by Slug
    builder.addCase(fetchPostBySlug.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchPostBySlug.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentPost = action.payload;
    });
    builder.addCase(fetchPostBySlug.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch Related Posts
    builder.addCase(fetchRelatedPosts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchRelatedPosts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.relatedPosts = action.payload;
    });
    builder.addCase(fetchRelatedPosts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create Post
    builder.addCase(createPost.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      state.isLoading = false;
      state.posts.unshift(action.payload);
      state.pagination.total += 1;
    });
    builder.addCase(createPost.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update Post
    builder.addCase(updatePost.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updatePost.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.posts.findIndex(
        (post) => post.id === action.payload.id
      );
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
      if (state.currentPost?.id === action.payload.id) {
        state.currentPost = action.payload;
      }
    });
    builder.addCase(updatePost.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Delete Post
    builder.addCase(deletePost.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deletePost.fulfilled, (state, action) => {
      state.isLoading = false;
      state.posts = state.posts.filter((post) => post.id !== action.payload);
      state.pagination.total -= 1;
      if (state.currentPost?.id === action.payload) {
        state.currentPost = null;
      }
    });
    builder.addCase(deletePost.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Increment Post Views
    builder.addCase(incrementPostViews.fulfilled, (state, action) => {
      const { postId, views } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        post.stats.views = views;
      }
      if (state.currentPost?.id === postId) {
        state.currentPost.stats.views = views;
      }
    });

    // Toggle Post Like
    builder.addCase(togglePostLike.fulfilled, (state, action) => {
      const { postId, likes } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post) {
        post.stats.likes = likes;
      }
      if (state.currentPost?.id === postId) {
        state.currentPost.stats.likes = likes;
      }
    });

    // Fetch Comments
    builder.addCase(fetchComments.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      state.isLoading = false;
      if (state.currentPost && state.currentPost.id === action.payload.postId) {
        state.currentPost.comments = action.payload.comments;
      }
    });
    builder.addCase(fetchComments.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Add Comment
    builder.addCase(addComment.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(addComment.fulfilled, (state, action) => {
      state.isLoading = false;
      if (state.currentPost && state.currentPost.id === action.payload.postId) {
        if (!state.currentPost.comments) state.currentPost.comments = [];
        state.currentPost.comments.push(action.payload.comment);
        if (state.currentPost.stats) {
          state.currentPost.stats.commentCount += 1;
        }
      }
    });
    builder.addCase(addComment.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const {
  setCurrentPost,
  setFilters,
  clearFilters,
  setSortBy,
  setSortOrder,
  setCurrentPage,
  setLimit,
  clearError,
  resetBlogState,
} = blogSlice.actions;

export default blogSlice.reducer;
