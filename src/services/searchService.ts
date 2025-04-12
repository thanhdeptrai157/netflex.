import axios from "../configs/axios";

// search api
export const searchMovies = async (keyword: string, page: number = 1, limit: number = 18) => {
    try{
        const response = await axios.get('v1/api/tim-kiem',{
            params: { keyword, limit, page }
        })
        return response.data;
    }
    catch(error){
        console.log(error);
        throw error;
    }
}

const SearchService = {
    searchMovies,
}
export default SearchService;