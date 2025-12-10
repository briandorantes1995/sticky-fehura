import { internal } from "./_generated/api";
import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
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
    // Validar el token manualmente
    // Nota: MutationCtx puede llamar a acciones internas aunque TypeScript no lo refleje
    const payload: JWTPayload | null = await (ctx as any).runAction(internal.jwtAuth.validateJWT, {
      token: args.token,
    });

    if (!payload) {
      throw new Error("Invalid or expired token");
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

