

import CountryPageClient from '@/components/client-country-page';
import { fetchCountryMetaData } from '@/lib/fetchDetailCountry';
import { Metadata } from 'next'

export const generateMetadata = async ({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> => {
  try {
    const { name } = await params;
    const metadata = await fetchCountryMetaData(name);
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

const CountryPage = async ({ params }: { params: Promise<{ name: string }> }) => {
    const { name } = await params;
    return <CountryPageClient name={name} />
}


export default CountryPage