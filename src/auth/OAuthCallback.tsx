import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { exchangeToken } from "../lib/apiAuth";
import Logo from "../components/logo";
import { useLanguage } from "../providers/language-provider";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Obtener el access_token del hash de la URL
        const hash = window.location.hash.replace("#", "");
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");

        if (!accessToken) {
          setError(t('oauth.error.noToken'));
          setIsLoading(false);
          navigate("/signin?error=no_token");
          return;
        }

        // Intercambiar el token de Supabase por el token propio
        const data = await exchangeToken(accessToken);

        if (!data.exists) {
          setError(t('oauth.error.userNotFound'));
          setIsLoading(false);
          navigate("/signin?error=user_not_found");
          return;
        }

        if (!data.complete) {
          setError(t('oauth.error.incompleteProfile'));
          setIsLoading(false);
          navigate("/signin?error=incomplete_profile");
          return;
        }

        if (data.token && data.user) {
          // El token y usuario ya fueron almacenados en exchangeToken
          navigate("/boards", { replace: true });
        } else {
          setError(t('oauth.error.exchangeFailed'));
          setIsLoading(false);
          navigate("/signin?error=exchange_failed");
        }
      } catch (err: any) {
        console.error("Error en OAuth callback:", err);
        setError(err.message || t('oauth.error.exchangeFailed'));
        setIsLoading(false);
        navigate("/signin?error=exchange_failed");
      }
    };

    handleOAuthCallback();
  }, [navigate, t]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212]">
        <Logo className="h-16 w-16 mb-4" />
        <p className="text-white">{t('oauth.processing')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212]">
        <Logo className="h-16 w-16 mb-4" />
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md" role="alert">
          <strong className="font-bold">{t('common.error')}: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <button
          onClick={() => navigate("/signin")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t('oauth.backToSignIn')}
        </button>
      </div>
    );
  }

  return null;
}

