import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Easing,
} from 'react-native';
import { Colors, Typography } from '../theme';
import * as Haptics from 'expo-haptics';

const NUM_RINGS = 4;

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
    const logoScale = useRef(new Animated.Value(0.4)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const titleOpacity = useRef(new Animated.Value(0)).current;
    const titleY = useRef(new Animated.Value(14)).current;
    const taglineOpacity = useRef(new Animated.Value(0)).current;
    const screenOpacity = useRef(new Animated.Value(1)).current;

    const ringAnims = useRef(
        Array.from({ length: NUM_RINGS }, () => new Animated.Value(0))
    ).current;

    useEffect(() => {
        // Pop logo in
        Animated.parallel([
            Animated.spring(logoScale, { toValue: 1, tension: 65, friction: 7, useNativeDriver: true }),
            Animated.timing(logoOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
        ]).start();

        // Staggered pulsing rings
        ringAnims.forEach((anim, i) => {
            const loop = () => {
                anim.setValue(0);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 1800,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                    delay: i * 420,
                }).start(({ finished }) => { if (finished) loop(); });
            };
            setTimeout(loop, i * 420);
        });

        // Title fade up
        Animated.sequence([
            Animated.delay(450),
            Animated.parallel([
                Animated.timing(titleOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
                Animated.timing(titleY, { toValue: 0, duration: 450, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            ]),
        ]).start();

        // Tagline
        Animated.sequence([
            Animated.delay(850),
            Animated.timing(taglineOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        ]).start();

        // Fade out
        const t = setTimeout(() => {
            Animated.timing(screenOpacity, { toValue: 0, duration: 450, useNativeDriver: true })
                .start(() => onFinish());
        }, 2800);

        return () => clearTimeout(t);
    }, []);

    return (
        <Animated.View style={[s.screen, { opacity: screenOpacity }]}>

            {/* Single centered stack — rings + logo share same origin */}
            <View style={s.centerStack}>
                {/* Rings rendered behind logo */}
                {ringAnims.map((anim, i) => {
                    const size = 90 + i * 52;
                    return (
                        <Animated.View
                            key={i}
                            style={[
                                s.ring,
                                {
                                    width: size,
                                    height: size,
                                    borderRadius: size / 2,
                                    transform: [{
                                        scale: anim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.5, 2.5],
                                        }),
                                    }],
                                    opacity: anim.interpolate({
                                        inputRange: [0, 0.2, 1],
                                        outputRange: [0, 0.55 - i * 0.1, 0],
                                    }),
                                },
                            ]}
                        />
                    );
                })}

                {/* Logo — no card, just the letter */}
                <Animated.Text
                    style={[
                        s.logo,
                        {
                            transform: [{ scale: logoScale }],
                            opacity: logoOpacity,
                        },
                    ]}
                >
                    B
                </Animated.Text>
            </View>

            {/* Title + tagline below */}
            <Animated.Text
                style={[s.title, { opacity: titleOpacity, transform: [{ translateY: titleY }] }]}
            >
                BUZZME
            </Animated.Text>
            <Animated.Text style={[s.tagline, { opacity: taglineOpacity }]}>
                feel the buzz. stay connected.
            </Animated.Text>

        </Animated.View>
    );
}

const s = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // All rings + logo go here; they all center on the same point
    centerStack: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    ring: {
        position: 'absolute',
        borderWidth: 1.5,
        borderColor: Colors.accent,
    },

    // Just the letter, no card
    logo: {
        fontFamily: Typography.pixel,
        fontSize: 100,
        color: Colors.accent,
        includeFontPadding: false,
        textAlign: 'center',
    },

    title: {
        fontFamily: Typography.pixel,
        fontSize: 24,
        color: Colors.accent,
        letterSpacing: 10,
        marginTop: 40,
    },

    tagline: {
        fontFamily: Typography.body,
        fontSize: 12,
        color: Colors.textSecondary,
        letterSpacing: 1.5,
        marginTop: 10,
    },
});
