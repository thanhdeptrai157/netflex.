
import CategoryPageClient from '@/components/client-category-page'
import { fetchCategoryMetaData } from '@/lib/fetchDetailCategory'
import { Metadata } from 'next'
import { toast } from 'react-toastify';

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
    toast.error("Có lỗi xảy ra khi tải thông tin danh mục." + (err instanceof Error ? `: ${err.message}` : ""));
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