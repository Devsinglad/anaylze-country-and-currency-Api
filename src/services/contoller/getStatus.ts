import { Request, Response, NextFunction } from "express";
import prisma from "../../prisma";

/**
 * GET /status
 * Get system status with total countries and last refresh timestamp
 */
export const getSystemStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const totalCountries = await prisma.country.count();
        const status = await prisma.systemStatus.findUnique({
            where: { id: 1 }
        });

        res.status(200).json({
            total_countries: totalCountries,
            last_refreshed_at: status?.last_refreshed_at.toISOString() || null
        });
    } catch (error) {
        console.error('Status error:', error);
        next(error);
    }
};