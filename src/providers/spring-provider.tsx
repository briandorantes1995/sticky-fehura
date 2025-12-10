import React, { createContext, useContext, useState } from 'react';

interface SpringContextType {
    isSpringMode: boolean;
    toggleSpringMode: () => void;
}

const SpringContext = createContext<SpringContextType | undefined>(undefined);

export function SpringProvider({ children }: { children: React.ReactNode }) {
    const [isSpringMode, setIsSpringMode] = useState(() => {
        const savedMode = localStorage.getItem('springMode');
        
        if (savedMode !== null) {
            return savedMode === 'true';
        }

        // Primavera: marzo (2), abril (3), mayo (4)
        const currentMonth = new Date().getMonth();
        const isSpring = currentMonth >= 2 && currentMonth <= 4;
        
        localStorage.setItem('springMode', String(isSpring));
        return isSpring;
    });
    const toggleSpringMode = () => {
        setIsSpringMode(prev => {
            const newValue = !prev;
            localStorage.setItem('springMode', String(newValue));
            return newValue;
        });
    };

    return (
        <SpringContext.Provider value={{ isSpringMode, toggleSpringMode }}>
            {children}
        </SpringContext.Provider>
    );
}

export const useSpring = () => {
    const context = useContext(SpringContext);
    if (context === undefined) {
        throw new Error('useSpring must be used within a SpringProvider');
    }
    return context;
};

