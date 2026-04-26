const express = require("express");
const authRoutes = require("./auth.routes");
const profileRoutes = require("./profile.routes");
const postRoutes = require("./post.routes");
const commentRoutes = require("./comment.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);

module.exports = router;
