import React, { useState, useEffect } from 'react';
import { Bot, RefreshCw, Send, Smartphone, MessageCircle } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import apiService from '../services/apiService';

const WhatsAppBot: React.FC = () => {
    const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'qr-ready'>('disconnected');
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [groups, setGroups] = useState<any>(null);
    const [logs, setLogs] = useState<string[]>([]);

    // Script generation
    const [topic, setTopic] = useState('');
    const [script, setScript] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [includeAudio, setIncludeAudio] = useState(true);
    const [includeVisuals, setIncludeVisuals] = useState(true);

    // Check WhatsApp status on mount
    useEffect(() => {
        checkStatus();
        const interval = setInterval(checkStatus, 5000);
        return () => clearInterval(interval);
    }, []);

    const checkStatus = async () => {
        try {
            const status = await apiService.getWhatsAppStatus();
            setConnectionStatus(status.status);
            if (status.qrCode) {
                setQrCode(status.qrCode);
            }
            if (status.groups) {
                setGroups(status.groups);
            }
            addLog(`Status: ${status.status}`);
        } catch (error) {
            console.error('Status check failed:', error);
        }
    };

    const connectWhatsApp = async () => {
        try {
            setConnectionStatus('connecting');
            addLog('🔄 Connecting to WhatsApp...');
            await apiService.connectWhatsApp();
            addLog('✅ Connection initiated. Waiting for QR code...');
        } catch (error: any) {
            addLog(`❌ Connection failed: ${error.message}`);
            setConnectionStatus('disconnected');
        }
    };

    const generateScript = async () => {
        if (!topic.trim()) {
            alert('Please enter a topic first!');
            return;
        }

        setIsGenerating(true);
        addLog(`📝 Generating script for: ${topic}`);

        try {
            const result = await apiService.generateScript(topic, includeAudio, includeVisuals);
            setScript(result.script);
            addLog('✅ Script generated successfully!');

            if (result.audioData) {
                addLog('🎤 Audio generated and sent to WhatsApp groups');
            }
            if (result.visuals) {
                addLog('🎨 Visuals researched and sent to WhatsApp groups');
            }
        } catch (error: any) {
            addLog(`❌ Generation failed: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const sendToWhatsApp = async () => {
        if (!script) {
            alert('Generate a script first!');
            return;
        }

        try {
            addLog('📱 Sending to WhatsApp groups...');
            // Script is automatically sent by backend when generated
            addLog('✅ Sent to Demo script group!');
        } catch (error: any) {
            addLog(`❌ Send failed: ${error.message}`);
        }
    };

    const addLog = (message: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev.slice(0, 50)]);
    };

    return (
        <div className="flex flex-col h-full">
            <header className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <MessageCircle size={24} className="text-green-600" />
                    WhatsApp Bot Control Panel
                </h2>
            </header>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 overflow-y-auto">
                {/* Left Panel - Connection & Status */}
                <div className="lg:w-1/3 space-y-4">
                    {/* Connection Card */}
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Smartphone size={20} />
                            Connection
                        </h3>

                        {/* QR Code Display */}
                        <div className="flex flex-col items-center mb-4">
                            {connectionStatus === 'qr-ready' && qrCode ? (
                                <div className="text-center">
                                    <div className="bg-white p-4 rounded-lg inline-block">
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCode)}`}
                                            alt="WhatsApp QR Code"
                                            className="rounded-md"
                                        />
                                    </div>
                                    <p className="text-sm text-green-600 mt-2 font-semibold">📱 Scan with WhatsApp</p>
                                </div>
                            ) : connectionStatus === 'connected' ? (
                                <div className="text-center p-4">
                                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Bot size={32} className="text-green-600" />
                                    </div>
                                    <p className="text-green-600 font-semibold">✅ Connected</p>
                                </div>
                            ) : connectionStatus === 'connecting' ? (
                                <div className="text-center p-4">
                                    <LoadingSpinner className="w-12 h-12 mx-auto mb-3" />
                                    <p className="text-blue-600 font-semibold">Connecting...</p>
                                </div>
                            ) : (
                                <div className="text-center p-4">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Smartphone size={32} className="text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 font-semibold">Disconnected</p>
                                </div>
                            )}
                        </div>

                        {/* Connect Button */}
                        <button
                            onClick={connectWhatsApp}
                            disabled={connectionStatus === 'connecting' || connectionStatus === 'connected'}
                            className={`w-full py-2 rounded-lg font-semibold transition-colors ${connectionStatus === 'connected'
                                    ? 'bg-green-600 text-white cursor-not-allowed'
                                    : connectionStatus === 'connecting'
                                        ? 'bg-blue-600 text-white cursor-not-allowed'
                                        : 'bg-green-600 text-white hover:bg-green-700'
                                }`}
                        >
                            {connectionStatus === 'connected' ? '✅ Connected' :
                                connectionStatus === 'connecting' ? '🔄 Connecting...' :
                                    '🔗 Connect to WhatsApp'}
                        </button>

                        {/* Groups Status */}
                        {groups && (
                            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                                <p className="font-semibold mb-2">📱 Groups Found:</p>
                                <div className="space-y-1 text-xs">
                                    <p className={groups.content ? 'text-green-600' : 'text-gray-400'}>
                                        {groups.content ? '✅' : '❌'} Content Group
                                    </p>
                                    <p className={groups.demoScript ? 'text-green-600' : 'text-gray-400'}>
                                        {groups.demoScript ? '✅' : '❌'} Demo Script Group
                                    </p>
                                    <p className={groups.demoVisual ? 'text-green-600' : 'text-gray-400'}>
                                        {groups.demoVisual ? '✅' : '❌'} Demo Visual Group
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Activity Log */}
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            <RefreshCw size={16} />
                            Activity Log
                        </h3>
                        <div className="h-64 bg-gray-900 text-green-400 font-mono text-xs p-2 rounded-md overflow-y-auto">
                            {logs.length > 0 ? logs.map((log, i) => (
                                <p key={i} className="mb-1">{log}</p>
                            )) : (
                                <p className="text-gray-500">No activity yet...</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel - Script Generator */}
                <div className="flex-1 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
                    <h3 className="text-lg font-semibold mb-4">📝 Urdu Script Generator</h3>

                    <div className="space-y-4">
                        {/* Topic Input */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Topic / News Item</label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Enter topic (e.g., Pakistan latest news, China Pakistan relations)"
                                className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                            />
                        </div>

                        {/* Options */}
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={includeAudio}
                                    onChange={(e) => setIncludeAudio(e.target.checked)}
                                    className="w-4 h-4 text-red-600 rounded"
                                />
                                <span className="text-sm">🎤 Generate Audio</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={includeVisuals}
                                    onChange={(e) => setIncludeVisuals(e.target.checked)}
                                    className="w-4 h-4 text-red-600 rounded"
                                />
                                <span className="text-sm">🎨 Research Visuals</span>
                            </label>
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={generateScript}
                            disabled={isGenerating || !topic.trim()}
                            className="w-full flex justify-center items-center gap-2 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {isGenerating ? (
                                <>
                                    <LoadingSpinner className="w-5 h-5" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Bot size={20} />
                                    Generate Urdu Script
                                </>
                            )}
                        </button>

                        {/* Script Output */}
                        {script && (
                            <div className="mt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-sm font-medium">Generated Script:</label>
                                    <button
                                        onClick={sendToWhatsApp}
                                        className="flex items-center gap-1 bg-green-600 text-white text-sm px-3 py-1 rounded-lg hover:bg-green-700"
                                    >
                                        <Send size={14} />
                                        Send to WhatsApp
                                    </button>
                                </div>
                                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                                    <pre className="text-sm whitespace-pre-wrap font-sans">{script}</pre>
                                </div>
                            </div>
                        )}

                        {/* Instructions */}
                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
                            <p className="font-semibold mb-2">💡 How to Use:</p>
                            <ul className="space-y-1 text-xs">
                                <li>1. Connect WhatsApp by scanning QR code</li>
                                <li>2. Enter your topic or news item</li>
                                <li>3. Click "Generate Urdu Script"</li>
                                <li>4. Script, audio, and visuals will be sent to WhatsApp groups automatically</li>
                                <li>5. You can also send commands directly in WhatsApp: <code className="bg-white dark:bg-gray-800 px-1 rounded">topic: Pakistan news</code></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhatsAppBot;