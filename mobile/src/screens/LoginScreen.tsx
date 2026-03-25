import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Easing,
    TouchableOpacity,
    Platform,
    KeyboardAvoidingView,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    Dimensions,
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, Radius } from '../theme';
import { getResponsiveValue, SCREEN_H } from '../utils/responsive';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';


const { width: SCREEN_W } = Dimensions.get('window');
const NUM_RINGS = 4;
const LOGIN_PANEL_HEIGHT = Math.min(SCREEN_H * 0.65, 450);
const REGISTER_PANEL_HEIGHT = Math.min(SCREEN_H * 0.85, 600);
const DRAG_THRESHOLD = LOGIN_PANEL_HEIGHT * 0.4;

interface LoginScreenProps {
    onLogin: () => void;
    onRegister: () => void;
}

// ─── Animated phone + ripple hero ───────────────────────────────────────────
function PhoneRippleHero({ opacity, scale }: { opacity: Animated.Value; scale: Animated.Value }) {
    const ringAnims = useRef(
        Array.from({ length: NUM_RINGS }, () => new Animated.Value(0))
    ).current;
    const phoneScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(phoneScale, { toValue: 1.07, duration: 750, useNativeDriver: true }),
                Animated.timing(phoneScale, { toValue: 1, duration: 750, useNativeDriver: true }),
            ])
        ).start();

        ringAnims.forEach((anim, i) => {
            const loop = () => {
                anim.setValue(0);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 2100,
                    delay: i * 480,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }).start(({ finished }) => { if (finished) loop(); });
            };
            setTimeout(loop, i * 480);
        });
    }, []);

    return (
        <Animated.View style={[hero.wrap, { opacity, transform: [{ scale }] }]}>
            {ringAnims.map((anim, i) => {
                const size = 80 + i * 46;
                return (
                    <Animated.View
                        key={i}
                        style={[
                            hero.ring,
                            {
                                width: size,
                                height: size,
                                borderRadius: size / 2,
                                transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 2.7] }) }],
                                opacity: anim.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 0.5 - i * 0.08, 0] }),
                            },
                        ]}
                    />
                );
            })}
            <Animated.View style={[hero.phones, { transform: [{ scale: phoneScale }] }]}>
                <View style={[hero.phone, { transform: [{ rotate: '-10deg' }, { translateX: -12 }] }]} />
                <View style={[hero.phone, { transform: [{ rotate: '10deg' }, { translateX: 12 }] }]} />
            </Animated.View>
        </Animated.View>
    );
}

const hero = StyleSheet.create({
    wrap: {
        width: getResponsiveValue(160, 200, 220),
        height: getResponsiveValue(160, 200, 220),
        alignItems: 'center',
        justifyContent: 'center'
    },
    ring: { position: 'absolute', borderWidth: 1.5, borderColor: Colors.accent },
    phones: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    phone: {
        width: getResponsiveValue(42, 48, 54),
        height: getResponsiveValue(74, 84, 94),
        borderRadius: 12,
        borderWidth: 3,
        borderColor: Colors.accent,
        position: 'absolute',
        shadowColor: Colors.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
    },
});







// ─── Main screen ─────────────────────────────────────────────────────────────
type Mode = 'welcome' | 'login' | 'register';

