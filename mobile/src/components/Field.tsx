import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Animated, StyleSheet, Dimensions } from 'react-native';
import { Colors, Typography, Radius } from '../theme';

const { height: SCREEN_H } = Dimensions.get('window');

const getResponsiveValue = (small: number, medium: number, large: number) => {
    if (SCREEN_H < 700) return small;
    if (SCREEN_H < 850) return medium;
    return large;
};

export function Field({
    label, value, onChange, placeholder, secure, keyboardType,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    secure?: boolean;
    keyboardType?: 'email-address' | 'default';
}) {
    const [focused, setFocused] = useState(false);
    const borderAnim = useRef(new Animated.Value(0)).current;

    const focus = () => {
        setFocused(true);
        Animated.timing(borderAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
    };
    const blur = () => {
        setFocused(false);
        Animated.timing(borderAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
    };

    const borderColor = borderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [Colors.cardBorder, Colors.accent],
    });

    return (
        <View style={f.group}>
            <Text style={f.label}>{label}</Text>
            <Animated.View style={[f.box, { borderColor }]}>
                <TextInput
                    style={f.input}
                    value={value}
                    onChangeText={onChange}
                    onFocus={focus}
                    onBlur={blur}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.textMuted}
                    secureTextEntry={secure}
                    keyboardType={keyboardType ?? 'default'}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
            </Animated.View>
        </View>
    );
}

const f = StyleSheet.create({
    group: { marginBottom: getResponsiveValue(12, 14, 16) },
    label: {
        fontFamily: Typography.pixel,
        fontSize: getResponsiveValue(9, 10, 11),
        color: Colors.textSecondary,
        letterSpacing: 1.5,
        marginBottom: getResponsiveValue(6, 8, 8),
    },
    box: {
        backgroundColor: Colors.surface,
        borderRadius: Radius.md,
        borderWidth: 1.5,
        height: getResponsiveValue(48, 52, 56),
        paddingHorizontal: getResponsiveValue(14, 16, 18),
        justifyContent: 'center',
    },
    input: {
        color: Colors.textPrimary,
        fontFamily: Typography.body,
        fontSize: getResponsiveValue(14, 15, 16),
    },
});
