import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';

import { createFamily } from '../services/app';
import { AuthContext } from '../components/authContext';

const FamilyCreationScreen = () => {
    const navigation = useNavigation();
    const { state, updateUser } = useContext(AuthContext);
    const { userToken, user } = state;
    const [familyName, setFamilyName] = useState(`${user.fullName}'s Family`); // Default name suggestion

    const handleCreateFamily = async () => {
        try {
            const response = await createFamily(familyName, userToken);
            const { data } = response;
            
            // 1. Update the local user state and storage with the new familyId
            await updateUser({ familyId: data.id });
            
            // 2. Show success message with invite code
            Alert.alert(
                'Family Created!',
                `Your invite code is: ${data.inviteCode}\nShare this with family members to let them join.`,
                [{
                    text: 'Continue to App',
                    onPress: () => {
                        // Do nothing here because the App root component handle to render MainNavigator already
                        },
                }]
            );
        } catch (error) {
            Alert.alert('Creation Failed', error.data?.error || 'Could not create family group.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome, Supervisor!</Text>
            <Text style={styles.subtitle}>To begin, create your family group name</Text>
            <TextInput
                style={styles.input}
                placeholder="The Smith Family"
                value={familyName}
                onChangeText={setFamilyName}
            />
            <TouchableOpacity style={[styles.button, (!familyName ? styles.buttonDisabled : null)]}
                onPress={handleCreateFamily}
                disabled={!familyName}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>Create Group</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        backgroundColor: '#f9f9f9',
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
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 20,
        marginBottom: 20,
        fontSize: 16,
        textAlign: 'center',
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
});

export default FamilyCreationScreen;