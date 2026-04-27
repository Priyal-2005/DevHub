const followService = require("../services/follow.service");

const toggleFollow = async (req, res, next) => {
  try {
    const followingId = req.validated?.body?.followingId || req.params.userId;
    const data = await followService.toggleFollow(req.user.id, followingId);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getFollowers = async (req, res, next) => {
  try {
    const data = await followService.getFollowers(req.params.userId);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getFollowing = async (req, res, next) => {
  try {
    const data = await followService.getFollowing(req.params.userId);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = { toggleFollow, getFollowers, getFollowing };
