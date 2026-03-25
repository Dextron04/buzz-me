# STRUCTURE.md — BuzzMe Directory Layout & Organization

## Top-Level Monorepo

```
buzz-me/
├── .agent/                     # GSD workflow tools + skills
│   ├── get-shit-done/          # Core GSD workflows
│   └── skills/                 # Individual skill definitions
├── .git/
├── .gitignore
├── README.md                   # Comprehensive project docs
├── app.json                    # Expo app config (root)
├── eas.json                    # EAS build config (root)
├── package.json                # Monorepo root (npm workspaces)
├── mobile/                     # React Native / Expo app
├── server/                     # Node.js backend
├── shared/                     # Shared types (currently empty, .gitkeep)
└── docs/                       # Design assets, diagrams (currently empty, .gitkeep)
```

---

## Mobile App (`mobile/`)

```
mobile/
├── App.tsx                     # Root component: font loading + splash gate + navigator
├── index.ts                    # RN entry: registerRootComponent(App)
├── app.json                    # Expo app config (name, scheme, icons, splash)
├── eas.json                    # EAS channels (development, preview, production)
├── babel.config.js             # Babel: preset-expo
├── metro.config.js             # Metro bundler config
├── tsconfig.json               # TypeScript config
├── package.json                # Dependencies
├── package-lock.json
├── .gitignore
├── claude_instructions.md      # Design fix instructions (Claude context doc)
│
├── assets/
│   └── fonts/
│       └── GeistPixel-Square.ttf   # Custom pixel font — loaded in App.tsx
│
├── android/                    # Native Android build files (Gradle, manifests)
│
└── src/                        # All application source code
    ├── screens/
    │   ├── SplashScreen.tsx    # Animated pixel logo + ripple rings (3.5s, then onFinish)
    │   ├── LoginScreen.tsx     # Welcome + slide-up login/register panel
    │   └── BuzzScreen.tsx      # Main buzz interaction screen
    │
    ├── navigation/
    │   └── AppNavigator.tsx    # NavigationContainer + Stack.Navigator
    │
    ├── components/
    │   ├── Field.tsx           # Animated TextInput with focus border
    │   ├── LoginForm.tsx       # Email + Password fields + Sign In button
    │   └── RegisterForm.tsx    # Name + Email + Password + Confirm + Create Account
    │
    └── theme/
        └── index.ts            # Design tokens: Colors, Typography, Spacing, Radius
```

### Key File Relationships
- `App.tsx` imports: `SplashScreen`, `AppNavigator`, `Colors` from theme
- `AppNavigator.tsx` imports: `LoginScreen`, `BuzzScreen`
- `LoginScreen.tsx` imports: `LoginForm`, `RegisterForm`, `Field` (transitively), theme tokens
- `BuzzScreen.tsx` imports: `BlurView` (expo-blur), `Ionicons`, theme tokens
- All screens import from `../theme` for design tokens

---

## Server (`server/`)

```
server/
├── server.js           # Entry point: Express + HTTP server ONLY
│                       # Currently: /health endpoint, PORT binding
├── package.json        # buzzme-server dependencies
└── .env.example        # Environment variable template
```

### Planned Structure (Not Yet Created — From README)
```
server/src/
├── config/             # DB pool, Redis client init
├── routes/             # Express router definitions
├── controllers/        # Thin handler functions
├── services/           # buzz.js, pairing.js, auth.js
├── middleware/         # jwtAuth.js, errorHandler.js, rateLimiter.js
├── models/             # user.js, pair.js, buzz.js (pg query wrappers)
└── utils/              # pairingCode.js, wsHeartbeat.js
tests/
└── ...                 # Jest integration tests
```

---

## Shared & Docs (Placeholder)

```
shared/    # Empty (.gitkeep) — intended for shared TS types/constants/protocol defs
docs/      # Empty (.gitkeep) — intended for architecture diagrams, API specs
```

---

## Naming Conventions

### Files
- **Screens**: `PascalCase` ending in `Screen.tsx` — e.g., `BuzzScreen.tsx`
- **Components**: `PascalCase` ending in component name — e.g., `Field.tsx`, `LoginForm.tsx`
- **Navigation**: `PascalCase` ending in `Navigator.tsx`
- **Theme**: `index.ts` as barrel export in `theme/` folder
- **Server**: `camelCase.js` (planned); entry point `server.js`

### Exports
- Screens: `export default function XxxScreen()`
- Components: Named export `export function Field()`, `export function LoginForm()`
- Theme: Named exports `export const Colors`, `export const Typography`, etc.

### Styles
- All styles defined via `StyleSheet.create()` at module bottom
- Variable name convention: `s` (short) for local StyleSheet, `f` for field-specific, `hero` for hero components
- Theme tokens always imported from `../theme`, never hardcoded

### TypeScript
- Props interfaces declared inline above the component function
- Navigation type: `RootStackParamList` in `AppNavigator.tsx`
- Responsive utility: `getResponsiveValue(small, medium, large)` pattern repeated across 3 files (not yet extracted to shared util)
