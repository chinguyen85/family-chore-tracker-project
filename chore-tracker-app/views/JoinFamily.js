import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';

import { AuthContext } from '../components/authContext';
import { joinFamily } from '../services/app';

const FamilyJoinScreen = () => {
    const navigation = useNavigation();
    const { state, updateUser } = useContext(AuthContext);
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
            await joinFamily(inviteCode.toUpperCase(), userToken);

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
                            routes: [{ name: 'AppStack' }],
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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Join a Family</Text>
            <Text style={styles.subtitle}>
                Ask your Family Supervisor for the 6-digit invite code.
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Enter an Invite Code"
                value={inviteCode}
                onChangeText={text => setInviteCode(text.toUpperCase())}
                autoCorrect={false}
                autoCapitalize="characters"
                maxLength={6}
                keyboardType="default"
            />
            
            <Button
                title={loading ? "Joining..." : "Join Group"}
                onPress={handleJoinFamily}
                disabled={loading || inviteCode.length !== 6}
            />

            <TouchableOpacity 
                style={styles.logoutLink}
                onPress={() => Alert.alert('Need a Code', 'Please ask your family supervisor for the invite code.')}
            >
                <Text style={styles.logoutText}>Need help finding your code?</Text>
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
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 40,
        textAlign: 'center',
    },
    input: {
        height: 55,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 20,
        marginBottom: 20,
        fontSize: 18,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    logoutLink: {
        marginTop: 30,
        alignSelf: 'center',
    },
    logoutText: {
        color: '#A0A0A0', 
        fontSize: 14,
    }
});

export default FamilyJoinScreen;