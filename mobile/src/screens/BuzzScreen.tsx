import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    SafeAreaView,
    Easing,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Typography, Spacing, Radius } from '../theme';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const MOCK_USER = {
    name: 'You',
    partner: 'Sarah',
    partnerOnline: true,
    todaySent: 12,
    todayReceived: 8,
};

// ─── Idle Concentric Ring Component ─────────────────────────────────────────
function IdleRings() {
    const ring1 = useRef(new Animated.Value(0)).current;
    const ring2 = useRef(new Animated.Value(0)).current;
    const ring3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const createRingAnim = (anim: Animated.Value, delay: number) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.parallel([
                        Animated.timing(anim, {
                            toValue: 1,
                            duration: 2400,
                            easing: Easing.out(Easing.bezier(0.4, 0, 0.2, 1)),
                            useNativeDriver: true,
                        }),
                        Animated.timing(anim, {
                            toValue: 1,
                            duration: 0,
                            useNativeDriver: true,
                        })
                    ])
                ])
            );
        };

        createRingAnim(ring1, 0).start();
        createRingAnim(ring2, 800).start();
        createRingAnim(ring3, 1600).start();
    }, []);

    const ringStyle = (anim: Animated.Value, baseSize: number) => ({
        position: 'absolute' as const,
        width: baseSize,
        height: baseSize,
        borderRadius: baseSize / 2,
        borderWidth: 1.2,
        borderColor: Colors.accent,
        transform: [
            { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 2.5] }) }
        ],
        opacity: anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0.4, 0] }),
    });

    return (
        <View style={s.ringContainer}>
            <Animated.View style={ringStyle(ring1, 140)} />
            <Animated.View style={ringStyle(ring2, 140)} />
            <Animated.View style={ringStyle(ring3, 140)} />
        </View>
    );
}

export default function BuzzScreen() {
    const [isBuzzing, setIsBuzzing] = useState(false);
    
    // Animations
    const btnScale = useRef(new Animated.Value(1)).current;
    
    // Impact ripples array
    const impactRipples = useRef([
        { scale: new Animated.Value(0), opacity: new Animated.Value(0) },
        { scale: new Animated.Value(0), opacity: new Animated.Value(0) },
    ]).current;

    const triggerBuzz = () => {
        if (isBuzzing) return;
        setIsBuzzing(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Button pop
        Animated.sequence([
            Animated.timing(btnScale, { toValue: 0.85, duration: 80, useNativeDriver: true }),
            Animated.spring(btnScale, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }),
        ]).start();

        // Impact ripples (sequential)
        impactRipples.forEach((ripple, i) => {
            ripple.scale.setValue(0.6);
            ripple.opacity.setValue(0.6);
            
            Animated.parallel([
                Animated.timing(ripple.scale, {
                    toValue: 4.5,
                    duration: 1200,
                    delay: i * 250,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(ripple.opacity, {
                    toValue: 0,
                    duration: 1200,
                    delay: i * 250,
                    useNativeDriver: true,
                }),
            ]).start();
        });

        setTimeout(() => setIsBuzzing(false), 1500);
    };

    return (
        <View style={s.root}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={s.safe}>
                
                {/* Detailed Header */}
                <View style={s.header}>
                    <View>
                        <Text style={s.brandTitle}>BUZZME</Text>
                        <View style={s.statusRow}>
                            <View style={s.onlineDot} />
                            <Text style={s.statusText}>Connected to {MOCK_USER.partner}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={s.avatarCircle} activeOpacity={0.7}>
                        <View style={s.avatarInner}>
                            <Text style={s.initials}>{MOCK_USER.name[0]}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Today's Stats Badge */}
                <View style={s.statsBadge}>
                    <Text style={s.statsText}>
                        {MOCK_USER.todaySent} Sent · {MOCK_USER.todayReceived} Recv
                    </Text>
                </View>

                {/* Main Interaction Area */}
                <View style={s.main}>
                    <View style={s.interactionCardLarge}>
                        {/* Background Glow */}
                        <View style={s.innerCardGlow} />

                        {/* Sequential Ripples (Impact) */}
                        <View style={s.rippleContainer}>
                            {impactRipples.map((ripple, i) => (
                                <Animated.View 
                                    key={i}
                                    style={[
                                        s.rippleCircle, 
                                        { 
                                            transform: [{ scale: ripple.scale }], 
                                            opacity: ripple.opacity 
                                        }
                                    ]} 
                                />
                            ))}
                        </View>

                        {/* Idle Pulsing Rings */}
                        <IdleRings />
                        
                        {/* Minimal BUZZ Button */}
                        <Animated.View style={{ transform: [{ scale: btnScale }], zIndex: 10 }}>
                            <TouchableOpacity 
                                activeOpacity={0.9}
                                onPress={triggerBuzz}
                                style={s.buzzButtonLarge}
                            >
                                <Text style={s.buzzButtonTextLarge}>BUZZ</Text>
                            </TouchableOpacity>
                        </Animated.View>

                        {/* Absolute Hint Text */}
                        <View style={s.hintContainer}>
                            <Text style={s.hintTextLarge}>Tap to buzz {MOCK_USER.partner}</Text>
                        </View>
                    </View>
                </View>

            </SafeAreaView>
        </View>
    );
}

const s = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    safe: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.lg,
    },
    brandTitle: {
        fontFamily: Typography.pixel,
        fontSize: 22,
        color: Colors.accent,
        letterSpacing: 4,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    statusText: {
        fontFamily: Typography.body,
        fontSize: 14,
        color: Colors.textSecondary,
    },
    onlineDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.online,
        marginRight: 8,
    },
    avatarCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1.5,
        borderColor: Colors.cardBorder,
        padding: 2,
    },
    avatarInner: {
        flex: 1,
        borderRadius: 20,
        backgroundColor: Colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    initials: {
        fontFamily: Typography.pixel,
        fontSize: 13,
        color: Colors.accent,
    },
    main: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.lg,
        marginTop: -30,
    },
    interactionCardLarge: {
        width: '100%',
        maxWidth: 400,
        height: SCREEN_H * 0.58,
        backgroundColor: Colors.surface,
        borderRadius: 48,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 25 },
        shadowOpacity: 0.6,
        shadowRadius: 35,
        elevation: 15,
    },
    innerCardGlow: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: Colors.accent,
        opacity: 0.02,
    },
    ringContainer: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rippleContainer: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rippleCircle: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 1.5,
        borderColor: Colors.accent,
    },
    buzzButtonLarge: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: Colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.accent,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 28,
        elevation: 15,
    },
    buzzButtonTextLarge: {
        fontFamily: Typography.pixel,
        fontSize: 26,
        color: Colors.background,
        letterSpacing: 2,
    },
    hintContainer: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10,
    },
    hintTextLarge: {
        fontFamily: Typography.body,
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: Spacing.xl,
        letterSpacing: 0.5,
    },
    statsBadge: {
        alignSelf: 'center',
        paddingHorizontal: 16,
        paddingVertical: 5,
        marginBottom: 8,
        borderRadius: Radius.full,
        backgroundColor: 'rgba(225,255,1,0.07)',
        borderWidth: 1,
        borderColor: 'rgba(225,255,1,0.2)',
    },
    statsText: {
        fontFamily: Typography.pixel,
        fontSize: 11,
        color: Colors.accent,
        letterSpacing: 1,
        opacity: 0.85,
    },
});





