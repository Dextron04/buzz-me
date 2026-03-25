import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../theme';
import BuzzScreen from '../screens/BuzzScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { TabBar, TabName } from '../components/TabBar';

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
                return <SettingsScreen />;
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
