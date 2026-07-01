


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

export default App;