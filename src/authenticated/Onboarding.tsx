import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/logo';
import { useConvexAuth } from '../hooks/useConvexAuth';

const Onboarding: React.FC = () => {
    const { isAuthenticated } = useConvexAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/boards', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#121212]">
            <Logo className="h-16 w-16" />
            <p className="text-white ml-4">Setting up your stickies...</p>
        </div>
    );
};

export default Onboarding;