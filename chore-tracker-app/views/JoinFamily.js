import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';

import { AuthContext } from '../components/authContext';
import { joinFamily } from '../services/app';

const FamilyJoinScreen = () => {
    const navigation = useNavigation();
    const { state, updateUser, logOut } = useContext(AuthContext);
    const { userToken } = state;
    const [inviteCode, setInviteCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleJoinFamily = async () => {
        if (!inviteCode) {
            return Alert.alert('Error', 'Please enter the 6-digit invite code.');
        }

        setLoading(true);
        try {
            // Call the API to join the family
            const response = await joinFamily(inviteCode.toUpperCase(), userToken);

            // Update the AuthContext state with new familyId
            await updateUser({ familyId: response.data.familyId });
            
            // Show message and navigate to the main app stack
            Alert.alert(
                'Success!',
                'You have successfully joined the family group. You can now use the main app features.',
                [{
                    text: 'Continue to App',
                    onPress: () => navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: 'MainNavigator' }],
                        })
                    ),
                }]
            );
        } catch (error) {
            console.error('Join Failed:', error);
            Alert.alert('Join Failed', error.data?.error || 'Could not join group. Check the invite code.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            // Use authContext.logOut to clear storage and state
            await logOut();
        } catch (err) {
            console.error('Logout failed:', err);
            Alert.alert('Error', 'Could not log out. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Join a Family</Text>
            <Text style={styles.subtitle}>
                Enter the 6-digit invite code below
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Enter an Invite Code"
                value={inviteCode}
                onChangeText={text => setInviteCode(text.toUpperCase())}
                maxLength={6}
            />

            {inviteCode.length > 0 && inviteCode.length !== 6 && (
                <Text style={{ color: '#D64545', textAlign: 'center', marginBottom: 8 }}>
                    Invite code must be 6 characters.
                </Text>
            )}

            <TouchableOpacity
                style={[
                    styles.button,
                    (loading || inviteCode.length !== 6) ? styles.buttonDisabled : null,
                ]}
                onPress={handleJoinFamily}
                disabled={loading || inviteCode.length !== 6}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>{loading ? 'Joining...' : 'Join Group'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.helpLink}
                onPress={() => Alert.alert('Need a Code', 'Please ask your family supervisor for the invite code.')}
            >
                <Text style={styles.helpText}>Need help finding your code?</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.helpLink, { marginTop: 12 }]}
                onPress={handleLogout}
            >
                <Text style={styles.helpText}>OR Log Out</Text>
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
        marginBottom: 40,
        textAlign: 'center',
    },
    input: {
        height: 55,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 20,
        marginBottom: 20,
        fontSize: 18,
        textAlign: 'center',
        textTransform: 'uppercase',
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
    helpLink: {
        marginTop: 30,
        alignSelf: 'center',
    },
    helpText: {
        color: '#007AFF', 
        fontSize: 14,
        textDecorationLine: 'underline',
        textDecorationColor: '#007AFF'
    }
});

export default FamilyJoinScreen;