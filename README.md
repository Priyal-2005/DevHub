# DevHub — Developer Portfolio & Blogging Platform

Production-grade backend API built with Node.js, Express, Prisma, and MySQL.

## Tech Stack

| Layer          | Technology                      |
| -------------- | ------------------------------- |
| Runtime        | Node.js 22+                     |
| Framework      | Express 5                       |
| Database       | MySQL                           |
| ORM            | Prisma 7                        |
| Auth           | JWT + Google OAuth (Passport)   |
| Validation     | Zod                             |
| Security       | Helmet, CORS, bcrypt            |

## Getting Started

### Prerequisites

- Node.js ≥ 22
- MySQL running locally (or a remote instance)
- Google OAuth credentials (for social login)

### Installation

```bash
# Clone and install
git clone <repo-url>
cd DevHub
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MySQL credentials, JWT secret, and Google OAuth keys

# Generate Prisma client
npm run prisma:generate

# Push schema to database (creates tables)
npm run prisma:push

# Start dev server
npm run dev
```

### Environment Variables

| Variable               | Description                          |
| ---------------------- | ------------------------------------ |
| `PORT`                 | Server port (default: 5000)          |
| `NODE_ENV`             | `development` or `production`        |
| `DATABASE_URL`         | MySQL connection string              |
| `JWT_SECRET`           | Secret key for signing JWTs          |
| `JWT_EXPIRES_IN`       | Token expiry (default: `7d`)         |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID               |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret           |
| `GOOGLE_CALLBACK_URL`  | OAuth callback URL                   |
| `CLIENT_URL`           | Frontend URL for CORS/redirects      |

## API Endpoints

### Auth

| Method | Endpoint                    | Description              | Auth     |
| ------ | --------------------------- | ------------------------ | -------- |
| POST   | `/api/auth/register`        | Register with email      | Public   |
| POST   | `/api/auth/login`           | Login with email         | Public   |
| GET    | `/api/auth/me`              | Get current user profile | Required |
| GET    | `/api/auth/google`          | Initiate Google OAuth    | Public   |
| GET    | `/api/auth/google/callback` | Google OAuth callback    | Public   |

### Health

| Method | Endpoint  | Description       |
| ------ | --------- | ----------------- |
| GET    | `/health` | API health check  |

## Project Structure

```
src/
├── config/          # Passport & app configuration
│   └── passport.js
├── controllers/     # Request/response handlers
│   └── auth.controller.js
├── middleware/       # Express middleware
│   ├── authenticate.js
│   ├── errorHandler.js
│   ├── validate.js
│   └── index.js
├── prisma/          # Database client
│   └── client.js
├── routes/          # Route definitions
│   ├── auth.routes.js
│   └── index.js
├── services/        # Business logic
│   └── auth.service.js
├── utils/           # Shared utilities
│   ├── ApiError.js
│   ├── ApiResponse.js
│   ├── asyncHandler.js
│   ├── jwt.js
│   └── index.js
├── validators/      # Zod schemas
│   └── auth.validator.js
├── app.js           # Express app setup
└── server.js        # Entry point
```

## Scripts

```bash
npm run dev            # Start with nodemon (hot-reload)
npm start              # Start production server
npm run prisma:generate # Generate Prisma client
npm run prisma:migrate  # Run database migrations
npm run prisma:push     # Push schema to DB (no migration)
npm run prisma:studio   # Open Prisma Studio GUI
```

## License

ISC
