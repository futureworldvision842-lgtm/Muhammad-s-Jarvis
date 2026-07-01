
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Globe, MapPin } from 'lucide-react';
import { generateTextWithGrounding } from '../services/geminiService';
import type { ChatMessage, GroundingChunk } from '../types';
import LoadingSpinner from './LoadingSpinner';

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: 'Hello! How can I help you today? You can ask me anything, or enable Search/Maps for grounded answers.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [useSearch, setUseSearch] = useState(false);
    const [useMaps, setUseMaps] = useState(false);
    const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        if (useMaps && !location) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation(position.coords);
                    setLocationError(null);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setLocationError("Could not get location. Please enable location services in your browser.");
                    setUseMaps(false);
                }
            );
        }
    }, [useMaps, location]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const { text, sources } = await generateTextWithGrounding(input, useSearch, useMaps, location);
            const modelMessage: ChatMessage = { role: 'model', text, sources };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error(error);
            const errorMessage: ChatMessage = { role: 'model', text: 'Sorry, I encountered an error. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    
    // FIX: Updated `renderSource` to use `uri` and `title` properties for map review snippets, aligning with the corrected `GroundingChunk` type.
    const renderSource = (source: GroundingChunk, index: number) => {
        if (source.web?.uri) {
            return <a key={index} href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline block truncate">{source.web.title || source.web.uri}</a>;
        }

        if (source.maps) {
            const mapElements: React.ReactNode[] = [];
            if (source.maps.uri) {
                mapElements.push(
                    <a key={`${index}-map`} href={source.maps.uri} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline block truncate">
                        {source.maps.title || 'View on Google Maps'}
                    </a>
                );
            }
            source.maps.placeAnswerSources?.reviewSnippets?.forEach((snippet, i) => {
                if (snippet.uri) {
                    mapElements.push(
                        <a key={`${index}-review-${i}`} href={snippet.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline block truncate">
                            {snippet.title || 'Review Snippet'}
                        </a>
                    );
                }
            });
            if (mapElements.length > 0) {
                return <React.Fragment key={index}>{mapElements}</React.Fragment>;
            }
        }

        return null;
    }

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900">
            <header className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold">AI Chat</h2>
            </header>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0"><Bot size={20} className="text-white" /></div>}
                        <div className={`max-w-xl p-4 rounded-2xl ${msg.role === 'user' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-red-50 dark:bg-red-900/50'}`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            {msg.sources && msg.sources.length > 0 && (
                                <div className="mt-4 border-t border-red-200 dark:border-red-800 pt-2">
                                    <h4 className="text-xs font-semibold mb-1 text-gray-600 dark:text-gray-400">Sources:</h4>
                                    <div className="text-xs space-y-1">
                                        {msg.sources.map(renderSource)}
                                    </div>
                                </div>
                            )}
                        </div>
                        {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center flex-shrink-0"><User size={20} className="text-white" /></div>}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            {locationError && <p className="px-6 text-red-500 text-sm">{locationError}</p>}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                    <button onClick={() => setUseSearch(!useSearch)} className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full border ${useSearch ? 'bg-red-600 text-white border-red-600' : 'bg-transparent border-gray-300 dark:border-gray-600'}`}><Globe size={14} /> Google Search</button>
                    <button onClick={() => setUseMaps(!useMaps)} className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full border ${useMaps ? 'bg-green-500 text-white border-green-500' : 'bg-transparent border-gray-300 dark:border-gray-600'}`}><MapPin size={14} /> Google Maps</button>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-red-600 rounded-full text-white hover:bg-red-700 disabled:bg-gray-400" disabled={isLoading}>
                        {isLoading ? <LoadingSpinner className="w-5 h-5" /> : <Send size={20} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;