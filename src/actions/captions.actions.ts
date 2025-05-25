import { api } from '@/api/client';
import { CAPTIONS_ENDPOINTS } from '@/api/endpoints';

export interface Word {
    _id: string;
    national: string;
    foreign: string;
    isFavorite: boolean;
    inSentences: string[];
}

export interface WordsResponse {
    words: Word[];
}

export interface AddWordRequest {
    national: string;
    foreign: string;
}

export interface EditWordRequest {
    national: string;
    foreign: string;
}

export interface ApiError {
    status: number;
    message: string;
    error?: string;
}

class CaptionsService {
    async getAllWords(): Promise<WordsResponse> {
        try {
            const response = await api.get<WordsResponse>(CAPTIONS_ENDPOINTS.GET_ALL_WORDS);
            return response;
        } catch (error) {
            console.error('Error fetching words:', error);
            throw new Error('Failed to fetch words');
        }
    }

    async addWord(wordData: AddWordRequest): Promise<Word> {
        try {
            if (!wordData.national?.trim() || !wordData.foreign?.trim()) {
                throw new Error('Both national and foreign words are required');
            }

            return await api.post<Word>(CAPTIONS_ENDPOINTS.ADD_WORD, wordData);
        } catch (error) {
            console.error('Error adding word:', error);
            throw new Error('Failed to add word');
        }
    }

    async editWord(id: string, wordData: EditWordRequest): Promise<Word> {
        try {
            if (!id?.trim()) {
                throw new Error('Word ID is required');
            }

            if (!wordData.national?.trim() || !wordData.foreign?.trim()) {
                throw new Error('Both national and foreign words are required');
            }

            return await api.put<Word>(`${CAPTIONS_ENDPOINTS.EDIT_WORD}/${id}`, wordData);
        } catch (error) {
            console.error('Error editing word:', error);
            throw new Error('Failed to update word');
        }
    }

    async deleteWord(id: string): Promise<void> {
        try {
            if (!id?.trim()) {
                throw new Error('Word ID is required');
            }

            await api.delete<void>(`${CAPTIONS_ENDPOINTS.DELETE_WORD}/${id}`);
        } catch (error) {
            console.error('Error deleting word:', error);
            throw new Error('Failed to delete word');
        }
    }
}

export const captionsActions = new CaptionsService();