import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
      </Router>
    </ErrorBoundary>
  )
}

export default App