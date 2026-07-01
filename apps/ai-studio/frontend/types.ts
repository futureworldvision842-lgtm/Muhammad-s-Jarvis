
export interface GroundingChunk {
    web?: {
        uri?: string;
        title?: string;
    };
    maps?: {
        uri?: string;
        title?: string;
        placeAnswerSources?: {
            // FIX: Made `reviewSnippets` optional to align with the `@google/genai` library's `GroundingChunk` type, which was causing a type assignment error.
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
export type VideoAspectRatio = "16:9" | "9:16";