
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

export default ComplexReasoning;
