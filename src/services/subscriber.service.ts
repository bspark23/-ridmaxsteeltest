import { ApiService, withQuery } from './api.service';
import type { Subscriber, SubscriberType } from '@/models/subscriber';
import type { Pagination } from '@/models/settings';

export type SubscribersListParams = {
  q?: string;
  type?: SubscriberType;
  page?: number;
  limit?: number;
};

export type SubscribersListResult = {
  subscribers: Subscriber[];
  pagination?: Pagination;
};

export class SubscriberService {
  static async list(
    params?: SubscribersListParams,
  ): Promise<SubscribersListResult> {
    const data = await ApiService.request<SubscribersListResult | Subscriber[]>(
      withQuery('/subscriber', params),
    );

    if (Array.isArray(data)) {
      return { subscribers: data };
    }

    return {
      subscribers: data.subscribers ?? [],
      pagination: data.pagination,
    };
  }

  static async createSubscribe(data: Partial<Subscriber>): Promise<Subscriber> {
    return ApiService.request<Subscriber>('/subscriber', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async get(id: string): Promise<Subscriber> {
    return ApiService.request<Subscriber>(`/subscriber/${id}`);
  }

  static async remove(id: string): Promise<void> {
    return ApiService.request<void>(`/subscriber/${id}`, { method: 'DELETE' });
  }
}
