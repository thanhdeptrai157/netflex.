import axios from "../configs/axios";


// country api
export const getAllCountries = async () => {
    try {
        const response = await axios.get('quoc-gia');
        return response.data;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

// get movie by country
export const getMoviesByCountry = async (slug: string, page: number = 1, limit: number = 64) => {
    try {
        const response = await axios.get(`v1/api/quoc-gia/${slug}`);
        return response.data;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

const CountryService = {
    getAllCountries,
    getMoviesByCountry
}

export default CountryService;
