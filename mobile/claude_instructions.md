# Design Fix Instructions for BuzzMe React Native App

The user has pointed out that the current design and fonts in the React Native app are way off from the original design created on Stitch. You need to fix the design to perfectly match the original intent.

## Reference Materials
1. The intended design aesthetic is based on the "Plexo" Dribbble shot, adapted for a mobile context (`dribbble_plexo_...`).
2. The splash screen animation should be a pure black screen with the pixel 'B' logo in neon yellow, with concentric vibration rings (`buzzme_screen.png`).
3. The font should be `Geist Pixel` or closely resemble it, not the default monospace font currently used.

## Current Setup
- The project is an Expo React Native app located in `/Users/tushinkulshreshtha/buzz-me/mobile`.
- The current implementation is in `src/screens/SplashScreen.tsx`, `src/screens/LoginScreen.tsx`, and `src/theme/index.ts`.
- The current font is `SpaceMono` and `SpaceGrotesk`, which is incorrect.

## Required Tasks

### 1. Fix Fonts
- The original Stitch design used `Geist Pixel` (or a similar pixel font) for headings/logos and a clean sans-serif (like Inter or Geist) for body.
- **Action**: Replace `SpaceMono` with the correct pixel font. If `Geist Pixel` isn't available, find and download a high-quality free pixel font (e.g., `Silkscreen`, `Press Start 2P`, or `VT323`) and place it in `assets/fonts/`. Update `App.tsx` to load it. Update body text to use `Inter` or standard system fonts instead of `SpaceGrotesk`.

### 2. Fix Splash Screen (`src/screens/SplashScreen.tsx`)
- The current pixel 'B' logo with the square border (`logoFrame`) is clunky.
- **Action**: The reference `buzzme_screen.png` shows the 'B' built out of thick pixel blocks *with no square border*. The rings should be closer to the logo. Make the 'B' look exactly like the reference image (solid pixelated B, no outline box).
- **Animation**: The pop-in and pulses are okay, but ensure the glow/opacity matches the reference perfectly.

### 3. Fix Login Screen (`src/screens/LoginScreen.tsx`)
- The current dark grey card (`Colors.card`) on a black background looks generic.
- The inputs with borders look generic.
- The pixel dots at the bottom are unnecessary if they aren't in the original design.
- **Action**: Make the layout cleaner and more aggressive. Look at the Plexo reference — it uses minimal borders, flat inputs, and high contrast.
- Ensure the 'B' logo on the login screen matches the corrected splash screen logo (no square box, pure pixel B).
- The neon button should have a bolder, pixel-font label.

### 4. Fix Theme (`src/theme/index.ts`)
- Update the `Typography` section with the new fonts.
- Refine the `Colors` palette to be exactly `#000000` (pure black) for background, and the exact neon `get` from the Stitch reference.

## Verification
- After making the changes, run the app using `npx expo start --android` (the emulator `emulator-5554` should still be running).
- Ensure no font loading errors occur.
- Verify the screens match the aesthetic of the references.

## Execution
Please read these instructions, execute the necessary changes to the `mobile/src` directory, and confirm once complete.
