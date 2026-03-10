import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
} from 'react-native';
import { Colors, Typography } from '../theme';

const { width } = Dimensions.get('window');
const LOGO_SIZE = 120;

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
    // Logo scale pop-in
    const logoScale = useRef(new Animated.Value(0.4)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;

    // tagline fade
    const taglineOpacity = useRef(new Animated.Value(0)).current;

    // 3 concentric pulsing rings
    const ring1Scale = useRef(new Animated.Value(1)).current;
    const ring1Opacity = useRef(new Animated.Value(0.6)).current;
    const ring2Scale = useRef(new Animated.Value(1)).current;
    const ring2Opacity = useRef(new Animated.Value(0.4)).current;
    const ring3Scale = useRef(new Animated.Value(1)).current;
    const ring3Opacity = useRef(new Animated.Value(0.2)).current;

    // Overall fade-out at end
    const screenOpacity = useRef(new Animated.Value(1)).current;

    const pulseRing = (scale: Animated.Value, opacity: Animated.Value, delay: number) => {
        return Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.parallel([
                    Animated.timing(scale, {
                        toValue: 2.2,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity, {
                        toValue: 0,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.parallel([
                    Animated.timing(scale, { toValue: 1, duration: 0, useNativeDriver: true }),
                    Animated.timing(opacity, { toValue: 0.6 - delay * 0.001, duration: 0, useNativeDriver: true }),
                ]),
            ])
        );
    };

    useEffect(() => {
        // 1. Pop logo in
        Animated.parallel([
            Animated.spring(logoScale, {
                toValue: 1,
                tension: 60,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(logoOpacity, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();

        // 2. Start pulsing rings with staggered delays
        pulseRing(ring1Scale, ring1Opacity, 0).start();
        pulseRing(ring2Scale, ring2Opacity, 400).start();
        pulseRing(ring3Scale, ring3Opacity, 800).start();

        // 3. Fade in tagline after 600ms
        Animated.sequence([
            Animated.delay(700),
            Animated.timing(taglineOpacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();

        // 4. After 2.8s, fade screen out and call onFinish
        const timeout = setTimeout(() => {
            Animated.timing(screenOpacity, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }).start(() => onFinish());
        }, 2800);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
            {/* Pulsing vibration rings */}
            <View style={styles.ringsContainer}>
                {[
                    { scale: ring1Scale, opacity: ring1Opacity, size: LOGO_SIZE + 40 },
                    { scale: ring2Scale, opacity: ring2Opacity, size: LOGO_SIZE + 80 },
                    { scale: ring3Scale, opacity: ring3Opacity, size: LOGO_SIZE + 120 },
                ].map((ring, i) => (
                    <Animated.View
                        key={i}
                        style={[
                            styles.ring,
                            {
                                width: ring.size,
                                height: ring.size,
                                borderRadius: ring.size / 2,
                                transform: [{ scale: ring.scale }],
                                opacity: ring.opacity,
                            },
                        ]}
                    />
                ))}
            </View>

            {/* Pixel B Logo */}
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        transform: [{ scale: logoScale }],
                        opacity: logoOpacity,
                    },
                ]}
            >
                <Text style={styles.logoText}>B</Text>
            </Animated.View>

            {/* Tagline */}
            <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
                feel the buzz. stay connected.
            </Animated.Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ringsContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    ring: {
        position: 'absolute',
        borderWidth: 2,
        borderColor: Colors.accent,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        width: LOGO_SIZE,
        height: LOGO_SIZE,
    },
    logoText: {
        fontFamily: Typography.pixel,
        fontSize: 96,
        color: Colors.accent,
        textAlign: 'center',
    },
    tagline: {
        fontFamily: Typography.pixel,
        fontSize: 10,
        color: Colors.textSecondary,
        letterSpacing: 1,
        marginTop: 64,
    },
});
