
import React, { useState } from 'react';
import { LayoutTemplate, Send, Download } from 'lucide-react';
import { generateImage } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import type { AspectRatio } from '../types';

const fonts = [
    { name: 'Oswald', family: "'Oswald', sans-serif" },
    { name: 'Roboto', family: "'Roboto', sans-serif" },
    { name: 'Playfair Display', family: "'Playfair Display', serif" },
    { name: 'Lobster', family: "'Lobster', cursive" },
];

const PosterGenerator: React.FC = () => {
    const [posterText, setPosterText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');

    // Text styling state
    const [fontSize, setFontSize] = useState(48);
    const [fontColor, setFontColor] = useState('#FFFFFF');
    const [textShadow, setTextShadow] = useState(true);
    const [fontFamily, setFontFamily] = useState('Oswald');

    const handleGenerate = async () => {
        if (!posterText || isLoading) return;
        setIsLoading(true);
        setError(null);
        setImageUrl(null);
        try {
            const prompt = `Create a visually stunning, high-quality poster background image that complements the following text. The background should be evocative and artistic, suitable for a poster, and should not contain any text itself. The text it should be based on is: "${posterText}"`;
            const url = await generateImage(prompt, aspectRatio);
            setImageUrl(url);
        } catch (err) {
            console.error(err);
            setError('Failed to generate poster background. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        if (!imageUrl) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            setError("Could not create a canvas to download the poster.");
            return;
        };

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imageUrl;
        img.onload = () => {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.drawImage(img, 0, 0);

            const selectedFont = fonts.find(f => f.name === fontFamily) || fonts[0];
            const responsiveFontSize = (canvas.width / 1000) * fontSize;
            ctx.font = `bold ${responsiveFontSize}px ${selectedFont.family}`;
            ctx.fillStyle = fontColor;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            if (textShadow) {
                ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
                ctx.shadowOffsetX = responsiveFontSize * 0.05;
                ctx.shadowOffsetY = responsiveFontSize * 0.05;
                ctx.shadowBlur = responsiveFontSize * 0.1;
            }

            const lines = posterText.split('\n');
            const lineHeight = responsiveFontSize * 1.2;
            const totalTextHeight = lines.length * lineHeight;
            const startY = (canvas.height / 2) - (totalTextHeight / 2) + (lineHeight / 2) - (lineHeight * 0.1);

            lines.forEach((line, index) => {
                ctx.fillText(line, canvas.width / 2, startY + (index * lineHeight));
            });
            
            const link = document.createElement('a');
            link.download = 'vision-point-poster.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        };
        img.onerror = () => {
            setError("Could not load image for download. The image might be from a restricted source.");
        }
    };

    return (
        <div className="flex flex-col h-full">
            <header className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold">Poster Generator</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Create beautiful poster backgrounds from your text.</p>
            </header>
            <div className="flex-1 flex flex-col md:flex-row gap-6 p-6 overflow-y-auto">
                <div className="w-full md:w-1/3 space-y-4">
                    <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h3 className="text-lg font-semibold">1. Content</h3>
                        <div>
                            <label htmlFor="poster-text" className="block text-sm font-medium mb-1">Poster Text</label>
                            <textarea
                                id="poster-text"
                                value={posterText}
                                onChange={(e) => setPosterText(e.target.value)}
                                placeholder="e.g., The Future is Now: An AI Symposium"
                                className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none h-32 resize-none"
                                disabled={isLoading}
                            />
                        </div>
                         <div>
                            <label htmlFor="aspectRatio" className="block text-sm font-medium mb-1">Aspect Ratio</label>
                            <select id="aspectRatio" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as AspectRatio)} className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none" disabled={isLoading}>
                                <option value="9:16">Portrait (9:16)</option>
                                <option value="16:9">Landscape (16:9)</option>
                                <option value="1:1">Square (1:1)</option>
                            </select>
                        </div>
                        <button onClick={handleGenerate} className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors" disabled={isLoading || !posterText}>
                            {isLoading ? <><LoadingSpinner /> Generating...</> : <><Send size={18} /> Generate Background</>}
                        </button>
                    </div>

                    {imageUrl && !isLoading && (
                        <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                             <h3 className="text-lg font-semibold">2. Text Styling</h3>
                             <div>
                                <label htmlFor="fontFamily" className="block text-sm font-medium mb-1">Font Family</label>
                                <select id="fontFamily" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none">
                                    {fonts.map(font => <option key={font.name} value={font.name}>{font.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="fontSize" className="block text-sm font-medium mb-1">Font Size: {fontSize}px</label>
                                <input id="fontSize" type="range" min="16" max="128" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                            </div>
                             <div className="flex items-center justify-between">
                                <label htmlFor="fontColor" className="block text-sm font-medium">Font Color</label>
                                <input id="fontColor" type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} className="w-10 h-10 p-1 bg-white border border-gray-300 rounded-md cursor-pointer dark:bg-gray-800 dark:border-gray-600" />
                            </div>
                            <div className="flex items-center gap-2">
                                <input id="textShadow" type="checkbox" checked={textShadow} onChange={(e) => setTextShadow(e.target.checked)} className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                <label htmlFor="textShadow" className="text-sm font-medium">Text Shadow</label>
                            </div>
                            <button onClick={handleDownload} className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors">
                                <Download size={18} /> Download Poster
                            </button>
                        </div>
                    )}
                    {error && <p className="text-red-500 text-sm p-4">{error}</p>}
                </div>
                <div className="flex-1 bg-gray-100 dark:bg-gray-800/50 rounded-lg flex items-center justify-center p-4 relative overflow-hidden">
                    {isLoading && <LoadingSpinner className="w-12 h-12" />}
                    {!isLoading && !imageUrl && (
                        <div className="text-center text-gray-500">
                            <LayoutTemplate size={48} className="mx-auto mb-2" />
                            <p>Your generated poster will appear here.</p>
                        </div>
                    )}
                    {imageUrl && (
                        <div className="relative w-full h-full flex items-center justify-center">
                            <img src={imageUrl} alt="Generated poster background" className="max-h-full max-w-full object-contain rounded-md" />
                            <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8 pointer-events-none">
                                <p 
                                    className="text-center font-bold break-words"
                                    style={{
                                        fontFamily: fonts.find(f => f.name === fontFamily)?.family,
                                        fontSize: `${fontSize}px`,
                                        color: fontColor,
                                        textShadow: textShadow ? '2px 2px 8px rgba(0,0,0,0.8)' : 'none',
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {posterText}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PosterGenerator;