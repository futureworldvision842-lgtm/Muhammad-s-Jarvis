

import React, { useState, useRef } from 'react';
import { Upload, FileVideo, Lightbulb } from 'lucide-react';
import { analyzeVideo, transcribeVideoAudio } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

const VideoAnalyzer: React.FC = () => {
    const [prompt, setPrompt] = useState('Summarize this video in a few sentences.');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [transcription, setTranscription] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('video/')) {
            setVideoFile(file);
            setAnalysis(null);
            setTranscription(null);
            setError(null);
        } else {
            setError("Please upload a valid video file.");
        }
    };

    const extractFrames = (): Promise<string[]> => {
        return new Promise((resolve, reject) => {
            if (!videoRef.current || !videoFile) {
                return reject("Video element not ready or file not selected");
            }

            const video = videoRef.current;
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const frames: string[] = [];
            const maxFrames = 15;
            
            const videoUrl = URL.createObjectURL(videoFile);
            
            const cleanup = () => {
                // Revoke the object URL to free up memory
                URL.revokeObjectURL(videoUrl);
            };

            video.onloadeddata = () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const duration = video.duration;
                const interval = duration / maxFrames;
                let currentTime = 0;
                let framesExtracted = 0;

                const captureFrame = () => {
                    if (currentTime > duration || framesExtracted >= maxFrames) {
                        cleanup();
                        resolve(frames);
                        return;
                    }
                    video.currentTime = currentTime;
                };

                video.onseeked = () => {
                    if (context) {
                       context.drawImage(video, 0, 0, canvas.width, canvas.height);
                       const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                       frames.push(dataUrl.split(',')[1]); // remove prefix
                       framesExtracted++;
                       currentTime += interval;
                       captureFrame();
                    } else {
                        cleanup();
                        reject("Canvas context is not available.");
                    }
                };
                
                captureFrame();
            };

            video.onerror = (e) => {
                cleanup();
                reject("Error loading video for frame extraction");
            };

            video.src = videoUrl;
        });
    };


    const handleAnalyze = async () => {
        if (!prompt || !videoFile || isLoading) return;
        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        setTranscription(null);
        try {
            const frames = await extractFrames();
            if (frames.length === 0) {
                throw new Error("Could not extract any frames from the video.");
            }
            
            const [analysisResult, transcriptionResult] = await Promise.all([
                analyzeVideo(prompt, frames),
                transcribeVideoAudio(videoFile),
            ]);

            setAnalysis(analysisResult);
            setTranscription(transcriptionResult);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to analyze video. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <header className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold">Video Analysis</h2>
            </header>
            <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 overflow-y-auto">
                <div className="w-full lg:w-1/3 space-y-4">
                    <div
                        className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="video/*" className="hidden" />
                        <video ref={videoRef} className="hidden" muted playsInline />
                        {videoFile ? (
                           <div className="text-green-500"><FileVideo size={32} className="mx-auto mb-1" /> <p className="text-sm break-all">{videoFile.name}</p></div>
                        ) : (
                           <div className="text-gray-500"><Upload size={32} className="mx-auto mb-1" /><p>Upload a video</p></div>
                        )}
                    </div>
                     <div>
                        <label htmlFor="prompt" className="block text-sm font-medium mb-1">What to analyze?</label>
                        <textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., What is happening in this video?" className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none h-24 resize-none" disabled={isLoading} />
                    </div>
                    <button onClick={handleAnalyze} className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors" disabled={isLoading || !videoFile}>
                        {isLoading ? <><LoadingSpinner /> Analyzing...</> : <><Lightbulb size={18} /> Analyze Video</>}
                    </button>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
                <div className="flex-1 bg-gray-100 dark:bg-gray-800/50 rounded-lg flex flex-col p-4">
                    {isLoading && (
                        <div className="flex items-center justify-center h-full">
                            <LoadingSpinner className="w-10 h-10" />
                            <p className="ml-4 text-gray-600 dark:text-gray-300">Analyzing video and audio...</p>
                        </div>
                    )}
                    {!isLoading && (analysis || transcription) ? (
                         <div className="flex-1 grid grid-rows-1 md:grid-rows-2 gap-4 overflow-hidden">
                            <div className="flex flex-col overflow-hidden">
                                <h3 className="text-lg font-semibold mb-2 flex-shrink-0">Analysis Result</h3>
                                <div className="flex-1 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900">
                                    <p className="whitespace-pre-wrap text-sm">{analysis}</p>
                                </div>
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <h3 className="text-lg font-semibold mb-2 flex-shrink-0">Audio Transcription</h3>
                                <div className="flex-1 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900">
                                     <p className="whitespace-pre-wrap text-sm">{transcription}</p>
                                </div>
                            </div>
                        </div>
                    ) : null}
                     {!isLoading && !analysis && !transcription && (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500 text-center">Analysis and transcription will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoAnalyzer;