import { api } from '@/api/client';

export interface Country {
    name: {
        common: string;
        official: string;
        nativeName?: Record<string, {
            official: string;
            common: string;
        }>;
    };
    capital: string[];
    region: string;
    subregion: string;
    languages: Record<string, string>;
    currencies: Record<string, {
        name: string;
        symbol: string;
    }>;
    independent: boolean;
    cca2: string;
    cca3: string;
    population: number;
    area: number;
    flag: string;
    borders?: string[];
    landlocked: boolean;
}


class CountriesService {
    async getAllCountries(): Promise<Country[]> {
        try {
            const response = await api.getCountries<Country[]>('/all');
            return response;
        } catch (error) {
            console.error('Error fetching countries:', error);
            throw new Error('Failed to fetch countries');
        }
    }

}

export const countriesActions = new CountriesService();