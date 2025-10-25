

import { refreshCountryData } from "../services/contoller/refreshCountryController";
import { getCountryByName } from "../services/contoller/getCountryByName";
import { deleteCountryByName } from "../services/contoller/deleteCountry";
import { getSystemStatus } from "../services/contoller/getStatus";
import { getSummaryImage } from "../services/contoller/getSummaryImage";
import {getAllCountries} from "../services/contoller/getAllCountryControler";


export const countryController = {
    refreshCountryData,
    getAllCountries,
    getCountryByName,
    deleteCountryByName,
    getSystemStatus,
    getSummaryImage
};



