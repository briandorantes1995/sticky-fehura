import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../lib/apiAuth";
import { useApiAuth } from "../hooks/useApiAuth";
import Logo from "../components/logo";
import Input from "../components/ui/input";
import { Button } from "../components/ui/button";
import posthog from "posthog-js";

function Signin() {
    const [isLoading, setIsLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
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
            setError(err.message || "Error al iniciar sesión");
            setIsSubmitting(false);
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
                <h1 className="text-2xl font-bold text-white mb-6 text-center">Iniciar Sesión</h1>
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
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full text-white"
                        />
                    </div>
                    <div>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Contraseña"
                            className="w-full text-white"
                        />
                    </div>
                    <Button
                        type="submit"
                        onClick={handleSignIn}
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default Signin;