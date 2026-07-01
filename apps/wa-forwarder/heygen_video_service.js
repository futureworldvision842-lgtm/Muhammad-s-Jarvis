import axios from 'axios';
import fs from 'fs';
import path from 'path';

export class HeyGenVideoService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.heygen.com/v2';
        this.headers = {
            'X-Api-Key': this.apiKey,
            'Content-Type': 'application/json'
        };
    }

    async getAvailableAvatars() {
        try {
            const response = await axios.get(`${this.baseUrl}/avatars`, {
                headers: this.headers
            });
            return response.data.data.avatars;
        } catch (error) {
            console.error('Error fetching avatars:', error.response?.data || error.message);
            throw error;
        }
    }

    async getAvailableVoices() {
        try {
            const response = await axios.get(`${this.baseUrl}/voices`, {
                headers: this.headers
            });
            return response.data.data.voices;
        } catch (error) {
            console.error('Error fetching voices:', error.response?.data || error.message);
            throw error;
        }
    }

    async generateVideo(avatarId, text, voiceId, options = {}) {
        try {
            const videoData = {
                video_inputs: [
                    {
                        character: {
                            type: 'avatar',
                            avatar_id: avatarId,
                            avatar_style: options.avatarStyle || 'normal'
                        },
                        voice: {
                            type: 'text',
                            input_text: text,
                            voice_id: voiceId,
                            speed: options.speed || 1.0
                        }
                    }
                ],
                dimension: {
                    width: options.width || 1280,
                    height: options.height || 720
                }
            };

            if (options.backgroundImage) {
                videoData.video_inputs[0].background = {
                    type: 'image',
                    url: options.backgroundImage
                };
            }

            const response = await axios.post(`${this.baseUrl}/video/generate`, videoData, {
                headers: this.headers
            });

            return response.data.data.video_id;
        } catch (error) {
            console.error('Error generating video:', error.response?.data || error.message);
            throw error;
        }
    }

    async checkVideoStatus(videoId) {
        try {
            const response = await axios.get(`https://api.heygen.com/v1/video_status.get?video_id=${videoId}`, {
                headers: this.headers
            });
            return response.data.data;
        } catch (error) {
            console.error('Error checking video status:', error.response?.data || error.message);
            throw error;
        }
    }

    async waitForVideoCompletion(videoId, maxWaitTime = 300000) {
        const startTime = Date.now();
        const pollInterval = 5000; // 5 seconds

        while (Date.now() - startTime < maxWaitTime) {
            try {
                const status = await this.checkVideoStatus(videoId);
                
                if (status.status === 'completed') {
                    return status;
                } else if (status.status === 'failed') {
                    throw new Error(`Video generation failed: ${status.error}`);
                }
                
                console.log(`Video status: ${status.status}. Waiting...`);
                await new Promise(resolve => setTimeout(resolve, pollInterval));
            } catch (error) {
                console.error('Error checking video status:', error);
                throw error;
            }
        }

        throw new Error('Video generation timeout');
    }

    async downloadVideo(videoUrl, outputPath) {
        try {
            const response = await axios.get(videoUrl, {
                responseType: 'stream'
            });

            const writer = fs.createWriteStream(outputPath);
            response.data.pipe(writer);

            return new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
        } catch (error) {
            console.error('Error downloading video:', error);
            throw error;
        }
    }

    async generateVideoWithText(avatarId, text, voiceId, outputPath, options = {}) {
        try {
            console.log('Generating video with text:', text);
            const videoId = await this.generateVideo(avatarId, text, voiceId, options);
            console.log('Video ID:', videoId);

            console.log('Waiting for video completion...');
            const completedVideo = await this.waitForVideoCompletion(videoId);
            
            if (completedVideo.video_url) {
                console.log('Downloading video...');
                await this.downloadVideo(completedVideo.video_url, outputPath);
                console.log('Video downloaded to:', outputPath);
                return outputPath;
            } else {
                throw new Error('No video URL in completed video data');
            }
        } catch (error) {
            console.error('Error in generateVideoWithText:', error);
            throw error;
        }
    }

    async generateVideoWithAudio(avatarId, audioAssetId, outputPath, options = {}) {
        try {
            const videoData = {
                video_inputs: [
                    {
                        character: {
                            type: 'avatar',
                            avatar_id: avatarId,
                            avatar_style: options.avatarStyle || 'normal'
                        },
                        voice: {
                            type: 'audio',
                            audio_id: audioAssetId
                        }
                    }
                ],
                dimension: {
                    width: options.width || 1280,
                    height: options.height || 720
                }
            };

            if (options.backgroundImage) {
                videoData.video_inputs[0].background = {
                    type: 'image',
                    url: options.backgroundImage
                };
            }

            const response = await axios.post(`${this.baseUrl}/video/generate`, videoData, {
                headers: this.headers
            });

            const videoId = response.data.data.video_id;
            console.log('Video ID:', videoId);

            console.log('Waiting for video completion...');
            const completedVideo = await this.waitForVideoCompletion(videoId);
            
            if (completedVideo.video_url) {
                console.log('Downloading video...');
                await this.downloadVideo(completedVideo.video_url, outputPath);
                console.log('Video downloaded to:', outputPath);
                return outputPath;
            } else {
                throw new Error('No video URL in completed video data');
            }
        } catch (error) {
            console.error('Error in generateVideoWithAudio:', error);
            throw error;
        }
    }
}