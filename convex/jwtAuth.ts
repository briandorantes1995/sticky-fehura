"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { jwtVerify } from "jose";

export interface JWTPayload {
  sub: string;
  company_id?: string;
  role?: string;
  branch_id?: string | null;
  is_driver?: boolean;
  driver_id?: string;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}

/**
 * Acción interna que valida un token JWT
 * Retorna el payload decodificado si el token es válido, null si no lo es
 */
export const validateJWT = internalAction({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args): Promise<JWTPayload | null> => {
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        console.error("JWT_SECRET no está configurado en Convex");
        return null;
      }

      // Verificar que el issuer sea "dawn-backend"
      const issuer = "dawn-backend";
      const audience = "dawn-api";

      const secretKey = new TextEncoder().encode(secret);
      const { payload } = await jwtVerify(args.token, secretKey, {
        issuer,
        audience,
      });

      return payload as JWTPayload;
    } catch (error) {
      console.error("Error validando JWT:", error);
      return null;
    }
  },
});

/**
 * Extrae el userId del token sin validar (útil para debugging)
 * NO usar para autenticación, solo para obtener información
 */
export function extractUserIdFromToken(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    return payload.sub || null;
  } catch {
    return null;
  }
}

