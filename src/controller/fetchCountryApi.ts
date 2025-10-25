import axios from "axios";
import { CountryAPIResponse } from "../interfaces/interface";


const COUNTRY_API = 'https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies';
const API_TIMEOUT = 5000;

export async function fetchCountryData(): Promise<CountryAPIResponse[]> {
    try {
        const response = await axios.get<CountryAPIResponse[]>(COUNTRY_API, {
            timeout: API_TIMEOUT,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNABORTED') {
                throw new Error('Country API request timeout');
            }
            throw new Error(`Could not fetch data from restcountries.com`);
        }
        throw new Error('Could not fetch country data at this time');
    }
}
