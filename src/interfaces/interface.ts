import { Decimal } from '@prisma/client/runtime/library';


export interface HttpError extends Error {
    status: number;
}

export interface CountryAPIResponse {
    name: string;
    capital?: string;
    region?: string;
    population: number;
    flag?: string;
    currencies?: Array<{
        code: string;
        name: string;
        symbol: string;
    }>;
    exchangeRate?: ExchangeRateAPIResponse;
}

export interface ExchangeRateAPIResponse {
    result: string;
    base_code: string;
    rates: {
        [currencyCode: string]: number;
    };
}


export interface Country {
    id: number;
    name: string;
    capital: string | null;
    region: string | null;
    population: bigint;
    currency_code: string | null;
    exchange_rate: Decimal | null;
    estimated_gdp: Decimal | null;
    flag_url: string | null;
    last_refreshed_at: Date;
}

export interface TopCountry {
    name: string;
    estimated_gdp: number | null;
    population: number;
}

export interface ImageGenerationParams {
    totalCountries: number;
    topCountries: TopCountry[];
    timestamp: Date;
    cacheDir: string;
}



export interface CountryFromDB {
    name: string;
    estimated_gdp: Decimal | null;
    population: bigint;
}
