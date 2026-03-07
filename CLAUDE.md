# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Twitter-like REST API backend built with NestJS. The project lives entirely in the `backend/` directory. All commands should be run from `backend/`.

## Commands

```bash
# Development
npm run start:dev      # Watch mode with hot reload
npm run start:debug    # Debug mode with watch

# Build & Production
npm run build          # Compile TypeScript to dist/
npm run start:prod     # Run compiled app

# Testing
npm test               # Run all tests
npm run test:watch     # Watch mode
npm run test:cov       # With coverage
npm run test -- --testPathPattern=<name>  # Single test file

# Linting
npm run lint           # ESLint with auto-fix

# Database migrations (TypeORM)
npm run typeorm        # Access typeorm-ts-node-commonjs CLI
```

## Environment Variables

Required in `backend/.env`:
```
DATABASE_URL=          # Postgres URL (takes precedence over individual vars)
# OR individual vars:
DATABASE_HOST=
DATABASE_PORT=
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_NAME=

JWT_SECRET=            # Required — app throws on startup if missing
JWT_EXPIRES_IN=        # Default: 7d

NODE_ENV=
PORT=                  # Default: 3000
FRONTEND_URL=          # Default: http://localhost:5173 (CORS origin)
```

## Architecture

### Module Structure

Each feature is a NestJS module under `backend/src/modules/`:
- **auth** — JWT authentication, registration, login, profile management, password change
- **user** — User CRUD (thin module; auth module directly owns User repository)
- **post** — Tweet-like posts with 280-char limit and likes
- **follow** — Follower/following relationships between users

### Data Model

All entities extend `BaseEntity` (`src/common/entities/base.entity.ts`) which provides UUID primary key, `createdAt`, `updatedAt`, and soft-delete `deletedAt`.

Key relationships:
- `Post` → `User` (ManyToOne, CASCADE delete)
- `Like` → `User` + `Post` (ManyToOne, CASCADE delete; unique constraint on `[userId, postId]`)
- `Follow` → `User` × 2 (`followerId`, `followingId`; unique constraint + indexes)

### Auth Pattern

- `JwtAuthGuard` is applied per-controller or per-route via `@UseGuards(JwtAuthGuard)`
- Routes marked `@Public()` skip JWT validation
- `@CurrentUser('id')` decorator extracts the authenticated user's field from the JWT payload
- `@Roles()` + `RolesGuard` for role-based access (`UserRole.USER` | `UserRole.ADMIN`)
- User `password` column has `select: false` — use `QueryBuilder` with `.addSelect('user.password')` when the password is needed

### Global Setup (main.ts)

- `ValidationPipe` with `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`
- Helmet for security headers
- CORS configured for `FRONTEND_URL`
- `ThrottlerGuard` applied globally (100 req / 60s)
- DB uses `synchronize: true` (schema auto-synced — no migration files needed in dev)

### API Routes Summary

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /auth/register | public | Register |
| POST | /auth/login | public | Login |
| GET | /auth/me | JWT | Current user |
| PATCH | /auth/me | JWT | Update profile |
| POST | /auth/change-password | JWT | Change password |
| GET | /posts | JWT | All posts |
| POST | /posts | JWT | Create post |
| GET | /posts/user/:userId | JWT | User's posts |
| DELETE | /posts/:id | JWT | Delete own post |
| POST | /posts/:id/like | JWT | Like post |
| DELETE | /posts/:id/like | JWT | Unlike post |
| POST | /users/:id/follow | JWT | Follow user |
| DELETE | /users/:id/follow | JWT | Unfollow user |
| GET | /users/:id/followers | JWT | Get followers |
| GET | /users/:id/following | JWT | Get following |

### Deployment

Deployed on Railway using the `Dockerfile` in `backend/`. Multi-stage build (Node 20 Alpine). Health check endpoint expected at `/health`.
