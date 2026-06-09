import { ApiService } from './api.service';
import {
  Post,
  PostComment,
  PostCommentCreateInput,
  PostCreateInput,
  PostFilters,
  PostPaginatedResult,
  PostUpdateInput,
} from '@/models/post';

export class PostService {
  static async getPosts(
    params?: PostFilters & { page?: number; limit?: number },
  ): Promise<PostPaginatedResult> {
    const queryParams = new URLSearchParams();
    if (params) {
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.categoryId) queryParams.append('categoryId', params.categoryId);
      if (params.searchQuery) queryParams.append('q', params.searchQuery);
      if (params.tags) params.tags.forEach((tag) => queryParams.append('tags', tag));
    }
    const queryString = queryParams.toString();
    return ApiService.request<PostPaginatedResult>(
      `/post${queryString ? `?${queryString}` : ''}`,
    );
  }

  static async getPost(idOrSlug: string): Promise<Post> {
    return ApiService.request<Post>(`/post/${idOrSlug}`);
  }

  static async getPostBySlug(slug: string): Promise<Post> {
    return ApiService.request<Post>(`/post/slug/${slug}`);
  }

  static async getRelatedPosts(slug: string): Promise<Post[]> {
    return ApiService.request<Post[]>(`/post/slug/${slug}/related`);
  }

  static async createPost(data: PostCreateInput): Promise<Post> {
    return ApiService.request<Post>('/post', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updatePost(id: string, data: PostUpdateInput): Promise<Post> {
    return ApiService.request<Post>(`/post/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  static async deletePost(id: string): Promise<void> {
    return ApiService.request<void>(`/post/${id}`, {
      method: 'DELETE',
    });
  }

  static async incrementPostViews(postId: string): Promise<{ views: number }> {
    return ApiService.request<{ views: number }>(`/post/${postId}/views`, {
      method: 'POST',
    });
  }

  static async togglePostLike(
    postId: string,
  ): Promise<{ likes: number; isLiked: boolean }> {
    return ApiService.request<{ likes: number; isLiked: boolean }>(
      `/post/${postId}/like`,
      {
        method: 'POST',
      },
    );
  }

  static async getComments(postId: string): Promise<PostComment[]> {
    return ApiService.request<PostComment[]>(`/post/${postId}/comments`);
  }

  static async addComment(
    postId: string,
    data: PostCommentCreateInput,
  ): Promise<PostComment> {
    return ApiService.request<PostComment>(`/post/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}
