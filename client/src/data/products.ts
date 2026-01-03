// src/data/products.ts

export const createSlug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const PRODUCTS_DATA = [
  {
    id: 1,
    title: 'ASUS ROG Strix G15 Gaming Laptop Ryzen 7',
    slug: createSlug('ASUS ROG Strix G15 Gaming Laptop Ryzen 7'),
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302',
    shopeePrice: 16500000,
    tiktokPrice: 16200000,
    shopeeRating: 4.8,
    tiktokRating: 4.7,
    tags: ['Laptop', 'Gaming'],
    shopeeLink: 'https://invl.io/cln5avr',
    tiktokLink: 'https://www.tiktok.com/search?q=asus%20rog'
  },
  {
    id: 2,
    title: 'MacBook Air M2 2023 Midnight 256GB',
    slug: createSlug('MacBook Air M2 2023 Midnight 256GB'),
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
    shopeePrice: 18999000,
    tiktokPrice: 19100000,
    shopeeRating: 4.9,
    tiktokRating: 4.8,
    tags: ['Laptop', 'Apple'],
    shopeeLink: 'https://invol.co/clxxxx',
    tiktokLink: 'https://www.tiktok.com/search?q=macbook%20air%20m2'
  },
  {
    id: 3,
    title: 'Samsung Galaxy S24 Ultra 5G AI',
    slug: createSlug('Samsung Galaxy S24 Ultra 5G AI'),
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c',
    shopeePrice: 21999000,
    tiktokPrice: 21500000,
    shopeeRating: 4.8,
    tiktokRating: 4.7,
    tags: ['HP', 'Samsung'],
    shopeeLink: 'https://invol.co/clxxxx',
    tiktokLink: 'https://www.tiktok.com/search?q=samsung%20s24%20ultra'
  },
  {
    id: 4,
    title: 'Adidas Ultraboost Light Running',
    slug: createSlug('Adidas Ultraboost Light Running'),
    image: 'https://images.unsplash.com/photo-1587563871167-1ee7c735df57',
    shopeePrice: 2800000,
    tiktokPrice: 2850000,
    shopeeRating: 4.7,
    tiktokRating: 4.6,
    tags: ['Sepatu', 'Olahraga'],
    shopeeLink: 'https://invol.co/clxxxx',
    tiktokLink: 'https://www.tiktok.com/search?q=adidas%20ultraboost'
  },
  {
    id: 5,
    title: 'iPhone 15 Pro Max 256GB Natural',
    slug: createSlug('iPhone 15 Pro Max 256GB Natural'),
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc',
    shopeePrice: 23999000,
    tiktokPrice: 24200000,
    shopeeRating: 4.9,
    tiktokRating: 4.8,
    tags: ['HP', 'iPhone'],
    shopeeLink: 'https://invol.co/clxxxx',
    tiktokLink: 'https://www.tiktok.com/search?q=iphone%2015%20pro%20max'
  },
  {
    id: 6,
    title: 'Kemeja Flannel Uniqlo Kotak-Kotak',
    slug: createSlug('Kemeja Flannel Uniqlo Kotak-Kotak'),
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c',
    shopeePrice: 399000,
    tiktokPrice: 399000,
    shopeeRating: 4.6,
    tiktokRating: 4.6,
    tags: ['Fashion'],
    shopeeLink: 'https://invol.co/clxxxx',
    tiktokLink: 'https://www.tiktok.com/search?q=uniqlo%20flannel'
  },
  {
    id: 7,
    title: 'Philips Air Fryer Low Watt 4.1L',
    slug: createSlug('Philips Air Fryer Low Watt 4.1L'),
    image: 'https://images.unsplash.com/photo-1585128993275-57d42e20551f',
    shopeePrice: 1200000,
    tiktokPrice: 1150000,
    shopeeRating: 4.7,
    tiktokRating: 4.6,
    tags: ['Elektronik'],
    shopeeLink: 'https://invol.co/clxxxx',
    tiktokLink: 'https://www.tiktok.com/search?q=philips%20air%20fryer'
  },
  {
    id: 8,
    title: 'Jam Tangan Casio G-Shock GA-2100',
    slug: createSlug('Jam Tangan Casio G-Shock GA-2100'),
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314',
    shopeePrice: 1450000,
    tiktokPrice: 1500000,
    shopeeRating: 4.9,
    tiktokRating: 4.8,
    tags: ['Aksesoris'],
    shopeeLink: 'https://invol.co/clxxxx',
    tiktokLink: 'https://www.tiktok.com/search?q=gshock%20ga2100'
  },
  {
    id: 9,
    title: 'Sunscreen Azarine Hydrasoothe Gel SPF45',
    slug: createSlug('Sunscreen Azarine Hydrasoothe Gel SPF45'),
    image: 'https://images.unsplash.com/photo-1556228720-1987df1c911e',
    shopeePrice: 65000,
    tiktokPrice: 59000,
    shopeeRating: 4.8,
    tiktokRating: 4.7,
    tags: ['Skincare'],
    shopeeLink: 'https://invol.co/clxxxx',
    tiktokLink: 'https://www.tiktok.com/search?q=azarine%20sunscreen'
  },
  {
    id: 10,
    title: 'Tas Ransel Eiger Mountaineering 25L',
    slug: createSlug('Tas Ransel Eiger Mountaineering 25L'),
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
    shopeePrice: 450000,
    tiktokPrice: 425000,
    shopeeRating: 4.8,
    tiktokRating: 4.7,
    tags: ['Outdoor'],
    shopeeLink: 'https://invol.co/clxxxx',
    tiktokLink: 'https://www.tiktok.com/search?q=tas%20eiger'
  },
    {
    id: 11,
    title: 'Sepatu Nike Air Force 1 Triple White',
    slug: createSlug('Sepatu Nike Air Force 1 Triple White'),
    image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28',
    shopeePrice: 1549000,
    tiktokPrice: 1499000,
    shopeeRating: 4.9,
    tiktokRating: 4.8,
    tags: ['Sepatu', 'Fashion'],
    shopeeLink: 'https://invol.co/clxxxx',
    tiktokLink: 'https://www.tiktok.com/search?q=nike%20air%20force%201'
  },
  {
    id: 12,
    title: 'SKINTIFIC 5X Ceramide Moisturizer',
    slug: createSlug('SKINTIFIC 5X Ceramide Moisturizer'),
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be',
    shopeePrice: 139000,
    tiktokPrice: 125000,
    shopeeRating: 5.0,
    tiktokRating: 4.9,
    tags: ['Skincare'],
    shopeeLink: 'https://invol.co/clxxxx',
    tiktokLink: 'https://www.tiktok.com/search?q=skintific'
  },
];
