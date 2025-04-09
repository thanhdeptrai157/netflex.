import axios from "../configs/axios";


// get all categories
export const getAllCategories = async () => {
    try {
        const response = await axios.get('the-loai');
        return response.data;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

// get movie by category
export const getMoviesByCategory = async (slug: string) => {
    try {
        const response = await axios.get(`v1/api/the-loai/${slug}`);
        return response.data;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

const CategoryService = {
    getAllCategories,
    getMoviesByCategory
}

export default CategoryService;

