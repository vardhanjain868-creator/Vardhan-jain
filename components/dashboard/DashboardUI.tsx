
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useKiosk } from '../../App';
import { OrderStatus, MenuItem, Addon } from '../../types';
import { CATEGORIES } from '../../constants';
import { PlusIcon } from '../Icons';

type DashboardView = 'overview' | 'orders' | 'menu' | 'reports' | 'settings';

export const Dashboard = () => {
    const [view, setView] = useState<DashboardView>('overview');

    const renderView = () => {
        switch (view) {
            case 'overview': return <Overview />;
            case 'orders': return <LiveOrders />;
            case 'menu': return <MenuManagement />;
            case 'reports': return <SalesReports />;
            case 'settings': return <div className="p-8"><h1 className="text-3xl font-bold">Settings</h1><p>Cafe settings will be here.</p></div>;
            default: return <Overview />;
        }
    };
    
    return (
        <div className="flex h-[calc(100vh-52px)] bg-gray-50">
            <nav className="w-64 bg-white p-4 shadow-lg">
                <h2 className="text-2xl font-bold text-[#4A4A4A] mb-8 text-center">Dashboard</h2>
                <ul className="space-y-2">
                    <DashboardNavItem label="Overview" active={view === 'overview'} onClick={() => setView('overview')} />
                    <DashboardNavItem label="Live Orders" active={view === 'orders'} onClick={() => setView('orders')} />
                    <DashboardNavItem label="Menu Control" active={view === 'menu'} onClick={() => setView('menu')} />
                    <DashboardNavItem label="Sales Reports" active={view === 'reports'} onClick={() => setView('reports')} />
                    <DashboardNavItem label="Settings" active={view === 'settings'} onClick={() => setView('settings')} />
                </ul>
            </nav>
            <main className="flex-1 overflow-y-auto">
                {renderView()}
            </main>
        </div>
    );
};

