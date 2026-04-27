const express = require("express");
const followController = require("../controllers/follow.controller");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:userId/follow", authMiddleware, followController.toggleFollow);
router.get("/:userId/followers", authMiddleware, followController.getFollowers);
router.get("/:userId/following", authMiddleware, followController.getFollowing);

module.exports = router;
