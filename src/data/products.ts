export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'gaming' | 'anime' | 'tech' | 'collectibles';
  image: string;
  description: string;
  stock: number;
  rating: number;
  featured: boolean;
  badge?: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Mechanical Keyboard RGB TKL',
    price: 89.99,
    category: 'gaming',
    image: '/images/keyboard.png',
    description: 'Tenkeyless mechanical keyboard with Cherry MX switches and full RGB backlight. Perfect for gaming and coding marathons.',
    stock: 15,
    rating: 4.8,
    featured: true,
    badge: 'Best Seller'
  },
  {
    id: '2',
    name: 'Anime Figure — Rem Re:Zero',
    price: 54.99,
    category: 'anime',
    image: '/images/rem.png',
    description: 'High-quality 1/7 scale figure of Rem from Re:Zero. Hand-painted with incredible detail. Limited edition.',
    stock: 5,
    rating: 4.9,
    featured: true,
    badge: 'Limited'
  },
  {
    id: '3',
    name: 'Raspberry Pi 5 — 8GB',
    price: 79.99,
    category: 'tech',
    image: '/images/rpi.png',
    description: 'The latest Raspberry Pi single-board computer. 8GB RAM, dual 4K display output, PCIe support.',
    stock: 22,
    rating: 4.7,
    featured: true,
    badge: 'New'
  },
  {
    id: '4',
    name: 'Gaming Headset 7.1 Surround',
    price: 64.99,
    category: 'gaming',
    image: '/images/headset.png',
    description: 'Virtual 7.1 surround sound headset with noise-cancelling microphone. USB-C connection.',
    stock: 9,
    rating: 4.5,
    featured: false
  },
  {
    id: '5',
    name: 'Naruto Hokage Cloak — XL',
    price: 39.99,
    category: 'anime',
    image: '/images/naruto-cloak.png',
    description: 'Officially licensed Naruto Hokage cloak. High quality fabric, perfect for cosplay or everyday flex.',
    stock: 0,
    rating: 4.6,
    featured: false,
    badge: 'Out of Stock'
  },
  {
    id: '6',
    name: 'USB-C Hub 12-in-1',
    price: 44.99,
    category: 'tech',
    image: '/images/hub.png',
    description: '12-in-1 USB-C hub with 4K HDMI, 100W PD, SD card, and Ethernet. The only hub you will ever need.',
    stock: 31,
    rating: 4.4,
    featured: false
  },
  {
    id: '7',
    name: 'Pokémon Cards — Booster Box',
    price: 129.99,
    category: 'collectibles',
    image: '/images/pokemon.png',
    description: 'Scarlet & Violet booster box with 36 packs. Chance of getting rare holographic cards.',
    stock: 7,
    rating: 4.9,
    featured: true,
    badge: 'Hot'
  },
  {
    id: '8',
    name: 'Ergonomic Gaming Chair',
    price: 249.99,
    category: 'gaming',
    image: '/images/chair.png',
    description: 'Full ergonomic gaming chair with lumbar support, adjustable armrests, and reclining up to 165°.',
    stock: 3,
    rating: 4.3,
    featured: false
  },
  {
    id: '9',
    name: 'Attack on Titan — Complete Manga Box',
    price: 149.99,
    category: 'collectibles',
    image: '/images/aot.png',
    description: 'Complete Attack on Titan manga collection in a collector box. All 34 volumes.',
    stock: 4,
    rating: 5.0,
    featured: false,
    badge: 'Fan Fav'
  },
  {
    id: '10',
    name: 'Arduino Starter Kit Pro',
    price: 59.99,
    category: 'tech',
    image: '/images/arduino.png',
    description: 'Complete Arduino starter kit with 200+ components, sensors, motors, and project guide book.',
    stock: 18,
    rating: 4.6,
    featured: false
  }
];

export const categories = ['gaming', 'anime', 'tech', 'collectibles'] as const;

export const getProductById = (id: string): Product | undefined =>
  products.find((p) => p.id === id);

export const getProductsByCategory = (category: string): Product[] =>
  products.filter((p) => p.category === category);

export const getFeaturedProducts = (): Product[] =>
  products.filter((p) => p.featured);
