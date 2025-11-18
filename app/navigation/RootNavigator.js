import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text } from 'react-native';

import MapScreen from '../screens/MapScreen';
import AlertsScreen from '../screens/AlertsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const COLORS = {
  primary: '#FF4D2E',
  white: '#FFFFFF',
  gray: '#F5F5F5',
  darkGray: '#333333',
  inactive: '#999999',
};

const screenOptions = {
  headerStyle: {
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTintColor: COLORS.darkGray,
  headerTitleStyle: {
    fontWeight: '700',
    fontSize: 18,
  },
  headerTitleAlign: 'center',
};

const tabScreenOptions = ({ route }) => ({
  title: '',
  tabBarLabelStyle: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  tabBarStyle: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    paddingBottom: 4,
    paddingTop: 4,
    height: 68,
  },
  tabBarActiveTintColor: COLORS.primary,
  tabBarInactiveTintColor: COLORS.inactive,
  headerShown: true,
  ...screenOptions,
});

const MapStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="MapScreenStack"
        component={MapScreen}
        options={{
          title: 'Map',
          headerTitle: () => null,
          headerStyle: {
            backgroundColor: COLORS.white,
            elevation: 0,
            shadowOpacity: 0,
          },
        }}
      />
    </Stack.Navigator>
  );
};

const AlertsStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="AlertsScreenStack"
        component={AlertsScreen}
        options={{
          title: 'Alerts',
        }}
      />
    </Stack.Navigator>
  );
};

const SettingsStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="SettingsScreenStack"
        component={SettingsScreen}
        options={{
          title: 'Settings',
        }}
      />
    </Stack.Navigator>
  );
};

const AboutStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="AboutScreenStack"
        component={AboutScreen}
        options={{
          title: 'About',
        }}
      />
    </Stack.Navigator>
  );
};

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={tabScreenOptions}
        initialRouteName="Map"
      >
        <Tab.Screen
          name="Map"
          component={MapStackNavigator}
          options={{
            tabBarLabel: 'Map',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size + 4, color }}>🗺️</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Alerts"
          component={AlertsStackNavigator}
          options={{
            tabBarLabel: 'Alerts',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size + 4, color }}>🔔</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsStackNavigator}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size + 4, color }}>⚙️</Text>
            ),
          }}
        />
        <Tab.Screen
          name="About"
          component={AboutStackNavigator}
          options={{
            tabBarLabel: 'About',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: size + 4, color }}>ℹ️</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
