// define types for movie data
export type Movie = {
    _id: string;
    name: string;
    slug: string;
    origin_name: string;
    poster_url: string;     
    episode_current: string;
    quality: string;
    lang: string;
    year: string;

}
export type MovieDetail = {
    _id: string;
    name: string;
    slug: string;
    origin_name: string;
    poster_url: string;
    thumb_url: string;
    time: string;
    episode_current: string;
    quality: string;
    lang: string;
    year: string;
    category: string[];
    country: string[];
}


