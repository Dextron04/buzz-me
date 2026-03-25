import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography } from '../theme';

export type TabName = 'Home' | 'History' | 'Settings';

interface TabBarProps {
    activeTab: TabName;
    onNavigate: (tab: TabName) => void;
}

const TABS: Array<{ name: TabName; icon: string; iconOutline: string; label: string }> = [
    { name: 'Home', icon: 'home', iconOutline: 'home-outline', label: 'HOME' },
    { name: 'History', icon: 'time', iconOutline: 'time-outline', label: 'HISTORY' },
    { name: 'Settings', icon: 'settings', iconOutline: 'settings-outline', label: 'SETTINGS' },
];

export function TabBar({ activeTab, onNavigate }: TabBarProps) {
    return (
        <View style={s.wrapper} pointerEvents="box-none">
            <BlurView intensity={60} tint="dark" style={s.pill}>
                <View style={s.tabs}>
                    {TABS.map((tab) => {
                        const isActive = activeTab === tab.name;
                        return (
                            <TouchableOpacity
                                key={tab.name}
                                style={s.tab}
                                onPress={() => onNavigate(tab.name)}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name={(isActive ? tab.icon : tab.iconOutline) as any}
                                    size={18}
                                    color={isActive ? Colors.accent : Colors.textSecondary}
                                />
                                <Text style={[s.label, isActive && s.labelActive]}>
                                    {tab.label}
                                </Text>
                                {isActive && <View style={s.activeBar} />}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </BlurView>
        </View>
    );
}

const s = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 32,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 100,
    },
    pill: {
        borderRadius: 999,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    tabs: {
        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingVertical: 10,
    },
    tab: {
        alignItems: 'center',
        paddingHorizontal: 22,
        paddingVertical: 4,
        gap: 3,
    },
    label: {
        fontFamily: Typography.pixel,
        fontSize: 9,
        color: Colors.textSecondary,
        letterSpacing: 1,
    },
    labelActive: {
        color: Colors.accent,
    },
    activeBar: {
        position: 'absolute',
        bottom: -2,
        width: 20,
        height: 2,
        backgroundColor: Colors.accent,
        borderRadius: 1,
    },
});
