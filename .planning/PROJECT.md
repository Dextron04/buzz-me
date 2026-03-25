# BuzzMe — Frontend Implementation

## What This Is

BuzzMe is a private mobile app for couples to silently buzz each other. This project milestone is focused exclusively on **implementing the complete React Native frontend** to faithfully match the Stitch design system — covering all 6 main screens (Welcome, Home/Buzz, History, Settings, Pairing, and a Login screen).

The backend is intentionally out of scope. All network calls will use mock data and stub functions. The goal is a pixel-faithful, fully navigable, animation-rich frontend codebase.

## Core Value

A stunning, cohesive mobile UI that feels alive — with animations, haptics, the `GeistPixel` font throughout, a neon yellow-on-black aesthetic (`#E1FF01` on `#000000`), and smooth navigation between all screens — so connecting the real backend is purely a wiring task.

## Context

- **Repository**: `buzz-me/` monorepo
- **Mobile app**: `mobile/` — Expo SDK 55, React Native 0.83.2, TypeScript
- **Design source**: Stitch project `16531083265248452053` ("BuzzMe - Android App")
- **Existing screens**: SplashScreen ✓, LoginScreen ✓ (partially), BuzzScreen ✓ (mock data)
- **Codebase map**: `.planning/codebase/` documents cover full current state
- **Constraints**:
  - `GeistPixel` font MUST be used throughout (already loaded in `App.tsx`)
  - Do NOT touch `server/`
  - Follow existing patterns: `StyleSheet.create`, theme tokens, `Animated` API, `useRef` for anim values
  - All screens export default, components export named
  - Navigation via `@react-navigation/native-stack`

## Stitch Screens (Design Reference — Project ID: 16531083265248452053)

| Screen ID | Title | Priority |
|---|---|---|
| `d897cc4f567c4acc966463c572b643b1` | BuzzMe Futuristic Welcome Screen | P0 |
| `685fa4a255b941159fb6938015fdd171` | BuzzMe Futuristic Home Screen | P0 |
| `77dd1c30483e487bb4784aa77b80a99e` | BuzzMe Futuristic History Screen | P0 |
| `76f6120e3f15421d932463bea9b96835` | BuzzMe Futuristic Settings Screen | P0 |
| `2a5dc86524204d579d875d875a3d3f99` | BuzzMe Futuristic Partner Pairing Screen | P0 |
| `27ac95bd0e254f66bbb86f6fb9412783` | BuzzMe Tech-Forward Variant | P1 (variant, skip if time) |

## Requirements

### Validated (Existing — Already Built)

- ✓ App entry, font loading gate (`App.tsx`) — existing
- ✓ `GeistPixel` custom font (`assets/fonts/GeistPixel-Square.ttf`) — existing
- ✓ Design tokens: `Colors`, `Typography`, `Spacing`, `Radius` (`src/theme/index.ts`) — existing
- ✓ `SplashScreen` — animated pixel logo assembly + ripple rings — existing
- ✓ `LoginScreen` — welcome panel + slide-up login/register form — existing (needs polish)
- ✓ `AppNavigator` — Login → Home stack — existing
- ✓ **Phase 01:** `BuzzScreen` — BUZZ button, ripple animations, idle rings, responsive pill nav UI
- ✓ **Phase 01:** HistoryScreen implementation
- ✓ **Phase 01:** Navigation wiring (TabNavigator setup)
- ✓ **Phase 01:** Shared responsive utility extraction
- ✓ **Phase 01:** Theme cleanup (`surface` color definition)

### Active (To Build This Milestone)

- [ ] **SettingsScreen** — Partner section, vibration pattern selector, intensity slider, connection toggle, account section; matches Stitch design
- [ ] **PairingScreen** — "Your Code" display + "Enter Partner's Code" input; code sharing UI
- [ ] **LoginScreen polish** — Ensure full design fidelity to Stitch welcome screen aesthetic

### Out of Scope

- Backend integration / real API calls — next milestone
- Real WebSocket connection — next milestone
- Push notifications — next milestone
- Android native foreground service — after backend
- Actual user auth token storage — after backend

## Key Decisions

| Decision | Rationale | Outcome |
|---|---|---|
| Keep `GeistPixel` for ALL text | User explicitly requires it; fits pixel-punk aesthetic | Fixed |
| Use `Animated` (not Reanimated) for all animations | Existing codebase pattern; Reanimated not currently used | Fixed |
| Use bottom tab nav (custom pill) not React Nav Tabs | Existing `BuzzScreen` has custom BlurView pill nav; extend it | Fixed |
| Mock data for all network-dependent screens | Backend not yet built; separate concerns | Fixed |
| No new dependencies | Existing stack covers all needs | Fixed |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition**:
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions

**After milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Check — backend wiring ready?

---
*Last updated: 2026-03-24 after Phase 01 completion*
