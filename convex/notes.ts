import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { getAuthenticatedUserFromMutation, getAuthenticatedUserFromQuery } from "./authHelpers";

export const createNote = mutation({
  args: {
    token: v.string(),
    boardId: v.id("boards"),
    content: v.string(),
    color: v.string(),
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
    size: v.object({
      width: v.number(),
      height: v.number(),
    }),
    zIndex: v.number(),
  },
  handler: async (ctx, args) => {
    // Verificar que el usuario tenga acceso al board
    const user = await getAuthenticatedUserFromMutation(ctx, args.token);
    const board = await ctx.db.get(args.boardId);
    if (!board) throw new Error("Board not found");
    if (board.ownerId !== user._id && (!board.isShared || board.inTrash)) {
      throw new Error("Access denied");
    }
    // Extraer solo los campos de la nota, excluyendo token
    const { token, ...noteData } = args;
    const noteId = await ctx.db.insert("notes", noteData);
    await ctx.runMutation(internal.boards.updateNotesCount, { boardId: args.boardId, increment: 1 });
    await ctx.db.patch(args.boardId, { lastModified: Date.now() });
    return noteId;
  },
});

export const updateNote = mutation({
  args: {
    token: v.string(),
    noteId: v.id("notes"),
    content: v.optional(v.string()),
    color: v.optional(v.string()),
    position: v.optional(v.object({
      x: v.number(),
      y: v.number(),
    })),
    size: v.optional(v.object({
      width: v.number(),
      height: v.number(),
    })),
    zIndex: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { noteId, token, ...updates } = args;
    // Verificar que el usuario tenga acceso al board
    const user = await getAuthenticatedUserFromMutation(ctx, token);
    const note = await ctx.db.get(noteId);
    if (!note) throw new Error("Note not found");
    const board = await ctx.db.get(note.boardId);
    if (!board) throw new Error("Board not found");
    if (board.ownerId !== user._id && (!board.isShared || board.inTrash)) {
      throw new Error("Access denied");
    }

    await ctx.db.patch(noteId, updates);
    
    await ctx.db.patch(note.boardId, { lastModified: Date.now() });
  },
});

export const deleteNote = mutation({
  args: { 
    token: v.string(),
    noteId: v.id("notes") 
  },
  handler: async (ctx, args) => {
    // Verificar que el usuario tenga acceso al board
    const user = await getAuthenticatedUserFromMutation(ctx, args.token);
    const note = await ctx.db.get(args.noteId);
    if (!note) throw new Error("Note not found");
    const board = await ctx.db.get(note.boardId);
    if (!board) throw new Error("Board not found");
    if (board.ownerId !== user._id && (!board.isShared || board.inTrash)) {
      throw new Error("Access denied");
    }
    
    await ctx.db.delete(args.noteId);
    await ctx.runMutation(internal.boards.updateNotesCount, { boardId: note.boardId, increment: -1 });
    await ctx.db.patch(note.boardId, { lastModified: Date.now() });
  },
});

export const getNotes = query({
  args: { 
    token: v.string(),
    boardId: v.id("boards") 
  },
  handler: async (ctx, args) => {
    // Verificar que el usuario tenga acceso al board
    const user = await getAuthenticatedUserFromQuery(ctx, args.token);
    const board = await ctx.db.get(args.boardId);
    if (!board) throw new Error("Board not found");
    if (board.ownerId !== user._id && (!board.isShared || board.inTrash)) {
      throw new Error("Access denied");
    }
    
    return await ctx.db
      .query("notes")
      .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
      .collect();
  },
});