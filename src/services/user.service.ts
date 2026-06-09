import { ApiService } from './api.service';
import type { User, UserCreate, UserRole, UserUpdateInput } from '@/models/user';
import type { Pagination } from '@/models/settings';

export type UsersListParams = {
  role?: UserRole;
  q?: string;
  page?: number;
  limit?: number;
};

export type UsersListResult = {
  users: User[];
  pagination?: Pagination;
};

function qs(params?: Record<string, unknown>) {
  if (!params) return '';
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    query.set(key, String(value));
  }
  const s = query.toString();
  return s ? `?${s}` : '';
}

export class UserService {
  
  static async list(params?: UsersListParams): Promise<UsersListResult> {
    return ApiService.request<UsersListResult>(`/user${qs(params)}`);
  }
  static async create(input: UserCreate): Promise<User> {
    return ApiService.request<User>('/user', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  static async update(uid: string, input: UserUpdateInput): Promise<User> {
    return ApiService.request<User>(`/user/${uid}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  }


  static async getById(uid: string): Promise<User> {
    return ApiService.request<User>(`/user/${uid}`);
  }
}
