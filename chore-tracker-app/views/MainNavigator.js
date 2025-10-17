import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CreateTask from './CreateTask';
import TaskList from './TaskList';
import FamilyManagement from './FamilyManagement';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="CreateTask"
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
        name="FamilyManagement"
        component={FamilyManagement}
        options={{
          title: 'FamilyManagement',
          tabBarLabel: 'Family',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
