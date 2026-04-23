import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('shiyastudio');

    // Run all queries in parallel for performance
    const [
      heroSettings,
      servicesSettings,
      projectsSettings,
      clientsSettings,
      influencerSettings,
    ] = await Promise.all([
      db.collection('settings').findOne({ type: 'hero' }),
      db.collection('settings').findOne({ type: 'services' }),
      db.collection('settings').findOne({ type: 'projects' }),
      db.collection('settings').findOne({ type: 'clients' }),
      db.collection('settings').findOne({ type: 'influencer' }),
    ]);

    // Count items per section
    const heroSlides = heroSettings?.slides?.length ?? 3;
    const servicesCount = servicesSettings?.services?.length ?? 5;
    const projectsCount = projectsSettings?.projects?.length ?? 3;
    const clientsCount = clientsSettings?.clients?.length ?? 8;
    const influencerItems = influencerSettings?.items?.length ?? 6;
    const influencerCategories = influencerSettings?.categories?.length ?? 5;

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
