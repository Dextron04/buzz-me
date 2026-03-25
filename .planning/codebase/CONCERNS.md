# CONCERNS.md — BuzzMe Technical Debt, Issues & Concerns

## Critical Concerns

### 1. Server is a Skeleton — Core Product Not Implemented
**Severity: Critical**

`server/server.js` only has:
- Express app setup
- One `/health` endpoint
- HTTP server binding

The entire product — WebSocket buzz delivery, auth, pairing, Redis presence — is **designed but not built**. The mobile app's `BuzzScreen.tsx` has a hardcoded `TEST_USER` and no actual WS connection.

```javascript
// server/server.js — only ~21 lines, nothing real
app.get('/health', (req, res) => { ... });
```

**Impact**: App cannot actually send a buzz between two users.

---

### 2. Hardcoded Test Data in Production UI
**Severity: High**

`mobile/src/screens/BuzzScreen.tsx`:
```typescript
const TEST_USER = {
    name: 'Alex',
    partner: 'Sam',
};
```
This is rendered in the real UI with no auth context. Shipping this would show "Alex" and "Sam" to all users.

---

### 3. No Authentication Flow Connected
**Severity: High**

`LoginScreen.tsx` has a fully-built UI with login/register forms, but:
- `onLogin` and `onRegister` callbacks just navigate to `BuzzScreen` immediately
- No API call to server
- No token storage
- No auth state management

```typescript
// AppNavigator.tsx — immediate nav, no real auth
onLogin={() => props.navigation.navigate('Home')}
onRegister={() => props.navigation.navigate('Home')}
```

---

## Significant Tech Debt

### 4. `getResponsiveValue` Duplicated in 4 Files
**Severity: Medium**

The same 5-line utility function is copy-pasted into:
- `mobile/src/screens/LoginScreen.tsx`
- `mobile/src/components/LoginForm.tsx`
- `mobile/src/components/RegisterForm.tsx`
- `mobile/src/components/Field.tsx`

Should be extracted to `mobile/src/utils/responsive.ts`. Any change to breakpoints requires 4 edits.

---

### 5. Typography System Uses Pixel Font for Everything
**Severity: Medium**

`mobile/src/theme/index.ts`:
```typescript
export const Typography = {
    pixel: 'GeistPixel',
    body: 'GeistPixel',      // ← pixel font for body!
    bodyMedium: 'GeistPixel',
    bodySemibold: 'GeistPixel',
    bodyBold: 'GeistPixel',
};
```
All typography variants map to the same pixel font. Forms, body text, and labels all render in pixel font — this may hurt readability for dense UI (login form, registration fields). The `claude_instructions.md` acknowledges this as an issue to fix (body should use Inter or similar).

---

### 6. Hardcoded Color Outside Theme
**Severity: Low-Medium**

`mobile/src/screens/BuzzScreen.tsx` line 282:
```typescript
backgroundColor: '#161616',  // should be Colors.surface
```
Breaks the single-source-of-truth theme design if the surface color is ever changed.

---

### 7. No ESLint or Prettier
**Severity: Medium**

No linting configured for either mobile or server. Risks:
- Inconsistent code style across files (visible: some files use tabs, some spaces)
- No enforcement of TypeScript strictness beyond compiler defaults
- No import order or unused variable enforcement

---

### 8. `shared/` and `docs/` are Empty
**Severity: Low (for now)**

Both `shared/` and `docs/` directories contain only `.gitkeep`. The README describes:
- `shared/` for shared types, WS protocol definitions
- `docs/` for architecture diagrams, API specs, Stitch design links

As the server grows, lack of shared types between server (JS) and mobile (TS) will become a source of protocol drift.

---

### 9. `reanimated` Installed but Not Used
**Severity: Low**

`react-native-reanimated` `^4.2.1` is a heavy dependency but all animations use React Native's built-in `Animated` API instead. Either:
- Migrate animations to Reanimated for better performance (recommended for complex gesture-driven animations)
- Remove the dependency to reduce bundle size

---

## Security Concerns

### 10. JWT Secrets in `.env` — No Production Secret Management
**Severity: High (Production)**

`JWT_SECRET` and `JWT_REFRESH_SECRET` are plain strings in `.env`. For production:
- No secrets manager (AWS Secrets Manager, Vault, etc.) configured
- No key rotation strategy
- If `.env` is leaked, all tokens are compromised

### 11. No Rate Limiting Implemented
**Severity: High (Production)**

Auth endpoints (register, login) have no rate limiting. The README mentions it as planned middleware but it's not yet built. Without it:
- Credential stuffing attacks possible
- Brute force on login endpoint
- Registration spam

### 12. WebSocket Auth Window
**Severity: Medium**

The README states: "Unauthenticated connections are closed after 10 seconds." This is a planned feature, not yet implemented. Until it is, any open WS connection could remain unauth'd indefinitely.

---

## Performance Concerns

### 13. Mobile: Animation Performance
**Severity: Low**

`SplashScreen.tsx` runs 20 individual `Animated.Value`s for pixel assembly + 4 rings simultaneously. `useNativeDriver: true` is correctly set, so this runs on the native thread. Should be fine on modern devices but may be slow on low-end Android.

### 14. No Connection Retry Logic in Mobile
**Severity: Medium (Future)**

Once the WS client is built in mobile, exponential backoff and reconnect logic will be needed. The README describes this for the Android architecture but it's not yet implemented.

---

## Design / UX Concerns

### 15. Design Inconsistency (Active Issue)
**Severity: Low (but tracked in `claude_instructions.md`)**

The `mobile/claude_instructions.md` documents known design fixes needed:
- Logo pixel 'B' has a clunky square border (should be borderless pixel blocks)
- Rings should be closer to the logo
- Body text should use a clean sans-serif, not pixel font
- Login card looks generic

This is an active concern being addressed.

---

## Infrastructure Concerns

### 16. No Migration System
**Severity: Medium**

No database migration tooling is set up (no Knex, Prisma, `db-migrate`, etc.). The README mentions `npm run migrate` but that script doesn't exist in `server/package.json`. Schema is defined only in the README as SQL snippets.

### 17. No Docker / Container Setup
**Severity: Low (Dev) / Medium (Deployment)**

No `Dockerfile` or `docker-compose.yml`. Local dev requires manual PostgreSQL + Redis setup. The README mentions Docker for production but it doesn't exist yet.

### 18. No CI Pipeline
**Severity: Medium**

No GitHub Actions, CircleCI, or similar configured. No automated test runs, no build verification on PRs.
