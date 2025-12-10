import { mutation } from './_generated/server'
import { v } from 'convex/values'
import { getAuthenticatedUserFromMutation } from './authHelpers'

export const supportRequest = mutation({
  args: { 
    token: v.string(),
    input: v.string() 
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUserFromMutation(ctx, args.token);
    await ctx.db.insert('supportRequest', {
      userId: user._id,
      input: args.input,
    })
  },
})