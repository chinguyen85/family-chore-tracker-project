import React, { createContext, useState, useEffect, useMemo, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initial state and reducer
const initialState = {
    isLoading: true,
    isSignout: false,
    userToken: null,
    user: null, // Store user data including role and familyId
};

const authReducer = (prevState, action) => {
    switch (action.type) {
        case 'RESTORE_TOKEN':
            return {
                ...prevState,
                userToken: action.token,
                user: action.user,
                isLoading: false,
            };
        case 'LOG_IN':
            return {
                ...prevState,
                isSignout: false,
                userToken: action.token,
                user: action.user,
            };
        case 'UPDATE_USER':
            return {
                ...prevState,
                user: {
                    ...prevState.user,
                    ...action.userUpdates
                },
            };
        case 'LOG_OUT':
            return {
                ...prevState,
                isSignout: true,
                userToken: null,
                user: null,
            };
        default:
            return prevState;
    }
};

// Create context
export const AuthContext = createContext();

// Context provider
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check AsyncStorage for token on app startup
    useEffect(() => {
        const bootstrapAsync = async () => {
            let userToken = null;
            let userData = null;

            try {
                userToken = await AsyncStorage.getItem('userToken');
                const userJson = await AsyncStorage.getItem('userData');
                userData = userJson ? JSON.parse(userJson) : null;
            } catch (err) {
                // Restoring token failed
            }

            dispatch({ type: 'RESTORE_TOKEN', token: userToken, user: userData });
        };

        bootstrapAsync();
    }, []);

    const authContext = useMemo(
        () => ({
            logIn: async (token, user) => {
                await AsyncStorage.setItem('userToken', token);
                await AsyncStorage.setItem('userData', JSON.stringify(user));
                dispatch({ type: 'LOG_IN', token, user });
            },
            logOut: async () => {
                await AsyncStorage.removeItem('userToken');
                await AsyncStorage.removeItem('userData');
                dispatch({ type: 'LOG_OUT' });
            },
            updateUser: async (userUpdates) => {
                // Merge updates with existing data in storage and state
                const currentData = JSON.parse(await AsyncStorage.getItem('userData'));
                const newUserData = { ...currentData, ...userUpdates};
                await AsyncStorage.setItem('userData', JSON.stringify(newUserData));
                dispatch ({ type: 'UPDATE_USER', userUpdates});
            },
            state,
        }),
        [state]
    );

    return (
        <AuthContext.Provider value={authContext}>
            {children}
        </AuthContext.Provider>
    );
};

