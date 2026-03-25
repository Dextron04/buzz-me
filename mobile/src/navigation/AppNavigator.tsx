import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '../theme';

// Screens & Navigators
import LoginScreen from '../screens/LoginScreen';
import PairingScreen from '../screens/PairingScreen';
import { TabNavigator } from './TabNavigator';

export type RootStackParamList = {
    Login: undefined;
    Tabs: undefined;
    Pair: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: Colors.background },
                    animation: 'fade_from_bottom',
                }}
            >
                <Stack.Screen name="Login">
                    {(props) => (
                        <LoginScreen
                            onLogin={() => props.navigation.navigate('Tabs')}
                            onRegister={() => props.navigation.navigate('Tabs')}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen name="Tabs" component={TabNavigator} />
                <Stack.Screen name="Pair" component={PairingScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
