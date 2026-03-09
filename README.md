# BuzzMe 📳

> *Feel the buzz. Stay connected.*

BuzzMe is a private, always-on mobile application that lets two people — typically a couple — silently buzz each other's phones at any time. No notification, no popup, no sound. Just a physical vibration. A quiet signal that says *"I'm thinking of you"*.

---

## ✨ What It Does

- **Send a Buzz** — Tap a button in the app to trigger a silent vibration on your partner's phone.
- **Vibration Only** — No push notification is shown. No banner, no badge. Just the buzz itself, keeping it intimate and unobtrusive.
- **Always Connected** — The app maintains a persistent WebSocket connection in the background, so buzzes are delivered in real-time even when the screen is off.
- **Buzz History** — A private log of all buzzes sent and received between you and your partner.
- **Custom Vibration Patterns** — Choose from patterns like Short Pulse, Long Buzz, Heartbeat, SOS, or define your own.

---

## 🏗️ Architecture Overview

BuzzMe is a **monorepo** containing two primary workstreams:

```
buzz-me/
├── server/          # Node.js backend (WebSocket + REST API)
├── android/         # Android native app (Kotlin / Jetpack Compose)
├── shared/          # Shared types, constants, protocol definitions
└── docs/            # Architecture diagrams, API specs, design assets
```

---

## 🔌 Backend — `server/`

The backend is built with **Node.js** and is the heart of the real-time connection system.

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Runtime | Node.js (v20+) |
| Framework | Express.js |
| Real-time | WebSocket (`ws` library) |
| Auth | JWT (JSON Web Tokens) |
| Database | PostgreSQL (user accounts, pairing, history) |
| Cache / Presence | Redis (session state, online status) |
| Process Management | PM2 (production) |

### Key Responsibilities

#### 1. WebSocket Server (Persistent Connection)
The core of BuzzMe. When the Android app launches, it opens a WebSocket connection to the server and **keeps it alive** indefinitely.

- Uses a heartbeat/ping-pong mechanism to detect stale connections
- On reconnect, the server re-associates the new socket with the user's session
- Redis tracks which user sessions are currently connected (presence layer)
- When a buzz is sent, the server looks up the partner's active WebSocket and forwards the buzz payload immediately

#### 2. REST API
Standard HTTP endpoints for non-real-time operations:

```
POST   /auth/register          # Create account
POST   /auth/login             # Login, returns JWT
POST   /auth/refresh           # Refresh access token

GET    /users/me               # Get current user profile
PUT    /users/me               # Update profile

POST   /pairs/connect          # Pair with a partner via pairing code
DELETE /pairs/disconnect       # Disconnect from partner
GET    /pairs/status           # Get current pairing status

GET    /buzzes/history         # Get paginated buzz history
POST   /buzzes/send            # (Fallback) Send buzz via REST if WS fails
```

#### 3. Pairing System
Each user gets a unique **pairing code** (e.g., `BUZZ-7X3K`). To pair, one user shares their code with the other, who enters it in the app. Once paired, both users' WebSocket sessions are linked server-side.

### Directory Structure — `server/`
```
server/
├── src/
│   ├── config/         # Environment config, DB/Redis connection setup
│   ├── routes/         # Express route definitions
│   ├── controllers/    # Request handlers (thin layer)
│   ├── services/       # Business logic (buzz delivery, pairing, auth)
│   ├── middleware/     # JWT auth, error handling, rate limiting
│   ├── models/         # PostgreSQL table models / query helpers
│   └── utils/          # Helpers: pairing code gen, WS heartbeat, etc.
├── tests/              # Integration and unit tests
├── .env.example        # Environment variable template
├── package.json
└── server.js           # Entry point
```

---

## 📱 Android App — `android/`

Built natively in **Kotlin** with **Jetpack Compose** for the UI.

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Language | Kotlin |
| UI | Jetpack Compose |
| WebSocket | OkHttp WebSocket |
| Background Service | Android Foreground Service |
| Local Storage | Room (SQLite) |
| Dependency Injection | Hilt |
| Networking | Retrofit (REST) + OkHttp (WS) |

### Key Design Decisions

