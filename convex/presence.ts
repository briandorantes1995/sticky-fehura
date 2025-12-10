import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthenticatedUserFromMutation, getAuthenticatedUserFromQuery } from "./authHelpers";

export const updatePresence = mutation({
  args: { 
    token: v.string(),
    boardId: v.id("boards"),
    cursorPosition: v.object({
      x: v.number(),
      y: v.number()
    }),
    isHeartbeat: v.boolean()
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUserFromMutation(ctx, args.token);

    const now = Date.now();
    const existingPresence = await ctx.db
      .query("presence")
      .withIndex("by_user_and_board", (q) => 
        q.eq("userId", user._id).eq("boardId", args.boardId)
      )
      .first();

    if (existingPresence) {
      await ctx.db.patch(existingPresence._id, {
        lastUpdated: now,
        cursorPosition: args.isHeartbeat ? existingPresence.cursorPosition : args.cursorPosition
      });
    } else {
      await ctx.db.insert("presence", {
        userId: user._id,
        boardId: args.boardId,
        lastUpdated: now,
        cursorPosition: args.cursorPosition
      });
    }
  },
});

export const getActiveUsers = query({
  args: { 
    token: v.string(),
    boardId: v.id("boards") 
  },
  handler: async (ctx, args) => {
    // Obtener el usuario actual para filtrar por compañía
    const currentUser = await getAuthenticatedUserFromQuery(ctx, args.token);

    // Solo mostrar usuarios de la misma compañía
    const currentCompanyId = currentUser.companyId;
    if (!currentCompanyId) {
      // Si el usuario no tiene companyId, no mostrar colaboradores
      return [];
    }

    const thirtySecondsAgo = Date.now() - 30000;
    const activePresence = await ctx.db
      .query("presence")
      .withIndex("by_board_and_lastUpdated", (q) => 
        q.eq("boardId", args.boardId)
         .gte("lastUpdated", thirtySecondsAgo)
      )
      .collect();

    const userIds = [...new Set(activePresence.map((p) => p.userId))];
    const users = await Promise.all(
      userIds.map(async (userId) => {
        const user = await ctx.db.get(userId);
        const presence = activePresence.find(p => p.userId === userId);
        // Filtrar solo usuarios de la misma compañía
        if (user && presence && user.companyId === currentCompanyId) {
          return {
            _id: user._id,
            name: user.name,
            profileImageUrl: user.profileImageUrl,
            cursorPosition: presence.cursorPosition
          };
        }
        return null;
      })
    );

    return users.filter((user): user is NonNullable<typeof user> => user !== null);
  },
});

export const removePresence = mutation({
  args: { 
    token: v.string(),
    boardId: v.id("boards") 
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUserFromMutation(ctx, args.token);

    const presence = await ctx.db
      .query("presence")
      .withIndex("by_user_and_board", (q) => 
        q.eq("userId", user._id).eq("boardId", args.boardId)
      )
      .first();

    if (presence) {
      await ctx.db.delete(presence._id);
    }
  },
});