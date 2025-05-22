import React, { useState } from 'react';
import { Settings as SettingsIcon, Sun, Moon, Server, X } from 'lucide-react';
import { useSettings } from '../store/settings';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const { 
    theme, 
    customBackendUrl, 
    isCustomBackendEnabled,
    setTheme, 
    setCustomBackendUrl, 
    toggleCustomBackend 
  } = useSettings();
  
  const [tempUrl, setTempUrl] = useState(customBackendUrl);

  const handleUrlSave = () => {
    setCustomBackendUrl(tempUrl);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 m-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Theme Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
            <div className="mt-2 flex gap-3">
              <button
                onClick={() => setTheme('light')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  theme === 'light'
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                <Sun className="h-4 w-4" />
                Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                <Moon className="h-4 w-4" />
                Dark
              </button>
            </div>
          </div>

          {/* Backend URL Configuration */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Custom Backend URL
              </label>
              <button
                onClick={toggleCustomBackend}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isCustomBackendEnabled ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isCustomBackendEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="mt-2 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  disabled={!isCustomBackendEnabled}
                  placeholder="http://localhost:8080"
                  className={`flex-1 px-3 py-2 border rounded-lg ${
                    isCustomBackendEnabled
                      ? 'border-gray-300 dark:border-gray-600'
                      : 'bg-gray-100 border-gray-200 dark:bg-gray-700 dark:border-gray-600'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                <button
                  onClick={handleUrlSave}
                  disabled={!isCustomBackendEnabled}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    isCustomBackendEnabled
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Server className="h-4 w-4" />
                  Save
                </button>
              </div>
              {isCustomBackendEnabled && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Make sure the backend server is running at the specified URL
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;