import axios from "../configs/axios";


// movie api

//get all movies 
//limit = 64
export const getSeriesMovies = async (page: number = 1, limit: number = 64) =>{
    try{
        const response = await axios.get('v1/api/danh-sach/phim-bo',{
            params: { page, limit }
        })
        return response.data;
    }
    catch(error){
        console.log(error);
        throw error;
    }
}

//get movie by slug
// link embed movie
export const getMovieBySlug = async (slug: string) =>{
    try{
        const response = await axios.get(`phim/${slug}`);
        return response.data;
    }
    catch(error){
        console.log(error);
        throw error;
    }
}

//get all sigle movies 
// limit = 64

export const getSingleMovies = async (page: number = 1, limit: number = 64) =>{
    try{
        const response = await axios.get('v1/api/danh-sach/phim-le',{
            params: { page, limit }
        })
        return response.data;
    }
    catch(error){
        console.log(error);
        throw error;
    }
}

//get all anime movies
// limit = 64
export const getAnimeMovies = async (page: number = 1, limit: number = 64) =>{
    try{
        const response = await axios.get('v1/api/danh-sach/hoat-hinh',{
            params: { page, limit }
        })
        return response.data;
    }
    catch(error){
        console.log(error);
        throw error;
    }
}

//get all tv shows
// limit = 64
export const getTvShows = async (page: number = 1, limit: number = 64) =>{
    try{
        const response = await axios.get('v1/api/danh-sach/tv-shows',{
            params: { page, limit }
        })
        return response.data;
    }
    catch(error){
        console.log(error);
        throw error;
    }
}

//get all new update movies
// limit = 64
export const getNewUpdateMovies = async (page: number = 1, limit: number = 64) =>{
    try{
        const response = await axios.get('danh-sach/phim-moi-cap-nhat-v2',{
            params: { page, limit }
        })
        return response.data;
    }
    catch(error){
        console.log(error);
        throw error;
    }
}

//get movies by year
export const getMoviesByYear = async (year: number, page: number = 1, limit: number = 64) =>{
    try{
        const response = await axios.get(`v1/api/nam/${year}`,{
            params: { page, limit }
        })
        return response.data;
    }
    catch(error){
        console.log(error);
        throw error;
    }
}


const MovieService = {
    getSeriesMovies,
    getMovieBySlug,
    getSingleMovies,
    getAnimeMovies,
    getTvShows,
    getNewUpdateMovies,
    getMoviesByYear
}
export default MovieService;