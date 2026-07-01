




import { GoogleGenAI, GenerateContentResponse, Chat, Modality, Type } from "@google/genai";
import { GroundingChunk } from '../types';
import { fileToBase64 } from "../utils/fileUtils";
import apiService from "./apiService";

// IMPORTANT: Do not expose this key publicly.
// It is assumed that process.env.API_KEY or process.env.GEMINI_API_KEY is configured in the build environment.
const getApiKey = () => {
    const key = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!key) {
        throw new Error("API_KEY or GEMINI_API_KEY environment variable not set. Please set it in your .env file or environment.");
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
    try {
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
    } catch (err) {
        console.warn("Direct client Gemini text generation failed, falling back to backend:", err);
        const res = await apiService.generateText(prompt, useSearch, useMaps, location);
        return { text: res.text, sources: res.sources || [] };
    }
};

export const generateTextComplex = async (prompt: string): Promise<string> => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 32768 }
            }
        });
        return response.text;
    } catch (err) {
        console.warn("Direct client reasoning failed, falling back to backend:", err);
        const res = await apiService.generateComplexReasoning(prompt);
        return res.text;
    }
};

export const analyzeContent = async (prompt: string, imageBase64?: string, imageMimeType?: string): Promise<string> => {
    try {
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
    } catch (err) {
        console.warn("Direct client content analysis failed, falling back to backend:", err);
        const res = await apiService.analyzeContent(prompt, imageBase64, imageMimeType);
        return res.text;
    }
};

export const generateImage = async (prompt: string, aspectRatio: string): Promise<string> => {
    try {
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
            throw new Error("Image generation failed. The model did not return an image.");
        }

        const base64ImageBytes = generatedImage.image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    } catch (err) {
        console.warn("Direct client image generation failed, falling back to backend:", err);
        const res = await apiService.generateImage(prompt, aspectRatio);
        return res.imageUrl || res.image || res.text;
    }
};

export const editImage = async (prompt: string, imageBase64: string, mimeType: string): Promise<string> => {
    try {
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
                return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
            }
        }
        throw new Error("No image generated from edit.");
    } catch (err) {
        console.warn("Direct client image edit failed, falling back to backend:", err);
        const res = await apiService.editImage(prompt, imageBase64, mimeType);
        return res.imageUrl || res.image || res.text;
    }
};

export const generateVideo = async (prompt: string, imageBase64?: string, mimeType?: string, aspectRatio?: "16:9" | "9:16") => {
    try {
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
        
        const response = await fetch(`${downloadLink}&key=${getApiKey()}`);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (err) {
        console.warn("Direct client video generation failed, falling back to backend:", err);
        const res = await apiService.generateVideo(prompt, imageBase64, mimeType, aspectRatio);
        return res.videoUrl || res.video || res.text;
    }
};

export const analyzeVideo = async (prompt: string, frames: string[]): Promise<string> => {
    try {
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
    } catch (err) {
        console.warn("Direct client video analysis failed, falling back to backend:", err);
        const res = await apiService.analyzeVideo(prompt, frames);
        return res.text;
    }
};

export const transcribeVideoAudio = async (videoFile: File): Promise<string> => {
    try {
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
    } catch (err) {
        console.warn("Direct client video transcription failed, falling back to backend:", err);
        const videoBase64 = await fileToBase64(videoFile);
        const res = await apiService.transcribeVideo(videoBase64, videoFile.type);
        return res.text;
    }
};

export const fetchLatestNews = async (): Promise<{ articles: { title: string; snippet: string; link: string }[] }> => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: 'Find the latest top 5 news articles about AI and Technology. Respond with only a JSON object containing a key "articles" which is an array of objects. Each object should have "title", "snippet", and "link" properties.',
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        
        const cleanedText = response.text.replace(/^```(json)?\n|```$/g, '').trim();
        const data = JSON.parse(cleanedText);
        if (data && Array.isArray(data.articles)) {
            return data;
        }
        return { articles: [] };
    } catch (e) {
        console.warn("Direct client news fetch failed, falling back to backend headlines:", e);
        try {
            const data = await apiService.getHeadlines();
            return data;
        } catch (err) {
            console.error("Backend news fetch failed:", err);
            return { articles: [] };
        }
    }
};

export const generateSpeech = async (text: string): Promise<string> => {
    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-tts',
            contents: [{ parts: [{ text: `Say with a clear and professional voice: ${text}` }] }],
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
    } catch (err) {
        console.warn("Direct client speech generation failed, falling back to backend:", err);
        const res = await apiService.generateSpeech(text);
        return res.audioBase64 || res.audio || res.text;
    }
};

export const getLiveSession = () => {
    const ai = getAiClient();
    return ai.live;
};

export const auditCodebase = async (files: {path: string, content: string}[]): Promise<string> => {
    try {
        const ai = getAiClient();
        const fileContents = files.map(f => `--- START OF FILE ${f.path} ---\n${f.content}\n--- END OF FILE ${f.path} ---`).join('\n\n');

        const prompt = `You are a world-class senior frontend engineer and UI/UX expert. I will provide you with the contents of several files from a web application. Please review the code for bugs, performance issues, adherence to best practices, accessibility problems, and potential UI/UX improvements.

For each issue you find, please provide:
1. The file path.
2. A clear description of the problem.
3. A suggested code snippet to fix the issue.

Structure your response clearly using Markdown. Here are the files:

${fileContents}
`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        });
        return response.text;
    } catch (err) {
        console.warn("Direct client codebase audit failed, falling back to backend:", err);
        const res = await apiService.auditCode(files);
        return res.text;
    }
};

export const generateCodeUpdate = async (files: {path: string, content: string}[], userRequest: string): Promise<string> => {
    try {
        const ai = getAiClient();
        const fileContents = files.map(f => `--- START OF FILE ${f.path} ---\n${f.content}\n--- END OF FILE ${f.path} ---`).join('\n\n');

        const prompt = `You are a world-class senior frontend engineer acting as an AI code assistant. The user wants to make changes to the application. Your task is to generate the updated code.

**User's Request:** "${userRequest}"

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
${fileContents}
`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        });
        return response.text;
    } catch (err) {
        console.warn("Direct client code update failed, falling back to backend:", err);
        const res = await apiService.generateCodeUpdate(files, userRequest);
        return res.text;
    }
};