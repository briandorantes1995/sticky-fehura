import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { decodeAppToken, type AppAuthPayload } from '../lib/appToken';
import { setAuthToken, setUserData } from '../lib/apiAuth';
import Logo from '../components/logo';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function AppLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAppLogin = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');
        const name = searchParams.get('name');
        const company = searchParams.get('company');

        if (!token) {
          setError('Token no proporcionado');
          setIsLoading(false);
          return;
        }

        // Decodificar el token para obtener el userId
        const tokenPayload = decodeAppToken(token);
        if (!tokenPayload) {
          setError('Token inválido o no se pudo decodificar');
          setIsLoading(false);
          return;
        }

        const userId = tokenPayload.sub;
        const userName = name || `Usuario ${tokenPayload.role || ''}`.trim();
        const companyName = company || tokenPayload.company_id || '';

        // Si hay una API backend configurada, usarla para hacer el exchange
        if (API_BASE_URL) {
          try {
            const response = await fetch(`${API_BASE_URL}/auth/exchange-token`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                accessToken: token,
              }),
            });

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.message || 'Error en el exchange del token');
            }

            const data = await response.json();
            
            if (!data.exists) {
              setError('Usuario no encontrado. Por favor, completa tu registro primero.');
              setIsLoading(false);
              return;
            }

            if (!data.complete) {
              setError('El usuario no está completo. Por favor, completa tu perfil primero.');
              setIsLoading(false);
              return;
            }

            if (data.user && data.user.id) {
              // El backend puede retornar token como string o como objeto { accessToken, refreshToken }
              const accessToken = typeof data.token === 'string' 
                ? data.token 
                : data.token?.accessToken || data.token;
              
              if (accessToken) {
                // Almacenar el token y los datos del usuario
                setAuthToken(accessToken);
                setUserData(data.user);

                // También actualizar Redux persist en el formato correcto
                // Redux persist guarda cada slice por separado, así que persist:auth contiene directamente el estado del slice auth
                // Esto es compatible con tu web principal
                try {
                  const persistData = {
                    accessToken,
                    refreshToken: data.token?.refreshToken || null,
                    user: data.user,
                    loading: false
                  };
                  
                  localStorage.setItem('persist:auth', JSON.stringify(persistData));
                } catch (e) {
                  console.warn('Error actualizando Redux persist:', e);
                }

                // Redirigir a boards
                navigate('/boards', { replace: true });
                return;
              }
            }
          } catch (apiError: any) {
            console.error('Error llamando al API:', apiError);
            setError(apiError.message || 'Error al comunicarse con el servidor');
            setIsLoading(false);
            return;
          }
        }

        // Si no hay backend configurado, no podemos hacer login
        if (!API_BASE_URL) {
          setError('Backend no configurado. Por favor, configura VITE_API_BASE_URL en las variables de entorno.');
          setIsLoading(false);
          return;
        }

        // Si llegamos aquí, algo salió mal
        setError('No se pudo completar el login. Por favor, verifica la configuración del backend.');
        setIsLoading(false);
      } catch (err: any) {
        console.error('Error en login automático:', err);
        setError(err.message || 'Error al procesar el login automático');
        setIsLoading(false);
      }
    };

    handleAppLogin();
  }, [location, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212]">
        <Logo className="h-16 w-16 mb-4" />
        <p className="text-white">Iniciando sesión...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212]">
        <Logo className="h-16 w-16 mb-4" />
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <button
          onClick={() => navigate('/signin')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Ir a Iniciar Sesión
        </button>
      </div>
    );
  }

  return null;
}

export default AppLogin;

