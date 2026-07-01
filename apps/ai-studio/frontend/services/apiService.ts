// API Service for communicating with backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class APIService {
    // Chat API
    async generateText(prompt, useSearch = false, useMaps = false, location = null) {
        const response = await fetch(`${API_BASE_URL}/chat/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, useSearch, useMaps, location })
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    }

    async generateComplexReasoning(prompt) {
        const response = await fetch(`${API_BASE_URL}/chat/complex`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    }

    async analyzeContent(prompt, imageBase64 = null, imageMimeType = null) {
        const response = await fetch(`${API_BASE_URL}/chat/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, imageBase64, imageMimeType })
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    }

    // Image API
    async generateImage(prompt, aspectRatio = '1:1') {
        const response = await fetch(`${API_BASE_URL}/image/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, aspectRatio })
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    }

    async editImage(prompt, imageBase64, mimeType) {
        const response = await fetch(`${API_BASE_URL}/image/edit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, imageBase64, mimeType })
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    }

    // Video API
    async generateVideo(prompt, imageBase64 = null, mimeType = null, aspectRatio = '16:9') {
        const response = await fetch(`${API_BASE_URL}/video/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, imageBase64, mimeType, aspectRatio })
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    }

    async analyzeVideo(prompt, frames) {
        const response = await fetch(`${API_BASE_URL}/video/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, frames })
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    }

    async transcribeVideo(videoBase64, mimeType) {
        const response = await fetch(`${API_BASE_URL}/video/transcribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ videoBase64, mimeType })
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    }

    // Audio API
    async generateSpeech(text) {
        const response = await fetch(`${API_BASE_URL}/audio/generate-speech`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    }

    // Content API (Urdu Scripts, Visuals, etc.)
    async generateScript(topic, includeAudio = false, includeVisuals = false, voiceName = null) {
        const response = await fetch(`${API_BASE_URL}/content/script`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic, includeAudio, includeVisuals, voiceName })
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    }

    async generateVisuals(content) {
        const response = await fetch(`${API_BASE_URL}/content/visuals`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    }

    async generateVoice(text, voiceName = null) {
        const response = await fetch(`${API_BASE_URL}/content/voice`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, voiceName })
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    }

    async getHeadlines() {
        const response = await fetch(`${API_BASE_URL}/content/headlines`);
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    }

    async generatePoster(text, backgroundPrompt = null) {
        const response = await fetch(`${API_BASE_URL}/content/poster`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, backgroundPrompt })
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    }

    // Developer API
    async auditCode(files) {
        const response = await fetch(`${API_BASE_URL}/developer/audit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ files })
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    }

    async generateCodeUpdate(files, userRequest) {
        const response = await fetch(`${API_BASE_URL}/developer/generate-update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ files, userRequest })
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    }

    // WhatsApp API
    async connectWhatsApp() {
        const response = await fetch(`${API_BASE_URL}/whatsapp/connect`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    }

    async getWhatsAppStatus() {
        const response = await fetch(`${API_BASE_URL}/whatsapp/status`);
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    }

    async sendWhatsAppMessage(to, message) {
        const response = await fetch(`${API_BASE_URL}/whatsapp/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to, message })
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    }

    async getWhatsAppGroups() {
        const response = await fetch(`${API_BASE_URL}/whatsapp/groups`);
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    }

    // Health Check
    async healthCheck() {
        const response = await fetch('http://localhost:5000/health');
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    }
}

export default new APIService();
