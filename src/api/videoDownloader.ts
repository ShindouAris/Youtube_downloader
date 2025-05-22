import { VideoFormats, DownloadResponse } from '../types';
import { useSettings } from '../store/settings';

function getBaseUrl(): string {
  const settings = useSettings.getState();
  return settings.isCustomBackendEnabled ? settings.customBackendUrl : 'https://arislab.june8th.us.eu.org';
}

export async function fetchVideoFormats(url: string): Promise<VideoFormats> {
  try {
    const response = await fetch(`${getBaseUrl()}/get_all_format`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching formats:', error);
    throw error;
  }
}

export async function downloadVideo(url: string, format: string): Promise<DownloadResponse> {
  try {
    const response = await fetch(`${getBaseUrl()}/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

export function getDownloadUrl(downloadLink: string): string {
  return `${getBaseUrl()}${downloadLink}`;
}