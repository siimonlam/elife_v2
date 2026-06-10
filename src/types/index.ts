export type Lang = 'en' | 'de' | 'it' | 'fr';

export type MultiLang = Record<Lang, string>;

export interface Category {
  id: string;
  name: string;
  name_translations: MultiLang;
  slug: string;
  image: string | null;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: MultiLang;
  description: MultiLang;
  slug: string;
  price: number;
  compare_price: number | null;
  sku: string | null;
  stock: number;
  category_id: string | null;
  images: string[];
  tags: string[];
  featured: boolean;
  is_new: boolean;
  is_active: boolean;
  age_range: string | null;
  brand: string | null;
  created_at: string;
  updated_at: string;
  categories?: Category;
}

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  currency: string;
  shipping_first_name: string | null;
  shipping_last_name: string | null;
  shipping_email: string | null;
  shipping_phone: string | null;
  shipping_line1: string | null;
  shipping_line2: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_postal_code: string | null;
  shipping_country: string | null;
  payment_method: string | null;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: MultiLang;
  excerpt: MultiLang;
  content: MultiLang;
  cover_image: string | null;
  author: string;
  tags: string[];
  published: boolean;
  published_at: string | null;
  read_time_minutes: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: MultiLang;
  price: number;
  image: string;
  quantity: number;
  slug: string;
}

export interface CheckoutFormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  paymentMethod: 'card' | 'paypal';
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardName: string;
}
