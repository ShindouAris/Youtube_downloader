import React from 'react';
import { Download } from 'lucide-react';
import { DownloadResponse } from '../types';
import { getDownloadUrl } from '../api/videoDownloader';

interface DownloadButtonProps {
  downloadInfo: DownloadResponse | null;
  isLoading: boolean;
  onClick: () => void;
  disabled: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ 
  downloadInfo, 
  isLoading, 
  onClick,
  disabled
}) => {
  if (!downloadInfo && !isLoading) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full py-3 px-4 flex items-center justify-center gap-2 rounded-lg font-medium transition-all ${
          disabled
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-300'
        }`}
      >
        <Download className="h-5 w-5" />
        <span>Download</span>
      </button>
    );
  }

  if (isLoading) {
    return (
      <button
        disabled
        className="w-full py-3 px-4 bg-indigo-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 shadow-md"
      >
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
        <span>Downloading...</span>
      </button>
    );
  }

  if (downloadInfo) {
    return (
      <a
        href={getDownloadUrl(downloadInfo.download_link)}
        download={downloadInfo.filename}
        className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 shadow-md hover:bg-green-700 transition-all"
      >
        <Download className="h-5 w-5" />
        <span>Download {downloadInfo.filename}</span>
      </a>
    );
  }

  return null;
};

export default DownloadButton;