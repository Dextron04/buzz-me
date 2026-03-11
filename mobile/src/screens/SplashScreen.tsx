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

// Pixel points for the 'B' logo based on the provided SVG
const PIXEL_POINTS = [
    { x: 0, y: 0 }, { x: 25, y: 0 }, { x: 50, y: 0 }, { x: 75, y: 0 },
    { x: 0, y: 25 }, { x: 100, y: 25 },
    { x: 0, y: 50 }, { x: 100, y: 50 },
    { x: 0, y: 75 }, { x: 25, y: 75 }, { x: 50, y: 75 }, { x: 75, y: 75 },
    { x: 0, y: 100 }, { x: 100, y: 100 },
    { x: 0, y: 125 }, { x: 100, y: 125 },
    { x: 0, y: 150 }, { x: 25, y: 150 }, { x: 50, y: 150 }, { x: 75, y: 150 },
];

function PixelLogo({ scale, opacity }: { scale: Animated.Value; opacity: Animated.Value }) {
    const pixelAnims = useRef(PIXEL_POINTS.map(() => new Animated.Value(0))).current;

    useEffect(() => {
        const animations = pixelAnims.map((anim, i) => {
            return Animated.sequence([
                Animated.delay(i * 30),
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 400,
                    easing: Easing.out(Easing.back(1.5)),
                    useNativeDriver: true,
                }),
            ]);
        });

        Animated.parallel(animations).start();

        // Staggered haptics to match the "thuds"
        pixelAnims.forEach((_, i) => {
            if (i % 4 === 0) {
                setTimeout(() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }, (i * 30) + 350);
            }
        });
    }, []);

    return (
        <Animated.View style={[s.logoContainer, { transform: [{ scale }], opacity }]}>
            {PIXEL_POINTS.map((point, i) => (
                <Animated.View
                    key={i}
                    style={[
                        s.pixel,
                        {
                            left: point.x,
                            top: point.y,
                            opacity: pixelAnims[i],
                            transform: [
                                {
                                    scale: pixelAnims[i].interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0, 1],
                                    }),
                                },
                                {
                                    translateY: pixelAnims[i].interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [-20, 0],
                                    }),
                                },
                            ],
                        },
                    ]}
                />
            ))}
        </Animated.View>
    );
}

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
    const logoScale = useRef(new Animated.Value(0.8)).current;
    const logoOpacity = useRef(new Animated.Value(1)).current;
    const titleOpacity = useRef(new Animated.Value(0)).current;
    const titleY = useRef(new Animated.Value(14)).current;
    const taglineOpacity = useRef(new Animated.Value(0)).current;
    const screenOpacity = useRef(new Animated.Value(1)).current;

    const ringAnims = useRef(
        Array.from({ length: NUM_RINGS }, () => new Animated.Value(0))
    ).current;

    useEffect(() => {
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
            Animated.delay(1200),
            Animated.parallel([
                Animated.timing(titleOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
                Animated.timing(titleY, { toValue: 0, duration: 450, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            ]),
        ]).start();

        // Tagline
        Animated.sequence([
            Animated.delay(1600),
            Animated.timing(taglineOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        ]).start();

        // Fade out
        const t = setTimeout(() => {
            Animated.timing(screenOpacity, { toValue: 0, duration: 450, useNativeDriver: true })
                .start(() => onFinish());
        }, 3500);

        return () => clearTimeout(t);
    }, []);

    return (
        <Animated.View style={[s.screen, { opacity: screenOpacity }]}>

            {/* Single centered stack — rings + logo share same origin */}
            <View style={s.centerStack}>
                {/* Rings rendered behind logo */}
                {ringAnims.map((anim, i) => {
                    const size = 120 + i * 52;
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

                <PixelLogo scale={logoScale} opacity={logoOpacity} />
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

    centerStack: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 170, // Consistent box for the assembly
    },

    ring: {
        position: 'absolute',
        borderWidth: 1.5,
        borderColor: Colors.accent,
    },

    logoContainer: {
        width: 120,
        height: 170,
        position: 'relative',
    },

    pixel: {
        position: 'absolute',
        width: 20,
        height: 20,
        backgroundColor: Colors.accent,
    },

    title: {
        fontFamily: Typography.pixel,
        fontSize: 24,
        color: Colors.accent,
        letterSpacing: 10,
        marginTop: 60,
    },

    tagline: {
        fontFamily: Typography.body,
        fontSize: 12,
        color: Colors.textSecondary,
        letterSpacing: 1.5,
        marginTop: 10,
    },
});
