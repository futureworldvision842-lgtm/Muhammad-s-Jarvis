
import React, { useState, useRef } from 'react';
import { Upload, Lightbulb } from 'lucide-react';
import { analyzeContent } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { fileToBase64 } from '../utils/fileUtils';

const DataAnalysis: React.FC = () => {
    const [prompt, setPrompt] = useState('What are the key points in this content?');
    const [image, setImage] = useState<{ file: File; url: string } | null>(null);
    const [analysis, setAnalysis] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setImage({ file, url: URL.createObjectURL(file) });
            setAnalysis('');
            setError(null);
        } else {
            setError("Please upload a valid image file.");
        }
    };
    
    const handleAnalyze = async () => {
        if (!prompt || isLoading) return;
        setIsLoading(true);
        setError(null);
        setAnalysis('');
        try {
            let imageBase64: string | undefined;
            let imageMimeType: string | undefined;
            if (image) {
                imageBase64 = await fileToBase64(image.file);
                imageMimeType = image.file.type;
            }
            const result = await analyzeContent(prompt, imageBase64, imageMimeType);
            setAnalysis(result);
        } catch (err) {
            console.error(err);
            setError('An error occurred during analysis. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <header className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold">Content Analysis</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Analyze text and images with Gemini.</p>
            </header>
            <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 overflow-y-auto">
                <div className="w-full lg:w-1/3 space-y-4">
                    <div
                        className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                        {image ? (
                            <img src={image.url} alt="For analysis" className="max-h-32 mx-auto object-contain rounded-md" />
                        ) : (
                            <div className="text-gray-500"><Upload size={32} className="mx-auto mb-1" /><p>Upload an image (optional)</p></div>
                        )}
                    </div>
                     <div>
                        <label htmlFor="analysis-prompt" className="block text-sm font-medium mb-1">Your Question or Instructions</label>
                        <textarea id="analysis-prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., What is in this image?" className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none h-24 resize-none" disabled={isLoading} />
                    </div>
                    <button onClick={handleAnalyze} className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors" disabled={isLoading || !prompt}>
                        {isLoading ? <><LoadingSpinner /> Analyzing...</> : <><Lightbulb size={18} /> Analyze</>}
                    </button>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
                <div className="flex-1 bg-gray-100 dark:bg-gray-800/50 rounded-lg flex flex-col p-4">
                    <h3 className="text-lg font-semibold mb-2">Analysis Result</h3>
                    <div className="flex-1 overflow-y-auto p-2">
                        {isLoading && <div className="flex items-center justify-center h-full"><LoadingSpinner className="w-12 h-12" /></div>}
                        {!isLoading && !analysis && <p className="text-gray-500 text-center mt-8">Analysis will appear here.</p>}
                        {analysis && <pre className="whitespace-pre-wrap text-sm">{analysis}</pre>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataAnalysis;
