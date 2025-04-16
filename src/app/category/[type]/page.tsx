
import CategoryPageClient from '@/components/client-category-page'
import { fetchCategoryMetaData } from '@/lib/fetchListMovie'
import { Metadata } from 'next'

export const generateMetadata = async ({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> => {
  try {
    const { type } = await params;
    const metadata = await fetchCategoryMetaData(type);
    return {
        title: metadata?.titleHead || "Danh sách phim | Netflex",
        description: metadata?.descriptionHead || "Xem phim miễn phí trên Netflex.",
        keywords: metadata?.descriptionHead || "Xem phim miễn phí trên Netflex.",
        openGraph: {
            title: metadata?.titleHead || "Danh sách phim | Netflex",
            description: metadata?.descriptionHead || "Xem phim miễn phí trên Netflex.",
            images: metadata?.og_image ? metadata.og_image : [],
            url: metadata?.og_url || "",
        },
    };
  } catch (err) {
    return {
      title: "Phim không tồn tại | Netflex",
      description: "Không tìm thấy thông tin phim.",
    };
  }
};

const CategoryPage = async ({ params }: { params: Promise<{ type: string }> }) => {
    const { type } = await params;
    return <CategoryPageClient type={type} />
}


export default CategoryPage