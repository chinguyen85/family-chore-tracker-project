import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import Screens
import LoginScreen from './LoginScreen';
import SignupScreen from './Screen_Signup';
import FamilyCreationScreen from './Screen_FamilyCreation'; // New screen for supervisors
import FamilyJoinScreen from './Screen_FamilyJoin'; // New screen for members
import ForgotPasswordScreen from './Screen_ForgotPassword';

const Stack = createStackNavigator();

const AuthNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Sign In' }} />
            <Stack.Screen name="Signup" component={SignupScreen} options={{ title: 'Create Account' }} />
            <Stack.Screen name="FamilyCreation" component={FamilyCreationScreen} options={{ title: 'Create Family Group' }} />
                        <Stack.Screen name="FamilyJoin" component={FamilyJoinScreen} options={{ title: 'Join Family Group' }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Reset Password' }} />
        </Stack.Navigator>
    );
};

export default AuthNavigator;