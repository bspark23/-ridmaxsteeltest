export type MediaType = 'image' | 'video' | 'audio' | 'document';
export interface Media {
  url: string;
  alt?: string;
  type: MediaType;
  caption?: string;
  width?: number;
  height?: number;
}

export interface MediaInput {
  folder: string;        // required (used in storage path) (default: 'images' | 'videos' | 'audios' | 'documents')
  filename?: string;     // optional (auto-generated if missing)
  contentType: string;   // required
  dataBase64: string;    // required (raw base64 or data:...;base64,...)
  type: MediaType; // required
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
}
