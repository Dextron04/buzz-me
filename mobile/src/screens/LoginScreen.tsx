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
    ScrollView,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../theme';

const { width, height } = Dimensions.get('window');
const PHONE_W = 60;
const PHONE_H = 100;
const NUM_RINGS = 4;

interface LoginScreenProps {
    onLogin: () => void;
    onRegister: () => void;
}

// ── Small animated phone icon ────────────────────────────────────────────────
function PhoneRippleHero() {
    const ringAnims = useRef(
        Array.from({ length: NUM_RINGS }, () => new Animated.Value(0))
    ).current;
    const phoneScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Subtle phone pulse
        Animated.loop(
            Animated.sequence([
                Animated.timing(phoneScale, { toValue: 1.06, duration: 700, useNativeDriver: true }),
                Animated.timing(phoneScale, { toValue: 1, duration: 700, useNativeDriver: true }),
            ])
        ).start();

        // Rings
        ringAnims.forEach((anim, i) => {
            anim.setValue(0);
            Animated.loop(
                Animated.sequence([
                    Animated.delay(i * 450),
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 2000,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        });
    }, []);

    return (
        <View style={hero.container}>
            {/* Rings */}
            {ringAnims.map((anim, i) => {
                const base = 80 + i * 45;
                const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 2.6] });
                const opacity = anim.interpolate({
                    inputRange: [0, 0.2, 1],
                    outputRange: [0, 0.5 - i * 0.08, 0],
                });
                return (
                    <Animated.View
                        key={i}
                        style={[
                            hero.ring,
                            {
                                width: base,
                                height: base,
                                borderRadius: base / 2,
                                transform: [{ scale }],
                                opacity,
                            },
                        ]}
                    />
                );
            })}

            {/* Phone icon (two overlapping rounded rects like the Stitch design) */}
            <Animated.View style={[hero.phoneGroup, { transform: [{ scale: phoneScale }] }]}>
                <View style={[hero.phone, hero.phoneShadow, { transform: [{ rotate: '-8deg' }, { translateX: -14 }] }]} />
                <View style={[hero.phone, { transform: [{ rotate: '8deg' }, { translateX: 14 }] }]} />
            </Animated.View>
        </View>
    );
}

