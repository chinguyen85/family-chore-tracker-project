import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { register } from '../services/app';
import { AuthContext } from '../components/authContext';

const SignupScreen = () => {
    const navigation = useNavigation();
    const { logIn } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [selectedRole, setSelectedRole] = useState('Member');

    const handleSignup = async () => {
        try {
            const response = await register({ email, password, fullName, role: selectedRole });
            const { token, user } = response;
            
            // 1. Store the token and user data globally
            await logIn(token, user); 
            
            // 2. Role-Based Onboarding Logic
            if (user.role === 'Supervisor') {
                navigation.navigate('FamilyCreation');
            } else {
                navigation.navigate('FamilyJoin');
            }

        } catch (error) {
            console.error('Full Signup Error Object:', error);
            Alert.alert('Signup Failed', error.data?.error || 'Could not register user.');
        }
    };

    const RoleOption = ({ role, label }) => (
        <TouchableOpacity style={styles.radioContainer} onPress={() => setSelectedRole(role)} >
            <Ionicons
                name={selectedRole === role ? 'radio-button-on' : 'radio-button-off'}
                size={24}
                color={selectedRole === role ? '#fa8d7aff' : '#888'}
            />
            <Text style={styles.radioLabel}>{label}</Text>
        </TouchableOpacity>
    )

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <View style={styles.inputContainer}>
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
            </View>
            
            <Text style={styles.roleHeader}>Select Your Role</Text>
            <View style={styles.roleSelector}>
                <RoleOption role="Supervisor" label="Supervisor" />
                <RoleOption role="Member" label="Member" />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginLink}
                onPress={() => navigation.navigate('Login')}
            >
                <Text style={styles.loginText}>Already have an account? Sign In</Text>
            </TouchableOpacity>
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
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
        color: '#333',
    },
    inputContainer: {
        marginBottom: 0,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
        marginBottom: 10,
    },
    roleHeader: {
        fontSize: 16,
        marginVertical: 8,
        color: '#333',
        fontWeight: '500',
    },
    roleSelector: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
        marginBottom: 10,
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    radioLabel: {
        fontSize: 16,
        marginLeft: 10,
        color: '#333',
    },
    button: {
        backgroundColor: '#fa8d7aff',
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
        marginTop: 20,
        alignSelf: 'center',
    },
    loginText: {
        color: '#fa8d7aff',
        fontSize: 16,
    }
});

export default SignupScreen;