export default function LoginScreen({ onLogin, onRegister }: LoginScreenProps) {
    const [mode, setMode] = useState<Mode>('welcome');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');

    // ── Entrance animations
    const headerAnim = useRef(new Animated.Value(0)).current;
    const headerY = useRef(new Animated.Value(-16)).current;
    const heroOpacity = useRef(new Animated.Value(0)).current;
    const heroScale = useRef(new Animated.Value(0.88)).current;
    const bodyOpacity = useRef(new Animated.Value(0)).current;
    const bodyY = useRef(new Animated.Value(20)).current;
    const btnsOpacity = useRef(new Animated.Value(0)).current;
    const btnsY = useRef(new Animated.Value(20)).current;

    // ── Form panel slide
    const panelY = useRef(new Animated.Value(SCREEN_H)).current;
    const panelOpacity = useRef(new Animated.Value(0)).current;
    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const dragStartY = useRef(0);
    const isDragging = useRef(false);

    // ── Welcome content exit
    const welcomeOpacity = useRef(new Animated.Value(1)).current;
    const welcomeY = useRef(new Animated.Value(0)).current;

    // ── Button press scale
    const btnScale = useRef(new Animated.Value(1)).current;

    // Mount entrance
    useEffect(() => {
        Animated.stagger(110, [
            Animated.parallel([
                Animated.timing(headerAnim, { toValue: 1, duration: 480, useNativeDriver: true }),
                Animated.timing(headerY, { toValue: 0, duration: 480, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(heroOpacity, { toValue: 1, duration: 550, useNativeDriver: true }),
                Animated.spring(heroScale, { toValue: 1, tension: 55, friction: 8, useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(bodyOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
                Animated.timing(bodyY, { toValue: 0, duration: 450, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(btnsOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.timing(btnsY, { toValue: 0, duration: 400, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            ]),
        ]).start();
    }, []);

    const openPanel = (m: 'login' | 'register') => {
        setMode(m);

        // Slide welcome content up + fade
        Animated.parallel([
            Animated.timing(welcomeOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
            Animated.timing(welcomeY, { toValue: -40, duration: 300, easing: Easing.in(Easing.quad), useNativeDriver: true }),
            Animated.timing(overlayOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]).start();

        // Panel springs up
        Animated.parallel([
            Animated.spring(panelY, { toValue: 0, tension: 58, friction: 11, useNativeDriver: true }),
            Animated.timing(panelOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        ]).start();
    };

    const closePanel = () => {
        Keyboard.dismiss();

        Animated.parallel([
            Animated.timing(panelY, { toValue: SCREEN_H, duration: 320, easing: Easing.in(Easing.quad), useNativeDriver: true }),
            Animated.timing(panelOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
            Animated.timing(overlayOpacity, { toValue: 0, duration: 280, useNativeDriver: true }),
            Animated.timing(welcomeOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
            Animated.timing(welcomeY, { toValue: 0, duration: 350, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        ]).start(() => setMode('welcome'));
    };

    const pressIn = () => Animated.spring(btnScale, { toValue: 0.96, tension: 120, friction: 4, useNativeDriver: true }).start();
    const pressOut = () => Animated.spring(btnScale, { toValue: 1, tension: 120, friction: 4, useNativeDriver: true }).start();

    // ── Drag gesture for panel ──
    const panGesture = Gesture.Pan()
        .enabled(mode !== 'welcome')
        .runOnJS(true)
        .onBegin(() => {
            isDragging.current = true;
            dragStartY.current = 0;
        })
        .onUpdate((event) => {
            if (!isDragging.current) return;

            // Only allow dragging down, not up
            const newY = Math.max(0, event.translationY);

            // Use timing for smooth updates during drag
            Animated.timing(panelY, {
                toValue: newY,
                duration: 0,
                useNativeDriver: true,
            }).start();
        })
        .onEnd((event) => {
            isDragging.current = false;
            const dragDistance = event.translationY;
            const velocity = event.velocityY;

            // Close if dragged down beyond threshold or fast downward swipe
            if (dragDistance > DRAG_THRESHOLD || velocity > 1000) {
                closePanel();
            } else {
                // Snap back to open position
                Animated.spring(panelY, {
                    toValue: 0,
                    tension: 58,
                    friction: 11,
                    useNativeDriver: true,
                }).start();
            }
        })
        .onFinalize(() => {
            isDragging.current = false;
        });

    return (
        <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

            {/* ── Welcome layer ── */}
            <Animated.View
                style={[s.welcome, { opacity: welcomeOpacity, transform: [{ translateY: welcomeY }] }]}
                pointerEvents={mode === 'welcome' ? 'auto' : 'none'}
            >
                {/* Brand */}
                <Animated.Text style={[s.brand, { opacity: headerAnim, transform: [{ translateY: headerY }] }]}>
                    BUZZME
                </Animated.Text>

                {/* Hero */}
                <PhoneRippleHero opacity={heroOpacity} scale={heroScale} />

                {/* Copy */}
                <Animated.View style={[s.body, { opacity: bodyOpacity, transform: [{ translateY: bodyY }] }]}>
                    <Text style={s.headline}>Feel the{'\n'}Connection</Text>
                    <Text style={s.sub}>Send silent vibrations to your partner,{'\n'}no matter the distance.</Text>
                </Animated.View>

                {/* CTAs */}
                <Animated.View style={[s.ctaWrap, { opacity: btnsOpacity, transform: [{ translateY: btnsY }] }]}>
                    <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                        <TouchableOpacity
                            style={s.primaryBtn}
                            onPress={() => openPanel('register')}
                            onPressIn={pressIn} onPressOut={pressOut}
                            activeOpacity={1}
                        >
                            <Text style={s.primaryBtnText}>Sign Up</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <TouchableOpacity style={s.secondaryBtn} onPress={() => openPanel('login')} activeOpacity={0.75}>
                        <Text style={s.secondaryBtnText}>Log In</Text>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>

            {/* ── Dim overlay ── */}
            <Animated.View style={[s.overlay, { opacity: overlayOpacity }]} pointerEvents="none" />

            {/* ── Slide-up form panel ── */}
            <Animated.View
                onLayout={(e) => {
                    // Update the height dynamically so it can start springing up
                    // But we won't strictly enforce a static height style, we just use it for threshold checking
                    const h = e.nativeEvent.layout.height;
                    // Ensure panel starts offscreen down if wait for layout is needed
                }}
                style={[
                    s.panel,
                    { 
                        transform: [{ translateY: panelY }], 
                        opacity: panelOpacity,
                    },
                ]}
                pointerEvents={mode === 'welcome' ? 'none' : 'auto'}
            >
                {/* Drag handle */}
                <GestureDetector gesture={panGesture}>
                    <View style={s.handleWrap}>
                        <View style={s.handle} />
                    </View>
                </GestureDetector>

                {/* Panel header */}
                <View style={s.panelHeader}>
                    <Text style={s.panelTitle}>
                        {mode === 'register' ? 'Create Account' : 'Welcome Back'}
                    </Text>
                    <Text style={s.panelSub}>
                        {mode === 'register'
                            ? 'Start sending silent buzzes today.'
                            : 'Sign in to reconnect with your partner.'}
                    </Text>
                </View>

                {/* Fields and Submit using Components */}
                {mode === 'login' ? (
                    <LoginForm
                        email={email} setEmail={setEmail}
                        password={password} setPassword={setPassword}
                        onSubmit={onLogin}
                        btnScale={btnScale} pressIn={pressIn} pressOut={pressOut}
                    />
                ) : (
                    <RegisterForm
                        name={name} setName={setName}
                        email={email} setEmail={setEmail}
                        password={password} setPassword={setPassword}
                        confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                        onSubmit={onRegister}
                        btnScale={btnScale} pressIn={pressIn} pressOut={pressOut}
                    />
                )}

                {/* Switch mode */}
                <TouchableOpacity
                    style={s.switchRow}
                    onPress={() => {
                        const nextMode = mode === 'login' ? 'register' : 'login';
                        openPanel(nextMode);
                    }}
                    activeOpacity={0.7}
                >
                    <Text style={s.switchText}>
                        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                        <Text style={s.switchLink}>
                            {mode === 'login' ? 'Sign Up' : 'Log In'}
                        </Text>
                    </Text>
                </TouchableOpacity>
            </Animated.View>

        </KeyboardAvoidingView>
    );
}

const s = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    // Welcome layer
    welcome: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Math.max(SCREEN_W * 0.06, 24),
        paddingBottom: getResponsiveValue(30, 40, 50),
        gap: getResponsiveValue(6, 8, 10),
    },
    brand: {
        fontFamily: Typography.pixel,
        fontSize: getResponsiveValue(18, 22, 24),
        color: Colors.accent,
        letterSpacing: getResponsiveValue(8, 10, 12),
        marginBottom: getResponsiveValue(12, 16, 20),
    },
    body: { alignItems: 'center', marginTop: getResponsiveValue(6, 8, 10) },
    headline: {
        fontFamily: Typography.bodyBold,
        fontSize: getResponsiveValue(32, 42, 48),
        color: Colors.textPrimary,
        textAlign: 'center',
        lineHeight: getResponsiveValue(38, 48, 56),
        marginBottom: getResponsiveValue(10, 12, 14),
    },
    sub: {
        fontFamily: Typography.body,
        fontSize: getResponsiveValue(13, 14, 15),
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: getResponsiveValue(20, 22, 24),
        maxWidth: Math.min(SCREEN_W * 0.85, 500),
    },

    // CTAs
    ctaWrap: {
        width: '100%',
        maxWidth: 500,
        gap: getResponsiveValue(10, 12, 14),
        marginTop: getResponsiveValue(24, 32, 40)
    },
    primaryBtn: {
        backgroundColor: Colors.accent,
        borderRadius: Radius.full,
        height: getResponsiveValue(52, 58, 62),
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
    },
    primaryBtnText: {
        fontFamily: Typography.bodyBold,
        fontSize: getResponsiveValue(15, 16, 17),
        color: Colors.background,
    },
    secondaryBtn: {
        borderRadius: Radius.full,
        height: getResponsiveValue(52, 58, 62),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: Colors.cardBorder,
    },
    secondaryBtnText: {
        fontFamily: Typography.bodyBold,
        fontSize: getResponsiveValue(15, 16, 17),
        color: Colors.textPrimary,
    },

    // Overlay
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.55)',
    },

    // Form panel
    panel: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.surface,
        borderTopLeftRadius: getResponsiveValue(24, 28, 32),
        borderTopRightRadius: getResponsiveValue(24, 28, 32),
        borderTopWidth: 1,
        borderColor: Colors.cardBorder,
        paddingHorizontal: Math.max(SCREEN_W * 0.06, 20),
        paddingBottom: getResponsiveValue(40, 60, 80),
    },
    handleWrap: {
        alignItems: 'center',
        paddingVertical: getResponsiveValue(14, 16, 18),
    },
    handle: {
        width: getResponsiveValue(34, 38, 42),
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.cardBorder,
    },
    panelHeader: { marginBottom: getResponsiveValue(16, 20, 24) },
    panelTitle: {
        fontFamily: Typography.bodyBold,
        fontSize: getResponsiveValue(22, 26, 30),
        color: Colors.textPrimary,
        marginBottom: getResponsiveValue(4, 6, 8),
    },
    panelSub: {
        fontFamily: Typography.body,
        fontSize: getResponsiveValue(13, 14, 15),
        color: Colors.textSecondary,
    },
    submitWrap: { marginTop: getResponsiveValue(6, 8, 10) },
    switchRow: { alignItems: 'center', marginTop: getResponsiveValue(16, 20, 24) },
    switchText: {
        fontFamily: Typography.body,
        fontSize: getResponsiveValue(13, 14, 15),
        color: Colors.textSecondary,
    },
    switchLink: {
        fontFamily: Typography.bodySemibold,
        color: Colors.accent,
    },
});
