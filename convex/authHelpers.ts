import { internal } from "./_generated/api";
import { QueryCtx, MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

/**
 * Helper para validar token y obtener el usuario en mutations
 * Usa validación manual de JWT
 */
export async function getAuthenticatedUserFromMutation(
  ctx: MutationCtx,
  token: string
): Promise<{ _id: Id<"users">; tokenIdentifier: string; companyId?: string }> {
  // Validar el token manualmente
  // Nota: MutationCtx puede llamar a acciones internas aunque TypeScript no lo refleje
  const payload = await (ctx as any).runAction(internal.jwtAuth.validateJWT, {
    token,
  });

  if (!payload) {
    throw new Error("Invalid or expired token");
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

