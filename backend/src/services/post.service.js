const prisma = require("../prisma/client");
const AppError = require("../utils/appError");

const postInclude = {
  author: { select: { id: true, name: true, email: true, avatar: true } },
  comments: {
    orderBy: { createdAt: "asc" },
    include: { user: { select: { id: true, name: true, avatar: true } } },
  },
  likes: true,
  _count: { select: { comments: true, likes: true } },
};

const toFeedPost = (post, viewerId) => ({
  id: post.id,
  title: post.title,
  content: post.content,
  createdAt: post.createdAt,
  author: post.author,
  comments: post.comments.map((comment) => ({
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    user: comment.user,
  })),
  commentsCount: post._count.comments,
  likesCount: post._count.likes,
  isLiked: viewerId ? post.likes.some((like) => like.userId === viewerId) : false,
});

const createPost = async (authorId, payload) => {
  const post = await prisma.post.create({
    data: { ...payload, authorId },
    include: postInclude,
  });

  const followers = await prisma.follow.findMany({
    where: { followingId: authorId },
    select: { followerId: true },
  });

  if (followers.length) {
    await prisma.notification.createMany({
      data: followers.map((item) => ({
        recipientId: item.followerId,
        actorId: authorId,
        type: "post",
        message: "created a new post.",
        postId: post.id,
      })),
    });
  }

  return toFeedPost(post, authorId);
};

const getFeed = async (userId, page, limit) => {
  const skip = (page - 1) * limit;
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });

  const authorIds = [userId, ...following.map((item) => item.followingId)];

  const [items, total] = await Promise.all([
    prisma.post.findMany({
      where: { authorId: { in: authorIds } },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: postInclude,
    }),
    prisma.post.count({
      where: { authorId: { in: authorIds } },
    }),
  ]);

  return { items: items.map((item) => toFeedPost(item, userId)), page, limit, total };
};

const getPosts = async (page, limit) => {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.post.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: postInclude,
    }),
    prisma.post.count(),
  ]);

  return { items: items.map((item) => toFeedPost(item)), page, limit, total };
};

const getPostById = async (id) => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: postInclude,
  });

  if (!post) throw new AppError(404, "Post not found");
  return toFeedPost(post);
};

module.exports = { createPost, getFeed, getPosts, getPostById };
