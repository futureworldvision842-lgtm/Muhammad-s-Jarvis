
import React, { useState, useEffect } from 'react';
import { Bot, RefreshCw, AudioLines, Video, Image, Play, Download } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { generateSpeech, generateVideo, generateImage } from '../services/geminiService';
import { useVeoApiKey } from '../hooks/useVeoApiKey';
import ApiKeyDialog from './ApiKeyDialog';

const qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://visionpointpk.com/";

// Audio Decoding functions for raw PCM data
const decode = (base64: string): Uint8Array => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
};

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}


const WhatsAppBot: React.FC = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    
    // Test states
    const [activeTest, setActiveTest] = useState<'voice' | 'video' | 'image'>('voice');
    const [textToSpeech, setTextToSpeech] = useState("Hello from Vision Point AI! I can turn any text into speech.");
    const [videoPrompt, setVideoPrompt] = useState("A futuristic cityscape at sunset, cinematic view.");
    const [imagePrompt, setImagePrompt] = useState("A high-tech robot reading a book.");
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    
    const { isKeySelected, isChecking, selectKey, handleApiError, checkKey } = useVeoApiKey();


    useEffect(() => {
        let interval: number;
        if (isConnected) {
            const activities = [
                "Monitoring 'VP CONTENT' group for new messages...",
                "New content detected: 'AI Breakthrough in Medicine'. Liking post.",
                "Generating 9-minute monologue script...",
                "Script generated. Posting to 'VP Researchers' group.",
                "Received voice command: 'Summarize latest AI news'.",
                "Transcribing voice message...",
                "Executing command: Fetching news summary...",
                "Forwarding summary to user.",
            ];
            let logIndex = 0;
            interval = window.setInterval(() => {
                setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${activities[logIndex % activities.length]}`, ...prev.slice(0, 10)]);
                logIndex++;
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [isConnected]);
    
    const handleTest = async () => {
        if (activeTest === 'video') {
            await checkKey();
             if (!isKeySelected) {
                selectKey();
                // Don't proceed if key isn't selected. The user will be prompted.
                return;
            }
        }

        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            if (activeTest === 'voice') {
                const base64Audio = await generateSpeech(textToSpeech);
                const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
                const source = outputAudioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputAudioContext.destination);
                source.start();
                setResult('played_audio');
            } else if (activeTest === 'video') {
                const res = await generateVideo(videoPrompt, undefined, undefined, '16:9');
                setResult(res);
            } else if (activeTest === 'image') {
                const res = await generateImage(imagePrompt, '1:1');
                setResult(res);
            }
        } catch (err: any) {
            setError(err.message || `Failed to generate ${activeTest}.`);
            console.error(err);
             if (activeTest === 'video') {
                handleApiError(err);
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col h-full">
            <header className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold">WhatsApp Bot Simulator</h2>
            </header>
            <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 overflow-y-auto">
                <div className="lg:w-1/3 space-y-4">
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Connection</h3>
                        <div className="flex flex-col items-center">
                            <img src={qrCodeUrl} alt="WhatsApp QR Code" className={`rounded-md ${!isConnected ? 'grayscale-0' : 'grayscale'}`} />
                            <button onClick={() => setIsConnected(!isConnected)} className={`mt-4 w-full py-2 rounded-lg font-semibold ${isConnected ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
                                {isConnected ? 'Disconnect Bot' : 'Connect to WhatsApp'}
                            </button>
                        </div>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Live Activity Log</h3>
                        <div className="h-64 bg-gray-900 text-green-400 font-mono text-xs p-2 rounded-md overflow-y-auto">
                            {isConnected ? logs.map((log, i) => <p key={i}>{log}</p>) : <p>Bot is disconnected.</p>}
                        </div>
                    </div>
                </div>
                <div className="flex-1 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Function Testing</h3>
                    <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                        <button onClick={() => setActiveTest('voice')} className={`px-4 py-2 font-semibold ${activeTest === 'voice' ? 'border-b-2 border-red-500 text-red-500' : ''}`}><AudioLines size={16} className="inline mr-1"/> Voiceover</button>
                        <button onClick={() => setActiveTest('video')} className={`px-4 py-2 font-semibold ${activeTest === 'video' ? 'border-b-2 border-red-500 text-red-500' : ''}`}><Video size={16} className="inline mr-1"/> VEO Video</button>
                        <button onClick={() => setActiveTest('image')} className={`px-4 py-2 font-semibold ${activeTest === 'image' ? 'border-b-2 border-red-500 text-red-500' : ''}`}><Image size={16} className="inline mr-1"/> Image</button>
                    </div>
                    
                    <div className="space-y-4">
                        {activeTest === 'voice' && <textarea value={textToSpeech} onChange={e => setTextToSpeech(e.target.value)} className="w-full h-24 bg-gray-100 dark:bg-gray-800 rounded-lg p-2 text-sm" />}
                        {activeTest === 'video' && <textarea value={videoPrompt} onChange={e => setVideoPrompt(e.target.value)} className="w-full h-24 bg-gray-100 dark:bg-gray-800 rounded-lg p-2 text-sm" />}
                        {activeTest === 'image' && <textarea value={imagePrompt} onChange={e => setImagePrompt(e.target.value)} className="w-full h-24 bg-gray-100 dark:bg-gray-800 rounded-lg p-2 text-sm" />}
                        
                        {isChecking && activeTest === 'video' ? (
                            <button disabled className="w-full flex justify-center items-center gap-2 bg-gray-400 text-white font-semibold py-2 rounded-lg">
                                <LoadingSpinner /> Initializing...
                            </button>
                        ) : (
                             <button onClick={handleTest} disabled={isLoading} className="w-full flex justify-center items-center gap-2 bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400">
                               {isLoading ? <LoadingSpinner /> : `Generate ${activeTest}`}
                            </button>
                        )}
                        
                        
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        
                        <div className="mt-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg min-h-[200px] flex items-center justify-center p-4">
                            {isLoading && <LoadingSpinner className="w-10 h-10" />}
                            {!isLoading && !result && (
                                <>
                                    {!isKeySelected && activeTest === 'video' 
                                        ? <ApiKeyDialog onSelectKey={selectKey} />
                                        : <p className="text-gray-500">Test results will appear here</p>
                                    }
                                </>
                            )}
                            {result === 'played_audio' && activeTest === 'voice' && (
                                <div className="text-center text-green-500">
                                    <AudioLines className="mx-auto h-10 w-10" />
                                    <p className="mt-2 font-semibold">Voiceover played successfully!</p>
                                </div>
                            )}
                            {result && activeTest === 'video' && <video src={result} controls autoPlay loop className="max-h-64 rounded-md" />}
                            {result && activeTest === 'image' && <img src={result} alt="Generated" className="max-h-64 rounded-md" />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhatsAppBot;