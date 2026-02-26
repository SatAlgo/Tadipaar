import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// 1. Import all your new dashboards
import LoginScreen from './src/screens/LoginScreen';
import AdminDashboard from './src/screens/dashboards/AdminDashboard.tsx';
import DCPDashboard from './src/screens/dashboards/DCPDashboard.tsx';
import ACPDashboard from './src/screens/dashboards/ACPDashboard.tsx';
import OfficerDashboard from './src/screens/dashboards/OfficerDashboard.tsx';
import CriminalDashboard from './src/screens/dashboards/CriminalDashboard.tsx';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        
        {/* 2. Register all 5 Dashboard Names here! */}
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="DCPDashboard" component={DCPDashboard} />
        <Stack.Screen name="ACPDashboard" component={ACPDashboard} />
        <Stack.Screen name="OfficerDashboard" component={OfficerDashboard} />
        <Stack.Screen name="CriminalDashboard" component={CriminalDashboard} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}