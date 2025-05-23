import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { useSettings } from '../store/settings';

interface ServerStatus {
    name: string;
    url: string;
    status: 'online' | 'offline' | 'checking';
}

const BackendUrls = {
    US: "https://arislab.june8th.us.eu.org",
    SG: "https://backend-yt-dlp.onrender.com"
};

const HealthCheck: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [servers, setServers] = useState<ServerStatus[]>([
        { name: 'US Server', url: BackendUrls.US, status: 'checking' },
        { name: 'SG Server', url: BackendUrls.SG, status: 'checking' }
    ]);
    const settings = useSettings.getState();
    // const { isCustomBackendEnabled, customBackendUrl } = useSettings.getState();

    useEffect(() => {
        if (isOpen) {
            const checkHealth = async () => {
                const updatedServers = await Promise.all(
                    servers.map(async (server) => {
                        try {
                            const response = await fetch(`${server.url}/`);
                            return { ...server, status: response.ok ? 'online' : 'offline' };
                        } catch {
                            return { ...server, status: 'offline' };
                        }
                    })
                );
                setServers(updatedServers);
            };

            checkHealth();
            const interval = setInterval(checkHealth, 30000);
            return () => clearInterval(interval);
        }
    }, [isOpen]);

    useEffect(() => {
        if (settings.isCustomBackendEnabled && isOpen) {
            setServers(prev => {
                const existing = prev.filter(s => s.url !== settings.customBackendUrl);
                return [...existing, { name: 'Custom Server', url: settings.customBackendUrl, status: 'checking' }];
            });
        } else {
            setServers(prev => prev.filter(s => s.url !== settings.customBackendUrl));
        }
    }, [settings.isCustomBackendEnabled, settings.customBackendUrl, isOpen]);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
                <Activity className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Server Status</h3>
                    </div>

                    <div className="space-y-3">
                        {servers.map((server) => (
                            <div key={server.url} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`h-2.5 w-2.5 rounded-full ${
                                        server.status === 'online'
                                            ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                                            : server.status === 'offline'
                                                ? 'bg-red-500'
                                                : 'bg-gray-400 animate-pulse'
                                    }`} />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {server.name}
                  </span>
                                </div>
                                <span className={`text-sm font-medium ${
                                    server.status === 'online'
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : server.status === 'offline'
                                            ? 'text-red-600 dark:text-red-400'
                                            : 'text-gray-500 dark:text-gray-400'
                                }`}>
                  {server.status.toUpperCase()}
                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HealthCheck;