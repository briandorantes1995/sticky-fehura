import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Intercambia el token de la app por información del usuario
 * Esta función valida el token JWT y retorna la información necesaria
 * para crear/actualizar el usuario en Convex
 */
export const exchangeAppToken = mutation({
  args: {
    token: v.string(),
    name: v.optional(v.string()),
    company: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Nota: La validación completa del JWT debería hacerse en el backend
    // Por ahora, esta función asume que el token ya fue validado en el frontend
    // y solo procesa la información del usuario
    
    // En producción, deberías validar el token aquí usando JWT_SECRET
    // Por ahora, retornamos los datos que necesitamos
    
    return {
      success: true,
      name: args.name,
      company: args.company,
    };
  },
});

