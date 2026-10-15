// User Types
export type UserRole = 'admin' | 'customer';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  phone?: string;
  address?: string;
  createdAt: number;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string; // Cloudinary URL
  createdAt: number;
}

// Product Types
export interface ProductVariant {
  name: string; // e.g., "Color", "Size"
  options: string[]; // e.g., ["Red", "Black"], ["M", "L", "XL"]
}

export interface ProductSpecification {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  categoryId: string;
  images: string[]; // Cloudinary URLs ONLY
  variants?: ProductVariant[];
  specifications?: ProductSpecification[];
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  createdAt: number;
  updatedAt: number;
}

// Cart Types
export interface CartItem {
  productId: string;
  name: string;
  price: number; // Use discountPrice if available, else regular price
  image: string; // First Cloudinary image
  quantity: number;
  selectedVariants?: Record<string, string>; // e.g., { "Color": "Red", "Size": "L" }
}

// Order Types
export interface DeliveryInfo {
  fullName: string;
  phone: string;
  address: string;
  area: string;
  note?: string;
}

export type PaymentMethod = 'cod' | 'online';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customerId: string;
  items: CartItem[];
  subTotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  deliveryInfo: DeliveryInfo;
  createdAt: number;
  updatedAt: number;
}

// Review Types
export interface Review {
  id: string;
  productId: string;
  customerId: string;
  customerName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: number;
}

// Legal Page Types (Privacy Policy, Terms, etc.)
export interface LegalPage {
  id: string;
  title: string;
  slug: string;
  content: string; // HTML content from React Quill/Jodit
  updatedAt: number;
}