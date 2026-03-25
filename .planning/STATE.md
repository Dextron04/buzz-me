# STATE.md — BuzzMe Project Memory

## Current Position

- **Milestone**: v1.0 — Frontend Implementation
- **Current Phase**: Not started (Phase 1 next)
- **Last Action**: Project initialized from Stitch design + codebase map

## Project Summary

BuzzMe is a couples' silent vibration app. This milestone builds the complete React Native frontend matching the Stitch design (project `16531083265248452053`). Backend is out of scope — all data is mocked.

## Stitch Design Reference

**Project ID**: `16531083265248452053` (Stitch MCP)

| Screen | ID | Status |
|---|---|---|
| Welcome Screen | `d897cc4f567c4acc966463c572b643b1` | Inspect before Phase 1 |
| Home/Buzz Screen | `685fa4a255b941159fb6938015fdd171` | Phase 1 polish target |
| History Screen | `77dd1c30483e487bb4784aa77b80a99e` | Phase 1 build target |
| Settings Screen | `76f6120e3f15421d932463bea9b96835` | Phase 2 build target |
| Pairing Screen | `2a5dc86524204d579d875d875a3d3f99` | Phase 2 build target |

## Key Technical Facts

- **Entry**: `mobile/App.tsx` → font gate → SplashScreen → AppNavigator
- **Font**: `GeistPixel` (loaded via `useFonts` in `App.tsx`) — use EVERYWHERE
- **Theme**: `mobile/src/theme/index.ts` — Colors, Typography, Spacing, Radius
- **Navigation**: `@react-navigation/native-stack` — currently Login → Home only
- **Animation**: React Native `Animated` API with `useNativeDriver: true`
- **DO NOT TOUCH**: `server/` directory

## Existing Screens

| Screen | File | Status |
|---|---|---|
| SplashScreen | `src/screens/SplashScreen.tsx` | ✅ Complete |
| LoginScreen | `src/screens/LoginScreen.tsx` | ✅ Built, needs polish (Phase 2) |
| BuzzScreen | `src/screens/BuzzScreen.tsx` | ⚠️ Built, needs polish (Phase 1) |

## Phase Decisions Log

- YOLO mode (no confirmation needed at each step)
- No research agents (domain is clear)
- No external test runner for mobile yet
- Navigation: custom pill nav (BlurView) not React Navigation tabs

## Open Items / TODOs

- [ ] Phase 1: Start with `gsd-plan-phase 1`
- [ ] Extract `getResponsiveValue` to `src/utils/responsive.ts`
- [ ] Fix hardcoded `#161616` in BuzzScreen
- [ ] Replace `TEST_USER` with `MOCK_USER`

---
*Initialized: 2026-03-24*
