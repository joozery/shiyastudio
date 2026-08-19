import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { getCreativeWorkSchema, getBreadcrumbSchema } from '@/lib/schemas';
import clientPromise from '@/lib/mongodb';
import ProjectDetailClient from './ProjectDetailClient';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://shiyastudio.com';

async function getProject(slug: string) {
  try {
    const client = await clientPromise;
    const db = client.db('shiyastudio');
    const data = await db.collection('settings').findOne({ type: 'projects' });
    return data?.projects?.find((p: any) => p.slug === slug) ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProject(slug);
  const isTh = locale === 'th';
  const canonical = `${BASE_URL}/${locale}/projects/${slug}`;

  const title = project
    ? `${project.title} — Shiya Studio`
    : 'Project — Shiya Studio';
  const description = project?.description
    ? `${project.description} ${isTh ? '— ผลงานโดย Shiya Studio' : '— A creative work by Shiya Studio'}`
    : isTh
      ? 'สำรวจผลงานระดับพรีเมียมโดย Shiya Studio — เอเจนซี่ครีเอทีฟชั้นนำในไทย'
      : 'Explore this premium creative project by Shiya Studio — Thailand\'s leading creative agency.';

  return {
    title,
    description,
    keywords: project
      ? `${project.title}, ${project.cat ?? ''}, Shiya Studio portfolio, creative project Thailand, ${isTh ? 'ผลงาน ชิยะสตูดิโอ' : 'branding Thailand'}`
      : 'Shiya Studio portfolio, creative project Thailand',
    alternates: {
      canonical,
      languages: {
        'en-US': `${BASE_URL}/en/projects/${slug}`,
        'th-TH': `${BASE_URL}/th/projects/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Shiya Studio',
      locale: isTh ? 'th_TH' : 'en_US',
      type: 'article',
      images: [
        {
          url: project?.coverImage ?? `${BASE_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [project?.coverImage ?? `${BASE_URL}/og-image.jpg`],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = await getProject(slug);
  const isTh = locale === 'th';
  const projectUrl = `${BASE_URL}/${locale}/projects/${slug}`;

  const schemas = [];

  if (project) {
    schemas.push(
      getCreativeWorkSchema({
        name: project.title,
        description: project.description ?? '',
        url: projectUrl,
        imageUrl: project.coverImage,
        dateCreated: project.year ? `${project.year}-01-01` : undefined,
        category: project.cat,
      })
    );
  }

  schemas.push(
    getBreadcrumbSchema([
      { name: isTh ? 'หน้าแรก' : 'Home', url: `${BASE_URL}/${locale}` },
      { name: isTh ? 'ผลงาน' : 'Portfolio', url: `${BASE_URL}/${locale}/projects` },
      { name: project?.title ?? slug, url: projectUrl },
    ])
  );

  return (
    <>
      {schemas.map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}
      <ProjectDetailClient params={params} />
    </>
  );
}
