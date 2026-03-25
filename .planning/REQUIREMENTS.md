# REQUIREMENTS.md — BuzzMe Frontend v1.0

## REQ-001: History Screen
**Priority**: Must  
**Phase**: 1

Implement `HistoryScreen.tsx` matching the Stitch "BuzzMe Futuristic History Screen" design.

**Acceptance criteria:**
- Scrollable list of buzz events (sent + received)
- Each item shows: direction (sent/received), partner name, relative timestamp ("2 min ago", "Yesterday")
- "This Week" section header with total count badge (e.g. "42 buzzes 💛")
- Uses `GeistPixel` font throughout
- Uses `Colors` design tokens (accent `#E1FF01`, background `#0B0B0B`)
- Bottom pill nav present (Home / History / Settings), History tab active

---

## REQ-002: Settings Screen
**Priority**: Must  
**Phase**: 2

Implement `SettingsScreen.tsx` matching the Stitch "BuzzMe Futuristic Settings Screen" design.

**Acceptance criteria:**
- "Partner" section: partner name, "Connected" status indicator
- "Vibration" section: pattern selector (Short Pulse / Long Buzz / Heartbeat), intensity slider (0–100%)
- "Connection" section: "Keep Alive in Background" toggle, "Auto-reconnect" toggle, WS status display
- "Account" section (placeholder, no actions needed)
- Scrollable content
- Bottom pill nav present, Settings tab active

---

## REQ-003: Pairing Screen
**Priority**: Must  
**Phase**: 2

Implement `PairingScreen.tsx` matching the Stitch "BuzzMe Futuristic Partner Pairing Screen" design.

**Acceptance criteria:**
- "Your Code" large display area (e.g. `BUZZ-7X3K` — static mock)
- Share button for the code
- "Enter Partner's Code" text input with submit button
- Instructional copy: "Share your code or enter your partner's to pair devices."
- Uses `GeistPixel` font, accent color highlights

---

## REQ-004: Navigation Wiring — Full Tab Navigation
**Priority**: Must  
**Phase**: 1

Wire all screens into a cohesive navigation structure with a functional bottom tab bar.

**Acceptance criteria:**
- Bottom pill nav (Home / History / Settings) navigates between `BuzzScreen`, `HistoryScreen`, `SettingsScreen`
- Pairing screen accessible from Settings screen (e.g., tap "Partner" section)
- Active tab indicator works correctly
- No visible native header on any screen (`headerShown: false`)
- Transitions smooth (fade or slide)

---

## REQ-005: BuzzScreen Design Polish
**Priority**: Must  
**Phase**: 1

Update `BuzzScreen.tsx` to align with the Stitch "BuzzMe Futuristic Home Screen" design.

**Acceptance criteria:**
- Replace hardcoded `TEST_USER` with a `MOCK_USER` constant (same file or shared)
- Partner name + online status displayed in header (matches Stitch design)
- "Today's Buzzes" stat badge visible (e.g. "12 Sent · 8 Recv") per Stitch design
- Accent color `#E1FF01` used correctly on BUZZ button and active elements
- Hardcoded `#161616` color replaced with `Colors.surface`

---

## REQ-006: Shared Responsive Utility
**Priority**: Should  
**Phase**: 1

Extract duplicated `getResponsiveValue` helper to `src/utils/responsive.ts`.

**Acceptance criteria:**
- Single file: `mobile/src/utils/responsive.ts`
- Exports `getResponsiveValue(small, medium, large)` function
- All 4 duplicate usages replaced with the import
- No behavior change

---

## REQ-007: LoginScreen Polish
**Priority**: Should  
**Phase**: 2

Refine `LoginScreen.tsx` + `App.tsx` to match Stitch "BuzzMe Futuristic Welcome Screen" design more closely.

**Acceptance criteria:**
- Welcome screen headline matches Stitch copy and visual weight
- `GeistPixel` font confirmed on all text nodes
- Hero animation (pulsing phone ripple) timing feels polished
- "Sign Up" / "Log In" button styling matches neon pixel aesthetic

---

## Tracking

| Req | Status | Phase | Notes |
|---|---|---|---|
| REQ-001 History Screen | 🔲 Not started | Phase 1 | |
| REQ-002 Settings Screen | 🔲 Not started | Phase 2 | |
| REQ-003 Pairing Screen | 🔲 Not started | Phase 2 | |
| REQ-004 Navigation Wiring | 🔲 Not started | Phase 1 | |
| REQ-005 BuzzScreen Polish | 🔲 Not started | Phase 1 | |
| REQ-006 Responsive Utility | 🔲 Not started | Phase 1 | |
| REQ-007 LoginScreen Polish | 🔲 Not started | Phase 2 | |
