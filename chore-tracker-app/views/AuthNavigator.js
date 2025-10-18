import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import Screens
import LoginScreen from './LoginScreen';
import SignupScreen from './Signup';
import ForgotPasswordScreen from './ForgotPassword';

const Stack = createStackNavigator();

const AuthNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Sign In' }} />
            <Stack.Screen name="Signup" component={SignupScreen} options={{ title: 'Create Account' }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Reset Password' }} />
        </Stack.Navigator>
    );
};

export default AuthNavigator;