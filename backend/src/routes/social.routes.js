const express = require("express");
const postController = require("../controllers/post.controller");
const likeController = require("../controllers/like.controller");
const commentController = require("../controllers/comment.controller");
const followController = require("../controllers/follow.controller");
const notificationController = require("../controllers/notification.controller");
const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { listQuerySchema, likeSchema, followSchema } = require("../validators/social.validator");
const { createCommentSchema } = require("../validators/comment.validator");

const router = express.Router();

router.get("/feed", authMiddleware, validate(listQuerySchema), postController.getFeed);
router.post("/like", authMiddleware, validate(likeSchema), likeController.toggleLike);
router.post("/comment", authMiddleware, validate(createCommentSchema), commentController.createComment);
router.post("/follow", authMiddleware, validate(followSchema), followController.toggleFollow);
router.get("/notifications", authMiddleware, notificationController.getNotifications);

module.exports = router;
