# ARCHITECTURE.md — BuzzMe System Architecture

## System Overview

BuzzMe is a **real-time intimate communication app** for couples. The architecture centers around a persistent WebSocket connection that allows silent buzz delivery with sub-second latency.

```
┌─────────────────────────────────────────────────────────────┐
│                       Mobile App                            │
│  React Native (Expo)                                        │
│  ┌──────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │  Splash  │→ │  LoginScreen │→ │    BuzzScreen       │    │
│  │  Screen  │  │  (Auth+Reg)  │  │  (Main Interaction) │    │
│  └──────────┘  └──────────────┘  └────────────────────┘    │
│                    ↓                         ↓               │
│              REST /auth/*             WebSocket (ws://)      │
└────────────────────────────────────────────────────────────┘
                     ↓                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  BuzzMe Server (Node.js)                     │
│  Express (REST) + ws (WebSocket) — same HTTP server         │
│  ┌────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │ Auth Routes│  │ Pair Service │  │  WS Handler        │  │
│  │ /auth/*    │  │ BUZZ-XXXX    │  │  AUTH→BUZZ→PONG    │  │
│  └────────────┘  └──────────────┘  └────────────────────┘  │
│         ↓                ↓                    ↓              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Data Layer                              │    │
│  │   PostgreSQL (persistent)  │  Redis (ephemeral)     │    │
│  │   users, pairs, buzzes     │  presence, sessions    │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## Mobile App Architecture

### Pattern: Feature-First Flat Structure
The mobile app uses a simple, flat feature structure — no Redux, no complex state management. State is local to screens with prop-drilling for shared values.

### Layers

#### 1. Entry Point & Boot Sequence
- `mobile/index.ts` → registers `App` component
- `mobile/App.tsx` — font loading gate → splash → navigation
- Custom `SplashScreen` renders first, then fires `onFinish` to trigger navigation mount
- Navigation is not rendered until fonts are loaded (prevents FOUT)

#### 2. Navigation (`mobile/src/navigation/`)
- **Library**: `@react-navigation/native-stack`
- **Pattern**: Single flat stack (no tabs at nav level; tabs are a custom UI component in `BuzzScreen`)
- **Screens in stack**:
  - `Login` → `LoginScreen` (handles both welcome, login, register states internally)
  - `Home` → `BuzzScreen`
- Navigation transitions: `fade_from_bottom`
- No header (all screens have `headerShown: false`)

#### 3. Screens (`mobile/src/screens/`)
Three screens, each self-contained:

| Screen | Responsibility |
|---|---|
| `SplashScreen.tsx` | Animated pixel 'B' logo assembly + ripple rings; fires `onFinish` after 3.5s |
| `LoginScreen.tsx` | Welcome page + slide-up form panel (login/register). Manages 3 modes: `welcome`, `login`, `register` |
| `BuzzScreen.tsx` | Main interaction: BUZZ button with ripple animation + haptics; floating pill nav |

#### 4. Components (`mobile/src/components/`)
Reusable UI primitives:
- `Field.tsx` — Animated text input with focus border highlight (accent color on focus)
- `LoginForm.tsx` — Composes two `Field`s + submit button
- `RegisterForm.tsx` — Composes four `Field`s + submit button

Components accept all state from parent (`LoginScreen`) via props — no internal state for values.

#### 5. Theme (`mobile/src/theme/index.ts`)
Single source of design tokens:
- `Colors` — palette (background, accent `#E1FF01`, text, status)
- `Typography` — font families (all map to `GeistPixel`)
- `Spacing` — 4px base unit scale (xs=4 → xxl=48)
- `Radius` — corner radius scale (sm=8 → full=999)

---

## Server Architecture (Current State: Skeleton)

### Pattern: MVC-like Layered Architecture (Planned)
The README describes a fully planned layered structure; the current `server/server.js` is only the entry point skeleton:

```
server/
├── server.js           ← Entry: Express + HTTP server (currently only /health)
└── src/                ← NOT YET IMPLEMENTED
    ├── config/         ← DB/Redis connection setup
    ├── routes/         ← Express routes
    ├── controllers/    ← Thin request handlers
    ├── services/       ← Business logic (buzz, pairing, auth)
    ├── middleware/     ← JWT auth, error handling, rate limiting
    ├── models/         ← PostgreSQL query helpers
    └── utils/          ← Pairing code gen, WS heartbeat
```

### Key Architectural Patterns (Designed, Not Coded)

#### Real-Time Buzz Delivery
1. Both users maintain persistent WebSocket connections
2. Redis maps `userId → wsConnectionId` for presence
3. On `BUZZ` message: server looks up partner's ws, forwards payload directly
4. If partner offline: store in `buzzes` table with `delivered=false`; deliver on reconnect

#### Pairing System
- Each user has a `pairing_code` (e.g., `BUZZ-7X3K`)
- Codes are single-use; regenerated after pairing
- `pairs` table stores the bidirectional relationship

#### JWT Auth Flow
```
Register → bcrypt hash → insert user → return JWT pair
Login → verify password → return JWT pair
WS connect → send AUTH frame with access JWT → server verifies → associates socket
Access token expires (15min) → client sends refresh token → server returns new pair
```

---

## Data Flow: Sending a Buzz

```
User taps BUZZ button (BuzzScreen.tsx)
  → triggerBuzz() called
  → Haptics.notificationAsync() — local haptic immediately
  → button scale animation + ripple animations
  → [TODO] WS.send({ type: "BUZZ", pattern: "short" })
      → Server receives BUZZ message
      → Looks up partner's active ws connection (Redis)
      → Forwards { type: "BUZZ", from: "...", pattern: "...", sentAt: "..." }
      → Partner's app receives BUZZ
      → [Android] VibrationManager triggers silent vibration
      → Server logs buzz in `buzzes` table (delivered=true)
```

---

## Current Implementation Gap

The mobile UI is **substantially built** (3 screens, theme system, navigation). The server is a **skeleton** — only a health endpoint exists. The core WS + buzz delivery system, auth, and pairing are all designed but not coded.
