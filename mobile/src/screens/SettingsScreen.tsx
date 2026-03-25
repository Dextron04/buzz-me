import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, SafeAreaView, StatusBar } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../theme';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
    const navigation = useNavigation<any>();
    
    // Mock States
    const [partnerConnected, setPartnerConnected] = useState(true);
    const [intensity, setIntensity] = useState(70);
    const [pattern, setPattern] = useState<'Short' | 'Pulse' | 'Heartbeat'>('Pulse');

    const renderPatternBtn = (lbl: 'Short' | 'Pulse' | 'Heartbeat') => {
        const active = pattern === lbl;
        return (
            <TouchableOpacity 
                style={[s.patternBtn, active && s.patternBtnActive]} 
                onPress={() => setPattern(lbl)}
                activeOpacity={0.7}
            >
                <Text style={[s.patternText, active && s.patternTextActive]}>{lbl}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={s.root}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={s.safe}>
                
                {/* Header */}
                <View style={s.header}>
                    <Text style={s.title}>SETTINGS</Text>
                </View>

                {/* Partner Section */}
                <View style={s.section}>
                    <Text style={s.sectionTitle}>PARTNER</Text>
                    <View style={s.card}>
                        <View style={s.row}>
                            <View style={s.partnerInfo}>
                                <View style={[s.dot, partnerConnected ? s.dotOnline : s.dotOffline]} />
                                <Text style={s.partnerName}>Sarah</Text>
                            </View>
                            <Switch 
                                value={partnerConnected} 
                                onValueChange={setPartnerConnected}
                                trackColor={{ false: '#333', true: Colors.accent }}
                                thumbColor="#FFF"
                            />
                        </View>
                        <TouchableOpacity style={s.pairBtn} onPress={() => navigation.navigate('Pair')}>
                            <Text style={s.pairBtnText}>Pair New Partner</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Vibration Settings */}
                <View style={s.section}>
                    <Text style={s.sectionTitle}>VIBRATION</Text>
                    <View style={s.card}>
                        <View style={s.sliderRow}>
                            <Text style={s.label}>Intensity</Text>
                            <Text style={s.valueText}>{intensity}%</Text>
                        </View>
                        {/* Mock Slider Visual */}
                        <View style={s.sliderTrack}>
                            <View style={[s.sliderFill, { width: `${intensity}%` }]} />
                        </View>

                        <Text style={[s.label, { marginTop: Spacing.xl, marginBottom: Spacing.md }]}>Pattern</Text>
                        <View style={s.patternGroup}>
                            {renderPatternBtn('Short')}
                            {renderPatternBtn('Pulse')}
                            {renderPatternBtn('Heartbeat')}
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
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.lg,
    },
    title: {
        fontFamily: Typography.pixel,
        fontSize: 20,
        color: Colors.textPrimary,
        letterSpacing: 3,
    },
    section: {
        marginBottom: Spacing.xxl,
        paddingHorizontal: Spacing.xl,
    },
    sectionTitle: {
        fontFamily: Typography.pixel,
        fontSize: 10,
        color: Colors.textSecondary,
        letterSpacing: 2,
        marginBottom: Spacing.md,
        opacity: 0.6,
    },
    card: {
        backgroundColor: Colors.surface,
        borderRadius: 24,
        padding: Spacing.lg,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.xl,
    },
    partnerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    dotOnline: {
        backgroundColor: Colors.accent,
        shadowColor: Colors.accent,
        shadowOpacity: 0.5,
        shadowRadius: 6,
    },
    dotOffline: {
        backgroundColor: '#666',
    },
    partnerName: {
        fontFamily: Typography.pixel,
        fontSize: 16,
        color: Colors.textPrimary,
    },
    pairBtn: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingVertical: 14,
        borderRadius: Radius.full,
        alignItems: 'center',
    },
    pairBtnText: {
        fontFamily: Typography.pixel,
        fontSize: 11,
        color: Colors.textSecondary,
        letterSpacing: 1,
    },
    sliderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.sm,
    },
    label: {
        fontFamily: Typography.pixel,
        fontSize: 11,
        color: Colors.textSecondary,
    },
    valueText: {
        fontFamily: Typography.pixel,
        fontSize: 11,
        color: Colors.accent,
    },
    sliderTrack: {
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    sliderFill: {
        height: '100%',
        backgroundColor: Colors.accent,
    },
    patternGroup: {
        flexDirection: 'row',
        gap: 12,
    },
    patternBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: Radius.full,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
    },
    patternBtnActive: {
        borderColor: Colors.accent,
        backgroundColor: 'rgba(225,255,1,0.05)',
    },
    patternText: {
        fontFamily: Typography.pixel,
        fontSize: 9,
        color: Colors.textSecondary,
    },
    patternTextActive: {
        color: Colors.accent,
    },
});
