# TESTING.md — BuzzMe Test Structure & Practices

## Current Testing State

**Mobile**: No test files found. No test framework configured in `mobile/package.json`.

**Server**: Jest + Supertest configured but no test files written yet.

---

## Server Testing Setup

### Framework
- **Test runner**: Jest `^29.7.0`
- **HTTP testing**: Supertest `^7.0.0`
- **Run command**: `npm run test` → `jest --runInBand` (sequential, not parallel)
- **Config**: No `jest.config.js` found; Jest will use defaults (looks for `*.test.js`, `__tests__/`)
- **`--runInBand`**: Tests run serially in current process — important for DB state isolation

### Planned Test Structure (From README)
```
server/
└── tests/              # Integration and unit tests (directory exists per README, not yet created)
```

### Test Strategy (Intended)
Based on package choices (`supertest`), the intended approach is:
- **Integration tests** for REST endpoints using `supertest` against the Express `app`
- `module.exports = { app, server }` in `server.js` is the testability hook — `supertest(app)` works without starting a real server

```javascript
// Example supertest pattern (not yet written)
const { app } = require('../server');
const request = require('supertest');

describe('GET /health', () => {
    it('returns ok', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
    });
});
```

---

## Mobile Testing Setup

### Current State
- No test runner configured
- No `jest`, `@testing-library/react-native`, or Detox in `mobile/package.json`
- Expo SDK 55 supports Jest via `jest-expo` preset — not yet added

### Recommended Setup (Not Yet Done)
```json
// Would need to add to mobile/package.json
"devDependencies": {
  "jest": "^29",
  "jest-expo": "~55",
  "@testing-library/react-native": "^12"
}
```

---

## Testing Gaps

| Area | Status | Gap |
|---|---|---|
| Server REST endpoints | ❌ No tests | All routes untested |
| Server WebSocket protocol | ❌ No tests | WS handler untested |
| Server auth (JWT, bcrypt) | ❌ No tests | Auth service untested |
| Server pairing logic | ❌ No tests | Pairing service untested |
| Mobile components | ❌ No tests | No framework installed |
| Mobile navigation | ❌ No tests | No navigation testing |
| Mobile animation behavior | ❌ No tests | Not practical to unit test |
| E2E / Integration | ❌ No tests | No Detox or Maestro configured |

---

## CI / CD

- No CI configuration found (no `.github/workflows/`, no `Jenkinsfile`, no CircleCI config)
- EAS provides cloud builds for mobile but no automated test gate

---

## Verification Approach (Current)

Testing is currently **manual + dev server**:
- Mobile: `expo start` → check on device/emulator
- Server: `npm run dev` → manual curl/Postman to `/health`
- `claude_instructions.md` in `mobile/` includes a manual verification step: run `npx expo start --android` and visually verify screens match reference design

---

## Priority Testing Investment

When building out tests, implement in this order:
1. **Server `/health`** — trivial baseline (should already pass)
2. **Server auth routes** — highest risk, security-critical
3. **Server WS message handler** — core of the product
4. **Server pairing flow** — user-facing critical path
5. **Mobile: `Field` component** — reusable, pure UI, easy to test
6. **E2E buzz flow** — end-to-end from button tap to WS message
