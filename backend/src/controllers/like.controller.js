const likeService = require("../services/like.service");

const toggleLike = async (req, res, next) => {
  try {
    const postId = req.params.id || req.validated?.body?.postId || req.body?.postId;
    const result = await likeService.toggleLike(req.user.id, postId);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { toggleLike };
