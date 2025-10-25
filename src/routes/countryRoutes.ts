import { Router } from "express";
import { countryController } from "../controller/countryController";

const router = Router();

// get summary image
router.get('/countries/image', countryController.getSummaryImage);
/// save country data to db
router.post('/countries/refresh', countryController.refreshCountryData);

// get all countries with filters and sorting
router.get('/countries', countryController.getAllCountries);
// get country by name
router.get('/countries/:name', countryController.getCountryByName);
// delete country by name
router.delete('/countries/:name', countryController.deleteCountryByName);
// get system status
router.get('/status', countryController.getSystemStatus);


export default router;
