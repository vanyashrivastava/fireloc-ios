// dark-mode-system applied
import React from 'react';
import { StatusBar, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import './app/services/firebaseConfig'; // Initialize Firebase
import LandingScreen from './app/screens/LandingScreen';
import MapScreen from './app/screens/MapScreen';
import AlertsScreen from './app/screens/AlertsScreen';
import SettingsScreen from './app/screens/SettingsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const COLORS = {
  backgroundPrimary: '#0F0F0F',
  surface: '#1A1A1A',
  elevated: '#242424',
  border: 'rgba(255,255,255,0.10)',
  borderSubtle: 'rgba(255,255,255,0.06)',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.55)',
  tabInactive: 'rgba(255,255,255,0.35)',
};

function MapStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: COLORS.backgroundPrimary,
          borderBottomColor: COLORS.borderSubtle,
          borderBottomWidth: 1,
          shadowColor: '#000',
          shadowOpacity: 0.5,
        },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: {
          color: COLORS.textPrimary,
        },
      }}
    >
      <Stack.Screen
        name="MapScreenStack"
        component={MapScreen}
        options={{ 
          title: 'Map',
          headerBackVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

function AlertsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: COLORS.backgroundPrimary,
          borderBottomColor: COLORS.borderSubtle,
          borderBottomWidth: 1,
          shadowColor: '#000',
          shadowOpacity: 0.5,
        },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: {
          color: COLORS.textPrimary,
        },
      }}
    >
      <Stack.Screen
        name="AlertsScreenStack"
        component={AlertsScreen}
        options={{ 
          title: 'Alerts',
          headerBackVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: COLORS.backgroundPrimary,
          borderBottomColor: COLORS.borderSubtle,
          borderBottomWidth: 1,
          shadowColor: '#000',
          shadowOpacity: 0.5,
        },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: {
          color: COLORS.textPrimary,
        },
      }}
    >
      <Stack.Screen
        name="SettingsScreenStack"
        component={SettingsScreen}
        options={{ 
          title: 'Settings',
          headerBackVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

function MainApp() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.backgroundPrimary,
          borderTopColor: 'rgba(255,255,255,0.08)',
        },
        tabBarActiveTintColor: COLORS.textPrimary,
        tabBarInactiveTintColor: COLORS.tabInactive,
      }}
    >
      <Tab.Screen
        name="Map"
        component={MapStack}
        options={{
          tabBarLabel: 'Map',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🗺️</Text>,
        }}
      />
      <Tab.Screen
        name="Alerts"
        component={AlertsStack}
        options={{
          tabBarLabel: 'Alerts',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🔔</Text>,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⚙️</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.backgroundPrimary} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="Landing" 
          component={LandingScreen}
          options={{ animationEnabled: false }}
        />
        <Stack.Screen 
          name="MainApp" 
          component={MainApp}
          options={{ animationEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
