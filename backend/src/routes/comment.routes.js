const express = require("express");
const commentController = require("../controllers/comment.controller");
const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { createCommentSchema } = require("../validators/comment.validator");

const router = express.Router();

router.post("/", authMiddleware, validate(createCommentSchema), commentController.createComment);

module.exports = router;
