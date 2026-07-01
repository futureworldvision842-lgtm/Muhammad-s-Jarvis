
import React, { useState } from 'react';
import { Image, Send } from 'lucide-react';
import { generateImage } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import type { AspectRatio } from '../types';

const aspectRatios: { label: string; value: AspectRatio }[] = [
    { label: 'Square', value: '1:1' },
    { label: 'Landscape', value: '16:9' },
    { label: 'Portrait', value: '9:16' },
    { label: 'Wide', value: '4:3' },
    { label: 'Tall', value: '3:4' },
];

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt || isLoading) return;
        setIsLoading(true);
        setError(null);
        setImageUrl(null);
        try {
            const url = await generateImage(prompt, aspectRatio);
            setImageUrl(url);
        } catch (err) {
            console.error(err);
            setError('Failed to generate image. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <header className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold">Image Generation</h2>
            </header>
            <div className="flex-1 flex flex-col md:flex-row gap-6 p-6 overflow-y-auto">
                <div className="w-full md:w-1/3 space-y-4">
                    <div>
                        <label htmlFor="prompt" className="block text-sm font-medium mb-1">Prompt</label>
                        <textarea
                            id="prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., A cat wearing a spacesuit on Mars, cinematic lighting"
                            className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none h-32 resize-none"
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label htmlFor="aspectRatio" className="block text-sm font-medium mb-1">Aspect Ratio</label>
                        <select
                            id="aspectRatio"
                            value={aspectRatio}
                            onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                            className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                            disabled={isLoading}
                        >
                            {aspectRatios.map(ar => <option key={ar.value} value={ar.value}>{ar.label}</option>)}
                        </select>
                    </div>
                    <button
                        onClick={handleGenerate}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                        disabled={isLoading || !prompt}
                    >
                        {isLoading ? <><LoadingSpinner /> Generating...</> : <><Send size={18} /> Generate</>}
                    </button>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
                <div className="flex-1 bg-gray-100 dark:bg-gray-800/50 rounded-lg flex items-center justify-center p-4">
                    {isLoading && <LoadingSpinner className="w-12 h-12" />}
                    {!isLoading && !imageUrl && (
                        <div className="text-center text-gray-500">
                            <Image size={48} className="mx-auto mb-2" />
                            <p>Your generated image will appear here.</p>
                        </div>
                    )}
                    {imageUrl && (
                        <img src={imageUrl} alt="Generated" className="max-h-full max-w-full object-contain rounded-md" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageGenerator;
