import { Category, Country } from "./header";

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
    year: number;
}


export type MovieDetail = {
    _id: string;
    name: string;
    slug: string;
    origin_name: string;
    content: string;
    type: string;
    status: string;
    poster_url: string;
    thumb_url: string;
    trailer_url: string;
    time: string;
    episode_current: string;
    episode_total: string;
    quality: string;
    lang: string;
    year: number;
    actor: string[];
    director: string[];
    category: Category[];
    country: Country[];
    view: number;
}

export interface EpisodeData {
    name: string;
    slug: string;
    filename: string;
    link_embed: string;
    link_m3u8: string;
}

export interface Episode {
    server_name: string;
    server_data: EpisodeData[];
}



