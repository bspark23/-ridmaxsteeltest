import { ApiService } from './api.service';
import { Content } from "@/models/content";

export class ContentService {
  // --- Content Methods ---
  static async getContent(): Promise<Content> {
    return ApiService.request<Content>("/content");
  }

  static async updateSiteContent(data: Partial<Content['siteContent']>): Promise<Content> {
    return ApiService.request<Content>("/content/site-content", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  static async updateSystemSettings(data: Partial<Content['systemSettings']>): Promise<Content> {
    return ApiService.request<Content>("/content/system-settings", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }
}