const hero = StyleSheet.create({
    container: {
        width: 220,
        height: 220,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ring: {
        position: 'absolute',
        borderWidth: 1.5,
        borderColor: Colors.accent,
    },
    phoneGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    phone: {
        width: PHONE_W,
        height: PHONE_H,
        borderRadius: 14,
        borderWidth: 3,
        borderColor: Colors.accent,
        backgroundColor: 'transparent',
        shadowColor: Colors.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
    },
    phoneShadow: {
        position: 'absolute',
    },
});

// ── Main LoginScreen ─────────────────────────────────────────────────────────
export default function LoginScreen({ onLogin, onRegister }: LoginScreenProps) {
    const [mode, setMode] = useState<'welcome' | 'login'>('welcome');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [focused, setFocused] = useState<'email' | 'password' | null>(null);

    // Entrance animations
    const headerOpacity = useRef(new Animated.Value(0)).current;
    const headerY = useRef(new Animated.Value(-20)).current;
    const heroOpacity = useRef(new Animated.Value(0)).current;
    const heroScale = useRef(new Animated.Value(0.85)).current;
    const bodyOpacity = useRef(new Animated.Value(0)).current;
    const bodyY = useRef(new Animated.Value(30)).current;

    // Login form
    const formOpacity = useRef(new Animated.Value(0)).current;
    const formY = useRef(new Animated.Value(40)).current;

    const buttonScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.stagger(120, [
            Animated.parallel([
                Animated.timing(headerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.timing(headerY, { toValue: 0, duration: 500, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(heroOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
                Animated.spring(heroScale, { toValue: 1, tension: 55, friction: 8, useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(bodyOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.timing(bodyY, { toValue: 0, duration: 500, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            ]),
        ]).start();
    }, []);

    const handleSignUpPress = () => {
        // Animate form in
        Animated.parallel([
            Animated.timing(formOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
            Animated.spring(formY, { toValue: 0, tension: 60, friction: 9, useNativeDriver: true }),
        ]).start();
        setMode('login');
    };

    const pressIn = () => Animated.spring(buttonScale, { toValue: 0.96, useNativeDriver: true, tension: 100, friction: 5 }).start();
    const pressOut = () => Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true, tension: 100, friction: 5 }).start();

    return (
        <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView
                contentContainerStyle={s.scroll}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* ── Brand header ── */}
                <Animated.View style={[s.header, { opacity: headerOpacity, transform: [{ translateY: headerY }] }]}>
                    <Text style={s.brand}>BUZZME</Text>
                </Animated.View>

                {/* ── Hero ── */}
                <Animated.View style={[s.heroWrap, { opacity: heroOpacity, transform: [{ scale: heroScale }] }]}>
                    <PhoneRippleHero />
                </Animated.View>

                {/* ── Body copy ── */}
                <Animated.View style={[s.body, { opacity: bodyOpacity, transform: [{ translateY: bodyY }] }]}>
                    <Text style={s.headline}>Feel the{'\n'}Connection</Text>
                    <Text style={s.sub}>
                        Send silent vibrations to your partner,{'\n'}no matter the distance.
                    </Text>
                </Animated.View>

                {/* ── Login form (slides in when Sign Up tapped) ── */}
                {mode === 'login' && (
                    <Animated.View style={[s.form, { opacity: formOpacity, transform: [{ translateY: formY }] }]}>
                        <View style={s.fieldGroup}>
                            <Text style={s.label}>EMAIL</Text>
                            <View style={[s.inputBox, focused === 'email' && s.inputBoxFocused]}>
                                <TextInput
                                    style={s.input}
                                    value={email}
                                    onChangeText={setEmail}
                                    onFocus={() => setFocused('email')}
                                    onBlur={() => setFocused(null)}
                                    placeholder="you@example.com"
                                    placeholderTextColor={Colors.textMuted}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                        </View>
                        <View style={s.fieldGroup}>
                            <Text style={s.label}>PASSWORD</Text>
                            <View style={[s.inputBox, focused === 'password' && s.inputBoxFocused]}>
                                <TextInput
                                    style={s.input}
                                    value={password}
                                    onChangeText={setPassword}
                                    onFocus={() => setFocused('password')}
                                    onBlur={() => setFocused(null)}
                                    placeholder="••••••••"
                                    placeholderTextColor={Colors.textMuted}
                                    secureTextEntry
                                />
                            </View>
                        </View>
                    </Animated.View>
                )}

                {/* ── CTA buttons ── */}
                <View style={s.buttons}>
                    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                        <TouchableOpacity
                            style={s.primaryBtn}
                            onPress={mode === 'welcome' ? handleSignUpPress : onRegister}
                            onPressIn={pressIn}
                            onPressOut={pressOut}
                            activeOpacity={1}
                        >
                            <Text style={s.primaryBtnText}>
                                {mode === 'welcome' ? 'Sign Up' : 'Create Account'}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <TouchableOpacity style={s.secondaryBtn} onPress={onLogin} activeOpacity={0.7}>
                        <Text style={s.secondaryBtnText}>Log In</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const s = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scroll: {
        flexGrow: 1,
        paddingHorizontal: 28,
        paddingTop: 60,
        paddingBottom: 48,
    },

    // Header
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    brand: {
        fontFamily: Typography.pixel,
        fontSize: 24,
        color: Colors.accent,
        letterSpacing: 10,
    },

    // Hero
    heroWrap: {
        alignItems: 'center',
        marginBottom: 36,
    },

    // Body
    body: {
        alignItems: 'center',
        marginBottom: 36,
    },
    headline: {
        fontFamily: Typography.bodyBold,
        fontSize: 40,
        color: Colors.textPrimary,
        textAlign: 'center',
        lineHeight: 46,
        marginBottom: 14,
    },
    sub: {
        fontFamily: Typography.body,
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 21,
    },

    // Login form
    form: {
        marginBottom: 20,
    },
    fieldGroup: {
        marginBottom: 16,
    },
    label: {
        fontFamily: Typography.pixel,
        fontSize: 10,
        color: Colors.textSecondary,
        letterSpacing: 1.5,
        marginBottom: 8,
    },
    inputBox: {
        backgroundColor: Colors.surface,
        borderRadius: Radius.md,
        borderWidth: 1,
        borderColor: Colors.cardBorder,
        paddingHorizontal: 16,
        height: 52,
        justifyContent: 'center',
    },
    inputBoxFocused: {
        borderColor: Colors.accent,
    },
    input: {
        color: Colors.textPrimary,
        fontSize: 16,
        fontFamily: Typography.body,
    },

    // Buttons
    buttons: {
        gap: 12,
    },
    primaryBtn: {
        backgroundColor: Colors.accent,
        borderRadius: Radius.full,
        height: 58,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
        elevation: 6,
    },
    primaryBtnText: {
        fontFamily: Typography.bodyBold,
        fontSize: 16,
        color: Colors.background,
        letterSpacing: 0.5,
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
        letterSpacing: 0.5,
    },
});
