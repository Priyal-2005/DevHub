const { z } = require("zod");

const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    content: z.string().min(1),
  }),
  params: z.object({}),
  query: z.object({}),
});

const listPostSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
  }),
});

module.exports = { createPostSchema, listPostSchema };
