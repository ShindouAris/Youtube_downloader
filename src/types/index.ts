export interface FormatInfo {
  type: 'video' | 'audio-only' | 'video+audio';
  format: string;
  label: string;
  video_format: string | null;
  audio_format: string | null;
  note: string | null;
  isPremium?: boolean;
  isUltraHD?: boolean;
}

export interface VideoFormats {
  name: string;
  formats: FormatInfo[];
}

export interface DownloadResponse {
  message: string;
  filename: string;
  download_link: string;
}

export interface ErrorResponse {
  detail: string;
}

export type DownloadStatus = 'idle' | 'fetching' | 'selecting' | 'downloading' | 'ready' | 'error';