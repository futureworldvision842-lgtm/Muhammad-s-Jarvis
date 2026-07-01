
import React, { useState, useRef } from 'react';
import { Upload, Video, Send } from 'lucide-react';
import { generateVideo } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import type { VideoAspectRatio } from '../types';
import { fileToBase64 } from '../utils/fileUtils';
import { useVeoApiKey } from '../hooks/useVeoApiKey';
import ApiKeyDialog from './ApiKeyDialog';

const reassuringMessages = [
    "Animating pixels, please wait...",
    "Composing your visual masterpiece...",
    "The AI is dreaming up your video...",
    "This can take a few minutes, hang tight!",
    "Gathering stardust for your creation...",
];

const VideoGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>('16:9');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [initialImage, setInitialImage] = useState<{ file: File; url: string } | null>(null);
    const [currentMessage, setCurrentMessage] = useState(reassuringMessages[0]);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messageIntervalRef = useRef<number | null>(null);
    const { isKeySelected, isChecking, selectKey, handleApiError, checkKey } = useVeoApiKey();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setInitialImage({ file, url: URL.createObjectURL(file) });
        }
    };

    const handleGenerate = async () => {
        if ((!prompt && !initialImage) || isLoading) return;

        await checkKey();
        if (!isKeySelected) {
            selectKey();
            return;
        }

        setIsLoading(true);
        setError(null);
        setVideoUrl(null);

        messageIntervalRef.current = window.setInterval(() => {
            setCurrentMessage(reassuringMessages[Math.floor(Math.random() * reassuringMessages.length)]);
        }, 3000);

        try {
            let base64: string | undefined;
            let mimeType: string | undefined;
            if (initialImage) {
                base64 = await fileToBase64(initialImage.file);
                mimeType = initialImage.file.type;
            }
            const url = await generateVideo(prompt, base64, mimeType, aspectRatio);
            setVideoUrl(url);
        } catch (err) {
            console.error(err);
            setError('Failed to generate video. Please try again.');
            handleApiError(err);
        } finally {
            setIsLoading(false);
            if (messageIntervalRef.current) {
                clearInterval(messageIntervalRef.current);
            }
        }
    };

    if (isChecking) {
        return <div className="flex items-center justify-center h-full"><LoadingSpinner className="w-12 h-12" /></div>
    }

    if (!isKeySelected) {
        return <ApiKeyDialog onSelectKey={selectKey} />;
    }

    return (
        <div className="flex flex-col h-full">
            <header className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold">Video Generation (VEO)</h2>
            </header>
            <div className="flex-1 flex flex-col md:flex-row gap-6 p-6 overflow-y-auto">
                <div className="w-full md:w-1/3 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Initial Image (Optional)</label>
                        <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50" onClick={() => fileInputRef.current?.click()}>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                            {initialImage ? <img src={initialImage.url} alt="Initial frame" className="max-h-32 mx-auto object-contain rounded-md" /> : <div className="text-gray-500"><Upload size={32} className="mx-auto mb-1" /><p>Upload Image</p></div>}
                        </div>
                    </div>
                     <div>
                        <label htmlFor="prompt" className="block text-sm font-medium mb-1">Prompt</label>
                        <textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., A golden retriever puppy playing in a field of flowers" className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none h-32 resize-none" disabled={isLoading} />
                    </div>
                    <div>
                        <label htmlFor="aspectRatio" className="block text-sm font-medium mb-1">Aspect Ratio</label>
                        <select id="aspectRatio" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as VideoAspectRatio)} className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none" disabled={isLoading}>
                           <option value="16:9">Landscape (16:9)</option>
                           <option value="9:16">Portrait (9:16)</option>
                        </select>
                    </div>
                    <button onClick={handleGenerate} className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors" disabled={isLoading || (!prompt && !initialImage)}>
                        {isLoading ? <><LoadingSpinner /> Generating...</> : <><Send size={18} /> Generate Video</>}
                    </button>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
                <div className="flex-1 bg-gray-100 dark:bg-gray-800/50 rounded-lg flex items-center justify-center p-4">
                    {isLoading && <div className="text-center"><LoadingSpinner className="w-12 h-12 mx-auto mb-4" /><p>{currentMessage}</p></div>}
                    {!isLoading && !videoUrl && (
                        <div className="text-center text-gray-500">
                            <Video size={48} className="mx-auto mb-2" />
                            <p>Your generated video will appear here.</p>
                        </div>
                    )}
                    {videoUrl && <video src={videoUrl} controls autoPlay loop className="max-h-full max-w-full object-contain rounded-md" />}
                </div>
            </div>
        </div>
    );
};

export default VideoGenerator;
