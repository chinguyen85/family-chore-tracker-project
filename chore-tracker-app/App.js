// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

//////////////////////////////////////

import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, Text, Alert } from 'react-native';
import { AuthProvider, AuthContext } from './components/authContext';

import AuthNavigator from './views/AuthNavigator';
import MainNavigator from './views/MainNavigator';

import TaskList from './views/TaskList';
import ParentHome from './views/ParentHome';
import CreateTask from './views/CreateTask';
import FamilyTaskList from './views/FamilyTaskList';

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
      <Stack.Screen name="ParentHome" component={ParentHome} options={{ headerShown: true, title: '', headerRight: () => <LogoutButton /> }} />
      <Stack.Screen name="CreateTask" component={CreateTask} options={{ headerShown: true, title: 'Create Task' }} />
      <Stack.Screen name="FamilyTaskList" component={FamilyTaskList} options={{ headerShown: true, title: '' }} />
    </Stack.Navigator>
  );
}

// Member log in 
function MemberStack() {
  return (
    <Stack.Navigator>

      <Stack.Screen name="TaskList" component={TaskList} options={{ headerShown: true, title: '', headerRight: () => <LogoutButton /> }} />

    </Stack.Navigator>
  );
}

function AppContent() {
  const { state } = useContext(AuthContext);

  if (state.isLoading) {
    return null; // 
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
        {state.userToken ? (state.user?.role === 'Supervisor' ? <SupervisorStack /> : <MemberStack />) : <AuthNavigator /> } 
      </NavigationContainer> );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
