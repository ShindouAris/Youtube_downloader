import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface URLInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

const URLInput: React.FC<URLInputProps> = ({ onSubmit, isLoading, disabled }) => {
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState(true);

  const validateUrl = (input: string): boolean => {
    // Simple validation for YouTube URLs
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/.test(input);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setIsValid(false);
      return;
    }
    
    const isValidUrl = validateUrl(url);
    setIsValid(isValidUrl);
    
    if (isValidUrl) {
      onSubmit(url);
    }
  };

  const handleClear = () => {
    setUrl('');
    setIsValid(true);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`relative rounded-lg shadow-sm border-2 transition-all ${
        !isValid ? 'border-red-500' : (url ? 'border-indigo-500' : 'border-gray-300')
      }`}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className={`h-5 w-5 ${!isValid ? 'text-red-500' : 'text-gray-400'}`} />
        </div>
        
        <input
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (!isValid) setIsValid(true);
          }}
          disabled={disabled}
          placeholder="Paste YouTube URL here..."
          className="block w-full pl-10 pr-12 py-3 rounded-lg focus:outline-none focus:ring-0 disabled:bg-gray-100 disabled:text-gray-500"
        />
        
        {url && (
          <div className="absolute inset-y-0 right-12 flex items-center">
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600"
              disabled={disabled}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button
            type="submit"
            disabled={isLoading || disabled || !url}
            className={`h-full px-4 rounded-r-lg transition-all ${
              isLoading || disabled || !url
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isLoading ? 'Loading...' : 'Fetch'}
          </button>
        </div>
      </div>
      
      {!isValid && (
        <p className="mt-1 text-sm text-red-500">
          Please enter a valid YouTube URL
        </p>
      )}
    </form>
  );
};

export default URLInput;