import { useEffect, useState } from 'react';
import { getAuthToken, getUserData, verifyToken, hasValidToken, type ApiUser } from '../lib/apiAuth';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function useApiAuth() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<ApiUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = getAuthToken();
      const storedUser = getUserData();

      if (storedToken && hasValidToken()) {
        setToken(storedToken);
        
        // Verificar token con el servidor
        const verifiedUser = await verifyToken();
        if (verifiedUser) {
          setUser(verifiedUser);
        } else if (storedUser) {
          // Usar datos locales si la verificación falla
          setUser(storedUser);
        }
      }

      setIsLoaded(true);
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (!isLoaded || !user || !token) return;

    // Crear o actualizar usuario en Convex
    const userName = user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.first_name || user.last_name || user.email?.split('@')[0] || 'Usuario';

    createOrUpdateUser({
      token, // Pasar el token para validación manual
      tokenIdentifier: user.id,
      name: userName,
      email: user.email,
      profileImageUrl: user.profile_image_url,
      companyId: user.company_id,
    }).catch((error) => {
      console.error('Error creating/updating user:', error);
    });
  }, [isLoaded, user, token, createOrUpdateUser]);

  return {
    isLoaded,
    isAuthenticated: !!token && !!user && hasValidToken(),
    user,
    token,
  };
}

