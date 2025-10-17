import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
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
                    // Reset navigation stack to prevent returning to signup screens
                    onPress: () => navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: 'AppStack' }],
                        })
                    ),
                }]
            );
        } catch (error) {
            Alert.alert('Creation Failed', error.data?.error || 'Could not create family group.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome, Supervisor!</Text>
            <Text style={styles.label}>To begin, create your family group name:</Text>
            <TextInput
                style={styles.input}
                placeholder="The Smith Family"
                value={familyName}
                onChangeText={setFamilyName}
            />
            <Button
                title="Create Group"
                onPress={handleCreateFamily}
                disabled={!familyName}
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
    label: {
        marginBottom: 10,
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

export default FamilyCreationScreen;