import React from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions } from 'react-native';
import { Field } from './Field';
import { Colors, Typography, Radius } from '../theme';

const { height: SCREEN_H } = Dimensions.get('window');

const getResponsiveValue = (small: number, medium: number, large: number) => {
    if (SCREEN_H < 700) return small;
    if (SCREEN_H < 850) return medium;
    return large;
};

export function LoginForm({
    email, setEmail, password, setPassword, onSubmit, btnScale, pressIn, pressOut
}: {
    email: string; setEmail: (e: string) => void;
    password: string; setPassword: (p: string) => void;
    onSubmit: () => void;
    btnScale: Animated.Value;
    pressIn: () => void; pressOut: () => void;
}) {
    return (
        <View style={{ width: '100%' }}>
            <Field
                label="EMAIL"
                value={email}
                onChange={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
            />
            <Field
                label="PASSWORD"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
                secure
            />
            <Animated.View style={[s.submitWrap, { transform: [{ scale: btnScale }] }]}>
                <TouchableOpacity
                    style={s.primaryBtn}
                    onPress={onSubmit}
                    onPressIn={pressIn} onPressOut={pressOut}
                    activeOpacity={1}
                >
                    <Text style={s.primaryBtnText}>Sign In</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const s = StyleSheet.create({
    submitWrap: { marginTop: getResponsiveValue(6, 8, 10) },
    primaryBtn: {
        backgroundColor: Colors.accent,
        borderRadius: Radius.full,
        height: getResponsiveValue(52, 58, 62),
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
    },
    primaryBtnText: {
        fontFamily: Typography.bodyBold,
        fontSize: getResponsiveValue(15, 16, 17),
        color: Colors.background,
    },
});
