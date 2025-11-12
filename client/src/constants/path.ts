// Definisikan semua path (alamat URL) yang kita gunakan
export const path = {
  home: '/', // Halaman utama (ProductList)

  // Halaman statis
  aboutUs: '/about-us',
  howWeWork: '/how-we-work',
  partners: '/partners',
  privacyPolicy: '/privacy-policy',
  terms: '/terms-and-conditions',

  // Halaman Customer Service
  howToUse: '/how-to-use',
  faq: '/faq',
  orderIssues: '/order-issues',
  contactUs: '/contact'

  // (Semua path lama seperti 'login', 'register', 'cart' sudah dihapus)
} as const;