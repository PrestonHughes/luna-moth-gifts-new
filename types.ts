export interface User {
  uid: string; // From Firebase Auth
  email: string;
  firstName?: string;
  lastName?: string;
  orders?: Order[];
}

export interface ProductVariant {
  size: string;
  price: number;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  variants: ProductVariant[];
  description: string;
  imageUrls: string[];
  category: string;
  isFeatured?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariant: ProductVariant;
  cartId: string;
}

export interface GeminiSuggestion {
    crystalName: string;
    description: string;
    productId?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  date: string;
  total: number;
  items: OrderItem[];
}


export type Page = 'home' | 'inventory' | 'account';