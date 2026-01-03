// Definisikan semua path (alamat URL) yang kita gunakan
export const path = {
  // Core
  home: '/',
  search: '/search',

  // Compare (PENTING)
  compare: '/compare/:slug',

  // Halaman Statis
  aboutUs: '/about-us',
  howWeWork: '/how-we-work',
  partners: '/partners',
  privacyPolicy: '/privacy-policy',
  terms: '/terms-and-conditions',

  // Customer Service
  howToUse: '/how-to-use',
  faq: '/faq',
  orderIssues: '/order-issues',
  contactUs: '/contact'
} as const;
