
import React, { useState, useEffect } from 'react';
import type { LucideProps } from 'lucide-react';
import apiService from './services/apiService';

export interface Tool {
    id: string;
    name: string;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
}

interface SidebarProps {
    tools: Tool[];
    activeTool: string;
    setActiveTool: (id: string) => void;
}

// Replaced corrupted logo with a valid SVG logo to fix app loading issue.
const visionPointLogo = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDEwMCAxMDAiPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMjAiIGZpbGw9IiNkYzI2MjYiLz48cGF0aCBkPSJNMjUgMjAgTDQwIDcwIEw1NSAyMCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTU1IDUwIEMgNzUgNTAsIDc1IDgwLCA1NSA4MCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTU1IDUwIEMgNzUgNTAsIDc1IDgwLCA1NSA4MCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PGNpcmNsZSBjeD0iNzUiIGN5PSIyNSIgcj0iNSIgZmlsbD0id2hpdGUiLz48L3N2Zz4=";

export const Sidebar: React.FC<SidebarProps> = ({ tools, activeTool, setActiveTool }) => {
    const [connectivity, setConnectivity] = useState<'online' | 'offline' | 'checking'>('checking');

    useEffect(() => {
        const checkConnection = async () => {
            try {
                const health = await apiService.healthCheck();
                setConnectivity(health.connectivity || 'offline');
            } catch (err) {
                setConnectivity('offline');
            }
        };

        checkConnection();
        const interval = setInterval(checkConnection, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col p-4">
            <div className="mb-8 px-2">
                <div className="flex items-center gap-2">
                     <img src={visionPointLogo} alt="Vision Point Logo" className="w-10 h-10" />
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Vision Point Studio</h1>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 pl-12">by Muhammad Qureshi</p>
            </div>
            <nav className="flex flex-col gap-2 overflow-y-auto mb-4">
                {tools.map((tool) => (
                    <button
                        key={tool.id}
                        onClick={() => setActiveTool(tool.id)}
                        className={`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors ${
                            activeTool === tool.id
                                ? 'bg-red-600 text-white'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    >
                        <tool.icon size={20} />
                        <span>{tool.name}</span>
                    </button>
                ))}
            </nav>
            
            {/* Connection Status Badge */}
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2 px-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                    connectivity === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' :
                    connectivity === 'offline' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' :
                    'bg-yellow-500 animate-pulse'
                }`}></span>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {connectivity === 'online' ? 'ONLINE (Gemini)' :
                     connectivity === 'offline' ? 'OFFLINE (Local AI)' :
                     'CONNECTING...'}
                </span>
            </div>
        </aside>
    );
};
