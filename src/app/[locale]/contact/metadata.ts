import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://shiyastudio.com';

const metaByLocale = {
  en: {
    title: 'Contact Us — Start Your Project',
    description:
      'Ready to elevate your brand? Contact Shiya Studio — a premium creative agency in Bangkok, Thailand, for Branding, Video Production, and Influencer Marketing.',
    keywords:
      'contact Shiya Studio, creative agency Bangkok, brand design Thailand, hire influencer marketing agency, production house Thailand',
    ogImage: `${BASE_URL}/og-image.jpg`,
    canonical: `${BASE_URL}/en/contact`,
  },
  th: {
    title: 'ติดต่อเรา — เริ่มต้นโปรเจกต์ของคุณ',
    description:
      'พร้อมยกระดับแบรนด์ของคุณแล้วหรือยัง? ติดต่อ Shiya Studio — เอเจนซี่ครีเอทีฟระดับพรีเมียมในกรุงเทพ ให้บริการออกแบบแบรนด์, ผลิตวิดีโอ และ Influencer Marketing',
    keywords:
      'ติดต่อ Shiya Studio, เอเจนซี่ครีเอทีฟ กรุงเทพ, ออกแบบแบรนด์ไทย, จ้าง influencer marketing, production house ไทย',
    ogImage: `${BASE_URL}/og-image.jpg`,
    canonical: `${BASE_URL}/th/contact`,
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = metaByLocale[locale as 'en' | 'th'] ?? metaByLocale.en;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: meta.canonical,
      languages: {
        'en-US': `${BASE_URL}/en/contact`,
        'th-TH': `${BASE_URL}/th/contact`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: meta.canonical,
      siteName: 'Shiya Studio',
      locale: locale === 'th' ? 'th_TH' : 'en_US',
      type: 'website',
      images: [{ url: meta.ogImage, width: 1200, height: 630, alt: 'Shiya Studio Contact' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [meta.ogImage],
    },
  };
}
