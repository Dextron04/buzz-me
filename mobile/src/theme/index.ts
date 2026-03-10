// Brand design tokens — matches Stitch design
export const Colors = {
    // Core palette
    background: '#0B0B0B',
    surface: '#161616',
    card: '#1E1E1E',
    cardBorder: '#2A2A2A',

    // Accent — neon yellow-green
    accent: '#E1FF01',
    accentDim: 'rgba(225, 255, 1, 0.15)',
    accentRing: 'rgba(225, 255, 1, 0.08)',

    // Text
    textPrimary: '#FFFFFF',
    textSecondary: '#8A8A8A',
    textMuted: '#3D3D3D',

    // Status
    online: '#00E676',
    danger: '#FF4444',

    // Transparent overlays
    overlay20: 'rgba(0,0,0,0.2)',
    overlay60: 'rgba(0,0,0,0.6)',
};

export const Typography = {
    // Space Grotesk font family
    pixel: 'SpaceGrotesk_700Bold' as const,
    body: 'SpaceGrotesk_400Regular' as const,
    bodyMedium: 'SpaceGrotesk_500Medium' as const,
    bodySemibold: 'SpaceGrotesk_600SemiBold' as const,
    bodyBold: 'SpaceGrotesk_700Bold' as const,
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const Radius = {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    full: 999,
};
