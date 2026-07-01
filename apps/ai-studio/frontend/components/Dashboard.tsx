import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { BookText, Images, X, Send, Newspaper } from 'lucide-react';
import apiService from '../services/apiService';

interface DashboardProps {
    setActiveTool: (toolId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveTool }) => {
    const [headlines, setHeadlines] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedTopic, setSelectedTopic] = useState<string>('');
    const [script, setScript] = useState<string | null>(null);
    const [isScriptLoading, setIsScriptLoading] = useState(false);

    useEffect(() => {
        loadHeadlines();
    }, []);

    const loadHeadlines = async () => {
        try {
            setIsLoading(true);
            const data = await apiService.getHeadlines();
            setHeadlines(data.headlines || '');
        } catch (err: any) {
            console.error(err);
            setError('Failed to fetch latest headlines.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateScript = async (topic: string) => {
        setSelectedTopic(topic);
        setIsScriptLoading(true);
        setScript(null);
        try {
            const result = await apiService.generateScript(topic, true, true);
            setScript(result.script);
        } catch (error: any) {
            console.error(error);
            setError("Failed to generate script: " + error.message);
        } finally {
            setIsScriptLoading(false);
        }
    };

    const resetState = () => {
        setScript(null);
        setSelectedTopic('');
        setError(null);
    };

    // Parse headlines into list
    const headlinesList = headlines
        .split('\n')
        .filter(line => line.match(/^\d+\./))
        .map(line => {
            const match = line.match(/^(\d+)\.\s*(.+)$/);
            return match ? { number: match[1], text: match[2] } : null;
        })
        .filter(Boolean);

    if (script) {
        return (
            <div className="flex flex-col h-full">
                <header className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold">📝 Generated Script</h2>
                    <button
                        onClick={resetState}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        <X size={20} />
                    </button>
                </header>
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Topic:</p>
                                <h3 className="text-lg font-semibold">{selectedTopic}</h3>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigator.clipboard.writeText(script)}
                                    className="flex items-center gap-1 bg-blue-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    📋 Copy
                                </button>
                                <button
                                    className="flex items-center gap-1 bg-green-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-green-700"
                                >
                                    <Send size={14} />
                                    Sent to WhatsApp
                                </button>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                            <pre className="whitespace-pre-wrap text-sm font-sans">{script}</pre>
                        </div>
                        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-sm">
                            <p className="text-green-700 dark:text-green-300">
                                ✅ Script, audio, and visuals have been automatically sent to WhatsApp groups!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
            <header className="p-6 border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                    Vision Point AI Studio
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Your AI-powered content creation platform
                </p>
            </header>

            <div className="flex-1 p-6 overflow-y-auto">
                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <button
                        onClick={() => setActiveTool('chat')}
                        className="p-4 bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-red-500 transition-all hover:shadow-lg group"
                    >
                        <div className="text-3xl mb-2">💬</div>
                        <div className="font-semibold text-sm">AI Chat</div>
                    </button>
                    <button
                        onClick={() => setActiveTool('image-generator')}
                        className="p-4 bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-red-500 transition-all hover:shadow-lg group"
                    >
                        <div className="text-3xl mb-2">🖼️</div>
                        <div className="font-semibold text-sm">Images</div>
                    </button>
                    <button
                        onClick={() => setActiveTool('video-generator')}
                        className="p-4 bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-red-500 transition-all hover:shadow-lg group"
                    >
                        <div className="text-3xl mb-2">🎬</div>
                        <div className="font-semibold text-sm">Videos</div>
                    </button>
                    <button
                        onClick={() => setActiveTool('whatsapp-bot')}
                        className="p-4 bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 transition-all hover:shadow-lg group"
                    >
                        <div className="text-3xl mb-2">📱</div>
                        <div className="font-semibold text-sm">WhatsApp Bot</div>
                    </button>
                </div>

                {/* Headlines Section */}
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Newspaper size={24} className="text-red-600" />
                            Latest Headlines - Vision Point Agenda
                        </h3>
                        <button
                            onClick={loadHeadlines}
                            disabled={isLoading}
                            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                        >
                            {isLoading ? <LoadingSpinner className="w-4 h-4" /> : '🔄'}
                            Refresh
                        </button>
                    </div>

                    {isLoading && (
                        <div className="flex justify-center py-8">
                            <LoadingSpinner className="w-10 h-10" />
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    {!isLoading && headlinesList.length > 0 && (
                        <div className="space-y-3">
                            {headlinesList.map((headline: any, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
                                >
                                    <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                                        {headline.number}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm">{headline.text}</p>
                                    </div>
                                    <button
                                        onClick={() => handleCreateScript(headline.text)}
                                        disabled={isScriptLoading}
                                        className="flex-shrink-0 flex items-center gap-1 bg-red-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400"
                                    >
                                        {isScriptLoading ? (
                                            <LoadingSpinner className="w-3 h-3" />
                                        ) : (
                                            <BookText size={14} />
                                        )}
                                        Generate Script
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
                        <p className="font-semibold mb-2">💡 Quick Tip:</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            Click "Generate Script" on any headline to create a complete Urdu script with audio and visuals.
                            Everything will be automatically sent to your WhatsApp groups!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
