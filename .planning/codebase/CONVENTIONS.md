# CONVENTIONS.md — BuzzMe Code Style & Patterns

## Language & Tooling

- **Mobile**: TypeScript (strict-ish, via `tsconfig.json` extending Expo defaults)
- **Server**: JavaScript ES2020 (CommonJS `require()`, no TypeScript)
- **Formatter/Linter**: None configured (no `.eslintrc`, `.prettierrc` found)
- **Editor config**: Not present

---

## React Native / Mobile Conventions

### Component Style
- All screens are **default exports**, functional components only (no class components)
- All reusable components are **named exports**
- Props interfaces defined inline directly above the function:

```typescript
// Good pattern used throughout codebase
export function Field({
    label, value, onChange, placeholder, secure, keyboardType,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    secure?: boolean;
    keyboardType?: 'email-address' | 'default';
}) { ... }
```

### State Management
- **Local state only** — `useState` for component-level state
- **No global state manager** (no Redux, Zustand, Context API in use)
- State flows down via props; callbacks passed up
- `useRef` for animation values (never `useState` for `Animated.Value`)

```typescript
// Standard animation pattern throughout all screens
const logoScale = useRef(new Animated.Value(0.8)).current;
const logoOpacity = useRef(new Animated.Value(1)).current;
```

### Animation Patterns
- **Animated API** (React Native core) used throughout — not `reanimated` (despite it being installed)
- `useNativeDriver: true` always set for transform/opacity animations
- `useNativeDriver: false` only for interpolated color animations (e.g., border color in `Field.tsx`)
- Haptics triggered inline with animations (not separated):

```typescript
// Pattern: haptic + animation together
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
Animated.timing(anim, { ... }).start();
```

### Responsive Sizing
A `getResponsiveValue(small, medium, large)` helper is **duplicated** in 4 files:
- `mobile/src/screens/LoginScreen.tsx`
- `mobile/src/components/LoginForm.tsx`
- `mobile/src/components/RegisterForm.tsx`
- `mobile/src/components/Field.tsx`

```typescript
// Repeated pattern — candidate for extraction to shared util
const getResponsiveValue = (small: number, medium: number, large: number) => {
    if (SCREEN_H < 700) return small;
    if (SCREEN_H < 850) return medium;
    return large;
};
```

### Styling Conventions
- All styles in `StyleSheet.create({})` at the **bottom** of the file
- StyleSheet variable naming:
  - `s` — primary screen/component styles
  - `f` — field-specific styles (`Field.tsx`)
  - `hero` — hero section styles (`LoginScreen.tsx`)
- No inline styles except for dynamic/animated values
- Design tokens **always** from theme, never hardcoded hex values (with minor exceptions: `'#161616'` in `BuzzScreen`)

```typescript
// Correct usage
backgroundColor: Colors.background

// Violation found in BuzzScreen.tsx line 282
backgroundColor: '#161616'  // should use Colors.surface
```

### Import Order (Informal)
1. React
2. React Native core packages
3. Expo packages
4. Third-party packages
5. Local components / screens
6. Theme imports

### File-Level Pattern
```typescript
// 1. Imports
import React, { useState, useRef } from 'react';
...

// 2. Constants at module level
const NUM_RINGS = 4;
const LOGIN_PANEL_HEIGHT = ...;

// 3. Helper functions / sub-components
function PhoneRippleHero(...) { ... }

// 4. Main component (default export)
export default function LoginScreen(...) { ... }

// 5. StyleSheet at bottom
const s = StyleSheet.create({ ... });
```

---

## Server Conventions

### Module Pattern
- CommonJS (`require` / `module.exports`)
- Entry point exports both `app` and `server` for testability:

```javascript
// server/server.js
module.exports = { app, server };
```

- Environment loaded via `dotenv` at top of `server.js`

### Error Handling
- Currently only the `/health` endpoint exists; no error handling middleware in place yet
- Planned: centralized error handler middleware in `src/middleware/`

### Naming (Planned from README structure)
- Files: `camelCase.js` (routes, controllers, services, models)
- HTTP handlers: thin controllers calling service functions
- DB queries: wrapped in model files

---

## Git Conventions

- No `.commitlintrc` or commit message convention enforced
- Standard `.gitignore` patterns (node_modules, .env, build artifacts, .expo cache)
- Monorepo: both `mobile/` and `server/` changes in same commits

---

## Key Anti-Patterns / Debt

1. **`getResponsiveValue` duplication** — should be extracted to `mobile/src/utils/responsive.ts`
2. **Hardcoded color** in `BuzzScreen.tsx` line 282
3. **No ESLint/Prettier** — code style is inconsistent (tabs vs spaces, trailing commas)
4. **`Typography` all maps to `GeistPixel`** — body text uses pixel font everywhere, which may not be ideal for readability in forms
5. **`BuzzScreen` uses hardcoded test user** (`TEST_USER = { name: 'Alex', partner: 'Sam' }`) — needs to be replaced with real auth context
