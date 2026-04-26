const { z } = require("zod");

const createCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1),
    postId: z.string().min(1),
    parentId: z.string().min(1).optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});

module.exports = { createCommentSchema };
