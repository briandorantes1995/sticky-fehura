import { jwtVerify } from 'jose';

export interface AppAuthPayload {
  sub: string;
  company_id?: string;
  role?: string;
  branch_id?: string | null;
  is_driver?: boolean;
  driver_id?: string;
  has_active_assignment?: boolean;
  iat?: number;
  exp?: number;
}

/**
 * Valida y decodifica el token JWT de la app móvil
 */
export async function validateAppToken(token: string): Promise<AppAuthPayload | null> {
  try {
    const secret = import.meta.env.VITE_JWT_SECRET;
    if (!secret) {
      console.error('VITE_JWT_SECRET no está configurado');
      return null;
    }

    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);
    
    return payload as AppAuthPayload;
  } catch (error) {
    console.error('Error validando token:', error);
    return null;
  }
}

/**
 * Decodifica el token sin verificar (útil para debugging, no usar en producción sin verificación)
 */
export function decodeAppToken(token: string): AppAuthPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    const payload = JSON.parse(atob(parts[1]));
    return payload as AppAuthPayload;
  } catch (error) {
    console.error('Error decodificando token:', error);
    return null;
  }
}

