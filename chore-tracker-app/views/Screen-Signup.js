import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { register } from '../services/app';
import { AuthContext } from '../components/AuthContext';

const SignupScreen = () => {
    const navigation = useNavigation();
    const { signIn } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');

    const handleSignup = async () => {
        try {
            const response = await register(email, password, fullName);
            const { token, user } = response;
            
            // 1. Store the token and user data globally
            await signIn(token, user); 
            
            // 2. Role-Based Onboarding Logic
            if (user.role === 'supervisor') {
                navigation.navigate('FamilyCreation');
            } else {
                navigation.navigate('FamilyJoin');
            }

        } catch (error) {
            Alert.alert('Signup Failed', error.data?.error || 'Could not register user.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button
                title="Register"
                onPress={handleSignup}
            />
            <Button
                title="Already have an account? Sign In"
                onPress={() => navigation.navigate('Login')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center'
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 10
    },
});

export default SignupScreen;