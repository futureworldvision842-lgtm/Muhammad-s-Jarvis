
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

export default ApiKeyDialog;
