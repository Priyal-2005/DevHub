const prisma = require("../prisma/client");
const AppError = require("../utils/appError");

const createPost = async (authorId, payload) => {
  return prisma.post.create({
    data: { ...payload, authorId },
    include: { author: { select: { id: true, name: true, email: true, avatar: true } } },
  });
};

const getPosts = async (page, limit) => {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.post.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { author: { select: { id: true, name: true, email: true, avatar: true } } },
    }),
    prisma.post.count(),
  ]);

  return { items, page, limit, total };
};

const getPostById = async (id) => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: { select: { id: true, name: true, email: true, avatar: true } } },
  });

  if (!post) throw new AppError(404, "Post not found");
  return post;
};

module.exports = { createPost, getPosts, getPostById };
