/**
 * Centralized Structured Data (JSON-LD) schemas for SEO & AEO
 * Supports: Organization, LocalBusiness, Service, FAQ, WebSite, BreadcrumbList
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://shiyastudio.com';
const LOGO_URL = `${BASE_URL}/logo.png`;

// ─────────────────────────────────────────────
// Organization + LocalBusiness (for AEO / AI search)
// ─────────────────────────────────────────────
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    '@id': `${BASE_URL}/#organization`,
    name: 'Shiya Studio',
    alternateName: ['ชิยะสตูดิโอ', 'Shiya Creative Studio'],
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: LOGO_URL,
      width: 400,
      height: 400,
    },
    image: `${BASE_URL}/og-image.jpg`,
    description:
      'Shiya Studio is a premium creative agency in Thailand specializing in Branding, Video Production, Graphic Design, and Influencer / KOL Marketing.',
    slogan: 'Where brands are reborn and digital boundaries are reimagined.',
    foundingDate: '2017',
    numberOfEmployees: { '@type': 'QuantitativeValue', value: 20 },
    areaServed: ['Thailand', 'Southeast Asia', 'Global'],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'TH',
      addressLocality: 'Bangkok',
      addressRegion: 'Bangkok',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: ['Thai', 'English'],
        url: `${BASE_URL}/en/contact`,
      },
    ],
    sameAs: [
      'https://www.facebook.com/shiyastudio',
      'https://www.instagram.com/shiyastudio',
      'https://www.tiktok.com/@shiyastudio',
      'https://lin.ee/shiyastudio',
    ],
    knowsAbout: [
      'Brand Identity Design',
      'Video Production',
      'Influencer Marketing',
      'KOL Marketing',
      'Motion Graphics',
      'Graphic Design',
      'Digital Marketing',
      'Content Creation',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Creative Agency Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Branding & Identity Design',
            description:
              'Complete brand identity creation including logo, color system, typography, and brand guidelines.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Video Production',
            description:
              'High-end cinematic video production from concept to final cut for commercials, corporate films, and content.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Influencer / KOL Marketing',
            description:
              'Strategic influencer and Key Opinion Leader campaigns connecting brands with the right audience.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Motion Graphics & VDO Motion',
            description:
              'Dynamic motion graphics and animation that bring digital presence to life.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Graphic Design',
            description:
              'Bold visual languages and graphic design that define modern brand identities.',
          },
        },
      ],
    },
  };
}

// ─────────────────────────────────────────────
// WebSite Schema (enables Google Sitelinks Searchbox)
// ─────────────────────────────────────────────
export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'Shiya Studio',
    description:
      'Premium Creative Agency — Branding, Video Production & Influencer Marketing in Thailand',
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/en/projects?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: ['en-US', 'th-TH'],
  };
}

// ─────────────────────────────────────────────
// FAQ Schema (critical for AEO / AI Answer Engine)
// ─────────────────────────────────────────────
export function getFAQSchema(locale: 'en' | 'th' = 'en') {
  const faqsEn = [
    {
      q: 'What services does Shiya Studio offer?',
      a: 'Shiya Studio offers premium creative services including Brand Identity Design, Video Production, Influencer & KOL Marketing, Motion Graphics (VDO Motion), Graphic Design, and Music Mixing & Mastering.',
    },
    {
      q: 'Where is Shiya Studio located?',
      a: 'Shiya Studio is based in Bangkok, Thailand, and serves clients both locally and internationally across Southeast Asia and globally.',
    },
    {
      q: 'How much does branding cost at Shiya Studio?',
      a: 'Branding packages at Shiya Studio vary based on project scope. Contact us for a custom quotation tailored to your brand needs.',
    },
    {
      q: 'What industries does Shiya Studio work with?',
      a: 'Shiya Studio works with a wide range of industries including fashion, FMCG, technology, F&B, hospitality, healthcare, and entertainment brands.',
    },
    {
      q: 'Can Shiya Studio create a full brand identity from scratch?',
      a: 'Yes. Shiya Studio specializes in end-to-end brand identity creation — from strategy, logo design, color system, typography, to brand guidelines and marketing collateral.',
    },
    {
      q: 'What is Influencer / KOL Marketing?',
      a: 'Influencer and KOL (Key Opinion Leader) Marketing is a strategy that connects your brand with the right social media personalities to reach your target audience authentically and at scale. Shiya Studio manages the full process from talent selection to campaign execution.',
    },
    {
      q: 'Does Shiya Studio produce commercials and corporate videos?',
      a: 'Yes. Shiya Studio produces high-end commercials, corporate films, product videos, and social media content with full cinematic production capabilities.',
    },
    {
      q: 'How do I start a project with Shiya Studio?',
      a: 'You can start a project by visiting our Contact page at shiyastudio.com/en/contact, filling out the project inquiry form, or reaching out via LINE or social media channels.',
    },
  ];

  const faqsTh = [
    {
      q: 'ชิยะสตูดิโอ (Shiya Studio) ให้บริการอะไรบ้าง?',
      a: 'ชิยะสตูดิโอให้บริการด้านความคิดสร้างสรรค์ระดับพรีเมียม ได้แก่ การออกแบบอัตลักษณ์แบรนด์, การผลิตวิดีโอ, Influencer & KOL Marketing, Motion Graphics, กราฟิกดีไซน์ และการมิกซ์เสียงดนตรี',
    },
    {
      q: 'ชิยะสตูดิโอตั้งอยู่ที่ไหน?',
      a: 'ชิยะสตูดิโอตั้งอยู่ในกรุงเทพมหานคร ประเทศไทย และให้บริการลูกค้าทั้งในประเทศและต่างประเทศทั่วเอเชียตะวันออกเฉียงใต้และทั่วโลก',
    },
    {
      q: 'ค่าบริการออกแบบแบรนด์ที่ชิยะสตูดิโอราคาเท่าไหร่?',
      a: 'ราคาออกแบบแบรนด์ขึ้นอยู่กับขอบเขตของโปรเจกต์ สามารถติดต่อเราเพื่อรับใบเสนอราคาที่ปรับแต่งตามความต้องการของแบรนด์คุณ',
    },
    {
      q: 'ชิยะสตูดิโอทำงานกับธุรกิจประเภทไหนบ้าง?',
      a: 'ชิยะสตูดิโอทำงานกับหลากหลายอุตสาหกรรม เช่น แฟชั่น, FMCG, เทคโนโลยี, ร้านอาหาร, การท่องเที่ยว, สุขภาพ และความบันเทิง',
    },
    {
      q: 'Influencer / KOL Marketing คืออะไร?',
      a: 'Influencer และ KOL Marketing คือกลยุทธ์การตลาดที่เชื่อมโยงแบรนด์ของคุณกับ Influencer หรือผู้มีอิทธิพลทางความคิดที่เหมาะสม เพื่อเข้าถึงกลุ่มเป้าหมายอย่างเป็นธรรมชาติและมีประสิทธิภาพ ชิยะสตูดิโอจัดการทุกขั้นตอนตั้งแต่การคัดเลือกนักการตลาดไปจนถึงการดำเนินแคมเปญ',
    },
    {
      q: 'จะเริ่มต้นโปรเจกต์กับชิยะสตูดิโอได้อย่างไร?',
      a: 'สามารถเริ่มต้นโปรเจกต์ได้โดยเยี่ยมชมหน้าติดต่อเราที่ shiyastudio.com/th/contact กรอกแบบฟอร์มสอบถาม หรือติดต่อผ่าน LINE หรือโซเชียลมีเดีย',
    },
  ];

  const faqs = locale === 'th' ? faqsTh : faqsEn;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  };
}

// ─────────────────────────────────────────────
// BreadcrumbList Schema
// ─────────────────────────────────────────────
export function getBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ─────────────────────────────────────────────
// Individual Service Page Schema
// ─────────────────────────────────────────────
export function getServiceSchema(service: {
  name: string;
  description: string;
  url: string;
  imageUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url: service.url,
    provider: {
      '@id': `${BASE_URL}/#organization`,
    },
    areaServed: ['Thailand', 'Southeast Asia'],
    ...(service.imageUrl && {
      image: service.imageUrl,
    }),
  };
}

// ─────────────────────────────────────────────
// CreativeWork / Portfolio Project Schema
// ─────────────────────────────────────────────
export function getCreativeWorkSchema(project: {
  name: string;
  description: string;
  url: string;
  imageUrl?: string;
  dateCreated?: string;
  category?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    description: project.description,
    url: project.url,
    creator: {
      '@id': `${BASE_URL}/#organization`,
    },
    ...(project.imageUrl && { image: project.imageUrl }),
    ...(project.dateCreated && { dateCreated: project.dateCreated }),
    ...(project.category && { genre: project.category }),
  };
}
