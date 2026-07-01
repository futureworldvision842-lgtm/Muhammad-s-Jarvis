
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
};
