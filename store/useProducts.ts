import { create } from 'zustand';

// Product categories
export const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports',
  'Toys & Games',
  'Books',
  'Vehicles',
  'Jewelry',
  'Furniture',
  'Other'
] as const;

export type Category = typeof CATEGORIES[number];

// Product condition
export const CONDITIONS = [
  'New',
  'Like New',
  'Good',
  'Fair',
  'Poor'
] as const;

export type Condition = typeof CONDITIONS[number];

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: Category;
  condition: Condition;
  location: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
  createdAt: string;
  featured?: boolean;
};

type ProductsState = {
  products: Product[];
  featuredProducts: Product[];
  isLoading: boolean;
  error: string | null;
  
  // Filters
  filters: {
    category: Category | null;
    minPrice: number | null;
    maxPrice: number | null;
    condition: Condition | null;
    search: string;
  };
  
  // Actions
  fetchProducts: () => void;
  setFilter: <K extends keyof ProductsState['filters']>(
    key: K,
    value: ProductsState['filters'][K]
  ) => void;
  clearFilters: () => void;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: Category) => Product[];
  getProductsBySeller: (sellerId: string) => Product[];
};

// Generate mock products
const generateMockProducts = (): Product[] => {
  const products: Product[] = [];
  
  // Sample images (in a real app, these would be from your database)
  const sampleImages = [
    'https://images.pexels.com/photos/2113994/pexels-photo-2113994.jpeg',
    'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg',
    'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg',
    'https://images.pexels.com/photos/4397840/pexels-photo-4397840.jpeg',
    'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg',
    'https://images.pexels.com/photos/2536965/pexels-photo-2536965.jpeg',
    'https://images.pexels.com/photos/1619651/pexels-photo-1619651.jpeg',
    'https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg',
    'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg',
  ];
  
  // Product titles
  const titles = [
    'iPhone 12 Pro - Excellent Condition',
    'Vintage Leather Jacket - Size M',
    'IKEA MALM Desk - White',
    'Sony WH-1000XM4 Headphones',
    'Mountain Bike - Trek Marlin 7',
    'Harry Potter Complete Book Collection',
    'Nintendo Switch with 3 Games',
    'Mid-Century Modern Coffee Table',
    'Diamond Engagement Ring - Size 7',
    'Cast Iron Cookware Set - 5 Pieces',
    'Designer Handbag - Barely Used',
    'Macbook Pro 16" 2023 M2',
    'Vintage Film Camera',
    'Air Fryer - Ninja 5.5L',
    'Professional Painting Set'
  ];
  
  // Seller info
  const sellers = [
    { id: '1', name: 'Alice Smith', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', name: 'Bob Johnson', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: '3', name: 'Charlie Williams', avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: '4', name: 'Diana Davis', avatar: 'https://i.pravatar.cc/150?img=4' },
    { id: '5', name: 'Ethan Brown', avatar: 'https://i.pravatar.cc/150?img=5' },
  ];
  
  // Generate 24 products
  for (let i = 0; i < 24; i++) {
    const randomSeller = sellers[Math.floor(Math.random() * sellers.length)];
    const randomCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const randomCondition = CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)];
    const randomPrice = Math.floor(Math.random() * 1000) + 10;
    const randomTitle = titles[i % titles.length];
    
    // For each product, get 1-3 random images
    const numImages = Math.floor(Math.random() * 3) + 1;
    const productImages: string[] = [];
    
    for (let j = 0; j < numImages; j++) {
      const randomImageIndex = Math.floor(Math.random() * sampleImages.length);
      productImages.push(sampleImages[randomImageIndex]);
    }
    
    products.push({
      id: `product-${i + 1}`,
      title: randomTitle,
      description: `This is a detailed description for ${randomTitle}. The item is in ${randomCondition.toLowerCase()} condition and ready for a new home. Don't miss this great deal!`,
      price: randomPrice,
      images: productImages,
      category: randomCategory,
      condition: randomCondition,
      location: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
      sellerId: randomSeller.id,
      sellerName: randomSeller.name,
      sellerAvatar: randomSeller.avatar,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      featured: i < 5, // The first 5 products are featured
    });
  }
  
  return products;
};

const mockProducts = generateMockProducts();

const useProducts = create<ProductsState>((set, get) => ({
  products: [],
  featuredProducts: [],
  isLoading: false,
  error: null,
  
  filters: {
    category: null,
    minPrice: null,
    maxPrice: null,
    condition: null,
    search: '',
  },
  
  fetchProducts: async () => {
    set({ isLoading: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set({
        products: mockProducts,
        featuredProducts: mockProducts.filter(p => p.featured),
        isLoading: false
      });
    } catch (error) {
      set({ error: 'Failed to fetch products', isLoading: false });
    }
  },
  
  setFilter: (key, value) => {
    set(state => ({
      filters: {
        ...state.filters,
        [key]: value
      }
    }));
  },
  
  clearFilters: () => {
    set({
      filters: {
        category: null,
        minPrice: null,
        maxPrice: null,
        condition: null,
        search: '',
      }
    });
  },
  
  getProductById: (id) => {
    return get().products.find(product => product.id === id);
  },
  
  getProductsByCategory: (category) => {
    return get().products.filter(product => product.category === category);
  },
  
  getProductsBySeller: (sellerId) => {
    return get().products.filter(product => product.sellerId === sellerId);
  }
}));

export default useProducts;