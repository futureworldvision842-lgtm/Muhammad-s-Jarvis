// This file contains a snapshot of the application's source code.
// It is used by the AI Developer Assistant tool to analyze and suggest updates.

interface CodeFile {
    path: string;
    content: string;
}

export const CODEBASE_FILES: CodeFile[] = [
    {
        path: 'index.tsx',
        content: `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
    },
    {
        path: 'metadata.json',
        content: `
{
  "name": "Vision Point AI Studio",
  "description": "A comprehensive web application showcasing a wide range of Gemini API capabilities, including text and chat, image and video generation/analysis, real-time voice conversations, and grounding with Google Search and Maps.",
  "requestFramePermissions": [
    "camera",
    "microphone",
    "geolocation"
  ]
}`
    },
    {
        path: 'index.html',
        content: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vision Point AI Studio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Lobster&family=Oswald:wght@700&family=Playfair+Display:ital,wght@0,700;1,700&family=Roboto:wght@700&display=swap" rel="stylesheet">
    <style>
      body { font-family: 'Inter', sans-serif; }
    </style>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            colors: {
              'gray-950': 'hsl(222, 47%, 8%)',
            },
            fontFamily: {
              'sans': ['Inter', 'sans-serif'],
            }
          }
        }
      }
    </script>
  <script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@18.2.0",
    "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
    "@google/genai": "https://esm.sh/@google/genai@0.11.3",
    "lucide-react": "https://esm.sh/lucide-react@0.378.0"
  }
}
</script>
</head>
  <body class="bg-gray-100 dark:bg-gray-950">
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>`
    },
    {
        path: 'App.tsx',
        content: `




import React, { useState, useCallback } from 'react';
import { Sidebar, Tool } from './components/Sidebar';
import Chat from './components/Chat';
import ImageGenerator from './components/ImageGenerator';
import ImageEditor from './components/ImageEditor';
import VideoGenerator from './components/VideoGenerator';
import LiveConversation from './components/LiveConversation';
import ComplexReasoning from './components/ComplexReasoning';
import DataAnalysis from './components/DataAnalysis';
import { Bot, Image, Video, Mic, BrainCircuit, BarChart, Film, LayoutTemplate, LayoutDashboard, MessageCircle, QrCode, CodeXml } from 'lucide-react';
import VideoAnalyzer from './components/VideoAnalyzer';
import PosterGenerator from './components/PosterGenerator';
import Dashboard from './components/Dashboard';
import WhatsAppBot from './components/WhatsAppBot';
import QRCodeGenerator from './components/QRCodeGenerator';
import DeveloperAssistant from './components/DeveloperAssistant';


const tools: Tool[] = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', name: 'AI Chat', icon: Bot },
    { id: 'image-generator', name: 'Image Generation', icon: Image },
    { id: 'image-editor', name: 'Image Editing', icon: Image },
    { id: 'poster-generator', name: 'Poster Generator', icon: LayoutTemplate },
    { id: 'video-generator', name: 'Video Generation', icon: Video },
    { id: 'video-analyzer', name: 'Video Analysis', icon: Film },
    { id: 'live-conversation', name: 'Live Conversation', icon: Mic },
    { id: 'complex-reasoning', name: 'Complex Reasoning', icon: BrainCircuit },
    { id: 'data-analysis', name: 'Content Analysis', icon: BarChart },
    { id: 'whatsapp-bot', name: 'WhatsApp Bot', icon: MessageCircle },
    { id: 'qr-code-generator', name: 'QR Code Generator', icon: QrCode },
    { id: 'dev-assistant', name: 'AI Developer', icon: CodeXml },
];

const App: React.FC = () => {
    const [activeTool, setActiveTool] = useState<string>('dashboard');

    const renderActiveTool = useCallback(() => {
        switch (activeTool) {
            case 'dashboard':
                return <Dashboard setActiveTool={setActiveTool} />;
            case 'chat':
                return <Chat />;
            case 'image-generator':
                return <ImageGenerator />;
            case 'image-editor':
                return <ImageEditor />;
            case 'poster-generator':
                return <PosterGenerator />;
            case 'video-generator':
                return <VideoGenerator />;
            case 'video-analyzer':
                return <VideoAnalyzer />;
            case 'live-conversation':
                return <LiveConversation />;
            case 'complex-reasoning':
                return <ComplexReasoning />;
            case 'data-analysis':
                return <DataAnalysis />;
            case 'whatsapp-bot':
                return <WhatsAppBot />;
            case 'qr-code-generator':
                return <QRCodeGenerator />;
            case 'dev-assistant':
                return <DeveloperAssistant />;
            default:
                return <Dashboard setActiveTool={setActiveTool} />;
        }
    }, [activeTool]);

    return (
        <div className="flex h-screen w-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
            <Sidebar tools={tools} activeTool={activeTool} setActiveTool={setActiveTool} />
            <main className="flex-1 flex flex-col h-screen overflow-y-auto">
                {renderActiveTool()}
            </main>
        </div>
    );
};

export default App;`
    },
    {
        path: 'types.ts',
        content: `

export interface GroundingChunk {
    web?: {
        uri?: string;
        title?: string;
    };
    maps?: {
        uri?: string;
        title?: string;
        placeAnswerSources?: {
            // FIX: Made \`reviewSnippets\` optional to align with the \`@google/genai\` library's \`GroundingChunk\` type, which was causing a type assignment error.
            reviewSnippets?: {
                uri?: string;
                title?: string;
            }[];
        };
    };
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
    sources?: GroundingChunk[];
}

export type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
export type VideoAspectRatio = "16:9" | "9:16";`
    },
    {
        path: 'utils/fileUtils.ts',
        content: `

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // remove data:mime/type;base64, prefix
            resolve(result.split(',')[1]);
        };
        reader.onerror = (error) => reject(error);
    });
};`
    },
    {
        path: 'services/geminiService.ts',
        content: `




import { GoogleGenAI, GenerateContentResponse, Chat, Modality, Type } from "@google/genai";
import { GroundingChunk } from '../types';
import { fileToBase64 } from "../utils/fileUtils";

// IMPORTANT: Do not expose this key publicly.
// It is assumed that process.env.API_KEY is configured in the build environment.
const getApiKey = () => {
    const key = process.env.API_KEY;
    if (!key) {
        throw new Error("API_KEY environment variable not set.");
    }
    return key;
};

const getAiClient = () => new GoogleGenAI({ apiKey: getApiKey() });

export const createChat = (systemInstruction: string): Chat => {
    const ai = getAiClient();
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction,
        },
    });
};

export const generateTextWithGrounding = async (
    prompt: string,
    useSearch: boolean,
    useMaps: boolean,
    location: GeolocationCoordinates | null
): Promise<{ text: string, sources: GroundingChunk[] }> => {
    const ai = getAiClient();
    const tools: any[] = [];
    if (useSearch) tools.push({ googleSearch: {} });
    if (useMaps) tools.push({ googleMaps: {} });

    const toolConfig: any = {};
    if (useMaps && location) {
        toolConfig.retrievalConfig = {
            latLng: {
                latitude: location.latitude,
                longitude: location.longitude,
            }
        };
    }
    
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            tools: tools.length > 0 ? tools : undefined,
            toolConfig: Object.keys(toolConfig).length > 0 ? toolConfig : undefined,
        },
    });

    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return { text, sources };
};

export const generateTextComplex = async (prompt: string): Promise<string> => {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            thinkingConfig: { thinkingBudget: 32768 }
        }
    });
    return response.text;
};

export const analyzeContent = async (prompt: string, imageBase64?: string, imageMimeType?: string): Promise<string> => {
    const ai = getAiClient();
    const parts: any[] = [{ text: prompt }];
    if (imageBase64 && imageMimeType) {
        parts.unshift({
            inlineData: {
                data: imageBase64,
                mimeType: imageMimeType,
            },
        });
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts },
    });
    return response.text;
};

export const generateImage = async (prompt: string, aspectRatio: string): Promise<string> => {
    const ai = getAiClient();
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio,
        },
    });

    const generatedImage = response.generatedImages?.[0];

    if (!generatedImage?.image?.imageBytes) {
        throw new Error("Image generation failed. The model did not return an image. This could be due to safety policies or other issues.");
    }

    const base64ImageBytes = generatedImage.image.imageBytes;
    return \`data:image/jpeg;base64,\${base64ImageBytes}\`;
};

export const editImage = async (prompt: string, imageBase64: string, mimeType: string): Promise<string> => {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                {
                    inlineData: { data: imageBase64, mimeType },
                },
                { text: prompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return \`data:\${part.inlineData.mimeType};base64,\${base64ImageBytes}\`;
        }
    }
    throw new Error("No image generated from edit.");
};

export const generateVideo = async (prompt: string, imageBase64?: string, mimeType?: string, aspectRatio?: "16:9" | "9:16") => {
    const ai = getAiClient();
    const requestPayload: any = {
        model: 'veo-3.1-fast-generate-preview',
        prompt,
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio,
        }
    };

    if (imageBase64 && mimeType) {
        requestPayload.image = {
            imageBytes: imageBase64,
            mimeType,
        };
    }
    
    let operation = await ai.models.generateVideos(requestPayload);
    
    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Video generation failed.");
    
    const response = await fetch(\`\${downloadLink}&key=\${getApiKey()}\`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
};

export const analyzeVideo = async (prompt: string, frames: string[]): Promise<string> => {
    const ai = getAiClient();
    
    const parts: any[] = [{ text: prompt }];
    frames.forEach(frame => {
        parts.push({
            inlineData: {
                mimeType: 'image/jpeg',
                data: frame
            }
        });
    });

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: { parts },
    });

    return response.text;
};

export const transcribeVideoAudio = async (videoFile: File): Promise<string> => {
    const ai = getAiClient();
    const videoBase64 = await fileToBase64(videoFile);
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { text: "Please transcribe the audio from this video. If there is no audio, please respond with 'No audio detected.'." },
                {
                    inlineData: {
                        mimeType: videoFile.type,
                        data: videoBase64,
                    },
                },
            ],
        },
    });

    return response.text;
};

export const fetchLatestNews = async (): Promise<{ articles: { title: string; snippet: string; link: string }[] }> => {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Find the latest top 5 news articles about AI and Technology. Respond with only a JSON object containing a key "articles" which is an array of objects. Each object should have "title", "snippet", and "link" properties.',
        config: {
            tools: [{ googleSearch: {} }],
        },
    });
    
    try {
        const cleanedText = response.text.replace(/^\\\`\\\`\\\`(json)?\\n|\\\`\\\`\\\`$/g, '').trim();
        const data = JSON.parse(cleanedText);
        if (data && Array.isArray(data.articles)) {
            return data;
        }
        return { articles: [] };
    } catch (e) {
        console.error("Failed to parse news response:", e, "Raw response:", response.text);
        return { articles: [] };
    }
};

export const generateSpeech = async (text: string): Promise<string> => {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-tts',
        contents: [{ parts: [{ text: \`Say with a clear and professional voice: \${text}\` }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
        },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
        throw new Error("Speech generation failed.");
    }
    return base64Audio;
};


export const getLiveSession = () => {
    const ai = getAiClient();
    return ai.live;
};

export const auditCodebase = async (files: {path: string, content: string}[]): Promise<string> => {
    const ai = getAiClient();
    const fileContents = files.map(f => \`--- START OF FILE \${f.path} ---\\n\${f.content}\\n--- END OF FILE \${f.path} ---\`).join('\\n\\n');

    const prompt = \`You are a world-class senior frontend engineer and UI/UX expert. I will provide you with the contents of several files from a web application. Please review the code for bugs, performance issues, adherence to best practices, accessibility problems, and potential UI/UX improvements.

For each issue you find, please provide:
1. The file path.
2. A clear description of the problem.
3. A suggested code snippet to fix the issue.

Structure your response clearly using Markdown. Here are the files:

\${fileContents}
\`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro', // Use pro for better code analysis
        contents: prompt,
    });
    return response.text;
};

export const generateCodeUpdate = async (files: {path: string, content: string}[], userRequest: string): Promise<string> => {
    const ai = getAiClient();
    const fileContents = files.map(f => \`--- START OF FILE \${f.path} ---\\n\${f.content}\\n--- END OF FILE \${f.path} ---\`).join('\\n\\n');

    const prompt = \`You are a world-class senior frontend engineer acting as an AI code assistant. The user wants to make changes to the application. Your task is to generate the updated code.

**User's Request:** "\${userRequest}"

**Instructions:**
1. Analyze the user's request and the provided codebase.
2. Determine which files need to be modified.
3. Respond with ONLY an XML block containing the full, updated content of the changed files. Do not add any other explanation or text outside the XML block.
4. If a file does not need to be changed, do not include it in your response.
5. The XML format MUST be:
<changes>
  <change>
    <file>[full_path_of_file]</file>
    <description>[A brief description of the change made to this file]</description>
    <content><![CDATA[Full new content of the file]]></content>
  </change>
</changes>

**Current Codebase:**
\${fileContents}
\`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
    });
    return response.text;
};`
    },
    {
        path: 'hooks/useVeoApiKey.ts',
        content: `

import { useState, useEffect, useCallback } from 'react';

// Mocking the window.aistudio object for development if it doesn't exist
if (typeof window !== 'undefined' && !(window as any).aistudio) {
    console.warn("Mocking window.aistudio for development. This will not work in production.");
    (window as any).aistudio = {
        hasSelectedApiKey: async () => true, // Assume key is selected in mock
        openSelectKey: async () => console.log("Mock openSelectKey called"),
    };
}


export const useVeoApiKey = () => {
    const [isKeySelected, setIsKeySelected] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    const checkKey = useCallback(async () => {
        setIsChecking(true);
        try {
            const hasKey = await (window as any).aistudio.hasSelectedApiKey();
            setIsKeySelected(hasKey);
        } catch (error) {
            console.error("Error checking for API key:", error);
            setIsKeySelected(false);
        } finally {
            setIsChecking(false);
        }
    }, []);

    const selectKey = useCallback(async () => {
        try {
            await (window as any).aistudio.openSelectKey();
            // Assume success after opening dialog to handle race condition
            setIsKeySelected(true); 
        } catch (error) {
            console.error("Error opening API key selection:", error);
            setIsKeySelected(false);
        }
    }, []);
    
    const handleApiError = useCallback((error: any) => {
        if (error?.message?.includes("Requested entity was not found.")) {
            setIsKeySelected(false);
        }
    }, []);

    useEffect(() => {
        checkKey();
    }, [checkKey]);

    return { isKeySelected, isChecking, selectKey, handleApiError, checkKey };
};`
    },
    {
        path: 'components/Sidebar.tsx',
        content: `

import React from 'react';
import type { LucideProps } from 'lucide-react';

export interface Tool {
    id: string;
    name: string;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
}

interface SidebarProps {
    tools: Tool[];
    activeTool: string;
    setActiveTool: (id: string) => void;
}

// Replaced corrupted logo with a valid SVG logo to fix app loading issue.
const visionPointLogo = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDEwMCAxMDAiPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMjAiIGZpbGw9IiNkYzI2MjYiLz48cGF0aCBkPSJNMjUgMjAgTDQwIDcwIEw1NSAyMCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTU1IDUwIEMgNzUgNTAsIDc1IDgwLCA1NSA4MCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PGNpcmNsZSBjeD0iNzUiIGN5PSIyNSIgcj0iNSIgZmlsbD0id2hpdGUiLz48L3N2Zz4=";

export const Sidebar: React.FC<SidebarProps> = ({ tools, activeTool, setActiveTool }) => {
    return (
        <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col p-4">
            <div className="mb-8 px-2">
                <div className="flex items-center gap-2">
                     <img src={visionPointLogo} alt="Vision Point Logo" className="w-10 h-10" />
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Vision Point Studio</h1>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 pl-12">by Muhammad Qureshi</p>
            </div>
            <nav className="flex flex-col gap-2">
                {tools.map((tool) => (
                    <button
                        key={tool.id}
                        onClick={() => setActiveTool(tool.id)}
                        className={\`flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors \${
                            activeTool === tool.id
                                ? 'bg-red-600 text-white'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }\`}
                    >
                        <tool.icon size={20} />
                        <span>{tool.name}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
};`
    },
    {
        path: 'components/LoadingSpinner.tsx',
        content: `

import React from 'react';

interface LoadingSpinnerProps {
    className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = 'w-5 h-5' }) => {
    return (
        <div
            className={\`animate-spin rounded-full border-t-2 border-r-2 border-white \${className}\`}
            role="status"
            aria-live="polite"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default LoadingSpinner;`
    },
    {
        path: 'components/ApiKeyDialog.tsx',
        content: `

import React from 'react';
import { KeyRound } from 'lucide-react';

interface ApiKeyDialogProps {
  onSelectKey: () => void;
}

const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({ onSelectKey }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50 dark:bg-gray-900 rounded-lg">
      <div className="bg-red-100 dark:bg-red-900/50 p-4 rounded-full mb-6">
        <KeyRound className="w-10 h-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">API Key Required</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
        To generate videos with VEO, you need to select a Gemini API key. Project owners are responsible for billing.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onSelectKey}
          className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors"
        >
          Select API Key
        </button>
        <a
          href="https://ai.google.dev/gemini-api/docs/billing"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Learn about Billing
        </a>
      </div>
    </div>
  );
};

export default ApiKeyDialog;`
    },
    {
        path: 'components/Chat.tsx',
        content: `

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

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };
    
    // FIX: Updated \`renderSource\` to use \`uri\` and \`title\` properties for map review snippets, aligning with the corrected \`GroundingChunk\` type.
    const renderSource = (source: GroundingChunk, index: number) => {
        if (source.web?.uri) {
            return <a key={index} href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline block truncate">{source.web.title || source.web.uri}</a>;
        }

        if (source.maps) {
            const mapElements: React.ReactNode[] = [];
            if (source.maps.uri) {
                mapElements.push(
                    <a key={\`\${index}-map\`} href={source.maps.uri} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline block truncate">
                        {source.maps.title || 'View on Google Maps'}
                    </a>
                );
            }
            source.maps.placeAnswerSources?.reviewSnippets?.forEach((snippet, i) => {
                if (snippet.uri) {
                    mapElements.push(
                        <a key={\`\${index}-review-\${i}\`} href={snippet.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline block truncate">
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
                    <div key={index} className={\`flex items-start gap-4 \${msg.role === 'user' ? 'justify-end' : ''}\`}>
                        {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0"><Bot size={20} className="text-white" /></div>}
                        <div className={\`max-w-xl p-4 rounded-2xl \${msg.role === 'user' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-red-50 dark:bg-red-900/50'}\`}>
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
                    <button onClick={() => setUseSearch(!useSearch)} className={\`flex items-center gap-1 text-xs px-3 py-1 rounded-full border \${useSearch ? 'bg-red-600 text-white border-red-600' : 'bg-transparent border-gray-300 dark:border-gray-600'}\`}><Globe size={14} /> Google Search</button>
                    <button onClick={() => setUseMaps(!useMaps)} className={\`flex items-center gap-1 text-xs px-3 py-1 rounded-full border \${useMaps ? 'bg-green-500 text-white border-green-500' : 'bg-transparent border-gray-300 dark:border-gray-600'}\`}><MapPin size={14} /> Google Maps</button>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
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

export default Chat;`
    },
    {
        path: 'components/ImageGenerator.tsx',
        content: `

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

export default ImageGenerator;`
    },
    {
        path: 'components/ImageEditor.tsx',
        content: `

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

export default ImageEditor;`
    },
    {
        path: 'components/VideoGenerator.tsx',
        content: `

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

export default VideoGenerator;`
    },
    {
        path: 'components/VideoAnalyzer.tsx',
        content: `


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

export default VideoAnalyzer;`
    },
    {
        path: 'components/LiveConversation.tsx',
        content: `

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
            
            const outputNode = outputAudioContext.current.createGain();
            outputNode.connect(outputAudioContext.current.destination);

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
                            source.connect(outputNode);
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
                <button onClick={toggleListen} className={\`relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300 \${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-red-600 hover:bg-red-700'}\`}>
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
                        <div key={i} className={\`flex items-start gap-2 \${t.role === 'user' ? 'text-gray-600 dark:text-gray-300' : 'text-red-600 dark:text-red-400'}\`}>
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

export default LiveConversation;`
    },
    {
        path: 'components/ComplexReasoning.tsx',
        content: `

import React, { useState } from 'react';
import { BrainCircuit, Send } from 'lucide-react';
import { generateTextComplex } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

const ComplexReasoning: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!prompt || isLoading) return;
        setIsLoading(true);
        setError(null);
        setResult('');
        try {
            const response = await generateTextComplex(prompt);
            setResult(response);
        } catch (err) {
            console.error(err);
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <header className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold">Complex Reasoning</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Powered by Gemini 2.5 Pro with enhanced thinking capabilities.</p>
            </header>
            <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="complex-prompt" className="block text-sm font-medium mb-1">Your Complex Prompt</label>
                        <textarea
                            id="complex-prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Enter a complex query, a coding problem, or a multi-step reasoning task..."
                            className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none h-40 resize-none"
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                        disabled={isLoading || !prompt}
                    >
                        {isLoading ? <><LoadingSpinner /> Thinking...</> : <><BrainCircuit size={18} /> Process</>}
                    </button>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
                <div className="mt-6 flex-1">
                    <h3 className="font-semibold mb-2">Result</h3>
                    <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-4 h-full overflow-y-auto">
                        {isLoading && (
                            <div className="flex items-center justify-center h-full">
                                <LoadingSpinner className="w-12 h-12" />
                            </div>
                        )}
                        {!isLoading && !result && (
                            <p className="text-gray-500 text-center mt-8">The result will appear here.</p>
                        )}
                        {result && <pre className="whitespace-pre-wrap text-sm">{result}</pre>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplexReasoning;`
    },
    {
        path: 'components/DataAnalysis.tsx',
        content: `

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

export default DataAnalysis;`
    },
    {
        path: 'components/PosterGenerator.tsx',
        content: `

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
            const prompt = \`Create a visually stunning, high-quality poster background image that complements the following text. The background should be evocative and artistic, suitable for a poster, and should not contain any text itself. The text it should be based on is: "\${posterText}"\`;
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
            ctx.font = \`bold \${responsiveFontSize}px \${selectedFont.family}\`;
            ctx.fillStyle = fontColor;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            if (textShadow) {
                ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
                ctx.shadowOffsetX = responsiveFontSize * 0.05;
                ctx.shadowOffsetY = responsiveFontSize * 0.05;
                ctx.shadowBlur = responsiveFontSize * 0.1;
            }

            const lines = posterText.split('\\n');
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
                                        fontSize: \`\${fontSize}px\`,
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

export default PosterGenerator;`
    },
    {
        path: 'components/Dashboard.tsx',
        content: `

import React, { useState, useEffect } from 'react';
import { fetchLatestNews } from '../services/geminiService';
import { generateTextComplex, generateImage } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { BookText, Images, X } from 'lucide-react';

interface NewsArticle {
    title: string;
    snippet: string;
    link: string;
}

interface DashboardProps {
    setActiveTool: (toolId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveTool }) => {
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [script, setScript] = useState<string | null>(null);
    const [isScriptLoading, setIsScriptLoading] = useState(false);
    
    const [visuals, setVisuals] = useState<string[]>([]);
    const [isVisualsLoading, setIsVisualsLoading] = useState(false);

    useEffect(() => {
        const loadNews = async () => {
            try {
                const data = await fetchLatestNews();
                setNews(data.articles || []);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch latest news.');
            } finally {
                setIsLoading(false);
            }
        };
        loadNews();
    }, []);

    const handleCreateScript = async (article: NewsArticle) => {
        setIsScriptLoading(true);
        setScript(null);
        setVisuals([]);
        try {
            const prompt = \`Create a 9-minute monologue video script based on the following news article. The script should be engaging, informative, and structured for a video format. Include clear suggestions for visuals (e.g., "[VISUAL: A futuristic robot arm assembling a microchip]").\\n\\nTitle: \${article.title}\\n\\nSnippet: \${article.snippet}\\n\\nLink: \${article.link}\`;
            const generatedScript = await generateTextComplex(prompt);
            setScript(generatedScript);
        } catch (error) {
            console.error(error);
            setError("Failed to generate script.");
        } finally {
            setIsScriptLoading(false);
        }
    };

    const handleFindVisuals = async () => {
        if (!script) return;
        setIsVisualsLoading(true);
        setVisuals([]);
        try {
            const visualPrompts = script.match(/\\[VISUAL:(.*?)\\]/g)
                ?.map(v => v.replace('[VISUAL:', '').replace(']', '').trim())
                .slice(0, 4) || []; // Limit to 4 visuals for performance

            if (visualPrompts.length === 0) {
                 visualPrompts.push("An abstract background representing artificial intelligence and technology");
            }
            
            const imagePromises = visualPrompts.map(prompt => generateImage(prompt, '16:9'));
            const generatedImages = await Promise.all(imagePromises);
            setVisuals(generatedImages);

        } catch (error) {
            console.error(error);
            setError("Failed to generate visuals.");
        } finally {
            setIsVisualsLoading(false);
        }
    };

    const resetState = () => {
        setScript(null);
        setVisuals([]);
        setError(null);
    };

    if (script) {
        return (
            <div className="flex flex-col h-full">
                <header className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Generated Content</h2>
                    <button onClick={resetState} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><X size={20}/></button>
                </header>
                <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 overflow-y-auto">
                    <div className="lg:w-1/2 flex flex-col">
                        <h3 className="text-lg font-semibold mb-2">Generated Script</h3>
                         <div className="flex-1 bg-gray-100 dark:bg-gray-800/50 rounded-lg p-4 overflow-y-auto">
                            <pre className="whitespace-pre-wrap text-sm">{script}</pre>
                        </div>
                        <button onClick={handleFindVisuals} disabled={isVisualsLoading} className="mt-4 w-full flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors">
                            {isVisualsLoading ? <><LoadingSpinner /> Finding Visuals...</> : <><Images size={18} /> Find Visuals</>}
                        </button>
                    </div>
                    <div className="lg:w-1/2 flex flex-col">
                         <h3 className="text-lg font-semibold mb-2">Generated Visuals</h3>
                         <div className="flex-1 bg-gray-100 dark:bg-gray-800/50 rounded-lg p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {isVisualsLoading && <div className="col-span-2 flex items-center justify-center"><LoadingSpinner className="w-10 h-10" /></div>}
                            {visuals.map((url, index) => (
                                <img key={index} src={url} alt={\`Visual \${index + 1}\`} className="w-full h-full object-cover rounded-md" />
                            ))}
                         </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <header className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold">Content Dashboard</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Your starting point for automated content creation.</p>
            </header>
            <div className="flex-1 p-6 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Latest in AI & Tech</h3>
                {isLoading && <div className="flex justify-center"><LoadingSpinner className="w-10 h-10" /></div>}
                {error && <p className="text-red-500">{error}</p>}
                {!isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {news.map((article, index) => (
                            <div key={index} className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-800 flex flex-col justify-between">
                               <div>
                                   <h4 className="font-bold mb-2">{article.title}</h4>
                                   <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{article.snippet}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                     <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-sm text-red-500 hover:underline">Read more</a>
                                     <button onClick={() => handleCreateScript(article)} disabled={isScriptLoading} className="w-full mt-2 flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors">
                                        {isScriptLoading ? <LoadingSpinner /> : <BookText size={16}/>}
                                        Create Script
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;`
    },
    {
        path: 'components/WhatsAppBot.tsx',
        content: `

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
                setLogs(prev => [\`[\${new Date().toLocaleTimeString()}] \${activities[logIndex % activities.length]}\`, ...prev.slice(0, 10)]);
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
            setError(err.message || \`Failed to generate \${activeTest}.\`);
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
                            <img src={qrCodeUrl} alt="WhatsApp QR Code" className={\`rounded-md \${!isConnected ? 'grayscale-0' : 'grayscale'}\`} />
                            <button onClick={() => setIsConnected(!isConnected)} className={\`mt-4 w-full py-2 rounded-lg font-semibold \${isConnected ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}\`}>
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
                        <button onClick={() => setActiveTest('voice')} className={\`px-4 py-2 font-semibold \${activeTest === 'voice' ? 'border-b-2 border-red-500 text-red-500' : ''}\`}><AudioLines size={16} className="inline mr-1"/> Voiceover</button>
                        <button onClick={() => setActiveTest('video')} className={\`px-4 py-2 font-semibold \${activeTest === 'video' ? 'border-b-2 border-red-500 text-red-500' : ''}\`}><Video size={16} className="inline mr-1"/> VEO Video</button>
                        <button onClick={() => setActiveTest('image')} className={\`px-4 py-2 font-semibold \${activeTest === 'image' ? 'border-b-2 border-red-500 text-red-500' : ''}\`}><Image size={16} className="inline mr-1"/> Image</button>
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
                               {isLoading ? <LoadingSpinner /> : \`Generate \${activeTest}\`}
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

export default WhatsAppBot;`
    },
    {
        path: 'components/QRCodeGenerator.tsx',
        content: `

import React, { useState } from 'react';
import { QrCode, Download } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const QRCodeGenerator: React.FC = () => {
    const [data, setData] = useState('https://visionpointpk.com/');
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = () => {
        if (!data) {
            setError("Please enter some data to generate a QR code.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setQrCodeUrl(null);

        const encodedUrl = encodeURIComponent(data);
        const apiUrl = \`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=\${encodedUrl}\`;
        
        // Preload image to check for errors and handle loading state
        const img = new Image();
        img.src = apiUrl;
        img.onload = () => {
            setQrCodeUrl(apiUrl);
            setIsLoading(false);
        };
        img.onerror = () => {
            setError("Failed to generate QR code. The service might be unavailable.");
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        if (!qrCodeUrl) return;
        const link = document.createElement('a');
        link.href = qrCodeUrl;
        link.download = 'qrcode.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-col h-full">
            <header className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold">QR Code Generator</h2>
            </header>
            <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
                <div className="w-full max-w-md space-y-4">
                    <div>
                        <label htmlFor="qr-data" className="block text-sm font-medium mb-1">URL or Text</label>
                        <input
                            id="qr-data"
                            type="text"
                            value={data}
                            onChange={(e) => setData(e.target.value)}
                            placeholder="Enter a website URL or any text"
                            className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                        />
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                    >
                        {isLoading ? <LoadingSpinner /> : <QrCode size={18} />}
                        Generate QR Code
                    </button>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                </div>
                <div className="w-full max-w-md h-64 bg-gray-100 dark:bg-gray-800/50 rounded-lg flex items-center justify-center p-4">
                    {isLoading && <LoadingSpinner className="w-12 h-12" />}
                    {!isLoading && qrCodeUrl && (
                        <img src={qrCodeUrl} alt="Generated QR Code" className="w-[250px] h-[250px]" />
                    )}
                    {!isLoading && !qrCodeUrl && (
                         <p className="text-gray-500">Your QR code will appear here.</p>
                    )}
                </div>
                {qrCodeUrl && !isLoading && (
                    <button
                        onClick={handleDownload}
                        className="w-full max-w-md flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <Download size={18} /> Download
                    </button>
                )}
            </div>
        </div>
    );
};

export default QRCodeGenerator;`
    },
    {
        path: 'components/DeveloperAssistant.tsx',
        content: `import React, { useState } from 'react';
import { auditCodebase, generateCodeUpdate } from '../services/geminiService';
import { CODEBASE_FILES } from '../services/codebase';
import LoadingSpinner from './LoadingSpinner';
import { CodeXml, Wand2 } from 'lucide-react';

type Tab = 'audit' | 'update';

const DeveloperAssistant: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('audit');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [updateRequest, setUpdateRequest] = useState('');

    const handleAudit = async () => {
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const response = await auditCodebase(CODEBASE_FILES);
            setResult(response);
        } catch (err) {
            console.error(err);
            setError('An error occurred while auditing the code.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleUpdate = async () => {
        if (!updateRequest) return;
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const response = await generateCodeUpdate(CODEBASE_FILES, updateRequest);
            setResult(response);
        } catch (err) {
            console.error(err);
            setError('An error occurred while generating the code update.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <header className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-bold">AI Developer Assistant</h2>
                 <p className="text-sm text-gray-500 dark:text-gray-400">Audit code and generate updates with AI.</p>
            </header>
            <div className="border-b border-gray-200 dark:border-gray-800">
                <nav className="flex gap-4 px-6">
                    <button onClick={() => setActiveTab('audit')} className={\`py-3 font-medium border-b-2 \${activeTab === 'audit' ? 'border-red-500 text-red-500' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}\`}>Code Auditor</button>
                    <button onClick={() => setActiveTab('update')} className={\`py-3 font-medium border-b-2 \${activeTab === 'update' ? 'border-red-500 text-red-500' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}\`}>Live Updater</button>
                </nav>
            </div>
            <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                {activeTab === 'audit' && (
                    <>
                        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">Click the button to run a full audit of the application's frontend code. The AI will check for bugs, performance issues, and suggest improvements.</p>
                        <button onClick={handleAudit} disabled={isLoading} className="w-full max-w-sm mx-auto flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors">
                            {isLoading ? <><LoadingSpinner /> Auditing Codebase...</> : <><CodeXml size={18} /> Run Code Audit</>}
                        </button>
                    </>
                )}
                {activeTab === 'update' && (
                     <>
                        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">Describe the changes you want to make to the application. The AI will generate the necessary code modifications.
                        <br/>
                        <strong className="text-amber-500">Note: This tool only shows the code changes. You must manually apply them to your files.</strong>
                        </p>
                        <textarea value={updateRequest} onChange={(e) => setUpdateRequest(e.target.value)} placeholder="e.g., Change the primary color to blue and increase the default font size." className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none h-24 resize-none mb-4" disabled={isLoading} />
                        <button onClick={handleUpdate} disabled={isLoading || !updateRequest} className="w-full max-w-sm mx-auto flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors">
                            {isLoading ? <><LoadingSpinner /> Generating Update...</> : <><Wand2 size={18} /> Generate Update</>}
                        </button>
                    </>
                )}
                <div className="mt-6 flex-1">
                    <h3 className="font-semibold mb-2">Result</h3>
                    <div className="bg-gray-900 text-gray-200 font-mono rounded-lg p-4 h-full overflow-y-auto">
                        {isLoading && (
                            <div className="flex items-center justify-center h-full">
                                <LoadingSpinner className="w-12 h-12" />
                            </div>
                        )}
                        {!isLoading && !result && (
                            <p className="text-gray-500 text-center mt-8 font-sans">The result will appear here.</p>
                        )}
                        {error && <p className="text-red-400 font-sans">{error}</p>}
                        {result && <pre className="whitespace-pre-wrap text-sm">{result}</pre>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeveloperAssistant;`
    }
];