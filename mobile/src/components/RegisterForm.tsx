import React from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Field } from './Field';
import { Colors, Typography, Radius } from '../theme';

import { getResponsiveValue } from '../utils/responsive';

export function RegisterForm({
    name, setName, email, setEmail, password, setPassword,
    confirmPassword, setConfirmPassword, onSubmit, btnScale, pressIn, pressOut
}: {
    name: string; setName: (n: string) => void;
    email: string; setEmail: (e: string) => void;
    password: string; setPassword: (p: string) => void;
    confirmPassword: string; setConfirmPassword: (p: string) => void;
    onSubmit: () => void;
    btnScale: Animated.Value;
    pressIn: () => void; pressOut: () => void;
}) {
    return (
        <View style={{ width: '100%' }}>
            <Field label="NAME" value={name} onChange={setName} placeholder="Your name" />
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
            <Field
                label="CONFIRM PASSWORD"
                value={confirmPassword}
                onChange={setConfirmPassword}
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
                    <Text style={s.primaryBtnText}>Create Account</Text>
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
