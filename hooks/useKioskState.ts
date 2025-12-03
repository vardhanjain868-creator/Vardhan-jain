
import { useState, useCallback, useMemo } from 'react';
import { MenuItem, CartItem, Order, OrderStatus, OrderType, PaymentMethod } from '../types';
import { INITIAL_MENU_ITEMS } from '../constants';

export const useKioskState = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [nextToken, setNextToken] = useState(101);

    const addToCart = useCallback((item: MenuItem, quantity: number = 1) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => cartItem.menuItem.id === item.id && JSON.stringify(cartItem.selectedAddons) === '[]');
            if (existingItem) {
                return prevCart.map(cartItem =>
                    cartItem.menuItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem
                );
            }
            return [...prevCart, { menuItem: item, quantity, selectedAddons: [] }];
        });
    }, []);

    const updateCartItemQuantity = useCallback((itemId: string, newQuantity: number) => {
        setCart(prevCart => {
            if (newQuantity <= 0) {
                return prevCart.filter(item => item.menuItem.id !== itemId);
            }
            return prevCart.map(item =>
                item.menuItem.id === itemId ? { ...item, quantity: newQuantity } : item
            );
        });
    }, []);

    const removeFromCart = useCallback((itemId: string) => {
        setCart(prevCart => prevCart.filter(item => item.menuItem.id !== itemId));
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    const cartTotal = useMemo(() => {
        return cart.reduce((total, item) => {
            const addonsTotal = item.selectedAddons.reduce((acc, addon) => acc + addon.price, 0);
            return total + (item.menuItem.price + addonsTotal) * item.quantity;
        }, 0);
    }, [cart]);

    const createOrder = useCallback((orderType: OrderType, paymentMethod: PaymentMethod, notes?: string) => {
        const newOrder: Order = {
            id: `ORD-${Date.now()}`,
            token: nextToken,
            items: cart,
            total: cartTotal,
            status: OrderStatus.Pending,
            orderType,
            paymentMethod,
            timestamp: new Date(),
            notes,
        };
        setOrders(prevOrders => [newOrder, ...prevOrders]);
        setNextToken(prevToken => prevToken + 1);
        clearCart();
        return newOrder;
    }, [cart, cartTotal, nextToken, clearCart]);

    const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === orderId ? { ...order, status } : order
            )
        );
    }, []);

    const addMenuItem = useCallback((item: MenuItem) => {
        setMenuItems(prev => [...prev, { ...item, id: `menu-${Date.now()}` }]);
    }, []);

    const updateMenuItem = useCallback((updatedItem: MenuItem) => {
        setMenuItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    }, []);

    const deleteMenuItem = useCallback((itemId: string) => {
        setMenuItems(prev => prev.filter(item => item.id !== itemId));
    }, []);


    return {
        menuItems,
        cart,
        orders,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        createOrder,
        updateOrderStatus,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
    };
};
   