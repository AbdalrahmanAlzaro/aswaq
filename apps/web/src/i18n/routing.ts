import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ar'],
  // Verida is Arabic-first (BRAND.md, Decision #4): Arabic (RTL) is the default,
  // English is a one-tap switch. `/` resolves to `/ar`.
  defaultLocale: 'ar'
});
