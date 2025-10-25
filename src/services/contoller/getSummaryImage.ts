
import { Request, Response, NextFunction } from "express";
import * as path from 'path';
import * as fs from 'fs';


// Ensure cache directory exists
const cacheDir = path.join(process.cwd(), 'cache');
if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
}
/**
 * GET /countries/image
 * Serve the generated summary image
 */
export const getSummaryImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const imagePath = path.join(cacheDir, 'summary.png');

        // Check if image exists
        if (!fs.existsSync(imagePath)) {
            return res.status(404).json({
                error: 'Summary image not found'
            });
        }

        // Set appropriate headers
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes

        // Send the image file
        res.sendFile(imagePath);
    } catch (error) {
        console.error('Get image error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: 'Failed to serve summary image'
        });
    }
};