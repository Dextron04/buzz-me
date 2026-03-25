# INTEGRATIONS.md — BuzzMe External Integrations

## Backend Integrations

### PostgreSQL (Primary Database)
- **Client**: `pg` (node-postgres) ^8.11.5
- **Config**: `DATABASE_URL` env var (`postgresql://user:pass@host:5432/buzzme`)
- **Schema** (documented in README, migrations needed):
  - `users` — UUID PK, username, email, password_hash, pairing_code
  - `pairs` — user_a_id + user_b_id (unique constraint)
  - `buzzes` — sender_id, receiver_id, pattern, delivered, sent_at
- **Status**: Schema designed, DB layer not yet implemented in code (`server/server.js` is a skeleton)

### Redis (Presence / Session Layer)
- **Client**: `redis` ^4.6.13
- **Config**: `REDIS_URL` env var (`redis://localhost:6379`)
- **Intended use**:
  - Track which users are currently WebSocket-connected (presence)
  - Session state for WS reconnection
- **Status**: Dependency listed; not yet wired in `server.js`

### WebSocket (`ws` library)
- **Library**: `ws` ^8.17.0
- **Pattern**: `http.createServer(app)` → WS server upgrade on same port
- **Protocol**: JSON messages with `type` field
  - Client→Server: `AUTH`, `BUZZ`, `PING`
  - Server→Client: `AUTH_OK`, `BUZZ`, `PRESENCE`, `PONG`
- **Auth flow**: First WS message must be `AUTH` with JWT; unauthenticated connections closed after 10s
- **Heartbeat**: Configured via `WS_HEARTBEAT_INTERVAL_MS` / `WS_HEARTBEAT_TIMEOUT_MS` env vars
- **Status**: Not yet implemented; `server.js` only has HTTP server skeleton

---

## Authentication
- **Library**: `jsonwebtoken` ^9.0.2
- **Strategy**: JWT with short-lived access tokens + refresh tokens
  - Access: 15 min (`JWT_ACCESS_EXPIRY`)
  - Refresh: 7 days (`JWT_REFRESH_EXPIRY`)
- **Secrets**: `JWT_SECRET` + `JWT_REFRESH_SECRET` from env
- **Password hashing**: `bcrypt` cost factor 12

---

## REST API Endpoints (Planned — Not Yet Implemented)
```
POST   /auth/register
POST   /auth/login
POST   /auth/refresh

GET    /users/me
PUT    /users/me

POST   /pairs/connect          # Pair via pairing code (format: BUZZ-XXXX)
DELETE /pairs/disconnect
GET    /pairs/status

GET    /buzzes/history
POST   /buzzes/send            # REST fallback if WS fails
```
- Currently only `/health` exists in `server/server.js`

---

## Mobile API Integrations

### Expo APIs
- **`expo-haptics`**: Used for haptic feedback on splash screen pixel assembly and buzz transmission. Called directly from RN code — no server call.
- **`expo-font`**: Loads `GeistPixel-Square.ttf` on app boot, blocks rendering until ready.
- **`expo-blur`**: Used in `BuzzScreen` floating pill navigation (`BlurView`).
- **`expo-linear-gradient`**: Imported but usage not yet visible in current screens.
- **`expo-splash-screen`**: Native splash screen control (separate from custom `SplashScreen.tsx`).
- **`expo-system-ui`**: System-level UI theming.

### Third-Party SDKs (Mobile)
- **`@expo/vector-icons`** (Ionicons): Icons in bottom nav (home, time, settings)
- **`react-native-gesture-handler`**: Pan gesture for drag-to-close login panel
- **`react-native-reanimated`**: High-perf animation worklets (v4.x)

---

## EAS (Expo Application Services)
- `eas.json` at both root and `mobile/`:
  - Build profiles (development, preview, production)
  - Likely configured for OTA updates + cloud builds
- Required for: Android `.apk`/`.aab` builds, iOS `.ipa`, OTA updates

---

## Production Infrastructure (Planned)
- **Reverse proxy**: nginx (for HTTPS/WSS termination)
- **Process manager**: PM2 (mentioned in README)
- **TLS**: Let's Encrypt via nginx
- **Status**: Not yet deployed; development-only infrastructure exists
