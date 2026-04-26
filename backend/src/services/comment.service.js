const prisma = require("../prisma/client");
const AppError = require("../utils/appError");

const createComment = async (userId, payload) => {
  const post = await prisma.post.findUnique({ where: { id: payload.postId } });
  if (!post) throw new AppError(404, "Post not found");

  if (payload.parentId) {
    const parent = await prisma.comment.findUnique({ where: { id: payload.parentId } });
    if (!parent) throw new AppError(404, "Parent comment not found");
  }

  return prisma.comment.create({
    data: { ...payload, userId },
  });
};

module.exports = { createComment };
