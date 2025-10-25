
import { Request, Response, NextFunction } from "express";
import prisma from "../../prisma";

/**
 * GET /countries/:name
 * Get a specific country by name
 */
export const getCountryByName = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.params;

        const country = await prisma.country.findFirst({
            where: {
                name: {
                    equals: name
                }
            }
        });



        if (!country) {
            return res.status(404).json({
                error: 'Country not found'
            });
        }

        res.status(200).json({
            id: country.id,
            name: country.name,
            capital: country.capital,
            region: country.region,
            population: Number(country.population),
            currency_code: country.currency_code,
            exchange_rate: country.exchange_rate ? Number(country.exchange_rate) : null,
            estimated_gdp: country.estimated_gdp ? Number(country.estimated_gdp) : null,
            flag_url: country.flag_url,
            last_refreshed_at: country.last_refreshed_at.toISOString()
        });
    } catch (error) {
        console.error('Get country error:', error);

        res.status(500).json({
            error: 'Internal server error',
            details: 'Failed to fetch country'
        });
    }
};