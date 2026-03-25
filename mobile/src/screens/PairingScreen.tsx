import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { Field } from '../components/Field';

export default function PairingScreen() {
    const navigation = useNavigation<any>();
    const [partnerCode, setPartnerCode] = useState('');

    return (
        <KeyboardAvoidingView 
            style={s.root} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <SafeAreaView style={s.safe}>
                
                {/* Header */}
                <View style={s.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
                        <Text style={s.backText}>←</Text>
                    </TouchableOpacity>
                    <Text style={s.title}>PAIRING</Text>
                    <View style={s.headerSpacer} />
                </View>

                {/* Content */}
                <View style={s.content}>
                    
                    {/* Your Code Section */}
                    <View style={s.section}>
                        <Text style={s.sectionTitle}>YOUR CODE</Text>
                        <View style={s.codeCard}>
                            <Text style={s.yourCode}>BUZZ-7X3K</Text>
                        </View>
                        <TouchableOpacity style={s.shareBtn} activeOpacity={0.7}>
                            <Text style={s.shareBtnText}>Share Code</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Partner Code Section */}
                    <View style={[s.section, { flex: 1, justifyContent: 'flex-end', paddingBottom: Spacing.xl }]}>
                        <Text style={s.sectionTitle}>ENTER PARTNER'S CODE</Text>
                        <Field 
                            label="Partner's Code"
                            placeholder="e.g. BUZZ-XXXX"
                            value={partnerCode}
                            onChange={setPartnerCode}
                            autoCapitalize="characters"
                        />
                        <TouchableOpacity 
                            style={[s.connectBtn, !partnerCode && s.connectBtnDisabled]} 
                            disabled={!partnerCode}
                            activeOpacity={0.8}
                        >
                            <Text style={[s.connectBtnText, !partnerCode && s.connectBtnTextDisabled]}>CONNECT</Text>
                        </TouchableOpacity>
                    </View>
                    
                </View>

            </SafeAreaView>
        </KeyboardAvoidingView>
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.lg,
    },
    backBtn: {
        padding: Spacing.sm,
        marginLeft: -Spacing.sm,
    },
    backText: {
        color: Colors.textPrimary,
        fontSize: 24,
    },
    title: {
        fontFamily: Typography.pixel,
        fontSize: 20,
        color: Colors.textPrimary,
        letterSpacing: 3,
    },
    headerSpacer: {
        width: 40,
    },
    content: {
        flex: 1,
        paddingHorizontal: Spacing.xl,
    },
    section: {
        marginTop: Spacing.xxl,
    },
    sectionTitle: {
        fontFamily: Typography.pixel,
        fontSize: 10,
        color: Colors.textSecondary,
        letterSpacing: 2,
        marginBottom: Spacing.md,
        opacity: 0.6,
        textAlign: 'center',
    },
    codeCard: {
        backgroundColor: 'rgba(225,255,1,0.05)',
        borderWidth: 1,
        borderColor: Colors.accent,
        borderRadius: 24,
        padding: Spacing.xl,
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    yourCode: {
        fontFamily: Typography.pixel,
        fontSize: 32,
        color: Colors.accent,
        letterSpacing: 4,
    },
    shareBtn: {
        backgroundColor: Colors.surface,
        paddingVertical: 16,
        borderRadius: Radius.full,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    shareBtnText: {
        fontFamily: Typography.pixel,
        fontSize: 12,
        color: Colors.textPrimary,
        letterSpacing: 1,
    },
    connectBtn: {
        backgroundColor: Colors.accent,
        paddingVertical: 18,
        borderRadius: Radius.full,
        alignItems: 'center',
        marginTop: Spacing.lg,
        shadowColor: Colors.accent,
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    connectBtnDisabled: {
        backgroundColor: Colors.surface,
        shadowOpacity: 0,
    },
    connectBtnText: {
        fontFamily: Typography.pixel,
        fontSize: 14,
        color: '#000',
        letterSpacing: 2,
    },
    connectBtnTextDisabled: {
        color: Colors.textMuted,
    },
});
