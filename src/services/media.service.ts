import { ApiService, withQuery } from './api.service';
import type { Media, MediaInput, MediaType } from '@/models/media';
import type { Pagination } from '@/models/settings';

export type MediaListParams = {
  folder?: string;
  type?: MediaType;
  q?: string;
  page?: number;
  limit?: number;
};

export type MediaItem = Media & {
  id: string;
  folder?: string;
  filename?: string;
  contentType?: string;
  sizeBytes?: number;
  createdAt?: string;
};

export type MediaListResult = {
  media: MediaItem[];
  pagination?: Pagination;
};

export class MediaService {
  static async list(params?: MediaListParams): Promise<MediaListResult> {
    return ApiService.request<MediaListResult>(withQuery('/media', params));
  }

  static async create(input: MediaInput): Promise<MediaItem> {
    return ApiService.request<MediaItem>('/media', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  static async delete(id: string): Promise<void> {
    return ApiService.request<void>(withQuery('/media', { id }), {
      method: 'DELETE',
    });
  }
}
