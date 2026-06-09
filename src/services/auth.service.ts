import { ApiService } from './api.service';
import { User, UserCreate, UserUpdateInput } from "@/models/user";

export class AuthService {
  static async signIn(credentials: { email: string; password: string }) {
    const data = await ApiService.request<{ user: User; accessToken: string; refreshToken: string }>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Store tokens on success
    if (data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  }

  static async signUp(userData: UserCreate) {
    return ApiService.request<User>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  static async forgotPassword(email: string) {
    return ApiService.request<void>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  static async signOut() {
    localStorage.clear();
    if (typeof window !== "undefined") {
      window.location.href = '/';
    }
  }

  static async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    const data = await ApiService.request<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
    
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.accessToken;
  }

  static async getProfile(): Promise<User> {
    return ApiService.request<User>("/auth/profile");
  }

  static async updateProfile(data: UserUpdateInput): Promise<User> {
    return ApiService.request<User>(`/auth/profile`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  static async changePassword(data: { currentPassword: string; newPassword: string }) {
    return ApiService.request<void>(`/auth/password`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}
