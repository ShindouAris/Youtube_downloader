import React, { useState } from 'react';
import { FormatInfo } from '../types';
import { Video, Music, Download, Tv } from 'lucide-react';

interface FormatSelectorProps {
  formats: FormatInfo[];
  onSelect: (format: FormatInfo) => void;
  isLoading: boolean;
}

const FormatSelector: React.FC<FormatSelectorProps> = ({ formats, onSelect, isLoading }) => {
  const [filterType, setFilterType] = useState<string | null>(null);
  const [selectedFormatId, setSelectedFormatId] = useState<string | null>(null);

  const filteredFormats = filterType 
    ? formats.filter(format => format.type === filterType)
    : formats;

  // Process formats to add HDR and UltraHD flags
  const processedFormats = filteredFormats.map(format => ({
    ...format,
    isHDR: format.note?.toLowerCase().includes('hdr') || false,
    isUltraHD: format.video_format?.toLowerCase().includes('2160p') || 
               format.video_format?.toLowerCase().includes('4k') ||
               format.label.toLowerCase().includes('2160p') ||
               format.label.toLowerCase().includes('4k') || false
  }));
    
  const handleSelect = (format: FormatInfo) => {
    setSelectedFormatId(format.format);
    onSelect(format);
  };

  if (formats.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Select Format</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilterType(null)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              filterType === null 
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('video+audio')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              filterType === 'video+audio' 
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Video + Audio
          </button>
          <button
            onClick={() => setFilterType('video')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              filterType === 'video' 
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Video Only
          </button>
          <button
            onClick={() => setFilterType('audio-only')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              filterType === 'audio-only' 
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200' 
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Audio Only
          </button>
        </div>
      </div>

      <div className="overflow-y-auto max-h-60 space-y-2">
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : processedFormats.length === 0 ? (
          <p className="text-center py-4 text-gray-500 dark:text-gray-400">No formats match the selected filter</p>
        ) : (
          processedFormats.map((format) => (
            <div 
              key={format.format}
              onClick={() => handleSelect(format)}
              className={`cursor-pointer border rounded-lg p-3 flex items-center gap-3 transition-all ${
                selectedFormatId === format.format
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20'
              }`}
            >
              <div className="flex-shrink-0">
                {format.type === 'video+audio' && (
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                    <Download className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                )}
                {format.type === 'video' && (
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                    <Video className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
                {format.type === 'audio-only' && (
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                    <Music className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 dark:text-gray-100 truncate flex items-center gap-2">
                  {format.label}
                  <div className="flex gap-1">
                    {format.isHDR && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                        HDR
                      </span>
                    )}
                    {format.isUltraHD && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                        <Tv className="h-3 w-3 mr-1" />
                        4K
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {format.video_format && <span>{format.video_format}</span>}
                  {format.video_format && format.audio_format && <span> • </span>}
                  {format.audio_format && <span>{format.audio_format}</span>}
                </div>
                {format.note && !format.isHDR && (
                  <div className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">{format.note}</div>
                )}
              </div>
              
              <div className="flex-shrink-0">
                <div className={`w-4 h-4 rounded-full border ${
                  selectedFormatId === format.format
                    ? 'border-indigo-500 bg-indigo-500 dark:border-indigo-400 dark:bg-indigo-400'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {selectedFormatId === format.format && (
                    <div className="w-2 h-2 mx-auto mt-1 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FormatSelector;