#### Persistent WebSocket via Foreground Service
The WebSocket connection runs inside an Android **Foreground Service** with a persistent notification (minimal, low-priority). This is the only way to guarantee the connection stays alive when the app is backgrounded or the screen locks.

- On reconnect failure, exponential backoff is applied (1s → 2s → 4s → max 30s)
- The Foreground Service is started on boot via a `BroadcastReceiver`

#### Silent Vibration (No Notification)
When a buzz payload arrives over the WebSocket:
1. The `VibrationManager` is called directly — no `NotificationManager` involved
2. Uses `VibrationEffect` API (Android 8+) for pattern-based vibration
3. Works even in DND / Silent mode (respects user's vibration toggle in settings)

#### Battery & Doze Mode
- Uses `WAKE_LOCK` permission to temporarily wake the CPU on buzz receipt
- Requests battery optimization exemption for the app to maintain WS uptime

---

## 🗄️ Database Schema

### Users
```sql
CREATE TABLE users (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username     VARCHAR(50) UNIQUE NOT NULL,
  email        VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  pairing_code  VARCHAR(10) UNIQUE NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### Pairs
```sql
CREATE TABLE pairs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_id    UUID REFERENCES users(id),
  user_b_id    UUID REFERENCES users(id),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_a_id, user_b_id)
);
```

### Buzzes
```sql
CREATE TABLE buzzes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id    UUID REFERENCES users(id),
  receiver_id  UUID REFERENCES users(id),
  pattern      VARCHAR(20) DEFAULT 'short',
  delivered    BOOLEAN DEFAULT FALSE,
  sent_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 📡 WebSocket Protocol

All WebSocket messages are JSON-encoded with a `type` field.

### Client → Server
```json
// Authenticate after connect
{ "type": "AUTH", "token": "<JWT>" }

// Send a buzz
{ "type": "BUZZ", "pattern": "heartbeat" }

// Keepalive
{ "type": "PING" }
```

### Server → Client
```json
// Auth success
{ "type": "AUTH_OK", "userId": "...", "partner": { "name": "Sarah", "online": true } }

// Incoming buzz from partner
{ "type": "BUZZ", "from": "Sarah", "pattern": "heartbeat", "sentAt": "..." }

// Partner came online / went offline
{ "type": "PRESENCE", "online": true }

// Keepalive response
{ "type": "PONG" }
```

---

## 🔐 Security Notes

- All passwords hashed with **bcrypt** (cost factor 12)
- JWTs have short expiry (15 min access, 7 day refresh)
- WebSocket connections are authenticated on the first message (AUTH frame)
- Unauthenticated connections are closed after 10 seconds
- Pairing codes are single-use — after pairing, the code is regenerated
- HTTPS/WSS enforced in production (TLS via nginx reverse proxy)

---

## 🚀 Getting Started

### Prerequisites
- Node.js v20+
- PostgreSQL 15+
- Redis 7+
- Android Studio (Hedgehog or newer)

### Server Setup
```bash
cd server
cp .env.example .env
# Fill in DB_URL, REDIS_URL, JWT_SECRET in .env
npm install
npm run migrate     # Run DB migrations
npm run dev         # Start dev server (nodemon)
```

### Environment Variables
```env
PORT=3001
DATABASE_URL=postgresql://user:pass@localhost:5432/buzzme
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
NODE_ENV=development
```

---

## 🗺️ Roadmap

- [x] Project scaffolding and architecture design
- [ ] Server: Auth (register/login/JWT)
- [ ] Server: WebSocket server with auth + presence
- [ ] Server: Pairing system
- [ ] Server: Buzz delivery via WebSocket
- [ ] Server: Buzz history API
- [ ] Android: Project setup (Kotlin + Compose)
- [ ] Android: Foreground Service for persistent WS connection
- [ ] Android: Buzz sending + vibration trigger
- [ ] Android: Pairing UI + flow
- [ ] Android: History screen
- [ ] Android: Settings (vibration patterns, connection management)
- [ ] Deployment: Docker + nginx + WSS setup

---

## 📁 Docs

See the [`docs/`](./docs) folder for:
- Architecture diagrams
- API reference
- UI/UX design assets (Stitch project link)

---

## 👤 Author

Built by Tushin — a personal project to stay connected with the people who matter.
