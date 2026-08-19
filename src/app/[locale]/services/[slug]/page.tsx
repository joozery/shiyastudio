import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { getServiceSchema, getBreadcrumbSchema } from '@/lib/schemas';
import ServicePageClient from './ServicePageClient';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://shiyastudio.com';

const servicesMeta: Record<string, { title: string; titleTh: string; description: string; descriptionTh: string; keywords: string; keywordsTh: string }> = {
  influencer: {
    title: 'Influencer / KOL Marketing — Shiya Studio',
    titleTh: 'Influencer / KOL Marketing — ชิยะสตูดิโอ',
    description: 'Strategic Influencer and KOL Marketing campaigns in Thailand. Shiya Studio connects your brand with the right creators to reach your audience authentically at scale.',
    descriptionTh: 'บริการ Influencer และ KOL Marketing เชิงกลยุทธ์ในไทย ชิยะสตูดิโอเชื่อมแบรนด์ของคุณกับผู้สร้างคอนเทนต์ที่เหมาะสมเพื่อเข้าถึงกลุ่มเป้าหมายอย่างมีประสิทธิภาพ',
    keywords: 'influencer marketing Thailand, KOL marketing Bangkok, social media campaign Thailand, TikTok influencer agency, Instagram KOL Thailand, Shiya Studio influencer',
    keywordsTh: 'influencer marketing ไทย, KOL marketing กรุงเทพ, แคมเปญโซเชียลมีเดียไทย, TikTok influencer agency, Instagram KOL ไทย',
  },
  production: {
    title: 'Video Production & Film Production — Shiya Studio',
    titleTh: 'Video Production และผลิตวิดีโอ — ชิยะสตูดิโอ',
    description: 'High-end cinematic video production in Bangkok, Thailand. Shiya Studio produces commercials, corporate films, product videos, and social media content with full production capabilities.',
    descriptionTh: 'บริการผลิตวิดีโอระดับพรีเมียมในกรุงเทพ ชิยะสตูดิโอผลิตโฆษณา วิดีโอองค์กร วิดีโอสินค้า และคอนเทนต์โซเชียลมีเดียครบวงจร',
    keywords: 'video production Thailand, production house Bangkok, commercial production Thailand, corporate film Thailand, TVC production Bangkok, Shiya Studio production',
    keywordsTh: 'video production ไทย, production house กรุงเทพ, ผลิตโฆษณาไทย, วิดีโอองค์กรไทย, TVC production กรุงเทพ',
  },
  'graphic-design': {
    title: 'Graphic Design & Brand Identity — Shiya Studio',
    titleTh: 'กราฟิกดีไซน์และ Brand Identity — ชิยะสตูดิโอ',
    description: 'Premium Graphic Design and Brand Identity services in Thailand. Shiya Studio creates bold visual languages, logos, packaging, and brand guidelines for modern brands.',
    descriptionTh: 'บริการกราฟิกดีไซน์และออกแบบอัตลักษณ์แบรนด์ระดับพรีเมียมในไทย ชิยะสตูดิโอสร้างภาษาภาพ โลโก้ บรรจุภัณฑ์ และ brand guidelines สำหรับแบรนด์สมัยใหม่',
    keywords: 'graphic design Thailand, brand identity Bangkok, logo design Thailand, packaging design Thailand, brand guidelines, Shiya Studio graphic design',
    keywordsTh: 'กราฟิกดีไซน์ไทย, brand identity กรุงเทพ, ออกแบบโลโก้ไทย, ออกแบบบรรจุภัณฑ์ไทย, brand guidelines',
  },
  'vdo-motion': {
    title: 'VDO Motion & Motion Graphics — Shiya Studio',
    titleTh: 'VDO Motion และ Motion Graphics — ชิยะสตูดิโอ',
    description: 'Dynamic Motion Graphics and VDO Motion design in Thailand. Shiya Studio creates animations, 3D visuals, and motion content that bring digital brands to life.',
    descriptionTh: 'บริการ Motion Graphics และ VDO Motion ในไทย ชิยะสตูดิโอสร้างแอนิเมชัน ภาพ 3D และคอนเทนต์ motion ที่ทำให้แบรนด์ดิจิทัลมีชีวิต',
    keywords: 'motion graphics Thailand, VDO motion Bangkok, animation studio Thailand, 3D animation Thailand, motion design Bangkok, Shiya Studio motion',
    keywordsTh: 'motion graphics ไทย, VDO motion กรุงเทพ, animation studio ไทย, 3D animation ไทย, motion design กรุงเทพ',
  },
  'mix-master-music': {
    title: 'Music Mixing & Mastering — Shiya Studio',
    titleTh: 'Mixing & Mastering เพลง — ชิยะสตูดิโอ',
    description: 'Professional Music Mixing and Mastering services in Bangkok, Thailand. Shiya Studio delivers broadcast-ready audio for commercials, branded content, and musical productions.',
    descriptionTh: 'บริการมิกซ์และมาสเตอร์เพลงระดับมืออาชีพในกรุงเทพ ชิยะสตูดิโอส่งมอบเสียงคุณภาพสูงสำหรับโฆษณา คอนเทนต์แบรนด์ และงานดนตรี',
    keywords: 'music mixing Thailand, mastering Bangkok, audio production Thailand, sound design Bangkok, branded audio Thailand, Shiya Studio music',
    keywordsTh: 'มิกซ์เพลงไทย, มาสเตอร์เพลง กรุงเทพ, audio production ไทย, sound design กรุงเทพ',
  },
};

const breadcrumbNamesTh: Record<string, string> = {
  influencer: 'Influencer / KOL Marketing',
  production: 'Video Production',
  'graphic-design': 'Graphic Design',
  'vdo-motion': 'VDO Motion',
  'mix-master-music': 'Mixing & Mastering',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const meta = servicesMeta[slug] ?? servicesMeta.influencer;
  const isTh = locale === 'th';
  const title = isTh ? meta.titleTh : meta.title;
  const description = isTh ? meta.descriptionTh : meta.description;
  const keywords = isTh ? meta.keywordsTh : meta.keywords;
  const canonical = `${BASE_URL}/${locale}/services/${slug}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: {
        'en-US': `${BASE_URL}/en/services/${slug}`,
        'th-TH': `${BASE_URL}/th/services/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Shiya Studio',
      locale: isTh ? 'th_TH' : 'en_US',
      type: 'website',
      images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE_URL}/og-image.jpg`],
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const meta = servicesMeta[slug] ?? servicesMeta.influencer;
  const isTh = locale === 'th';
  const serviceUrl = `${BASE_URL}/${locale}/services/${slug}`;
  const serviceName = breadcrumbNamesTh[slug] ?? slug;

  const serviceSchema = getServiceSchema({
    name: serviceName,
    description: isTh ? meta.descriptionTh : meta.description,
    url: serviceUrl,
    imageUrl: `${BASE_URL}/og-image.jpg`,
  });

  const breadcrumb = getBreadcrumbSchema([
    { name: isTh ? 'หน้าแรก' : 'Home', url: `${BASE_URL}/${locale}` },
    { name: isTh ? 'บริการ' : 'Services', url: `${BASE_URL}/${locale}/services` },
    { name: serviceName, url: serviceUrl },
  ]);

  return (
    <>
      <JsonLd data={serviceSchema} />
      <JsonLd data={breadcrumb} />
      <ServicePageClient />
    </>
  );
}
