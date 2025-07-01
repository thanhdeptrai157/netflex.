import { LangList, TypeList } from "@/types/filter";
import axios from "../configs/axios";


interface MovieFilterParams {
  type_list: TypeList
  page?: number;
  limit?: number;
  sort_field?: 'modified.time' | '_id' | 'year';
  sort_type?: 'asc' | 'desc';
  sort_lang?: LangList
  category?: string; // slug
  country?: string;  // slug
  year?: number;
}

export const getMoviesByFilter = async ({
  type_list,
  page = 1,
  limit = 18,
  sort_field = 'modified.time',
  sort_type = 'desc',
  sort_lang,
  category,
  country,
  year
}: MovieFilterParams) => {
  try {
    const response = await axios.get(`/v1/api/danh-sach/${type_list}`, {
      params: {
        page,
        limit,
        sort_field,
        sort_type,
        ...(sort_lang && { sort_lang }),
        ...(category && { category }),
        ...(country && { country }),
        ...(year && { year })
      }
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

