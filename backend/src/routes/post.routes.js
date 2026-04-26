const express = require("express");
const postController = require("../controllers/post.controller");
const likeController = require("../controllers/like.controller");
const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { createPostSchema, listPostSchema } = require("../validators/post.validator");

const router = express.Router();

router.post("/", authMiddleware, validate(createPostSchema), postController.createPost);
router.get("/", validate(listPostSchema), postController.getPosts);
router.get("/:id", postController.getPostById);
router.post("/:id/like", authMiddleware, likeController.toggleLike);

module.exports = router;
