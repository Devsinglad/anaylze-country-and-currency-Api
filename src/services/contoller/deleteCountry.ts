import { Request, Response, NextFunction } from "express";
import prisma from "../../prisma";

/**
 * DELETE /countries/:name
 * Delete a country by name
 */
export const deleteCountryByName = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.params;

        const country = await prisma.country.findFirst({
            where: {
                name: { equals: name, }
            }
        });

        if (!country) {
            return res.status(404).json({
                error: 'Country not found'
            });
        }

        await prisma.country.delete({
            where: { id: country.id }
        });

        res.status(204).send();
    } catch (error) {
        console.error('Delete country error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: 'Failed to delete country'
        });
    }
};