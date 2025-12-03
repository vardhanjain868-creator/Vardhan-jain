
export interface Addon {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  addons?: Addon[];
  available: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  selectedAddons: Addon[];
  notes?: string;
}

export enum OrderStatus {
  Pending = 'Pending',
  Preparing = 'Preparing',
  Ready = 'Ready',
  Completed = 'Completed',
}

export enum OrderType {
  DineIn = 'Dine-In',
  Takeaway = 'Takeaway',
}

export enum PaymentMethod {
    UPI = 'UPI',
    Cash = 'Cash',
}

export interface Order {
  id: string;
  token: number;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  timestamp: Date;
  notes?: string;
}
   