
import React, { useState, useRef } from 'react';
import { Upload, Wand2, Send } from 'lucide-react';
import { fileToBase64 } from '../utils/fileUtils';
import { editImage } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

const ImageEditor: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [originalImage, setOriginalImage] = useState<{ file: File; url: string } | null>(null);
    const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setOriginalImage({ file, url: URL.createObjectURL(file) });
            setEditedImageUrl(null);
            setError(null);
        }
    };

    const handleEdit = async () => {
        if (!prompt || !originalImage || isLoading) return;
        setIsLoading(true);
        setError(null);
        try {
            const base64 = await fileToBase64(originalImage.file);
            const url = await editImage(prompt, base64, originalImage.file.type);
            setEditedImageUrl(url);
        } catch (err) {
            console.error(err);
            setError('Failed to edit image. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <header className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold">Image Editing</h2>
            </header>
            <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                        <h3 className="font-semibold mb-2">1. Upload Image</h3>
                        <div
                            className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                            {originalImage ? (
                                <img src={originalImage.url} alt="Original" className="max-h-64 mx-auto object-contain rounded-md" />
                            ) : (
                                <div className="text-gray-500">
                                    <Upload size={48} className="mx-auto mb-2" />
                                    <p>Click to upload an image</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold mb-2">2. Describe Your Edit</h3>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., Add a retro filter, remove the person in the background"
                            className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none h-24 resize-none"
                            disabled={!originalImage || isLoading}
                        />
                        <button
                            onClick={handleEdit}
                            className="w-full mt-2 flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                            disabled={!prompt || !originalImage || isLoading}
                        >
                            {isLoading ? <><LoadingSpinner /> Applying Edit...</> : <><Wand2 size={18} /> Edit Image</>}
                        </button>
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="font-semibold mb-2">Result</h3>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-800/50 rounded-lg flex items-center justify-center p-4 min-h-[300px]">
                        {isLoading && <LoadingSpinner className="w-12 h-12" />}
                        {!isLoading && !editedImageUrl && !error && <p className="text-gray-500">Your edited image will appear here.</p>}
                        {error && <p className="text-red-500">{error}</p>}
                        {editedImageUrl && <img src={editedImageUrl} alt="Edited" className="max-h-96 max-w-full object-contain rounded-md" />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageEditor;
