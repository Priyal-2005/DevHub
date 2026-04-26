const profileService = require("../services/profile.service");

const upsertProfile = async (req, res, next) => {
  try {
    const profile = await profileService.upsertProfile(req.user.id, req.validated.body);
    res.status(201).json(profile);
  } catch (error) {
    next(error);
  }
};

const getProfileByUserId = async (req, res, next) => {
  try {
    const profile = await profileService.getProfileByUserId(req.params.userId);
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

module.exports = { upsertProfile, getProfileByUserId };
