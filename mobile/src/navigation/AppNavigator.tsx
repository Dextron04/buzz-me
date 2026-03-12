import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '../theme';

// Screens
import LoginScreen from '../screens/LoginScreen';
import BuzzScreen from '../screens/BuzzScreen';

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
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
                <Stack.Screen
                    name="Login"
                >
                    {(props) => (
                        <LoginScreen
                            onLogin={() => props.navigation.navigate('Home')}
                            onRegister={() => props.navigation.navigate('Home')}
                        />
                    )}
                </Stack.Screen>
                <Stack.Screen name="Home" component={BuzzScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
