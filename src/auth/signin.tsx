import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, oauthLogin } from "../lib/apiAuth";
import { useApiAuth } from "../hooks/useApiAuth";
import Logo from "../components/logo";
import Input from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useLanguage } from "../providers/language-provider";
import { Chrome, Building2 } from "lucide-react";
import posthog from "posthog-js";

function Signin() {
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOAuthLoading, setIsOAuthLoading] = useState<string | null>(null);
    const navigate = useNavigate();
    const { isAuthenticated, isLoaded } = useApiAuth();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        posthog.capture('signin page', { property: 'visit' });
    }, []);

    // Si ya está autenticado, redirigir
    useEffect(() => {
        if (isLoaded && isAuthenticated) {
            navigate("/boards", { replace: true });
        }
    }, [isLoaded, isAuthenticated, navigate]);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await login(email, password);
            // Redirigir después del login exitoso
            navigate("/boards", { replace: true });
        } catch (err: any) {
            setError(err.message || t('signin.error'));
            setIsSubmitting(false);
        }
    };

    const handleOAuthLogin = async (provider: 'google' | 'azure') => {
        setError(null);
        setIsOAuthLoading(provider);

        try {
            const url = await oauthLogin(provider);
            // Redirigir al proveedor OAuth
            window.location.href = url;
        } catch (err: any) {
            setError(err.message || t('oauth.error.loginFailed'));
            setIsOAuthLoading(null);
        }
    };

    if (isLoading || (isLoaded && isAuthenticated)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#121212]">
                <Logo className="h-16 w-16" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212]">
            <div className="p-8 rounded-lg w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <Logo className="h-16 w-16" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-6 text-center">{t('signin.title')}</h1>
                <form onSubmit={handleSignIn} className="space-y-4">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    <div>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            placeholder={t('signin.email')}
                            className="w-full text-white"
                        />
                    </div>
                    <div>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            placeholder={t('signin.password')}
                            className="w-full text-white"
                        />
                    </div>
                    <Button
                        type="submit"
                        onClick={handleSignIn}
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? t('signin.submitting') : t('signin.submit')}
                    </Button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[#121212] text-gray-400">{t('signin.or')}</span>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        <Button
                            onClick={() => handleOAuthLogin('google')}
                            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                            disabled={isOAuthLoading !== null}
                        >
                            {isOAuthLoading === 'google' ? (
                                <span>{t('oauth.loading')}</span>
                            ) : (
                                <>
                                    <Chrome className="w-5 h-5" />
                                    <span>{t('oauth.google')}</span>
                                </>
                            )}
                        </Button>

                        <Button
                            onClick={() => handleOAuthLogin('azure')}
                            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                            disabled={isOAuthLoading !== null}
                        >
                            {isOAuthLoading === 'azure' ? (
                                <span>{t('oauth.loading')}</span>
                            ) : (
                                <>
                                    <Building2 className="w-5 h-5" />
                                    <span>{t('oauth.azure')}</span>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signin;