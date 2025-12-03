
import React, { useState, useMemo } from 'react';
import { useKiosk } from '../../App';
import { CATEGORIES } from '../../constants';
import { MenuItem, CartItem, OrderType, PaymentMethod, Order } from '../../types';
import { PlusIcon, MinusIcon, TrashIcon, XMarkIcon, CheckCircleIcon, DoodleMug } from '../Icons';

type KioskView = 'welcome' | 'menu' | 'checkout' | 'confirmation';

export const WelcomeScreen = () => {
    const [view, setView] = useState<KioskView>('welcome');
    const [lastOrder, setLastOrder] = useState<Order | null>(null);

    const handleOrderPlaced = (order: Order) => {
        setLastOrder(order);
        setView('confirmation');
    };

    const handleNewOrder = () => {
        setLastOrder(null);
        setView('welcome');
    };

    const renderContent = () => {
        switch (view) {
            case 'welcome':
                return (
                    <div className="flex flex-col items-center justify-center h-[calc(100vh-52px)] text-center p-8 bg-[#FADADD]">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#F4ACB7]/50 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                            <DoodleMug className="w-48 h-48 mx-auto text-[#4A4A4A]" />
                            <h1 className="text-5xl md:text-7xl font-bold text-[#4A4A4A] mt-4">The कर्ची Wok</h1>
                            <p className="text-xl md:text-2xl text-[#9D8189] mt-2 mb-8">स्वाद जो याद बन जाए</p>
                            <button
                                onClick={() => setView('menu')}
                                className="bg-[#F4ACB7] text-white font-bold py-4 px-12 rounded-full text-2xl shadow-lg hover:bg-pink-500 transition-transform transform hover:scale-105"
                            >
                                START ORDER
                            </button>
                        </div>
                    </div>
                );
            case 'menu':
                return <MenuScreen onCheckout={() => setView('checkout')} />;
            case 'checkout':
                return <CheckoutFlow onOrderPlaced={handleOrderPlaced} onBack={() => setView('menu')} />;
            case 'confirmation':
                return lastOrder && <ConfirmationScreen order={lastOrder} onNewOrder={handleNewOrder} />;
            default:
                return null;
        }
    };

    return <>{renderContent()}</>;
};

