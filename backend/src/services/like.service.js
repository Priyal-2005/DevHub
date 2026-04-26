const prisma = require("../prisma/client");
const AppError = require("../utils/appError");

const toggleLike = async (userId, postId) => {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new AppError(404, "Post not found");

  const existing = await prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    return { liked: false };
  }

  await prisma.like.create({ data: { userId, postId } });
  return { liked: true };
};

module.exports = { toggleLike };
