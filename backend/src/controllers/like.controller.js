const likeService = require("../services/like.service");

const toggleLike = async (req, res, next) => {
  try {
    const result = await likeService.toggleLike(req.user.id, req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { toggleLike };
