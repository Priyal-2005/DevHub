const prisma = require("../prisma/client");
const AppError = require("../utils/appError");

const createComment = async (userId, payload) => {
  const post = await prisma.post.findUnique({ where: { id: payload.postId } });
  if (!post) throw new AppError(404, "Post not found");

  if (payload.parentId) {
    const parent = await prisma.comment.findUnique({ where: { id: payload.parentId } });
    if (!parent) throw new AppError(404, "Parent comment not found");
  }

  const comment = await prisma.comment.create({
    data: { ...payload, userId },
    include: { user: { select: { id: true, name: true, avatar: true } } },
  });

  if (post.authorId !== userId) {
    await prisma.notification.create({
      data: {
        recipientId: post.authorId,
        actorId: userId,
        type: "comment",
        message: "commented on your post.",
        postId: post.id,
        commentId: comment.id,
      },
    });
  }

  return comment;
};

module.exports = { createComment };
