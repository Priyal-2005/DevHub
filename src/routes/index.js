// =============================================
// Routes - Barrel Export
// =============================================

const { Router } = require("express");
const authRoutes = require("./auth.routes");

const router = Router();

// Mount route modules
router.use("/auth", authRoutes);

module.exports = router;
