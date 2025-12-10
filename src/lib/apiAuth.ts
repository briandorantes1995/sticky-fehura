const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const TOKEN_KEY = 'app_auth_token';
const USER_KEY = 'app_user_data';
const REDUX_PERSIST_KEY = 'persist:auth';

export interface MemberRole {
  id: string;
  name: string;
  level?: number;
  description?: string;
  created_at?: string;
}

export interface MemberCompany {
  id: string;
  name: string;
  legal_name?: string | null;
  type?: string;
  plan_id?: string | null;
  owner_user_id?: string;
  created_at?: string;
  invitation_code?: string;
}

export interface ApiUser {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  company_id?: string;
  role?: string;
  profile_image_url?: string;
  phone?: string;
  roles?: MemberRole | MemberRole[];
  company?: MemberCompany;
}

export interface LoginResponse {
  token: {
    accessToken: string;
    refreshToken: string;
  };
  user: ApiUser;
}

/**
 * Almacena el token de autenticación
 */
export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Obtiene el token de autenticación desde Redux persist o localStorage
 * Redux persist guarda cada slice por separado, así que persist:auth contiene directamente el estado del slice auth
 */
export function getAuthToken(): string | null {
  // Primero intentar leer de Redux persist (compatible con tu web principal)
  try {
    const reduxPersist = localStorage.getItem(REDUX_PERSIST_KEY);
    if (reduxPersist) {
      const parsed = JSON.parse(reduxPersist);
      // Redux persist guarda el slice directamente: { user, accessToken, refreshToken, loading }
      // Leemos el accessToken tal cual Redux lo guarda (puede venir como string JSON escapado)
      if (parsed.accessToken) {
        // Si viene como string JSON escapado (formato de Redux persist), parsearlo
        // Si ya es un string normal, usarlo directamente
        if (typeof parsed.accessToken === 'string' && parsed.accessToken.startsWith('"') && parsed.accessToken.endsWith('"')) {
          return JSON.parse(parsed.accessToken);
        }
        return parsed.accessToken;
      }
    }
  } catch (e) {
    console.warn('Error leyendo Redux persist:', e);
  }

  // Fallback a localStorage normal
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Elimina el token de autenticación
 * IMPORTANTE: Solo limpia los datos de esta app, NO afecta otros datos de Redux persist
 * Redux persist guarda cada slice por separado, así que solo limpiamos persist:auth
 */
export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  // Limpiar Redux persist auth (cada slice se guarda por separado, así que esto solo afecta auth)
  try {
    // Limpiar el slice auth, pero Redux persist maneja otros slices (notifications, ui, etc.) por separado
    localStorage.removeItem(REDUX_PERSIST_KEY);
  } catch (e) {
    // Ignorar errores
  }
}

/**
 * Almacena los datos del usuario
 */
export function setUserData(user: ApiUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Obtiene los datos del usuario desde Redux persist o localStorage
 * Redux persist guarda cada slice por separado, así que persist:auth contiene directamente el estado del slice auth
 */
export function getUserData(): ApiUser | null {
  // Primero intentar leer de Redux persist (compatible con tu web principal)
  try {
    const reduxPersist = localStorage.getItem(REDUX_PERSIST_KEY);
    if (reduxPersist) {
      const parsed = JSON.parse(reduxPersist);
      // Redux persist guarda el slice directamente: { user, accessToken, refreshToken, loading }
      if (parsed.user) {
        // Si viene como string JSON escapado (formato de Redux persist), parsearlo
        // Si ya es un objeto, usarlo directamente
        let user = parsed.user;
        if (typeof user === 'string') {
          try {
            user = JSON.parse(user);
          } catch {
            // Si falla el parse, el user no es un JSON válido
            return null;
          }
        }
        // Normalizar roles si es necesario
        if (user.roles && !Array.isArray(user.roles)) {
          user.roles = [user.roles];
        }
        return user;
      }
    }
  } catch (e) {
    console.warn('Error leyendo Redux persist:', e);
  }

  // Fallback a localStorage normal
  const userData = localStorage.getItem(USER_KEY);
  if (!userData) return null;
  try {
    return JSON.parse(userData);
  } catch {
    return null;
  }
}

/**
 * Verifica si hay un token válido
 */
export function hasValidToken(): boolean {
  const token = getAuthToken();
  if (!token) return false;
  
  // Verificar si el token está expirado (decodificar y verificar exp)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      clearAuthToken();
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Login usando la API
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL no está configurado');
  }

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al iniciar sesión' }));
    throw new Error(error.message || 'Error al iniciar sesión');
  }

  const data = await response.json();
  
  if (!data.token || !data.user) {
    throw new Error('Respuesta inválida del servidor');
  }

  // La respuesta tiene token.accessToken y token.refreshToken
  const accessToken = data.token.accessToken || data.token;
  const refreshToken = data.token.refreshToken;

  // Almacenar token y usuario
  setAuthToken(accessToken);
  setUserData(data.user);

  // También actualizar Redux persist en el formato correcto
  // Redux persist guarda cada slice por separado, así que persist:auth contiene directamente el estado del slice auth
  // Guardamos en el mismo formato que Redux persist espera (compatible con tu web principal)
  try {
    const persistData = {
      accessToken,
      refreshToken: refreshToken || null,
      user: data.user,
      loading: false
    };
    
    localStorage.setItem(REDUX_PERSIST_KEY, JSON.stringify(persistData));
  } catch (e) {
    console.warn('Error actualizando Redux persist:', e);
  }

  return {
    token: accessToken,
    user: data.user,
  };
}

