const express = require("express");
const profileController = require("../controllers/profile.controller");
const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { profileSchema } = require("../validators/profile.validator");

const router = express.Router();

router.post("/", authMiddleware, validate(profileSchema), profileController.upsertProfile);
router.get("/:userId", profileController.getProfileByUserId);

module.exports = router;
