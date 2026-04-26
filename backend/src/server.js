// =============================================
// DevHub - Server Entry Point
// =============================================

require("dotenv").config();

const app = require("./app");
const prisma = require("./prisma/client");

const PORT = process.env.PORT || 5000;

// ─── Graceful Startup ──────────────────────────

const startServer = async () => {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log("✅ Database connected successfully");

    // Start HTTP server
    const server = app.listen(PORT, () => {
      console.log(`\n🚀 DevHub API Server`);
      console.log(`   Environment : ${process.env.NODE_ENV || "development"}`);
      console.log(`   Port        : ${PORT}`);
      console.log(`   Health      : http://localhost:${PORT}/health`);
      console.log(`   API Base    : http://localhost:${PORT}/api\n`);
    });

    // ─── Graceful Shutdown ─────────────────────

    const shutdown = async (signal) => {
      console.log(`\n⚡ ${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        await prisma.$disconnect();
        console.log("📦 Database disconnected");
        console.log("👋 Server shut down\n");
        process.exit(0);
      });

      // Force shutdown after 10s
      setTimeout(() => {
        console.error("⚠️  Forced shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
};

// ─── Handle Unhandled Rejections ───────────────

process.on("unhandledRejection", (reason) => {
  console.error("🔥 Unhandled Rejection:", reason);
  // Don't crash — log and continue
});

process.on("uncaughtException", (error) => {
  console.error("🔥 Uncaught Exception:", error);
  process.exit(1);
});

// ─── Start ─────────────────────────────────────

startServer();
