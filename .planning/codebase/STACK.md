# STACK.md — BuzzMe Technology Stack

## Overview

BuzzMe is a **monorepo** with two distinct workstreams:
- `mobile/` — React Native / Expo mobile app (iOS + Android)
- `server/` — Node.js backend (REST + WebSocket)

---

## Mobile App (`mobile/`)

### Runtime & Language
- **Language**: TypeScript (strict mode implied by tsconfig)
- **Framework**: React Native `0.83.2` via **Expo SDK `~55.0.5`**
- **React**: `19.2.0`
- **Entry point**: `mobile/index.ts` → `mobile/App.tsx`
- **Bundler**: Metro (configured via `mobile/metro.config.js`)
- **Transpiler**: Babel with `babel-preset-expo` (`mobile/babel.config.js`)

### Key Dependencies
| Package | Version | Purpose |
|---|---|---|
| `expo` | ~55.0.5 | Core SDK, managed workflow |
| `react-native` | 0.83.2 | Base RN framework |
| `@react-navigation/native` | ^7.1.33 | Navigation container |
| `@react-navigation/native-stack` | ^7.14.4 | Native stack navigator |
| `react-native-gesture-handler` | ~2.30.0 | Gesture system (drag-to-close panels) |
| `react-native-reanimated` | ^4.2.1 | High-perf animations (Reanimated 4) |
| `react-native-screens` | ~4.23.0 | Native navigation screens |
| `react-native-safe-area-context` | ~5.6.2 | Safe area insets |
| `expo-blur` | ~55.0.9 | Blur views (pill nav) |
| `expo-font` | ~55.0.4 | Font loading (`GeistPixel`) |
| `expo-haptics` | ~55.0.8 | Haptic feedback on buzz/splash |
| `expo-linear-gradient` | ~55.0.8 | Gradient fills |
| `expo-splash-screen` | ~55.0.10 | Native splash screen |
| `expo-status-bar` | ~55.0.4 | Status bar control |
| `expo-system-ui` | ~55.0.9 | System UI color |
| `@expo/vector-icons` | ^15.0.2 | Ionicons icon set |
| `react-native-worklets` | 0.7.2 | Worklets runtime (Reanimated dep) |

### Dev Dependencies
- `typescript` ~5.9.2
- `@types/react` ~19.2.2

### TypeScript Config (`mobile/tsconfig.json`)
- Extends Expo's default TS config

### Custom Assets
- **Font**: `mobile/assets/fonts/GeistPixel-Square.ttf` — pixel font used across all text
- Loaded in `App.tsx` via `useFonts` before any screen renders

---

## Backend Server (`server/`)

### Runtime & Language
- **Runtime**: Node.js (v20+ recommended)
- **Language**: JavaScript (CommonJS, no TypeScript)
- **Entry point**: `server/server.js`
- **Package name**: `buzzme-server`

### Key Dependencies
| Package | Version | Purpose |
|---|---|---|
| `express` | ^4.18.3 | HTTP REST API framework |
| `ws` | ^8.17.0 | WebSocket server |
| `pg` | ^8.11.5 | PostgreSQL client |
| `redis` | ^4.6.13 | Redis client (presence/session) |
| `jsonwebtoken` | ^9.0.2 | JWT access + refresh tokens |
| `bcrypt` | ^5.1.1 | Password hashing (cost 12) |
| `dotenv` | ^16.4.5 | `.env` file loading |
| `cors` | ^2.8.5 | CORS middleware |
| `uuid` | ^9.0.1 | UUID generation (pairing codes, IDs) |

### Dev Dependencies
- `nodemon` ^3.1.0 — auto-restart in dev (`npm run dev`)
- `jest` ^29.7.0 — unit/integration testing
- `supertest` ^7.0.0 — HTTP integration test helper

---

## Monorepo Root (`/`)

- **Root `package.json`**: npm workspaces containing `server` (mobile is NOT a workspace member — it manages its own `node_modules`)
- **Scripts**:
  - `npm run dev:server` — runs `nodemon server.js` in server workspace
  - `npm run test:server` — runs `jest --runInBand` in server workspace

---

## Build & Distribution (Mobile)

- **EAS (Expo Application Services)**: `mobile/eas.json` + root `eas.json` define build profiles
- **Android**: Native build in `mobile/android/`
- **iOS**: Currently not mentioned in docs; Expo supports via EAS
- **Dev server**: `expo start` (Metro bundler)

---

## Environment Configuration

All server config via `.env` file (see `server/.env.example`):
```
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/buzzme
REDIS_URL=redis://localhost:6379
JWT_SECRET=<long-random>
JWT_REFRESH_SECRET=<long-random>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
NODE_ENV=development
WS_HEARTBEAT_INTERVAL_MS=30000
WS_HEARTBEAT_TIMEOUT_MS=10000
PAIR_CODE_LENGTH=8
```
