import React from 'react';
import { Trash2, Video, Music, Download, ExternalLink } from 'lucide-react';

interface HistoryItem {
  id: string;
  title: string;
  url: string;
  format: string;
  formatLabel: string;
  type: 'video' | 'audio-only' | 'video+audio';
  downloadLink: string;
  timestamp: number;
}

interface DownloadHistoryProps {
  history: HistoryItem[];
  onClearHistory: () => void;
  onClearItem: (id: string) => void;
}

const DownloadHistory: React.FC<DownloadHistoryProps> = ({ 
  history, 
  onClearHistory,
  onClearItem
}) => {
  if (history.length === 0) return null;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getFormatIcon = (type: string) => {
    switch (type) {
      case 'video+audio':
        return <Download className="h-4 w-4 text-indigo-600" />;
      case 'video':
        return <Video className="h-4 w-4 text-blue-600" />;
      case 'audio-only':
        return <Music className="h-4 w-4 text-green-600" />;
      default:
        return <Download className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-4 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Download History</h2>
        <button
          onClick={onClearHistory}
          className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
        >
          <Trash2 className="h-4 w-4" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="space-y-3 max-h-60 overflow-y-auto">
        {history.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-lg p-3">
            <div className="flex justify-between">
              <div className="font-medium text-gray-900 truncate max-w-[70%]">{item.title}</div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{formatDate(item.timestamp)}</span>
                <button
                  onClick={() => onClearItem(item.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                {getFormatIcon(item.type)}
                <span>{item.formatLabel}</span>
              </div>
              
              <a
                href={item.downloadLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Download</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DownloadHistory;