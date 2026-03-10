import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../theme';

const { width, height } = Dimensions.get('window');

interface LoginScreenProps {
    onLogin: () => void;
    onRegister: () => void;
}

export default function LoginScreen({ onLogin, onRegister }: LoginScreenProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);

    // Button press animation
    const buttonScale = useRef(new Animated.Value(1)).current;

    // Card slide-up animation on mount
    const cardTranslateY = useRef(new Animated.Value(60)).current;
    const cardOpacity = useRef(new Animated.Value(0)).current;
    const headerOpacity = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        // Staggered entrance
        Animated.parallel([
            Animated.timing(headerOpacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.sequence([
                Animated.delay(150),
                Animated.parallel([
                    Animated.spring(cardTranslateY, {
                        toValue: 0,
                        tension: 55,
                        friction: 9,
                        useNativeDriver: true,
                    }),
                    Animated.timing(cardOpacity, {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ]),
            ]),
        ]).start();
    }, []);

    const handlePressIn = () => {
        Animated.spring(buttonScale, {
            toValue: 0.96,
            useNativeDriver: true,
            tension: 100,
            friction: 5,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(buttonScale, {
            toValue: 1,
            useNativeDriver: true,
            tension: 100,
            friction: 5,
        }).start();
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Header — Logo + title */}
                <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
                    {/* Pixel B icon */}
                    <Text style={styles.logoMarkText}>B</Text>
                    <Text style={styles.appName}>BuzzMe</Text>
                    <Text style={styles.appSubtitle}>feel the buzz. stay connected.</Text>
                </Animated.View>

                {/* Login Card */}
                <Animated.View
                    style={[
                        styles.card,
                        {
                            opacity: cardOpacity,
                            transform: [{ translateY: cardTranslateY }],
                        },
                    ]}
                >
                    {/* Card header */}
                    <Text style={styles.cardTitle}>Sign In</Text>
                    <Text style={styles.cardSubtitle}>Enter your credentials to continue</Text>

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Email field */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>EMAIL</Text>
                        <View
                            style={[
                                styles.inputWrapper,
                                focusedField === 'email' && styles.inputWrapperFocused,
                            ]}
                        >
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                placeholder="you@example.com"
                                placeholderTextColor={Colors.textMuted}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                    </View>

                    {/* Password field */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>PASSWORD</Text>
                        <View
                            style={[
                                styles.inputWrapper,
                                focusedField === 'password' && styles.inputWrapperFocused,
                            ]}
                        >
                            <TextInput
                                style={styles.input}
                                value={password}
                                onChangeText={setPassword}
                                onFocus={() => setFocusedField('password')}
                                onBlur={() => setFocusedField(null)}
                                placeholder="••••••••"
                                placeholderTextColor={Colors.textMuted}
                                secureTextEntry
                            />
                        </View>
                    </View>

                    {/* Sign In button */}
                    <Animated.View style={{ transform: [{ scale: buttonScale }], marginTop: Spacing.md }}>
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={onLogin}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            activeOpacity={1}
                        >
                            <Text style={styles.primaryButtonText}>SIGN IN</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Register link */}
                    <View style={styles.registerRow}>
                        <Text style={styles.registerPrompt}>Don't have an account? </Text>
                        <TouchableOpacity onPress={onRegister}>
                            <Text style={styles.registerLink}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* Bottom pixel grid decoration */}
                <View style={styles.pixelGrid}>
                    {Array.from({ length: 12 }).map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.pixelDot,
                                { opacity: 0.04 + (i % 4) * 0.02 },
                            ]}
                        />
                    ))}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: Spacing.lg,
        paddingTop: 80,
        paddingBottom: 40,
    },

    // Header
    header: {
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    logoMarkText: {
        fontFamily: Typography.pixel,
        fontSize: 64,
        color: Colors.accent,
        marginBottom: Spacing.md,
    },
    appName: {
        fontFamily: Typography.pixel,
        fontSize: 32,
        color: Colors.textPrimary,
        marginBottom: Spacing.xs,
    },
    appSubtitle: {
        fontFamily: Typography.pixel,
        fontSize: 10,
        color: Colors.textSecondary,
        letterSpacing: 2,
        textTransform: 'lowercase',
    },

    // Card
    card: {
        backgroundColor: Colors.card,
        borderRadius: Radius.xl,
        borderWidth: 1,
        borderColor: Colors.cardBorder,
        padding: Spacing.xl,
    },
    cardTitle: {
        fontFamily: Typography.bodyBold,
        fontSize: 24,
        color: Colors.textPrimary,
        marginBottom: Spacing.xs,
    },
    cardSubtitle: {
        fontSize: 14,
        fontFamily: Typography.body,
        color: Colors.textSecondary,
        marginBottom: Spacing.lg,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.cardBorder,
        marginBottom: Spacing.lg,
    },

    // Fields
    fieldGroup: {
        marginBottom: Spacing.md,
    },
    fieldLabel: {
        fontFamily: Typography.pixel,
        fontSize: 10,
        color: Colors.textSecondary,
        letterSpacing: 1,
        marginBottom: Spacing.sm,
    },
    inputWrapper: {
        backgroundColor: Colors.surface,
        borderRadius: Radius.md,
        borderWidth: 1,
        borderColor: Colors.cardBorder,
        paddingHorizontal: Spacing.md,
        height: 52,
        justifyContent: 'center',
    },
    inputWrapperFocused: {
        borderColor: Colors.accent,
    },
    input: {
        color: Colors.textPrimary,
        fontSize: 16,
        fontFamily: Typography.body,
    },

    // Primary button
    primaryButton: {
        backgroundColor: Colors.accent,
        borderRadius: Radius.md,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryButtonText: {
        fontFamily: Typography.pixel,
        fontSize: 14,
        color: Colors.background,
        letterSpacing: 3,
    },

    // Register row
    registerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Spacing.lg,
    },
    registerPrompt: {
        fontFamily: Typography.body,
        fontSize: 14,
        color: Colors.textSecondary,
    },
    registerLink: {
        fontFamily: Typography.bodySemibold,
        fontSize: 14,
        color: Colors.accent,
    },

    // Pixel grid decoration
    pixelGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
        marginTop: Spacing.xxl,
        paddingHorizontal: Spacing.xl,
    },
    pixelDot: {
        width: 4,
        height: 4,
        backgroundColor: Colors.accent,
    },
});
