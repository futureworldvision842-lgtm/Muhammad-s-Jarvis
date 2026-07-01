import React, { useState } from 'react';
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
                    <button onClick={() => setActiveTab('audit')} className={`py-3 font-medium border-b-2 ${activeTab === 'audit' ? 'border-red-500 text-red-500' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>Code Auditor</button>
                    <button onClick={() => setActiveTab('update')} className={`py-3 font-medium border-b-2 ${activeTab === 'update' ? 'border-red-500 text-red-500' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>Live Updater</button>
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

export default DeveloperAssistant;
