
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, AlertTriangle, User, Bot } from 'lucide-react';
import { getLiveSession } from '../services/geminiService';
import type { LiveServerMessage, Blob } from '@google/genai';
import { Modality } from '@google/genai';

// FIX: The LiveConnection type is not exported from the @google/genai library.
// Define a local interface based on its usage within this component for type safety.
interface LiveConnection {
    sendRealtimeInput(input: { media: Blob }): void;
    close(): void;
}

// Audio Encoding/Decoding functions
const decode = (base64: string): Uint8Array => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
};

const encode = (bytes: Uint8Array): string => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
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

const LiveConversation: React.FC = () => {
    const [isListening, setIsListening] = useState(false);
    const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [transcripts, setTranscripts] = useState<{ role: 'user' | 'model', text: string }[]>([]);

    const sessionPromise = useRef<Promise<LiveConnection> | null>(null);
    const inputAudioContext = useRef<AudioContext | null>(null);
    const outputAudioContext = useRef<AudioContext | null>(null);
    const outputNode = useRef<GainNode | null>(null);
    const mediaStream = useRef<MediaStream | null>(null);
    const scriptProcessor = useRef<ScriptProcessorNode | null>(null);
    const streamSource = useRef<MediaStreamAudioSourceNode | null>(null);
    const nextStartTime = useRef(0);
    const audioSources = useRef(new Set<AudioBufferSourceNode>());

    const currentInputTranscription = useRef('');
    const currentOutputTranscription = useRef('');
    
    const stopConversation = useCallback(() => {
        setIsListening(false);
        setStatus('idle');
        
        if (mediaStream.current) {
            mediaStream.current.getTracks().forEach(track => track.stop());
            mediaStream.current = null;
        }
        if (scriptProcessor.current) {
            scriptProcessor.current.disconnect();
            scriptProcessor.current = null;
        }
        if(streamSource.current) {
            streamSource.current.disconnect();
            streamSource.current = null;
        }
        if(inputAudioContext.current && inputAudioContext.current.state !== 'closed') {
           inputAudioContext.current.close();
           inputAudioContext.current = null;
        }
        if(outputAudioContext.current && outputAudioContext.current.state !== 'closed') {
           outputAudioContext.current.close();
           outputAudioContext.current = null;
        }
        outputNode.current = null;
        if (sessionPromise.current) {
            sessionPromise.current.then(session => session.close());
            sessionPromise.current = null;
        }

        audioSources.current.forEach(source => source.stop());
        audioSources.current.clear();
        nextStartTime.current = 0;

    }, []);


    const startConversation = useCallback(async () => {
        if (isListening) return;

        setIsListening(true);
        setStatus('connecting');
        setError(null);
        setTranscripts([]);
        currentInputTranscription.current = '';
        currentOutputTranscription.current = '';

        try {
            mediaStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            inputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            
            outputNode.current = outputAudioContext.current.createGain();
            outputNode.current.connect(outputAudioContext.current.destination);

            const geminiLive = getLiveSession();
            sessionPromise.current = geminiLive.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setStatus('connected');
                        if (!mediaStream.current || !inputAudioContext.current) return;
                        streamSource.current = inputAudioContext.current.createMediaStreamSource(mediaStream.current);
                        scriptProcessor.current = inputAudioContext.current.createScriptProcessor(4096, 1, 1);
                        scriptProcessor.current.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            
                            const l = inputData.length;
                            const int16 = new Int16Array(l);
                            for (let i = 0; i < l; i++) {
                                int16[i] = inputData[i] * 32768;
                            }

                            const pcmBlob: Blob = {
                                data: encode(new Uint8Array(int16.buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };

                            if (sessionPromise.current) {
                                sessionPromise.current.then((session) => {
                                    session.sendRealtimeInput({ media: pcmBlob });
                                });
                            }
                        };
                        streamSource.current.connect(scriptProcessor.current);
                        scriptProcessor.current.connect(inputAudioContext.current.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                         // Transcriptions
                        if (message.serverContent?.inputTranscription) {
                            currentInputTranscription.current += message.serverContent.inputTranscription.text;
                        }
                        if (message.serverContent?.outputTranscription) {
                            currentOutputTranscription.current += message.serverContent.outputTranscription.text;
                        }
                        if (message.serverContent?.turnComplete) {
                            setTranscripts(prev => [
                                ...prev,
                                {role: 'user', text: currentInputTranscription.current},
                                {role: 'model', text: currentOutputTranscription.current}
                            ]);
                            currentInputTranscription.current = '';
                            currentOutputTranscription.current = '';
                        }
                        // Audio
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio && outputAudioContext.current) {
                            nextStartTime.current = Math.max(nextStartTime.current, outputAudioContext.current.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext.current, 24000, 1);
                            const source = outputAudioContext.current.createBufferSource();
                            source.buffer = audioBuffer;
                            if (outputNode.current) {
                                source.connect(outputNode.current);
                            }
                            source.addEventListener('ended', () => audioSources.current.delete(source));
                            source.start(nextStartTime.current);
                            nextStartTime.current += audioBuffer.duration;
                            audioSources.current.add(source);
                        }
                        if (message.serverContent?.interrupted) {
                            audioSources.current.forEach(source => source.stop());
                            audioSources.current.clear();
                            nextStartTime.current = 0;
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live session error:', e);
                        setError('A connection error occurred.');
                        setStatus('error');
                        stopConversation();
                    },
                    onclose: (e: CloseEvent) => {
                        if (isListening) { // Only show error if it wasn't a manual stop
                           console.log('Live session closed:', e);
                           setStatus('idle');
                           stopConversation();
                        }
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    systemInstruction: 'You are a friendly and helpful AI assistant.',
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                },
            });

        } catch (err) {
            console.error('Failed to start conversation:', err);
            setError('Could not access microphone. Please grant permission.');
            setStatus('error');
            setIsListening(false);
        }
    }, [isListening, stopConversation]);

    useEffect(() => {
        return () => {
           // Cleanup on component unmount
           if(isListening) {
              stopConversation();
           }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleListen = () => {
        if (isListening) {
            stopConversation();
        } else {
            startConversation();
        }
    };
    
    return (
        <div className="flex flex-col h-full">
            <header className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold">Live Conversation</h2>
            </header>
            <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
                <button onClick={toggleListen} className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300 ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-red-600 hover:bg-red-700'}`}>
                    {isListening ? <MicOff size={60} className="text-white" /> : <Mic size={60} className="text-white" />}
                    {status === 'connected' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                </button>
                <div className="text-center">
                    <p className="font-semibold text-lg">{isListening ? 'Listening...' : 'Tap to start conversation'}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Status: {status}</p>
                    {status === 'error' && <p className="text-red-500 mt-2 flex items-center gap-2"><AlertTriangle size={16} /> {error}</p>}
                </div>
            </div>
            <div className="h-1/3 bg-gray-100 dark:bg-gray-800/50 p-4 border-t border-gray-200 dark:border-gray-800 overflow-y-auto">
                <h3 className="font-semibold mb-2">Transcript</h3>
                <div className="space-y-4 text-sm">
                    {transcripts.map((t, i) => (
                        <div key={i} className={`flex items-start gap-2 ${t.role === 'user' ? 'text-gray-600 dark:text-gray-300' : 'text-red-600 dark:text-red-400'}`}>
                           {t.role === 'user' ? <User size={16} className="mt-1 flex-shrink-0" /> : <Bot size={16} className="mt-1 flex-shrink-0" />}
                           <p>{t.text}</p>
                        </div>
                    ))}
                     {!transcripts.length && <p className="text-gray-400">Transcript will appear here...</p>}
                </div>
            </div>
        </div>
    );
};

export default LiveConversation;