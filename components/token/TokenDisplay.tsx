
import React from 'react';
import { useKiosk } from '../../App';
import { OrderStatus } from '../../types';

export const TokenDisplay = () => {
    const { orders } = useKiosk();

    const preparingOrders = orders.filter(o => o.status === OrderStatus.Preparing).sort((a,b) => a.token - b.token);
    const readyOrders = orders.filter(o => o.status === OrderStatus.Ready).sort((a,b) => a.token - b.token);

    return (
        <div className="flex h-[calc(100vh-52px)] text-[#4A4A4A]">
            <div className="w-2/3 p-8 border-r border-gray-200">
                <h1 className="text-5xl font-bold text-center mb-8">PREPARING</h1>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {preparingOrders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-2xl shadow-md text-center">
                            <p className="text-5xl font-extrabold">{order.token}</p>
                        </div>
                    ))}
                    {preparingOrders.length === 0 && (
                        <p className="col-span-full text-center text-gray-400 text-2xl mt-16">No orders being prepared.</p>
                    )}
                </div>
            </div>
            <div className="w-1/3 p-8 bg-[#FADADD]">
                <h1 className="text-5xl font-bold text-center text-[#F4ACB7] mb-8">READY FOR PICKUP</h1>
                <div className="flex flex-col items-center gap-6">
                     {readyOrders.map(order => (
                        <div 
                            key={order.id} 
                            className="bg-[#F4ACB7] text-white p-8 rounded-3xl shadow-lg w-full text-center animate-pulse"
                        >
                            <p className="text-8xl font-extrabold">{order.token}</p>
                        </div>
                    ))}
                    {readyOrders.length === 0 && (
                        <p className="text-center text-[#9D8189] text-2xl mt-16">No orders ready for pickup.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
   