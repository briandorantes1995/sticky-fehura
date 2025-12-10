import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthenticatedUserFromMutation, getAuthenticatedUserFromQuery } from "./authHelpers";
import { Id } from "./_generated/dataModel";
import type { JWTPayload } from "./jwtAuth";

export const createOrUpdateUser = mutation({
  args: {
    token: v.string(), // Token JWT para validación manual
    tokenIdentifier: v.string(), // userId del token
    name: v.string(),
    email: v.optional(v.string()),
    profileImageUrl: v.optional(v.string()),
    companyId: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<Id<"users">> => {
    // Validar el token manualmente decodificándolo
    // Las mutations no pueden usar runAction, así que validamos directamente
    try {
      const parts = args.token.split(".");
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

      // Verificar que el tokenIdentifier coincida con el sub del token
      if (payload.sub !== args.tokenIdentifier) {
        throw new Error("Token identifier mismatch");
      }

      // Usar companyId del token si está disponible y no se pasó explícitamente
      const finalCompanyId = args.companyId || payload.company_id;

      const user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
        .unique();

      if (user !== null) {
        await ctx.db.patch(user._id, { 
          name: args.name,
          profileImageUrl: args.profileImageUrl,
          companyId: finalCompanyId,
        });
        return user._id;
      }

      const userId: Id<"users"> = await ctx.db.insert("users", {
        name: args.name,
        email: args.email,
        tokenIdentifier: args.tokenIdentifier,
        profileImageUrl: args.profileImageUrl,
        companyId: finalCompanyId,
      });

      return userId;
    } catch (error) {
      console.error("Error validating token in createOrUpdateUser:", error);
      throw new Error("Invalid or expired token");
    }
  },
});

export const getCurrentUser = query({
  args: {
    token: v.string(), // Token JWT para validación manual
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUserFromQuery(ctx, args.token);
    return user;
  }
})

