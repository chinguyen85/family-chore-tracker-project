import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, Text, Alert } from 'react-native';

import { AuthProvider, AuthContext } from './components/authContext';
import AuthNavigator from './views/AuthNavigator';
import TaskList from './views/TaskList';
import ParentHome from './views/SupervisorDashboard';
import CreateTask from './views/CreateTask';
import FamilyTaskList from './views/ViewTask';
import FamilyCreationScreen from './views/CreateFamily';
import FamilyJoinScreen from './views/JoinFamily';
import ProofUploadScreen from './views/ProofUpload';

const Stack = createStackNavigator();

// log out 
function LogoutButton() {
  const { logOut } = useContext(AuthContext);

  const handleLogout = async () => {
    Alert.alert(
      'Log out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log out',
          style: 'destructive',
          onPress: async () => {
            await logOut();
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16 }}>
      <Text style={{ color: '#F7AFA3', fontWeight: 'bold' }}>Log out</Text>
    </TouchableOpacity>
  );
}

// Supervisor log in
function SupervisorStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ParentHome" component={ParentHome} options={{ headerShown: true, title: 'Supervisor Dashboard', headerRight: () => <LogoutButton /> }} />
      <Stack.Screen name="CreateTask" component={CreateTask} options={{ headerShown: true, title: 'Create Task' }} />
      <Stack.Screen name="FamilyTaskList" component={FamilyTaskList} options={{ headerShown: true, title: 'View All Tasks' }} />
    </Stack.Navigator>
  );
}

// Member log in 
function MemberStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TaskList" component={TaskList} options={{ headerShown: true, title: 'Member Task List', headerRight: () => <LogoutButton /> }} />
      <Stack.Screen name="ProofUpload" component={ProofUploadScreen} options={{ headerShown: true, title: 'Upload Proof', headerRight: () => <LogoutButton /> }} />
    </Stack.Navigator>
  );
}

// Onboarding Stack
function OnboardingStack() {
  const { state } = useContext(AuthContext);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {state.user?.role === 'Supervisor' ? (
        <Stack.Screen name="CreateFamily" component={FamilyCreationScreen} />
      ) : (
        <Stack.Screen name="JoinFamily" component={FamilyJoinScreen} />
      )}
    </Stack.Navigator>
  )
}

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
          <OnboardingStack />// Render the appropriate screen component based on role if logged in but no familyId
        ) : (
          state.user?.role === 'Supervisor' ? (
            <SupervisorStack /> 
          ) : (
              <MemberStack />
          )
        ) // Show main app tabs based on user's role if logged in with familyId
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
