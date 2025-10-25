
import { Decimal } from "@prisma/client/runtime/library";
import { Request, Response, NextFunction } from "express";
import * as path from 'path';
import * as fs from 'fs';
import { generateSummaryImage } from "../../utils/image";
import { fetchCountryData } from "../../controller/fetchCountryApi";
import { fetchExchangeRates } from "../../controller/fetchRateApi";
import { CountryAPIResponse, CountryFromDB, TopCountry } from "../../interfaces/interface";
import { calculateEstimatedGDP } from "../../utils/gdpCalculation";
import prisma from "../../prisma";


// Ensure cache directory exists
const cacheDir = path.join(process.cwd(), 'cache');
if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
}

/**
 * POST /countries/refresh
 * Fetches country data and exchange rates, then caches them in the database
 */
export const refreshCountryData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Fetch data from external APIs
        const countriesData = await fetchCountryData();
        const exchangeRatesData = await fetchExchangeRates();

        const exchangeRates = exchangeRatesData.rates;
        const timestamp = new Date();

        // Process each country
        const countryPromises = countriesData.map(async (country: CountryAPIResponse) => {
            // Get first currency code or null if no currencies
            const currencyCode = country.currencies && country.currencies.length > 0
                ? country.currencies[0].code
                : null;

            // Get exchange rate for the currency
            const exchangeRate = currencyCode && exchangeRates[currencyCode]
                ? exchangeRates[currencyCode]
                : null;

            // Calculate estimated GDP based on requirements:
            // - If no currency: GDP = 0
            // - If currency but no rate found: GDP = null
            // - Otherwise: GDP = population × random(1000–2000) ÷ exchange_rate
            let estimatedGdp: number | null;
            if (!currencyCode) {
                estimatedGdp = 0; // No currency
            } else if (!exchangeRate) {
                estimatedGdp = null; // Currency exists but rate not found
            } else {
                estimatedGdp = calculateEstimatedGDP(country.population, exchangeRate);
            }

            const countryData = {
                name: country.name,
                capital: country.capital || null,
                region: country.region || null,
                population: country.population,
                currency_code: currencyCode,
                exchange_rate: exchangeRate ? new Decimal(exchangeRate) : null,
                estimated_gdp: estimatedGdp !== null ? Decimal(estimatedGdp) : null,
                flag_url: country.flag || null,
                last_refreshed_at: timestamp
            };

            // Upsert: Update if exists (by name), create if not
            return prisma.country.upsert({
                where: { name: country.name },
                update: countryData,
                create: countryData
            });
        });

        await Promise.all(countryPromises);

        // Update system status (global last refresh timestamp)
        await prisma.systemStatus.upsert({
            where: { id: 1 },
            update: { last_refreshed_at: timestamp },
            create: { id: 1, last_refreshed_at: timestamp }
        });

        const totalCountries = await prisma.country.count();

        const topCountries = await prisma.country.findMany({
            orderBy: { estimated_gdp: 'desc' },
            take: 5,
            select: {
                name: true,
                estimated_gdp: true,
                population: true
            }
        });

        // Convert Decimal to number for image generation
        // Convert Decimal to number for image generation
        const topCountriesFormatted: TopCountry[] = topCountries.map((country: CountryFromDB) => ({
            name: country.name,
            estimated_gdp: country.estimated_gdp ? Number(country.estimated_gdp) : null,
            population: Number(country.population) 
        }));
        // Generate summary image using the utility function
        await generateSummaryImage({
            totalCountries,
            topCountries: topCountriesFormatted,
            timestamp,
            cacheDir
        });

        res.status(200).json({
            message: 'Countries data refreshed successfully',
            total_countries: totalCountries,
            last_refreshed_at: timestamp.toISOString()
        });
    } catch (error: any) {
        console.error('Refresh error:', error);

        // Check if it's an external API error
        if (error.message && (
            error.message.includes('restcountries.com') ||
            error.message.includes('open.er-api.com') ||
            error.message.includes('timeout')
        )) {
            return res.status(503).json({
                error: 'External data source unavailable',
                details: error.message
            });
        }

        res.status(500).json({
            error: 'Internal server error',
            details: 'Failed to refresh countries data'
        });
    }
};