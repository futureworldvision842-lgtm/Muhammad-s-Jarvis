
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
            const prompt = `Create a 9-minute monologue video script based on the following news article. The script should be engaging, informative, and structured for a video format. Include clear suggestions for visuals (e.g., "[VISUAL: A futuristic robot arm assembling a microchip]").\n\nTitle: ${article.title}\n\nSnippet: ${article.snippet}\n\nLink: ${article.link}`;
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
            const visualPrompts = script.match(/\[VISUAL:(.*?)\]/g)
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
                                <img key={index} src={url} alt={`Visual ${index + 1}`} className="w-full h-full object-cover rounded-md" />
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

export default Dashboard;
