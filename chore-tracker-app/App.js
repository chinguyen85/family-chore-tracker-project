import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, AuthContext } from './components/authContext';

import AuthNavigator from './views/AuthNavigator';
import MainNavigator from './views/MainNavigator';
import FamilyCreationScreen from './views/CreateFamily';
import FamilyJoinScreen from './views/JoinFamily';

function AppContent() {
  const { state } = useContext(AuthContext);

  if (state.isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      {!state.userToken ? (
        <AuthNavigator /> // Show AuthNavigator if users not login yet
      ) : (
        !state.user.familyId ? (
          state.user.role === 'Supervisor' ? (
            <FamilyCreationScreen />
          ) : (
            <FamilyJoinScreen />
          ) // Render the appropriate screen component based on role if logged in but no familyId
        ) : (
          <MainNavigator /> // Show main app tabs if logged in with familyId
        )
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
