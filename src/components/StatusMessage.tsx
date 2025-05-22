import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { DownloadStatus } from '../types';

interface StatusMessageProps {
  status: DownloadStatus;
  message?: string;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ status, message }) => {
  if (status === 'idle') return null;

  const getStatusConfig = () => {
    switch (status) {
      case 'fetching':
        return {
          icon: <Info className="h-5 w-5 text-blue-600" />,
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          defaultMessage: 'Fetching video information...'
        };
      case 'selecting':
        return {
          icon: <Info className="h-5 w-5 text-indigo-600" />,
          bgColor: 'bg-indigo-100',
          textColor: 'text-indigo-800',
          defaultMessage: 'Please select a format to download.'
        };
      case 'downloading':
        return {
          icon: <Info className="h-5 w-5 text-indigo-600" />,
          bgColor: 'bg-indigo-100',
          textColor: 'text-indigo-800',
          defaultMessage: 'Downloading video... This may take a moment.'
        };
      case 'ready':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-600" />,
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          defaultMessage: 'Download ready! Click the button to save your file.'
        };
      case 'error':
        return {
          icon: <AlertCircle className="h-5 w-5 text-red-600" />,
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          defaultMessage: 'Error occurred. Please try again.'
        };
      default:
        return {
          icon: <Info className="h-5 w-5 text-gray-600" />,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          defaultMessage: 'Processing your request...'
        };
    }
  };

  const { icon, bgColor, textColor, defaultMessage } = getStatusConfig();
  const displayMessage = message || defaultMessage;

  return (
    <div className={`${bgColor} ${textColor} px-4 py-3 rounded-lg flex items-center gap-2 animate-fade-in`}>
      {icon}
      <span>{displayMessage}</span>
    </div>
  );
};

export default StatusMessage;