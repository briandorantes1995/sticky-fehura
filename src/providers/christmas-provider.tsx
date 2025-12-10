import React, { createContext, useContext, useState } from 'react';

interface ChristmasContextType {
    isChristmasMode: boolean;
    toggleChristmasMode: () => void;
}

const ChristmasContext = createContext<ChristmasContextType | undefined>(undefined);

export function ChristmasProvider({ children }: { children: React.ReactNode }) {
    const [isChristmasMode, setIsChristmasMode] = useState(() => {
        const savedMode = localStorage.getItem('christmasMode');
        
        if (savedMode !== null) {
            return savedMode === 'true';
        }

        const DECEMBER = 11;
        const isDecember = new Date().getMonth() === DECEMBER;
        
        localStorage.setItem('christmasMode', String(isDecember));
        return isDecember;
    });
    const toggleChristmasMode = () => {
        setIsChristmasMode(prev => {
            const newValue = !prev;
            localStorage.setItem('christmasMode', String(newValue));
            return newValue;
        });
    };

    return (
        <ChristmasContext.Provider value={{ isChristmasMode, toggleChristmasMode }}>
            {children}
        </ChristmasContext.Provider>
    );
}

export const useChristmas = () => {
    const context = useContext(ChristmasContext);
    if (context === undefined) {
        throw new Error('useChristmas must be used within a ChristmasProvider');
    }
    return context;
};

