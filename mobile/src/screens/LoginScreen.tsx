import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Easing,
    TouchableOpacity,
    Dimensions,
    Platform,
    KeyboardAvoidingView,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../theme';

const { height: SCREEN_H } = Dimensions.get('window');
const PANEL_HEIGHT = SCREEN_H * 0.62;
const NUM_RINGS = 4;

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
    wrap: { width: 200, height: 200, alignItems: 'center', justifyContent: 'center' },
    ring: { position: 'absolute', borderWidth: 1.5, borderColor: Colors.accent },
    phones: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    phone: {
        width: 48,
        height: 84,
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

// ─── Input field ─────────────────────────────────────────────────────────────
function Field({
    label, value, onChange, placeholder, secure, keyboardType,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    secure?: boolean;
    keyboardType?: 'email-address' | 'default';
}) {
    const [focused, setFocused] = useState(false);
    const borderAnim = useRef(new Animated.Value(0)).current;

    const focus = () => {
        setFocused(true);
        Animated.timing(borderAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
    };
    const blur = () => {
        setFocused(false);
        Animated.timing(borderAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
    };

    const borderColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [Colors.cardBorder, Colors.accent],
    });

    return (
        <View style={f.group}>
            <Text style={f.label}>{label}</Text>
            <Animated.View style={[f.box, { borderColor }]}>
                <TextInput
                    style={f.input}
                    value={value}
                    onChangeText={onChange}
                    onFocus={focus}
                    onBlur={blur}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.textMuted}
                    secureTextEntry={secure}
                    keyboardType={keyboardType ?? 'default'}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </Animated.View>
        </View>
    );
}

const f = StyleSheet.create({
    group: { marginBottom: 14 },
    label: {
        fontFamily: Typography.pixel,
        fontSize: 10,
        color: Colors.textSecondary,
        letterSpacing: 1.5,
        marginBottom: 8,
    },
    box: {
        backgroundColor: Colors.surface,
        borderRadius: Radius.md,
        borderWidth: 1.5,
        height: 52,
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    input: {
        color: Colors.textPrimary,
        fontFamily: Typography.body,
        fontSize: 15,
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
    const panelY = useRef(new Animated.Value(PANEL_HEIGHT)).current;
    const panelOpacity = useRef(new Animated.Value(0)).current;
    const overlayOpacity = useRef(new Animated.Value(0)).current;

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
            Animated.timing(panelY, { toValue: PANEL_HEIGHT, duration: 320, easing: Easing.in(Easing.quad), useNativeDriver: true }),
            Animated.timing(panelOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
            Animated.timing(overlayOpacity, { toValue: 0, duration: 280, useNativeDriver: true }),
            Animated.timing(welcomeOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
            Animated.timing(welcomeY, { toValue: 0, duration: 350, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        ]).start(() => setMode('welcome'));
    };

    const pressIn = () => Animated.spring(btnScale, { toValue: 0.96, tension: 120, friction: 4, useNativeDriver: true }).start();
    const pressOut = () => Animated.spring(btnScale, { toValue: 1, tension: 120, friction: 4, useNativeDriver: true }).start();

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
                style={[
                    s.panel,
                    { transform: [{ translateY: panelY }], opacity: panelOpacity },
                ]}
            >
                {/* Drag handle */}
                <TouchableOpacity onPress={closePanel} style={s.handleWrap} activeOpacity={0.7}>
                    <View style={s.handle} />
                </TouchableOpacity>

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

                {/* Fields */}
                {mode === 'register' && (
                    <Field label="NAME" value={name} onChange={setName} placeholder="Your name" />
                )}
                <Field
                    label="EMAIL"
                    value={email}
                    onChange={setEmail}
                    placeholder="you@example.com"
                    keyboardType="email-address"
                />
                <Field
                    label="PASSWORD"
                    value={password}
                    onChange={setPassword}
                    placeholder="••••••••"
                    secure
                />
                {mode === 'register' && (
                    <Field
                        label="CONFIRM PASSWORD"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        placeholder="••••••••"
                        secure
                    />
                )}

                {/* Submit */}
                <Animated.View style={[s.submitWrap, { transform: [{ scale: btnScale }] }]}>
                    <TouchableOpacity
                        style={s.primaryBtn}
                        onPress={mode === 'register' ? onRegister : onLogin}
                        onPressIn={pressIn} onPressOut={pressOut}
                        activeOpacity={1}
                    >
                        <Text style={s.primaryBtnText}>
                            {mode === 'register' ? 'Create Account' : 'Sign In'}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Switch mode */}
                <TouchableOpacity
                    style={s.switchRow}
                    onPress={() => {
                        closePanel();
                        setTimeout(() => openPanel(mode === 'login' ? 'register' : 'login'), 380);
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
        paddingHorizontal: 28,
        paddingBottom: 40,
        gap: 8,
    },
    brand: {
        fontFamily: Typography.pixel,
        fontSize: 22,
        color: Colors.accent,
        letterSpacing: 10,
        marginBottom: 16,
    },
    body: { alignItems: 'center', marginTop: 8 },
    headline: {
        fontFamily: Typography.bodyBold,
        fontSize: 42,
        color: Colors.textPrimary,
        textAlign: 'center',
        lineHeight: 48,
        marginBottom: 12,
    },
    sub: {
        fontFamily: Typography.body,
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },

    // CTAs
    ctaWrap: { width: '100%', gap: 12, marginTop: 32 },
    primaryBtn: {
        backgroundColor: Colors.accent,
        borderRadius: Radius.full,
        height: 58,
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
        fontSize: 16,
        color: Colors.background,
    },
    secondaryBtn: {
        borderRadius: Radius.full,
        height: 58,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: Colors.cardBorder,
    },
    secondaryBtnText: {
        fontFamily: Typography.bodyBold,
        fontSize: 16,
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
        height: PANEL_HEIGHT,
        backgroundColor: Colors.surface,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        borderTopWidth: 1,
        borderColor: Colors.cardBorder,
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    handleWrap: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    handle: {
        width: 38,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.cardBorder,
    },
    panelHeader: { marginBottom: 20 },
    panelTitle: {
        fontFamily: Typography.bodyBold,
        fontSize: 26,
        color: Colors.textPrimary,
        marginBottom: 6,
    },
    panelSub: {
        fontFamily: Typography.body,
        fontSize: 14,
        color: Colors.textSecondary,
    },
    submitWrap: { marginTop: 8 },
    switchRow: { alignItems: 'center', marginTop: 20 },
    switchText: {
        fontFamily: Typography.body,
        fontSize: 14,
        color: Colors.textSecondary,
    },
    switchLink: {
        fontFamily: Typography.bodySemibold,
        color: Colors.accent,
    },
});