const DashboardNavItem = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
    <li>
        <button onClick={onClick} className={`w-full text-left text-lg p-3 rounded-lg transition-all ${active ? 'bg-[#FADADD] text-[#F4ACB7] font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}>
            {label}
        </button>
    </li>
);

// MOCK DATA FOR CHARTS
const salesData = [
  { name: 'Mon', sales: 4000 }, { name: 'Tue', sales: 3000 }, { name: 'Wed', sales: 5000 },
  { name: 'Thu', sales: 4500 }, { name: 'Fri', sales: 7000 }, { name: 'Sat', sales: 8000 }, { name: 'Sun', sales: 7500 },
];
const topItemsData = [
  { name: 'Margherita Pizza', sold: 120 }, { name: 'Cold Coffee', sold: 98 }, { name: 'Chilli Paneer', sold: 85 },
  { name: 'Hakka Noodles', sold: 70 }, { name: 'Club Sandwich', sold: 60 },
];

const Overview = () => {
    const { orders } = useKiosk();
    const todaySales = orders.reduce((sum, order) => new Date(order.timestamp).toDateString() === new Date().toDateString() ? sum + order.total : sum, 0);
    const activeTokens = orders.filter(o => o.status === 'Pending' || o.status === 'Preparing').length;
    
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-[#4A4A4A] mb-6">Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow"><h3 className="text-gray-500">Today's Sales</h3><p className="text-3xl font-bold">&#8377;{todaySales.toFixed(2)}</p></div>
                <div className="bg-white p-6 rounded-lg shadow"><h3 className="text-gray-500">Active Tokens</h3><p className="text-3xl font-bold">{activeTokens}</p></div>
                <div className="bg-white p-6 rounded-lg shadow"><h3 className="text-gray-500">Total Orders Today</h3><p className="text-3xl font-bold">{orders.filter(o => new Date(o.timestamp).toDateString() === new Date().toDateString()).length}</p></div>
                <div className="bg-white p-6 rounded-lg shadow"><h3 className="text-gray-500">Completed Orders</h3><p className="text-3xl font-bold">{orders.filter(o => o.status === 'Completed').length}</p></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="font-bold text-lg mb-4">Weekly Sales</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={salesData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="sales" stroke="#F4ACB7" strokeWidth={2} activeDot={{ r: 8 }} /></LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="font-bold text-lg mb-4">Top Selling Items</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={topItemsData} layout="vertical"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis type="category" dataKey="name" width={120} /><Tooltip /><Bar dataKey="sold" fill="#FADADD" /></BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

const LiveOrders = () => {
    const { orders, updateOrderStatus } = useKiosk();

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.Pending: return 'bg-yellow-100 text-yellow-800';
            case OrderStatus.Preparing: return 'bg-blue-100 text-blue-800';
            case OrderStatus.Ready: return 'bg-green-100 text-green-800';
            case OrderStatus.Completed: return 'bg-gray-100 text-gray-800';
        }
    };
    
    const getNextStatus = (status: OrderStatus): OrderStatus | null => {
        const statuses = [OrderStatus.Pending, OrderStatus.Preparing, OrderStatus.Ready, OrderStatus.Completed];
        const currentIndex = statuses.indexOf(status);
        return currentIndex < statuses.length - 1 ? statuses[currentIndex + 1] : null;
    }

    const activeOrders = orders.filter(o => o.status !== OrderStatus.Completed);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-[#4A4A4A] mb-6">Live Orders</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {activeOrders.length === 0 && <p className="text-gray-500">No active orders right now.</p>}
                {activeOrders.map(order => {
                    const nextStatus = getNextStatus(order.status);
                    return (
                        <div key={order.id} className="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-2xl font-extrabold text-[#F4ACB7]">#{order.token}</h3>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>{order.status}</span>
                                </div>
                                <p className="text-sm text-gray-500 mb-2">{order.orderType} &bull; {new Date(order.timestamp).toLocaleTimeString()}</p>
                                <ul className="text-sm space-y-1 my-4 border-t border-b py-2">
                                    {order.items.map(item => (
                                        <li key={item.menuItem.id}>{item.quantity} x {item.menuItem.name}</li>
                                    ))}
                                </ul>
                            </div>
                            {nextStatus && (
                                <button onClick={() => updateOrderStatus(order.id, nextStatus)} className="w-full bg-[#F4ACB7] text-white font-bold py-2 rounded-lg hover:bg-pink-500 transition">
                                    Mark as {nextStatus}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const MenuManagement = () => {
    const { menuItems, addMenuItem, updateMenuItem, deleteMenuItem } = useKiosk();
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

    const handleSave = (item: MenuItem) => {
        if (item.id.startsWith('new-')) {
            const newItem = {...item};
            delete (newItem as any).id;
            addMenuItem(newItem);
        } else {
            updateMenuItem(item);
        }
        setEditingItem(null);
    }
    
    const handleAddNew = () => {
        setEditingItem({
            id: 'new-item', name: '', description: '', price: 0, image: '', category: CATEGORIES[0], available: true, addons: []
        });
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-[#4A4A4A]">Menu Management</h1>
                <button onClick={handleAddNew} className="bg-[#F4ACB7] text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-pink-500"><PlusIcon className="w-5 h-5" /> Add New Item</button>
            </div>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4">Item</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Availability</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {menuItems.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-4 font-semibold">{item.name}</td>
                                <td className="p-4">{item.category}</td>
                                <td className="p-4">&#8377;{item.price}</td>
                                <td className="p-4">{item.available ? <span className="text-green-600">Available</span> : <span className="text-red-600">Unavailable</span>}</td>
                                <td className="p-4">
                                    <button onClick={() => setEditingItem(item)} className="text-[#F4ACB7] font-semibold mr-4">Edit</button>
                                    <button onClick={() => deleteMenuItem(item.id)} className="text-red-500 font-semibold">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {editingItem && <MenuEditModal item={editingItem} onSave={handleSave} onClose={() => setEditingItem(null)} />}
        </div>
    );
};

const MenuEditModal = ({ item, onSave, onClose }: { item: MenuItem, onSave: (item: MenuItem) => void, onClose: () => void }) => {
    const [formState, setFormState] = useState(item);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
             setFormState(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
             setFormState(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6">{item.id.startsWith('new-') ? 'Add New Item' : 'Edit Item'}</h2>
                <div className="space-y-4">
                    <input type="text" name="name" value={formState.name} onChange={handleChange} placeholder="Item Name" className="w-full p-2 border rounded" />
                    <textarea name="description" value={formState.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded"></textarea>
                    <input type="number" name="price" value={formState.price} onChange={handleChange} placeholder="Price" className="w-full p-2 border rounded" />
                    <select name="category" value={formState.category} onChange={handleChange} className="w-full p-2 border rounded">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input type="text" name="image" value={formState.image} onChange={handleChange} placeholder="Image URL" className="w-full p-2 border rounded" />
                     <label className="flex items-center gap-2"><input type="checkbox" name="available" checked={formState.available} onChange={handleChange} /> Available</label>
                </div>
                <div className="flex justify-end gap-4 mt-8">
                    <button onClick={onClose} className="py-2 px-4 bg-gray-200 rounded">Cancel</button>
                    <button onClick={() => onSave(formState)} className="py-2 px-4 bg-[#F4ACB7] text-white rounded">Save</button>
                </div>
            </div>
        </div>
    );
};

const SalesReports = () => (
    <div className="p-8">
        <h1 className="text-3xl font-bold">Sales Reports</h1>
        <p>Detailed sales reports will be displayed here.</p>
    </div>
);
   