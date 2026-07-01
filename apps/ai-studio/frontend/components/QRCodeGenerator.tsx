
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
        const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodedUrl}`;
        
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

export default QRCodeGenerator;
