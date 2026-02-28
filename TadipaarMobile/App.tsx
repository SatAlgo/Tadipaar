import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './src/screens/LoginScreen';
import AdminDashboard from './src/screens/dashboards/AdminDashboard';
import DCPDashboard from './src/screens/dashboards/DCPDashboard';
import CriminalDashboard from './src/screens/dashboards/CriminalDashboard';
import RegisterCriminal from './src/screens/management/RegisterCriminal';
import CriminalList from './src/screens/management/CriminalList';
import MapBoundary from './src/screens/management/MapBoundary';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ title: 'Admin Panel' }} />
        <Stack.Screen name="DCPDashboard" component={DCPDashboard} options={{ title: 'Live Monitoring' }} />
        <Stack.Screen name="CriminalDashboard" component={CriminalDashboard} options={{ title: 'Self-Verification' }} />
        <Stack.Screen name="RegisterCriminal" component={RegisterCriminal} options={{ title: 'Add New Record' }} />
        <Stack.Screen name="CriminalList" component={CriminalList} options={{ title: 'Externed Individuals' }} />
        <Stack.Screen name="MapBoundary" component={MapBoundary} options={{ title: 'Map Boundary' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}