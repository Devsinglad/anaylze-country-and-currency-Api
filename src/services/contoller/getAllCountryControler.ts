import { Request, Response, NextFunction } from "express";
import { Country } from "../../interfaces/interface";
import prisma from "../../prisma";


/**
 * GET /countries
 * Get all countries with optional filters and sorting
 */
export const getAllCountries = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { region, currency, sort } = req.query;

        const where: any = {};

        if (region) {
            where.region = { equals: region as string, };
        }

        if (currency) {
            where.currency_code = { equals: currency as string, };
        }

        let orderBy: any = { name: 'asc' };

        if (sort === 'gdp_desc') orderBy = { estimated_gdp: 'desc' };
        else if (sort === 'gdp_asc') orderBy = { estimated_gdp: 'asc' };
        else if (sort === 'population_desc') orderBy = { population: 'desc' };
        else if (sort === 'population_asc') orderBy = { population: 'asc' };

        const countries = await prisma.country.findMany({ where, orderBy });

        const formattedCountries = countries.map((country: Country) => ({
            id: country.id,
            name: country.name,
            capital: country.capital,
            region: country.region,
            population: Number(country.population) ?? 0,
            currency_code: country.currency_code ?? null,
            exchange_rate: country.exchange_rate ? Number(country.exchange_rate) : null,
            estimated_gdp: country.estimated_gdp ? Number(country.estimated_gdp) : null,
            flag_url: country.flag_url ?? null,
            last_refreshed_at: country.last_refreshed_at
                ? country.last_refreshed_at.toISOString()
                : null,
        }));

        res.status(200).json(formattedCountries);
    } catch (error) {
        console.error('Get countries error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: 'Failed to fetch country'
        });
    }
};