import {createNavigation} from 'next-intl/navigation';

export const locales = ['en', 'th'] as const;
export type Locale = (typeof locales)[number];
export const localePrefix = 'as-needed';
export const defaultLocale = 'en';

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation({locales, localePrefix, defaultLocale});
