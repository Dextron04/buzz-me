import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '../theme';
import BuzzScreen from '../screens/BuzzScreen';
import HistoryScreen from '../screens/HistoryScreen';
import { TabBar, TabName } from '../components/TabBar';

// ─── Settings Placeholder (replaced in Phase 2) ──────────────────────────────
function SettingsPlaceholder() {
    return (
        <View style={p.container}>
            <Text style={p.label}>SETTINGS</Text>
            <Text style={p.sub}>Coming in Phase 2</Text>
        </View>
    );
}

const p = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontFamily: Typography.pixel,
        fontSize: 16,
        color: Colors.textSecondary,
        letterSpacing: 3,
        marginBottom: 8,
    },
    sub: {
        fontFamily: Typography.pixel,
        fontSize: 10,
        color: Colors.textMuted,
        letterSpacing: 1,
    },
});

// ─── Tab Navigator ────────────────────────────────────────────────────────────
export function TabNavigator() {
    const [activeTab, setActiveTab] = useState<TabName>('Home');

    const renderScreen = () => {
        switch (activeTab) {
            case 'Home':
                return <BuzzScreen />;
            case 'History':
                return <HistoryScreen />;
            case 'Settings':
                return <SettingsPlaceholder />;
            default:
                return <BuzzScreen />;
        }
    };

    return (
        <View style={s.container}>
            {renderScreen()}
            <TabBar activeTab={activeTab} onNavigate={setActiveTab} />
        </View>
    );
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
});
