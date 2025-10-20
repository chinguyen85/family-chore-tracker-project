import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CreateTask from './CreateTask';
import TaskList from './TaskList';
import FamilyManagement from './FamilyManagement';
import ProofUploadScreen from './ProofUpload';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="TaskList"
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tab.Screen
        name="TaskList"
        component={TaskList}
        options={{
          title: 'TaskList',
          tabBarLabel: 'Task',
        }}
      />
      <Tab.Screen
        name="CreateTask"
        component={CreateTask}
        options={{
          title: 'CreateTask',
          tabBarLabel: 'Create',
        }}
      />
      <Tab.Screen
        name="ProofUpload"
        component={ProofUploadScreen}
        options={{
          title: 'Test Proof Upload',
          tabBarLabel: 'Proof Test',
        }}
        // Dummy data for testing
        initialParams={{
          taskId: '68ee8b830c10de36bffa94b7',
          taskTitle: 'george sleep',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
