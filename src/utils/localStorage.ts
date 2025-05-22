interface HistoryItem {
  id: string;
  title: string;
  url: string;
  format: string;
  formatLabel: string;
  type: 'video' | 'audio' | 'video+audio';
  downloadLink: string;
  timestamp: number;
}

const HISTORY_KEY = 'youtube_downloader_history';

export const saveToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>): HistoryItem => {
  const history = getHistory();
  const newItem = {
    ...item,
    id: crypto.randomUUID(),
    timestamp: Date.now()
  };
  
  // Add to beginning of array, limit to 10 items
  const updatedHistory = [newItem, ...history].slice(0, 10);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  
  return newItem;
};

export const getHistory = (): HistoryItem[] => {
  try {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error reading history from localStorage:', error);
    return [];
  }
};

export const clearHistory = (): void => {
  localStorage.removeItem(HISTORY_KEY);
};

export const removeFromHistory = (id: string): void => {
  const history = getHistory();
  const updatedHistory = history.filter(item => item.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
};