import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Animated,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../theme';

// ─── Mock Data ───────────────────────────────────────────────────────────────
const MOCK_HISTORY: Array<{ id: string; direction: 'sent' | 'received'; timestamp: string }> = [
    { id: '1', direction: 'sent', timestamp: '2 min ago' },
    { id: '2', direction: 'received', timestamp: '15 min ago' },
    { id: '3', direction: 'sent', timestamp: '1 hour ago' },
    { id: '4', direction: 'received', timestamp: '3 hours ago' },
    { id: '5', direction: 'sent', timestamp: 'Yesterday' },
    { id: '6', direction: 'received', timestamp: 'Yesterday' },
    { id: '7', direction: 'sent', timestamp: '2 days ago' },
    { id: '8', direction: 'received', timestamp: '2 days ago' },
    { id: '9', direction: 'sent', timestamp: '3 days ago' },
    { id: '10', direction: 'received', timestamp: '4 days ago' },
];

const MOCK_PARTNER = 'Sarah';
const MOCK_WEEK_COUNT = 42;

// ─── BuzzEntry Sub-Component ─────────────────────────────────────────────────
function BuzzEntry({
    direction,
    partner,
    timestamp,
}: {
    direction: 'sent' | 'received';
    partner: string;
    timestamp: string;
}) {
    const isSent = direction === 'sent';
    const label = isSent ? `You buzzed ${partner}` : `${partner} buzzed you`;
    const dotColor = isSent ? Colors.accent : '#666666';

    return (
        <View style={e.row}>
            <View style={[e.dot, { backgroundColor: dotColor }]} />
            <View style={e.content}>
                <Text style={[e.label, isSent && e.sentLabel]}>{label}</Text>
                <Text style={e.timestamp}>{timestamp}</Text>
            </View>
            <View style={e.arrow}>
                <Text style={{ color: dotColor, fontFamily: Typography.pixel, fontSize: 12 }}>
                    {isSent ? '→' : '←'}
                </Text>
            </View>
        </View>
    );
}

// ─── History Screen ──────────────────────────────────────────────────────────
export default function HistoryScreen() {
    const headerOpacity = useRef(new Animated.Value(0)).current;
    const listOpacity = useRef(new Animated.Value(0)).current;
    const listTranslateY = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(headerOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.parallel([
                Animated.timing(listOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(listTranslateY, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, []);

    return (
        <View style={s.root}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={s.safe}>

                {/* Header */}
                <Animated.View style={[s.header, { opacity: headerOpacity }]}>
                    <Text style={s.headerTitle}>HISTORY</Text>
                    <View style={s.weekBadge}>
                        <Text style={s.weekText}>{MOCK_WEEK_COUNT} buzzes 💛</Text>
                    </View>
                </Animated.View>

                {/* Section Label */}
                <Animated.View style={{ opacity: headerOpacity }}>
                    <Text style={s.sectionLabel}>THIS WEEK</Text>
                </Animated.View>

                {/* Buzz List */}
                <Animated.ScrollView
                    style={[
                        s.list,
                        {
                            opacity: listOpacity,
                            transform: [{ translateY: listTranslateY }],
                        },
                    ]}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 120 }}
                >
                    {MOCK_HISTORY.map((item) => (
                        <BuzzEntry
                            key={item.id}
                            direction={item.direction}
                            partner={MOCK_PARTNER}
                            timestamp={item.timestamp}
                        />
                    ))}
                </Animated.ScrollView>

            </SafeAreaView>
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.sm,
    },
    headerTitle: {
        fontFamily: Typography.pixel,
        fontSize: 20,
        color: Colors.textPrimary,
        letterSpacing: 3,
    },
    weekBadge: {
        backgroundColor: 'rgba(225,255,1,0.08)',
        borderRadius: Radius.full,
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: 'rgba(225,255,1,0.25)',
    },
    weekText: {
        fontFamily: Typography.pixel,
        fontSize: 11,
        color: Colors.accent,
    },
    sectionLabel: {
        fontFamily: Typography.pixel,
        fontSize: 10,
        color: Colors.textSecondary,
        letterSpacing: 2,
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.sm,
        opacity: 0.6,
    },
    list: {
        flex: 1,
    },
});

const e = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 14,
    },
    content: {
        flex: 1,
    },
    label: {
        fontFamily: Typography.pixel,
        fontSize: 13,
        color: Colors.textSecondary,
    },
    sentLabel: {
        color: Colors.textPrimary,
    },
    timestamp: {
        fontFamily: Typography.pixel,
        fontSize: 10,
        color: Colors.textSecondary,
        marginTop: 3,
        opacity: 0.6,
    },
    arrow: {
        width: 24,
        alignItems: 'center',
    },
});
