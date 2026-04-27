const prisma = require("../prisma/client");
const AppError = require("../utils/appError");

const toggleLike = async (userId, postId) => {
  if (!postId) throw new AppError(400, "postId is required");

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new AppError(404, "Post not found");

  const existing = await prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    await prisma.notification.deleteMany({
      where: { likeId: existing.id, actorId: userId, recipientId: post.authorId },
    });
    return { liked: false };
  }

  const like = await prisma.like.create({ data: { userId, postId } });
  if (post.authorId !== userId) {
    await prisma.notification.create({
      data: {
        recipientId: post.authorId,
        actorId: userId,
        type: "like",
        message: "liked your post.",
        postId,
        likeId: like.id,
      },
    });
  }
  return { liked: true };
};

module.exports = { toggleLike };
