import React, { useState, useEffect } from 'react';
import { Video, Settings as SettingsIcon } from 'lucide-react';
import URLInput from './components/URLInput';
import FormatSelector from './components/FormatSelector';
import VideoInfo from './components/VideoInfo';
import DownloadButton from './components/DownloadButton';
import StatusMessage from './components/StatusMessage';
import DownloadHistory from './components/DownloadHistory';
import Settings from './components/Settings';
import HealthCheck from './components/HealthCheck';
import { fetchVideoFormats, downloadVideo, getDownloadUrl } from './api/videoDownloader';
import { getHistory, saveToHistory, clearHistory, removeFromHistory } from './utils/localStorage';
import { VideoFormats, FormatInfo, DownloadResponse, DownloadStatus } from './types';
import { useSettings } from './store/settings';
import GitHubButton from "./components/GitHub.tsx";

function App() {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoInfo, setVideoInfo] = useState<VideoFormats | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<FormatInfo | null>(null);
  const [downloadInfo, setDownloadInfo] = useState<DownloadResponse | null>(null);
  const [status, setStatus] = useState<DownloadStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [history, setHistory] = useState(getHistory());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const theme = useSettings((state) => state.theme);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleUrlSubmit = async (url: string) => {
    setVideoUrl(url);
    setVideoInfo(null);
    setSelectedFormat(null);
    setDownloadInfo(null);
    setStatus('fetching');
    setErrorMessage('');

    try {
      const formats = await fetchVideoFormats(url);
      setVideoInfo(formats);
      setStatus('selecting');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to fetch video information');
    }
  };

  const handleFormatSelect = (format: FormatInfo) => {
    setSelectedFormat(format);
  };

  const handleDownload = async () => {
    if (!videoUrl || !selectedFormat) return;

    setStatus('downloading');
    setDownloadInfo(null);

    try {
      const downloadResult = await downloadVideo(videoUrl, selectedFormat.format);
      setDownloadInfo(downloadResult);
      setStatus('ready');

      if (videoInfo) {
        const historyItem = saveToHistory({
          title: videoInfo.name,
          url: videoUrl,
          format: selectedFormat.format,
          formatLabel: selectedFormat.label,
          type: selectedFormat.type,
          downloadLink: getDownloadUrl(downloadResult.download_link)
        });

        setHistory(getHistory());
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to download video');
    }
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  const handleRemoveHistoryItem = (id: string) => {
    removeFromHistory(id);
    setHistory(getHistory());
  };

  return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-100 to-indigo-50'}`}>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex justify-end mb-4 gap-2">
            <HealthCheck />
            <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <SettingsIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-indigo-600 text-white p-3 rounded-full">
                <Video className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">
                Youtube, Tiktok, Facebook, or Instagram Downloader
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Enter a Youtube, Tiktok, Facebook, or Instagram URL, select your preferred format, and download videos quickly and easily.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <div className="space-y-6">
              <URLInput
                  onSubmit={handleUrlSubmit}
                  isLoading={status === 'fetching'}
                  disabled={status === 'downloading'}
              />

              {status !== 'idle' && (
                  <StatusMessage status={status} message={errorMessage} />
              )}

              {videoInfo && (
                  <VideoInfo videoInfo={videoInfo} />
              )}

              {videoInfo && (
                  <FormatSelector
                      formats={videoInfo.formats}
                      onSelect={handleFormatSelect}
                      isLoading={status === 'fetching'}
                  />
              )}

              {selectedFormat && (
                  <DownloadButton
                      downloadInfo={downloadInfo}
                      isLoading={status === 'downloading'}
                      onClick={handleDownload}
                      disabled={!selectedFormat || status === 'downloading'}
                  />
              )}
            </div>
          </div>

          {history.length > 0 && (
              <DownloadHistory
                  history={history}
                  onClearHistory={handleClearHistory}
                  onClearItem={handleRemoveHistoryItem}
              />
          )}

          <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>©2025 Kanatube 💙</p>
            <p className="mt-1">Copy right Kanatube - Running by ArisDev and ytdlp</p>
            
            <div className="flex justify-center gap-4 mt-4">
              <GitHubButton
                  repoUrl="https://github.com/ShindouAris/Youtube_downloader.git"
                  label="Frontend Repository"
                  className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg"
              />
              <GitHubButton
                  repoUrl="https://github.com/ShindouAris/Backend_yt-dlp.git"
                  label="Backend Repository"
                  className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black transition-all duration-300 shadow-md hover:shadow-lg"
              />
            </div>
          </footer>
          <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
      </div>
  );
}

export default App;