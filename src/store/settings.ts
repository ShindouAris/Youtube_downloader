import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  theme: 'light' | 'dark';
  customBackendUrl: string;
  isCustomBackendEnabled: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  setCustomBackendUrl: (url: string) => void;
  toggleCustomBackend: () => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'light',
      customBackendUrl: 'http://localhost:8080',
      isCustomBackendEnabled: false,
      setTheme: (theme) => set({ theme }),
      setCustomBackendUrl: (url) => set({ customBackendUrl: url }),
      toggleCustomBackend: () => set((state) => ({ isCustomBackendEnabled: !state.isCustomBackendEnabled })),
    }),
    {
      name: 'youtube-downloader-settings',
    }
  )
);