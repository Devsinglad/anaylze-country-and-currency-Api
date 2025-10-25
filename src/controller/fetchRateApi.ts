import axios from "axios";
import { ExchangeRateAPIResponse } from "../interfaces/interface";


const RATE_API = 'https://open.er-api.com/v6/latest/USD';
const API_TIMEOUT = 5000;

/**
 * Fetches exchange rates from Open Exchange Rate API
 * @returns Promise<ExchangeRateAPIResponse> - Object containing all exchange rates with USD as base
 * @throws Error if API request fails or times out
 */
export async function fetchExchangeRates(): Promise<ExchangeRateAPIResponse> {
    try {
        const response = await axios.get<ExchangeRateAPIResponse>(RATE_API, {
            timeout: API_TIMEOUT,
        });

        // Validate response structure
        if (!response.data || !response.data.rates) {
            throw new Error('Invalid response structure from exchange rate API');
        }

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // Handle timeout specifically
            if (error.code === 'ECONNABORTED') {
                throw new Error('Exchange rate API request timeout');
            }
            // Handle other axios errors
            throw new Error(`Could not fetch data from open.er-api.com`);
        }
        // Handle non-axios errors
        throw new Error('Could not fetch exchange rate data at this time');
    }
}
