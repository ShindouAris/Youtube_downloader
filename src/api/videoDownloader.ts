import { VideoFormats, DownloadResponse } from '../types';
import { useSettings } from '../store/settings';

class VideoDownloader {
  private static instance: VideoDownloader;
  private readonly API_ACCESS_KEY: string = import.meta.env.VITE_API_ACCESS_KEY;
  private is_us_fail: boolean = false;

  private readonly BACKEND_URLS = {
    US: "https://arislab.june8th.us.eu.org",
    SG: "https://backend-yt-dlp.onrender.com"
  } as const;

  private constructor() {}

  public static getInstance(): VideoDownloader {
    if (!VideoDownloader.instance) {
      VideoDownloader.instance = new VideoDownloader();
    }
    return VideoDownloader.instance;
  }

  private rotate_backend_url(): string {
    return this.is_us_fail ? this.BACKEND_URLS.SG : this.BACKEND_URLS.US;
  }

  private getBaseUrl(): string {
    const settings = useSettings.getState();
    return settings.isCustomBackendEnabled ? settings.customBackendUrl : this.rotate_backend_url();
  }

  public async fetchVideoFormats(url: string): Promise<VideoFormats> {
    const backendurl = this.getBaseUrl();
    try {
      const res = await fetch(`${backendurl}/get_all_format`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_ACCESS_KEY}`
        },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) throw new Error(`Primary backend failed with status ${res.status}`);

      this.is_us_fail = false;
      return await res.json();
    } catch (err) {
      if (!this.is_us_fail) {
        this.is_us_fail = true;
        return await this.fetchVideoFormats(url);
      }

      console.error('Error fetching formats:', err);
      throw err;
    }
  }

  public async downloadVideo(url: string, format: string): Promise<DownloadResponse> {
    try {
      const response = await fetch(`${this.getBaseUrl()}/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_ACCESS_KEY}`
        },
        body: JSON.stringify({ url, format }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error starting download:', error);
      throw error;
    }
  }

  public getDownloadUrl(downloadLink: string): string | null {
    const download_link_regex: RegExp = /^\/files\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/gm;

    if (download_link_regex.test(downloadLink)) {
      return `${this.getBaseUrl()}${downloadLink}`;
    }

    return null;
  }
}

// Export singleton instance methods
const downloader = VideoDownloader.getInstance();
export const fetchVideoFormats = (url: string) => downloader.fetchVideoFormats(url);
export const downloadVideo = (url: string, format: string) => downloader.downloadVideo(url, format);
export const getDownloadUrl = (downloadLink: string) => downloader.getDownloadUrl(downloadLink);