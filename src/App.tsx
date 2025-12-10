import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Footer from "./components/lander/footer"
import HeroSection from "./components/lander/hero"
import NavBar from "./components/lander/nav"
import PrivacyPolicy from "./components/privacy"
import TermsOfConditions from "./components/terms"
import Signin from './auth/signin';
import { useConvexAuth } from './hooks/useConvexAuth';
import AuthenticatedApp from './authenticated';
import AppLogin from './auth/appLogin';
import OAuthCallback from './auth/OAuthCallback';
import ErrorBoundary from './components/ErrorBoundary';
import { useLanguage } from './providers/language-provider';
import { useEffect, useState } from 'react';
import { getAuthToken, getUserData, hasValidToken } from './lib/apiAuth';

// Componente que verifica la sesión y redirige si es necesario
function AuthChecker({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Verificar sesión de forma síncrona al montar
    const checkSession = () => {
      const storedToken = getAuthToken();
      const storedUser = getUserData();

      // Si existe sesión válida y estamos en una ruta no autenticada, redirigir
      if (storedToken && storedUser && hasValidToken()) {
        const isAuthRoute = location.pathname.startsWith('/boards') || 
                           location.pathname.startsWith('/board') ||
                           location.pathname === '/app-login' ||
                           location.pathname === '/oauth-callback';
        
        if (!isAuthRoute) {
          // Usar window.location para redirigir inmediatamente sin renderizar
          window.location.href = '/boards';
          return;
        }
      }
      
      setIsChecking(false);
    };

    checkSession();
  }, [location.pathname]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  return <>{children}</>;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoaded, isAuthenticated } = useConvexAuth();
  const { t } = useLanguage();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <div className="text-white">{t('common.loading')}</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return <>{children}</>;
}

function App() {
  const { isLoaded } = useConvexAuth();
  const { t } = useLanguage();
  const [initialCheck, setInitialCheck] = useState(true);
  const [shouldRedirectToBoards, setShouldRedirectToBoards] = useState(false);

  // Verificación inicial síncrona de sesión antes de renderizar
  useEffect(() => {
    if (initialCheck) {
      const storedToken = getAuthToken();
      const storedUser = getUserData();

      // Si existe sesión válida en Redux persist, redirigir a boards
      if (storedToken && storedUser && hasValidToken()) {
        const currentPath = window.location.pathname;
        const isAuthRoute = currentPath.startsWith('/boards') || 
                           currentPath.startsWith('/board') ||
                           currentPath === '/app-login' ||
                           currentPath === '/oauth-callback';
        
        if (!isAuthRoute) {
          setShouldRedirectToBoards(true);
          window.location.href = '/boards';
          return;
        }
      }
      
      setInitialCheck(false);
    }
  }, [initialCheck]);

  if (initialCheck || shouldRedirectToBoards) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <div className="text-white">{t('common.loading')}</div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <div className="text-white">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <AuthChecker>
          <Routes>
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Navigate to="/signin" replace />} />
            <Route path="/app-login" element={<AppLogin />} />
            <Route path="/oauth-callback" element={<OAuthCallback />} />
            <Route path="/" element={
              <>
                <NavBar />
                <main>
                  <HeroSection />
                </main>
                <Footer />
              </>
            } />
            <Route path="/privacy" element={
              <>
                <NavBar />
                <PrivacyPolicy />
                <Footer />
              </>
            } />
            <Route path="/terms" element={
              <>
                <NavBar />
                <TermsOfConditions />
                <Footer />
              </>
            } />
            <Route path="/boards" element={
              <ProtectedRoute>
                <AuthenticatedApp />
              </ProtectedRoute>
            } />
            <Route path="/board/:id" element={
              <ProtectedRoute>
                <AuthenticatedApp />
              </ProtectedRoute>
            } />
            <Route path="/board" element={
              <ProtectedRoute>
                <AuthenticatedApp />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthChecker>
      </Router>
    </ErrorBoundary>
  )
}

export default App