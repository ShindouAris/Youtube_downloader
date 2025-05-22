import React from 'react';
import { VideoFormats } from '../types';

interface VideoInfoProps {
  videoInfo: VideoFormats | null;
}

const VideoInfo: React.FC<VideoInfoProps> = ({ videoInfo }) => {
  if (!videoInfo) return null;

  // YouTube thumbnail URL derivation - assuming we can extract video ID from title or other info
  const getYoutubeId = (name: string): string | null => {
    // This is a simplified approach - in reality, we'd extract from the original URL
    const regex = /\[([a-zA-Z0-9_-]{11})\]/;
    const match = name.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getYoutubeId(videoInfo.name);
  const thumbnailUrl = videoId 
    ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` 
    : null;

  return (
    <div className="flex flex-col sm:flex-row items-center bg-white rounded-lg shadow-md p-4 animate-fade-in">
      {thumbnailUrl && (
        <div className="sm:w-1/3 w-full mb-4 sm:mb-0 sm:mr-4">
          <div className="rounded-md overflow-hidden aspect-video bg-gray-200">
            <img 
              src={thumbnailUrl} 
              alt={videoInfo.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      )}
      
      <div className={thumbnailUrl ? "sm:w-2/3 w-full" : "w-full"}>
        <h2 className="text-xl font-semibold text-gray-800 line-clamp-2">
          {videoInfo.name}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {videoInfo.formats.length} available formats
        </p>
      </div>
    </div>
  );
};

export default VideoInfo;