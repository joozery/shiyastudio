import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://shiyastudio.com';
const locales = ['en', 'th'];

// Static routes with their priorities and change frequencies
const staticRoutes: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
}> = [
  { path: '',           priority: 1.0,  changeFrequency: 'weekly' },
  { path: '/projects',  priority: 0.9,  changeFrequency: 'weekly' },
  { path: '/services',  priority: 0.8,  changeFrequency: 'monthly' },
  { path: '/contact',   priority: 0.7,  changeFrequency: 'monthly' },
];

async function getProjectSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/projects`, { 
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.projects || [])
      .filter((p: any) => p.slug)
      .map((p: any) => p.slug as string);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  // Static pages for all locales
  for (const locale of locales) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${BASE_URL}/${locale}${route.path}`,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    }
  }

  // Dynamic project pages
  const slugs = await getProjectSlugs();
  for (const locale of locales) {
    for (const slug of slugs) {
      entries.push({
        url: `${BASE_URL}/${locale}/projects/${slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.75,
      });
    }
  }

  return entries;
}
