import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('shiyastudio');

    // Count arrays in MongoDB instead of transferring full galleries to the app server.
    const settings = await db.collection('settings').aggregate([
      { $match: { type: { $in: ['hero', 'services', 'projects', 'clients', 'influencer'] } } },
      { $project: { _id: 0, type: 1, updatedAt: 1,
        slides: { $cond: [{ $isArray: '$slides' }, { $size: '$slides' }, 3] },
        services: { $cond: [{ $isArray: '$services' }, { $size: '$services' }, 5] },
        projects: { $cond: [{ $isArray: '$projects' }, { $size: '$projects' }, 3] },
        clients: { $cond: [{ $isArray: '$clients' }, { $size: '$clients' }, 8] },
        items: { $cond: [{ $isArray: '$items' }, { $size: '$items' }, 6] },
        categories: { $cond: [{ $isArray: '$categories' }, { $size: '$categories' }, 5] }
      } }
    ]).toArray();
    const heroSettings = settings.find(item => item.type === 'hero');
    const servicesSettings = settings.find(item => item.type === 'services');
    const projectsSettings = settings.find(item => item.type === 'projects');
    const clientsSettings = settings.find(item => item.type === 'clients');
    const influencerSettings = settings.find(item => item.type === 'influencer');

    // Count items per section
    const heroSlides = heroSettings?.slides ?? 3;
    const servicesCount = servicesSettings?.services ?? 5;
    const projectsCount = projectsSettings?.projects ?? 3;
    const clientsCount = clientsSettings?.clients ?? 8;
    const influencerItems = influencerSettings?.items ?? 6;
    const influencerCategories = influencerSettings?.categories ?? 5;

    // Last updated times
    const lastUpdated = {
      hero: heroSettings?.updatedAt ?? null,
      services: servicesSettings?.updatedAt ?? null,
      projects: projectsSettings?.updatedAt ?? null,
      clients: clientsSettings?.updatedAt ?? null,
      influencer: influencerSettings?.updatedAt ?? null,
    };

    return NextResponse.json({
      sections: {
        hero: { slides: heroSlides, lastUpdated: lastUpdated.hero },
        services: { count: servicesCount, lastUpdated: lastUpdated.services },
        projects: { count: projectsCount, lastUpdated: lastUpdated.projects },
        clients: { count: clientsCount, lastUpdated: lastUpdated.clients },
        influencer: { items: influencerItems, categories: influencerCategories, lastUpdated: lastUpdated.influencer },
      },
      totals: {
        totalSections: 5,
        totalItems: heroSlides + servicesCount + projectsCount + clientsCount + influencerItems,
        lastModified: [lastUpdated.hero, lastUpdated.services, lastUpdated.projects, lastUpdated.clients, lastUpdated.influencer]
          .filter(Boolean)
          .sort((a, b) => new Date(b as Date).getTime() - new Date(a as Date).getTime())[0] ?? null,
        configuredSections: [heroSettings, servicesSettings, projectsSettings, clientsSettings, influencerSettings].filter(Boolean).length
      }
    });
  } catch (error) {
    console.error('API /api/dashboard GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
