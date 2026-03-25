# ROADMAP.md — BuzzMe Frontend v1.0

## Milestone Goal

A complete, navigable frontend with all Stitch-designed screens implemented in React Native using the existing codebase patterns (`GeistPixel` font, `Animated` API, `StyleSheet.create`, theme tokens). No backend required — all data is mocked.

---

## Phase 1 — Core Screens & Navigation

**Goal**: Deliver the three primary screens (Home polish, History, Navigation wiring) + shared utility. This makes the app navigable end-to-end.

**Requirements**: REQ-001, REQ-004, REQ-005, REQ-006

### Plans

#### 01-01 — Shared Foundation
- Extract `getResponsiveValue` to `mobile/src/utils/responsive.ts` (REQ-006)
- Update all 4 existing files to import from new util
- Fix hardcoded `#161616` in `BuzzScreen` → `Colors.surface`
- Add `MOCK_USER` constant to replace `TEST_USER` in `BuzzScreen`
- Update `BuzzScreen` header + stats badge to match Stitch Home design (REQ-005)

#### 01-02 — History Screen
- Create `mobile/src/screens/HistoryScreen.tsx` (REQ-001)
- Animated entry, buzz list items (sent/received), week section header + stat
- Bottom pill nav present with correct active state
- Mock data: 10–15 sample buzz entries

#### 01-03 — Navigation Wiring
- Refactor `AppNavigator.tsx` to support tab-level navigation (REQ-004)
- Move bottom pill nav OUT of `BuzzScreen` into a shared `TabNavigator` wrapper
- Wire: Home → `BuzzScreen`, History → `HistoryScreen`
- Ensure `SplashScreen` → `LoginScreen` → `TabNavigator` flow works
- Update `RootStackParamList` types

---

## Phase 2 — Settings, Pairing & Login Polish

**Goal**: Complete the app with Settings, Pairing screens and refine the Login/Welcome screen to match the Stitch design.

**Requirements**: REQ-002, REQ-003, REQ-007

### Plans

#### 02-01 — Settings Screen
- Create `mobile/src/screens/SettingsScreen.tsx` (REQ-002)
- Partner section, vibration pattern selector, intensity slider, connection toggles
- Mock data: partner "Sarah", connected status, 70% intensity default
- Wire Settings tab in bottom nav

#### 02-02 — Pairing Screen
- Create `mobile/src/screens/PairingScreen.tsx` (REQ-003)
- "Your Code" large display (mock: `BUZZ-7X3K`), share button
- "Enter Partner's Code" input + Connect button
- Accessible from Settings → Partner section

#### 02-03 — Login & Welcome Polish
- Refine `LoginScreen.tsx` visual design (REQ-007)
- Ensure all text uses `GeistPixel`, copy matches Stitch welcome screen
- Tighten entrance animation timing

---

## Phase Status

| Phase | Status | Screens Delivered |
|---|---|---|
| Phase 1 — Core Screens & Nav | 🔲 Not started | History, Home (polished), Navigation |
| Phase 2 — Settings & Pairing | 🔲 Not started | Settings, Pairing, Login polish |

---

## Definition of Done (Milestone)

- [ ] All 5 main screens implemented and navigable
- [ ] `GeistPixel` font used on ALL text nodes
- [ ] No hardcoded colors — all theme tokens from `src/theme/index.ts`
- [ ] `getResponsiveValue` extracted to shared util
- [ ] `TEST_USER` replaced with `MOCK_USER`
- [ ] App runs without error on Android emulator (`expo run:android`)
- [ ] Screen-to-screen navigation works: Splash → Login → Home ↔ History ↔ Settings → Pairing
