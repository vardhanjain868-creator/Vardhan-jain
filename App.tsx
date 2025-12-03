
import React, { useState, createContext, useContext } from 'react';
import { useKioskState } from './hooks/useKioskState';
import { WelcomeScreen } from './components/kiosk/KioskUI';
import { Dashboard } from './components/dashboard/DashboardUI';
import { TokenDisplay } from './components/token/TokenDisplay';

type KioskState = ReturnType<typeof useKioskState>;
const KioskContext = createContext<KioskState | null>(null);

export const useKiosk = () => {
    const context = useContext(KioskContext);
    if (!context) {
        throw new Error('useKiosk must be used within a KioskProvider');
    }
    return context;
};

type View = 'kiosk' | 'dashboard' | 'token_display';

function App() {
    const kioskState = useKioskState();
    const [view, setView] = useState<View>('kiosk');

    const renderView = () => {
        switch (view) {
            case 'kiosk':
                return <WelcomeScreen />;
            case 'dashboard':
                return <Dashboard />;
            case 'token_display':
                return <TokenDisplay />;
            default:
                return <WelcomeScreen />;
        }
    };

    return (
        <KioskContext.Provider value={kioskState}>
            <div className="min-h-screen bg-[#FEFBF6] font-sans">
                <nav className="bg-[#FADADD] p-2 shadow-md print:hidden">
                    <div className="container mx-auto flex justify-center items-center gap-4">
                        <h1 className="text-lg font-bold text-[#4A4A4A]">The कर्ची Wok</h1>
                         <button onClick={() => setView('kiosk')} className={`px-3 py-1 rounded-full text-sm ${view === 'kiosk' ? 'bg-[#F4ACB7] text-white' : 'text-[#4A4A4A]'}`}>Kiosk</button>
                         <button onClick={() => setView('dashboard')} className={`px-3 py-1 rounded-full text-sm ${view === 'dashboard' ? 'bg-[#F4ACB7] text-white' : 'text-[#4A4A4A]'}`}>Dashboard</button>
                         <button onClick={() => setView('token_display')} className={`px-3 py-1 rounded-full text-sm ${view === 'token_display' ? 'bg-[#F4ACB7] text-white' : 'text-[#4A4A4A]'}`}>Token Display</button>
                    </div>
                </nav>
                {renderView()}
            </div>
        </KioskContext.Provider>
    );
}

export default App;
   