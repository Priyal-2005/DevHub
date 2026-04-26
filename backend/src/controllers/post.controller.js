const postService = require("../services/post.service");

const createPost = async (req, res, next) => {
  try {
    const post = await postService.createPost(req.user.id, req.validated.body);
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

const getPosts = async (req, res, next) => {
  try {
    const { page, limit } = req.validated.query;
    const data = await postService.getPosts(page, limit);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const post = await postService.getPostById(req.params.id);
    res.json(post);
  } catch (error) {
    next(error);
  }
};

module.exports = { createPost, getPosts, getPostById };
