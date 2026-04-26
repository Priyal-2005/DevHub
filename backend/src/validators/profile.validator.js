const { z } = require("zod");

const profileSchema = z.object({
  body: z.object({
    bio: z.string().max(500).optional(),
    skills: z.array(z.string()).optional(),
    githubUrl: z.string().url().optional(),
    portfolioUrl: z.string().url().optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});

module.exports = { profileSchema };