const MenuScreen = ({ onCheckout }: { onCheckout: () => void }) => {
    const { menuItems, cart, addToCart } = useKiosk();
    const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const filteredItems = useMemo(() => {
        return menuItems.filter(item => item.category === selectedCategory && item.available);
    }, [menuItems, selectedCategory]);
    
    const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <div className="flex h-[calc(100vh-52px)]">
            <aside className="w-1/4 bg-[#FADADD] p-4 overflow-y-auto">
                <h2 className="text-2xl font-bold text-[#4A4A4A] mb-4">Categories</h2>
                <div className="flex flex-col gap-2">
                    {CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`w-full text-left text-lg p-3 rounded-lg transition-all ${selectedCategory === category ? 'bg-[#F4ACB7] text-white font-semibold' : 'text-[#4A4A4A] hover:bg-pink-200'}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </aside>
            <main className="w-3/4 p-6 overflow-y-auto">
                <h2 className="text-3xl font-bold text-[#4A4A4A] mb-6">{selectedCategory}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map(item => (
                        <MenuItemCard key={item.id} item={item} onAdd={() => addToCart(item)} />
                    ))}
                </div>
            </main>
            {cartItemCount > 0 && (
                 <div className="fixed bottom-8 right-8 z-20">
                    <button 
                        onClick={() => setIsCartOpen(true)}
                        className="bg-[#F4ACB7] text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg hover:bg-pink-500 transition-transform transform hover:scale-105 flex items-center gap-2">
                         View Cart <span className="bg-white text-[#F4ACB7] rounded-full px-3 py-1 text-sm font-bold">{cartItemCount}</span>
                    </button>
                </div>
            )}
            {isCartOpen && <CartSidebar onCheckout={onCheckout} onClose={() => setIsCartOpen(false)} />}
        </div>
    );
};

// FIX: Changed component definition to use React.FC to correctly type it as a React Function Component, which allows the use of the 'key' prop without a TypeScript error.
const MenuItemCard: React.FC<{ item: MenuItem; onAdd: () => void }> = ({ item, onAdd }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col justify-between p-4 border border-gray-100 transition-transform transform hover:-translate-y-1">
            <div>
                <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded-lg" />
                <h3 className="text-xl font-bold text-[#4A4A4A] mt-4">{item.name}</h3>
                <p className="text-gray-500 text-sm mt-1 h-10">{item.description}</p>
            </div>
            <div className="flex justify-between items-center mt-4">
                <span className="text-xl font-semibold text-[#4A4A4A]">&#8377;{item.price}</span>
                <button
                    onClick={onAdd}
                    className="bg-pink-100 text-[#F4ACB7] p-2 rounded-full hover:bg-[#F4ACB7] hover:text-white transition-colors"
                >
                    <PlusIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};


const CartSidebar = ({ onCheckout, onClose }: { onCheckout: () => void; onClose: () => void }) => {
    const { cart, updateCartItemQuantity, removeFromCart, cartTotal } = useKiosk();

    return (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose}>
            <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-[#4A4A4A]">Your Order</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                        <XMarkIcon className="w-6 h-6 text-gray-600" />
                    </button>
                </div>
                {cart.length === 0 ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-center">
                        <DoodleMug className="w-24 h-24 text-gray-300" />
                        <p className="text-gray-500 mt-4 text-lg">Your cart is empty.</p>
                        <p className="text-gray-400">Add some delicious items to get started!</p>
                    </div>
                ) : (
                    <div className="flex-grow overflow-y-auto -mr-6 pr-6 space-y-4">
                        {cart.map(item => (
                            <CartItemCard key={item.menuItem.id} item={item} onUpdateQuantity={updateCartItemQuantity} onRemove={removeFromCart} />
                        ))}
                    </div>
                )}
                {cart.length > 0 && (
                    <div className="mt-6 pt-6 border-t">
                        <div className="flex justify-between items-center text-xl font-bold text-[#4A4A4A] mb-4">
                            <span>Total</span>
                            <span>&#8377;{cartTotal.toFixed(2)}</span>
                        </div>
                        <button onClick={onCheckout} className="w-full bg-[#F4ACB7] text-white font-bold py-4 rounded-full text-xl shadow-lg hover:bg-pink-500 transition">
                            Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


// FIX: Changed component definition to use React.FC to correctly type it as a React Function Component, which allows the use of the 'key' prop without a TypeScript error.
const CartItemCard: React.FC<{ item: CartItem; onUpdateQuantity: (id: string, q: number) => void; onRemove: (id: string) => void; }> = ({ item, onUpdateQuantity, onRemove }) => {
    return (
        <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg">
            <img src={item.menuItem.image} alt={item.menuItem.name} className="w-20 h-20 object-cover rounded-md" />
            <div className="flex-grow">
                <h4 className="font-semibold text-[#4A4A4A]">{item.menuItem.name}</h4>
                <p className="text-gray-500">&#8377;{item.menuItem.price.toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => onUpdateQuantity(item.menuItem.id, item.quantity - 1)} className="p-1 rounded-full bg-pink-100 text-[#F4ACB7]"><MinusIcon className="w-4 h-4" /></button>
                    <span className="font-bold w-8 text-center">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.menuItem.id, item.quantity + 1)} className="p-1 rounded-full bg-pink-100 text-[#F4ACB7]"><PlusIcon className="w-4 h-4" /></button>
                </div>
            </div>
            <button onClick={() => onRemove(item.menuItem.id)} className="text-gray-400 hover:text-red-500 p-2">
                <TrashIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

const CheckoutFlow = ({ onOrderPlaced, onBack }: { onOrderPlaced: (order: Order) => void, onBack: () => void }) => {
    const { createOrder, cartTotal } = useKiosk();
    const [step, setStep] = useState(1);
    const [orderType, setOrderType] = useState<OrderType | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);

    const handlePlaceOrder = () => {
        if (orderType && paymentMethod) {
            const order = createOrder(orderType, paymentMethod);
            onOrderPlaced(order);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-52px)] p-8">
            <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg">
                <div className="mb-6">
                    <button onClick={onBack} className="text-[#9D8189] hover:text-[#4A4A4A] mb-4">&larr; Back to Menu</button>
                    <div className="flex justify-between text-sm">
                        <span className={step >= 1 ? 'text-[#F4ACB7] font-bold' : 'text-gray-400'}>Order Type</span>
                        <span className={step >= 2 ? 'text-[#F4ACB7] font-bold' : 'text-gray-400'}>Payment</span>
                        <span className={step >= 3 ? 'text-[#F4ACB7] font-bold' : 'text-gray-400'}>Confirm</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div className="bg-[#F4ACB7] h-1.5 rounded-full" style={{ width: `${(step / 3) * 100}%` }}></div>
                    </div>
                </div>

                {step === 1 && (
                    <div>
                        <h2 className="text-3xl font-bold text-center text-[#4A4A4A] mb-8">How will you be dining?</h2>
                        <div className="grid grid-cols-2 gap-8">
                            <button onClick={() => { setOrderType(OrderType.DineIn); setStep(2); }} className="p-8 border-2 border-gray-200 rounded-xl text-center hover:border-[#F4ACB7] hover:bg-pink-50 transition">
                                <span className="text-5xl">🍽️</span>
                                <p className="text-2xl font-bold mt-2 text-[#4A4A4A]">{OrderType.DineIn}</p>
                            </button>
                            <button onClick={() => { setOrderType(OrderType.Takeaway); setStep(2); }} className="p-8 border-2 border-gray-200 rounded-xl text-center hover:border-[#F4ACB7] hover:bg-pink-50 transition">
                                <span className="text-5xl">🛍️</span>
                                <p className="text-2xl font-bold mt-2 text-[#4A4A4A]">{OrderType.Takeaway}</p>
                            </button>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div>
                        <h2 className="text-3xl font-bold text-center text-[#4A4A4A] mb-8">How would you like to pay?</h2>
                        <div className="grid grid-cols-2 gap-8">
                            <button onClick={() => { setPaymentMethod(PaymentMethod.UPI); setStep(3); }} className="p-8 border-2 border-gray-200 rounded-xl text-center hover:border-[#F4ACB7] hover:bg-pink-50 transition">
                                <span className="text-5xl">📱</span>
                                <p className="text-2xl font-bold mt-2 text-[#4A4A4A]">{PaymentMethod.UPI}</p>
                            </button>
                            <button onClick={() => { setPaymentMethod(PaymentMethod.Cash); setStep(3); }} className="p-8 border-2 border-gray-200 rounded-xl text-center hover:border-[#F4ACB7] hover:bg-pink-50 transition">
                                <span className="text-5xl">💵</span>
                                <p className="text-2xl font-bold mt-2 text-[#4A4A4A]">{PaymentMethod.Cash}</p>
                            </button>
                        </div>
                    </div>
                )}
                {step === 3 && (
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-[#4A4A4A] mb-4">Confirm Your Order</h2>
                        <p className="text-lg text-gray-600 mb-6">You've selected <span className="font-bold">{orderType}</span> and will pay by <span className="font-bold">{paymentMethod}</span>.</p>
                        <div className="bg-pink-50 p-6 rounded-lg mb-8">
                            <p className="text-2xl font-bold text-[#4A4A4A]">Total Amount</p>
                            <p className="text-5xl font-extrabold text-[#F4ACB7] mt-2">&#8377;{cartTotal.toFixed(2)}</p>
                        </div>
                        <button onClick={handlePlaceOrder} className="w-full bg-[#F4ACB7] text-white font-bold py-4 rounded-full text-xl shadow-lg hover:bg-pink-500 transition">
                            Place Order
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


const ConfirmationScreen = ({ order, onNewOrder }: { order: Order; onNewOrder: () => void; }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center h-[calc(100vh-52px)] p-8 bg-pink-50">
            <CheckCircleIcon className="w-24 h-24 text-green-500" />
            <h1 className="text-4xl font-bold text-[#4A4A4A] mt-4">Order Placed Successfully!</h1>
            <p className="text-lg text-gray-600 mt-2">Please wait for your token number to be called.</p>
            
            <div className="my-10">
                <p className="text-xl text-[#9D8189]">Your Token Number</p>
                <div className="bg-[#FADADD] text-[#F4ACB7] font-extrabold text-8xl py-6 px-12 rounded-2xl inline-block mt-2 shadow-inner">
                    {order.token}
                </div>
            </div>

            <p className="text-lg text-gray-600">Estimated preparation time: <span className="font-bold">15-20 minutes</span></p>

            <div className="mt-12 flex gap-4">
                 <button className="bg-white text-[#F4ACB7] border border-[#F4ACB7] font-bold py-3 px-8 rounded-full text-lg shadow-sm hover:bg-pink-50 transition">
                    Print Receipt
                </button>
                <button 
                    onClick={onNewOrder}
                    className="bg-[#F4ACB7] text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-pink-500 transition">
                    New Order
                </button>
            </div>
        </div>
    );
};