/**
 * Verifica el token con el servidor
 * Nota: Este endpoint puede no existir en todas las APIs, así que si falla, usa datos locales
 */
export async function verifyToken(): Promise<ApiUser | null> {
  const token = getAuthToken();
  if (!token) return null;

  // Verificar que el token no esté expirado localmente
  if (!hasValidToken()) {
    clearAuthToken();
    return null;
  }

  // Si no hay API configurada, usar datos locales
  if (!API_BASE_URL) {
    return getUserData();
  }

  // Intentar verificar con el servidor (si el endpoint existe)
  // Si no existe, simplemente usar datos locales
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // Si el endpoint no existe (404), usar datos locales
    if (response.status === 404) {
      return getUserData();
    }

    if (!response.ok) {
      // Si hay un error de autenticación (401, 403), limpiar token
      if (response.status === 401 || response.status === 403) {
        clearAuthToken();
        return null;
      }
      // Para otros errores, usar datos locales
      return getUserData();
    }

    const data = await response.json();
    if (data.user) {
      setUserData(data.user);
      return data.user;
    }

    return getUserData();
  } catch (error) {
    // Si falla la verificación (endpoint no existe, error de red, etc.), usar datos locales
    // El token ya fue validado cuando se hizo el login, así que es seguro usar datos locales
    return getUserData();
  }
}

/**
 * Logout
 */
export function logout(): void {
  clearAuthToken();
}

/**
 * Inicia el flujo de OAuth (Google, Azure)
 * Retorna la URL a la que debe redirigir el usuario
 */
export async function oauthLogin(provider: 'google' | 'azure', redirectTo?: string): Promise<string> {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL no está configurado');
  }

  // Construir la URL de callback
  const callbackUrl = redirectTo || `${window.location.origin}/oauth-callback`;

  const response = await fetch(`${API_BASE_URL}/auth/oauth-login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      provider,
      redirectTo: callbackUrl,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error al iniciar OAuth' }));
    throw new Error(error.message || 'Error al iniciar OAuth');
  }

  const data = await response.json();
  
  if (!data.url) {
    throw new Error('Respuesta inválida del servidor');
  }

  return data.url;
}

/**
 * Intercambia el token de Supabase por el token propio de la aplicación
 * Similar al exchangeTokenThunk de tu web
 */
export async function exchangeToken(accessToken: string): Promise<{
  token: { accessToken: string; refreshToken: string } | null;
  user: ApiUser | null;
  exists: boolean;
  complete: boolean;
  userId: string;
}> {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL no está configurado');
  }

  const response = await fetch(`${API_BASE_URL}/auth/exchange-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ accessToken }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error intercambiando token' }));
    throw new Error(error.message || 'Error intercambiando token');
  }

  const data = await response.json();

  // Si el usuario existe y está completo, almacenar el token y usuario
  if (data.exists && data.complete && data.token && data.user) {
    const accessToken = typeof data.token === 'string' 
      ? data.token 
      : data.token?.accessToken || data.token;
    const refreshToken = data.token?.refreshToken || null;

    // Almacenar token y usuario
    setAuthToken(accessToken);
    setUserData(data.user);

    // Actualizar Redux persist
    try {
      const persistData = {
        accessToken,
        refreshToken,
        user: data.user,
        loading: false
      };
      
      localStorage.setItem(REDUX_PERSIST_KEY, JSON.stringify(persistData));
    } catch (e) {
      console.warn('Error actualizando Redux persist:', e);
    }
  }

  return data;
}

