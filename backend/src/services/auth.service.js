// =============================================
// Auth Service - Business Logic Layer
// =============================================

const bcrypt = require("bcryptjs");
const prisma = require("../prisma/client");
const { ApiError, generateToken } = require("../utils");

const SALT_ROUNDS = 12;

class AuthService {
  // ─── Register ────────────────────────────────

  /**
   * Register a new user with email + password
   * @param {Object} data - { name, email, password }
   * @returns {Object} { user, token }
   */
  async register({ name, email, password }) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw ApiError.conflict("A user with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        provider: "LOCAL",
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        provider: true,
        createdAt: true,
      },
    });

    // Generate JWT
    const token = generateToken({ id: user.id, email: user.email });

    return { user, token };
  }

  // ─── Login ───────────────────────────────────

  /**
   * Authenticate user with email + password
   * @param {Object} data - { email, password }
   * @returns {Object} { user, token }
   */
  async login({ email, password }) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    // Check if user registered via OAuth (no password)
    if (!user.password) {
      throw ApiError.unauthorized(
        "This account uses Google sign-in. Please log in with Google."
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    // Generate JWT
    const token = generateToken({ id: user.id, email: user.email });

    // Strip password from response
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  // ─── Get Current User ───────────────────────

  /**
   * Get the currently authenticated user's profile
   * @param {string} userId
   * @returns {Object} User profile
   */
  async getMe(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        provider: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    return user;
  }

  // ─── Google OAuth ────────────────────────────

  /**
   * Find or create user from Google OAuth profile
   * @param {Object} profile - Google profile data
   * @returns {Object} { user, token }
   */
  async findOrCreateGoogleUser(profile) {
    const { id: googleId, emails, displayName, photos } = profile;
    const email = emails[0].value;
    const avatar = photos?.[0]?.value || null;

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // If user exists but registered locally, update provider info
      if (user.provider === "LOCAL") {
        user = await prisma.user.update({
          where: { email },
          data: {
            provider: "GOOGLE",
            avatar: user.avatar || avatar,
          },
        });
      }
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          name: displayName,
          email,
          avatar,
          provider: "GOOGLE",
        },
      });
    }

    // Generate JWT
    const token = generateToken({ id: user.id, email: user.email });

    // Strip password
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }
}

module.exports = new AuthService();
