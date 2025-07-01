import { APP_DOMAIN_CDN_IMAGE } from "@/configs/env"
import CategoryService from "@/services/categoryService"

export interface Metadata {
    titleHead: string
    descriptionHead: string
    og_image: string[]
    og_url: string
}

export const fetchCategoryMetaData = async (type: string): Promise<Metadata | null> => {
    try {
        const response = await CategoryService.getMoviesByCategory(type, 1) as {
            status: string
            data: any
        }
        const data = response?.data

        if (response.status !== "success" || !data?.seoOnPage) {
            console.error("Không tìm thấy dữ liệu SEO cho danh mục:", type)
            return null
        }
        data.seoOnPage.og_image = data.seoOnPage.og_image.map((item: string) => {
            if (item.startsWith(APP_DOMAIN_CDN_IMAGE ? APP_DOMAIN_CDN_IMAGE : "")) {
                return item
            } else {
                return APP_DOMAIN_CDN_IMAGE + item
            }
        }
        )
        return {
            titleHead: data.seoOnPage.titleHead,
            descriptionHead: data.seoOnPage.descriptionHead,
            og_image: data.seoOnPage.og_image,
            og_url: data.seoOnPage.og_url
        }
    } catch (error) {
        console.error("Có lỗi khi lấy dữ liệu:", error)
        return null
    }
}
