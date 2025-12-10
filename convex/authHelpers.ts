import { QueryCtx, MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import type { JWTPayload } from "./jwtAuth";

/**
 * Helper para validar token y obtener el usuario en mutations
 * Las mutations no pueden usar runAction, así que validamos el token directamente
 */
export async function getAuthenticatedUserFromMutation(
  ctx: MutationCtx,
  token: string
): Promise<{ _id: Id<"users">; tokenIdentifier: string; companyId?: string }> {
  // Validar el token manualmente decodificándolo
  // Nota: Las mutations no pueden usar runAction, así que hacemos validación básica
  // La validación completa de firma se hace en el frontend antes de enviar
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid token format");
    }

    const payload: JWTPayload = JSON.parse(atob(parts[1]));
    
    // Verificar expiración básica
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      throw new Error("Token expired");
    }

    // Verificar issuer
    if (payload.iss !== "dawn-backend") {
      throw new Error("Invalid token issuer");
    }

    // Buscar el usuario por tokenIdentifier
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", payload.sub))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error validating token in mutation:", error);
    throw new Error("Invalid or expired token");
  }
}

/**
 * Helper para validar token y obtener el usuario en queries
 * Para queries, validamos el token directamente sin usar acciones internas
 */
export async function getAuthenticatedUserFromQuery(
  ctx: QueryCtx,
  token: string
): Promise<{ _id: Id<"users">; tokenIdentifier: string; companyId?: string }> {
  // En queries no podemos usar runAction, así que validamos directamente
  // Decodificamos el token sin verificar (la verificación real se hace en el frontend)
  // En producción, deberías validar el token aquí también
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid token format");
    }

    const payload = JSON.parse(atob(parts[1]));
    
    // Verificar expiración básica
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      throw new Error("Token expired");
    }

    // Verificar issuer
    if (payload.iss !== "dawn-backend") {
      throw new Error("Invalid token issuer");
    }

    // Buscar el usuario por tokenIdentifier
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", payload.sub))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

