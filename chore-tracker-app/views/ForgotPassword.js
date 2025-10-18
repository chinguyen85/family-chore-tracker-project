import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { forgotPassword } from '../services/app';

const ForgotPasswordScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePasswordReset = async () => {
        // Validation
        if (!email || !newPassword || !confirmPassword) {
            return Alert.alert('Error', 'Please fill in all fields.');
        }
        if (newPassword !== confirmPassword) {
            return Alert.alert('Error', 'New password and confirmation do not match.');
        }

        setLoading(true);
        try {
            // Call the API function
            await forgotPassword(email, newPassword);
            
            Alert.alert(
                'Success!', 
                'Your password has been reset. Please log in with your new password.',
                [{
                    text: 'Go to Login',
                    onPress: () => navigation.navigate('Login')
                }]
            );
        } catch (error) {
            console.error('Password Reset Error:', error);
            // Display specific error from the backend if available
            Alert.alert('Reset Failed', error.data?.error || 'Could not reset password. Check your email address.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Password Reset</Text>
            <Text style={styles.subtitle}>Enter your email and new password to reset your account access</Text>

            <TextInput
                style={styles.input}
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
            />
            
            <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />

            <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} 
                onPress={handlePasswordReset} 
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Reset Password</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.loginLink} 
                onPress={() => navigation.navigate('Login')}
            >
                <Text style={styles.loginText}>Back to Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
        button: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 15,
    },
    buttonDisabled: {
        backgroundColor: '#999',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    loginLink: {
        marginTop: 30,
        alignSelf: 'center',
    },
    loginText: {
        color: '#007AFF',
        fontSize: 16,
    }
});

export default ForgotPasswordScreen;