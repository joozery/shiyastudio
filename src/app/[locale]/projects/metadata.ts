import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://shiyastudio.com';

const metaByLocale = {
  en: {
    title: 'Our Portfolio — Premium Creative Projects',
    description:
      'Explore Shiya Studio\'s portfolio of premium branding, video production, and influencer marketing projects. See how we transform brands into powerful visual identities.',
    keywords:
      'Shiya Studio portfolio, creative projects Thailand, branding case studies, video production reel, influencer marketing campaigns, graphic design work',
    ogImage: `${BASE_URL}/og-image.jpg`,
    canonical: `${BASE_URL}/en/projects`,
  },
  th: {
    title: 'ผลงาน — โปรเจกต์ระดับพรีเมียม',
    description:
      'สำรวจผลงานของ Shiya Studio — การออกแบบแบรนด์, ผลิตวิดีโอ และแคมเปญ Influencer Marketing ระดับพรีเมียม ดูวิธีที่เราเปลี่ยนแบรนด์ให้กลายเป็นอัตลักษณ์ที่ทรงพลัง',
    keywords:
      'ผลงาน Shiya Studio, โปรเจกต์ครีเอทีฟไทย, case study การออกแบบแบรนด์, รีลวิดีโอ production, แคมเปญ influencer marketing',
    ogImage: `${BASE_URL}/og-image.jpg`,
    canonical: `${BASE_URL}/th/projects`,
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
        'en-US': `${BASE_URL}/en/projects`,
        'th-TH': `${BASE_URL}/th/projects`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: meta.canonical,
      siteName: 'Shiya Studio',
      locale: locale === 'th' ? 'th_TH' : 'en_US',
      type: 'website',
      images: [{ url: meta.ogImage, width: 1200, height: 630, alt: 'Shiya Studio Projects' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [meta.ogImage],
    },
  };
}
