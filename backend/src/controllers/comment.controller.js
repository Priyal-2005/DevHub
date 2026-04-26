const commentService = require("../services/comment.service");

const createComment = async (req, res, next) => {
  try {
    const comment = await commentService.createComment(req.user.id, req.validated.body);
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

module.exports = { createComment };
