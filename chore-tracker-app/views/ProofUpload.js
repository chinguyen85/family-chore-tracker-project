import React, { useState, useContext } from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import { AuthContext } from '../components/authContext';
import { submitProof } from '../services/app';

const ProofUploadScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { state } = useContext(AuthContext);
    const token = state.userToken;

    const { taskId, taskTitle } = route.params || {}; // Get taskId and taskTitle passed from the TaskList screen
    const [imageUri, setImageUri] = useState(null);
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    // IMAGE HANDLER
    const requestPermissions = async (type) => {
        let permission;
        if (type === 'camera') {
            permission = await ImagePicker.requestCameraPermissionsAsync();
        } else {
            permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        }

        if (permission.status !== 'granted') {
            Alert.alert('Permission Required', `We need ${type} access to use this feature.`);
            return false;
        }
        return true;
    };

    const pickImage = async (source) => {
        let granted = false;
        let launchFunction;

        if (source === 'camera') {
            granted = await requestPermissions('camera');
            launchFunction = ImagePicker.launchCameraAsync;
        } else {
            granted = await requestPermissions('gallery');
            launchFunction = ImagePicker.launchImageLibraryAsync;
        }

        if (!granted) return;

        let result = await ImagePicker.launchImageLibraryAsync({
            // mediaTypes: ImagePicker.MediaTypeOptions.Images,
            mediaTypes: [ImagePicker.MediaType.Images],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };
    
    // SUBMISSION HANDLER
    const handleSubmit = async () => {
        if (!imageUri) {
            return Alert.alert('Error', 'Please select a photo proof!');
        }
        setLoading(true);

        // Prepare data for FormData
        const formData = new FormData();
        
        // Append the image file type and name based on the server setup
        const uriParts = imageUri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        
        formData.append('proofImage', {
            uri: imageUri,
            name: `proof_${taskId}_${Date.now()}.${fileType}`,
            type: `image/${fileType}`, 
        });
        
        // Append other fields
        formData.append('notes', notes);
        formData.append('taskId', taskId);

        try {
            // Call API function
            await submitProof(formData, token);

            Alert.alert('Success!', 'Proof submitted for approval.', [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                },
            ]);
        } catch (error) {
            console.error('Proof submission failed:', error);
            const errorMsg = error.message || error.toString() || 'Could not submit proof.';
            Alert.alert('Submission Failed', errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Upload Proof</Text>
                <Text style={styles.subtitle}>
                    Task: <Text style={{fontWeight: 'bold'}}>{taskTitle}</Text>
                </Text>
            </View>

            {/* Image Preview */}
            <View style={styles.imageContainer}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Ionicons name="image-outline" size={40} color={styles.placeholderText.color} />
                        <Text style={styles.placeholderText}>No photo selected</Text>
                    </View>
                )}
            </View>

            {/* Photo Upload */}
            <View style={styles.photoUploadContainer}>
                <TouchableOpacity style={styles.uploadButton}
                    onPress={() => pickImage('camera')}
                    disabled={loading}
                >
                    <Ionicons name="camera-outline" size={40} color={styles.uploadButtonText.color} />
                    <Text style={styles.uploadButtonText}>Take Photo</Text>
                </TouchableOpacity>
                <View style={styles.separatorContainer}>
                    <Text style={styles.separatorText}>OR</Text>
                </View>
                <TouchableOpacity style={styles.uploadButton}
                    onPress={() => pickImage('gallery')}
                    disabled={loading}
                >
                    <Ionicons name="images-outline" size={40} color={styles.uploadButtonText.color} />
                    <Text style={styles.uploadButtonText}>Gallery Upload</Text>
                </TouchableOpacity>
            </View>

            {/* Notes Input */}
            <Text style={styles.labelText}>Notes (Optional)</Text>
            <TextInput
                style={[styles.input, styles.notesInput]}
                placeholder="Add any necessary notes for the supervisor..."
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                editable={!loading}
            />

            {/* Submit & Cancel Buttons */}
            <TouchableOpacity style={[styles.button, (loading || !imageUri) && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={loading || !imageUri}
            >
                {loading ? (
                    <ActivityIndicator color='#fff' />
                ) : (
                    <Text style={styles.buttonText}>Submit</Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton}
                onPress={() => navigation.goBack()}
                disabled={loading}
            >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>

        </ScrollView>
    );
};

// Local styles for specific layout adjustments
const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 30,
        paddingTop: 60,
        paddingBottom: 40,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
        headerContainer: {
        marginBottom: 20,
    },
    imageContainer: {
        marginBottom: 20,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ddd',
        height: 200,
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f9f9f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: '#999',
        marginTop: 5,
        fontSize: 14,
    },
    photoUploadContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    uploadButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        marginHorizontal: 5,
        borderRadius: 8,
        backgroundColor: '#E6E6E6',
    },
    uploadButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
    },
    labelText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    notesInput: {
        height: 100,
        textAlignVertical: 'top',
        marginBottom: 30,
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
    },
    separatorText: {
        width: 30,
        textAlign: 'center',
        color: '#999',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 20,
    },
    secondaryButtonText: {
        color: '#333',
        fontSize: 18,
        fontWeight: '600',
    },
    buttonDisabled: {
        backgroundColor: '#999',
    },
});

export default ProofUploadScreen;