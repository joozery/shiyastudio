import { ObjectId } from 'mongodb';
export const defaultCategories = ['Beauty', 'Fashion', 'Lifestyle', 'Food', 'Travel', 'Tech', 'Health', 'Pet', 'Business'];
export const defaultGenders = ['หญิง', 'ชาย', 'ไม่ระบุ'];
export type Social = {
    platform: string;
    url: string;
    followers: string;
    averageViews: string;
    engagement: string;
};
export type CreatorRecord = {
    _id?: ObjectId;
    id: string;
    author: string;
    img: string;
    photoId?: string;
    mediaKitId?: string;
    bio: string;
    categories: string[];
    gender: string;
    socials: Social[];
    portfolio: string[];
    rates: Record<string, string>;
    personal: {
        prefix?: string;
        fullName: string;
        nickname: string;
        birthday: string;
        province: string; nationality?: string; district?: string; occupation?: string; address?: string; languages?: string[]; otherLanguage?: string;
    };
    contact: {
        phone: string;
        email: string;
        line: string;
    };
    status: 'pending' | 'approved' | 'rejected' | 'hidden';
    featured: boolean;
    createdAt: Date;
    updatedAt?: Date;
    consent: {
        terms: boolean;
        privacy: boolean;
        version: string;
        at: Date;
        termsText?: string;
        privacyText?: string;
    };
};
export function publicCreator(p: CreatorRecord) { const primary = p.socials?.[0]; return { id: p.id, author: p.author, img: p.photoId ? `/api/creators/media/${p.photoId}` : p.img || '', bio: p.bio || '', category: p.categories?.[0] || '', categories: p.categories || [], gender: p.gender || '', platform: primary?.platform || '', profileUrl: primary?.url || '', followers: primary?.followers || '', videoUrl: p.portfolio?.[0] || '', socials: (p.socials || []).map(s => ({ platform: s.platform, url: s.url, followers: s.followers, averageViews: s.averageViews, engagement: s.engagement })), portfolio: p.portfolio || [], featured: !!p.featured }; }
export const text = (value: unknown, max = 500) => typeof value === 'string' ? value.trim().slice(0, max) : '';
export const validUrl = (value: string) => { if (!value)
    return true; try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && !!url.hostname;
}
catch {
    return false;
} };
export const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
