import { VideoFormats, DownloadResponse } from '../types';
import { useSettings } from '../store/settings';

let is_us_fail: boolean = false;

const BackendUrls = {
  US: "https://arislab.june8th.us.eu.org",
  SG: "https://backend-yt-dlp.onrender.com"
};

function rotate_backend_url(): string {
  return is_us_fail ? BackendUrls.SG : BackendUrls.US;
}

function getBaseUrl(): string {
  const settings = useSettings.getState();
  return settings.isCustomBackendEnabled ? settings.customBackendUrl : rotate_backend_url();
}

export async function fetchVideoFormats(url: string): Promise<VideoFormats> {
  const backendurl = getBaseUrl();
  try {
    const res = await fetch(`${backendurl}/get_all_format`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    if (!res.ok) throw new Error(`Primary backend failed with status ${res.status}`);

    is_us_fail = false;
    return await res.json();
  } catch (err) {
    if (!is_us_fail) {
      is_us_fail = true;
      return await fetchVideoFormats(url);
    }

    console.error('Error fetching formats:', err);
    throw err;
  }
}

export async function downloadVideo(url: string, format: string): Promise<DownloadResponse> {
  try {
    const response = await fetch(`${getBaseUrl()}/download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

export function getDownloadUrl(downloadLink: string): string | null {
  const download_link_regex: RegExp = /^\/files\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/gm;

  if (download_link_regex.test(downloadLink)) {
    return `${getBaseUrl()}${downloadLink}`;
  }

  return null;
}
