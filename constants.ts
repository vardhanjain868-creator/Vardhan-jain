
import { MenuItem } from './types';

export const CATEGORIES = [
  'Momos', 'Pizza', 'Fried Rice', 'Burger', 'Sandwich', 'Noodles',
  'Starters', 'Pasta', 'Coffee & Shake', 'Waffle', 'Maggie', 'Garlic Bread', 'Roll'
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  { id: 'momo1', name: 'Steamed Veg Momos', description: 'Classic steamed dumplings filled with fresh vegetables.', price: 120, image: 'https://picsum.photos/id/1060/400/400', category: 'Momos', available: true, addons: [{ id: 'addon1', name: 'Spicy Dip', price: 20 }, { id: 'addon2', name: 'Cheese Burst', price: 50 }] },
  { id: 'momo2', name: 'Paneer Fried Momos', description: 'Crispy fried dumplings with a savory paneer filling.', price: 150, image: 'https://picsum.photos/id/102/400/400', category: 'Momos', available: true },
  { id: 'pizza1', name: 'Margherita Pizza', description: 'A classic delight with 100% real mozzarella cheese.', price: 250, image: 'https://picsum.photos/id/20/400/400', category: 'Pizza', available: true, addons: [{ id: 'addon3', name: 'Extra Cheese', price: 60 }, { id: 'addon4', name: 'Olives', price: 40 }] },
  { id: 'pizza2', name: 'Veggie Paradise', description: 'A pizza loaded with crunchy onions, crisp capsicum, and juicy tomatoes.', price: 300, image: 'https://picsum.photos/id/30/400/400', category: 'Pizza', available: true },
  { id: 'rice1', name: 'Schezwan Fried Rice', description: 'Spicy and flavorful rice tossed with vegetables in schezwan sauce.', price: 180, image: 'https://picsum.photos/id/40/400/400', category: 'Fried Rice', available: true },
  { id: 'burger1', name: 'Aloo Tikki Burger', description: 'A delicious potato patty in a soft bun with tangy sauces.', price: 90, image: 'https://picsum.photos/id/45/400/400', category: 'Burger', available: true },
  { id: 'sandwich1', name: 'Club Sandwich', description: 'A triple-layered sandwich with fresh veggies and sauces.', price: 160, image: 'https://picsum.photos/id/48/400/400', category: 'Sandwich', available: true },
  { id: 'noodles1', name: 'Hakka Noodles', description: 'Classic Hakka style noodles tossed with assorted vegetables.', price: 170, image: 'https://picsum.photos/id/54/400/400', category: 'Noodles', available: true },
  { id: 'starter1', name: 'Chilli Paneer', description: 'Spicy and tangy paneer cubes tossed in a flavorful sauce.', price: 220, image: 'https://picsum.photos/id/65/400/400', category: 'Starters', available: true },
  { id: 'pasta1', name: 'White Sauce Pasta', description: 'Creamy and cheesy pasta with exotic vegetables.', price: 240, image: 'https://picsum.photos/id/75/400/400', category: 'Pasta', available: true },
  { id: 'coffee1', name: 'Cold Coffee', description: 'Rich and creamy cold coffee shake.', price: 150, image: 'https://picsum.photos/id/152/400/400', category: 'Coffee & Shake', available: false },
  { id: 'waffle1', name: 'Chocolate Waffle', description: 'Crispy waffle served with rich chocolate sauce and ice cream.', price: 200, image: 'https://picsum.photos/id/212/400/400', category: 'Waffle', available: true },
  { id: 'maggie1', name: 'Cheese Maggie', description: 'Classic maggie noodles cooked with a generous amount of cheese.', price: 100, image: 'https://picsum.photos/id/219/400/400', category: 'Maggie', available: true },
  { id: 'garlicbread1', name: 'Cheese Garlic Bread', description: 'Toasted bread with garlic butter and melted cheese.', price: 130, image: 'https://picsum.photos/id/312/400/400', category: 'Garlic Bread', available: true },
  { id: 'roll1', name: 'Paneer Tikka Roll', description: 'A delicious roll filled with spicy paneer tikka and veggies.', price: 180, image: 'https://picsum.photos/id/342/400/400', category: 'Roll', available: true }
];
   