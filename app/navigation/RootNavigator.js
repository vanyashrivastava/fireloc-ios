// dark-mode-system applied
import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { StyleSheet, Text } from 'react-native';

import MapScreen from '../screens/MapScreen';
import AlertsScreen from '../screens/AlertsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const COLORS = {
  primary: '#FFFFFF',
  white: '#0F0F0F',
  gray: '#1A1A1A',
  darkGray: '#FFFFFF',
  inactive: 'rgba(255,255,255,0.35)',
};

const screenOptions = {
  headerStyle: {
    backgroundColor: '#0F0F0F',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  headerTintColor: '#FFFFFF',
  headerTitleStyle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#FFFFFF',
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
    backgroundColor: '#0F0F0F',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    paddingBottom: 4,
    paddingTop: 4,
    height: 68,
  },
  tabBarActiveTintColor: '#FFFFFF',
  tabBarInactiveTintColor: COLORS.inactive,
  headerShown: true,
  ...screenOptions,
});


const MapStack = createStackNavigator({
  MapScreen: {
    screen: MapScreen,
    navigationOptions: {
      title: 'Map',
      headerStyle: {
        backgroundColor: '#0F0F0F',
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTitleStyle: {
        fontWeight: '700',
        fontSize: 18,
        color: '#FFFFFF',
      },
      headerTintColor: '#FFFFFF',
      headerTitleAlign: 'center',
    },
  },
});

const AlertsStack = createStackNavigator({
  AlertsScreen: {
    screen: AlertsScreen,
    navigationOptions: {
      title: 'Alerts',
      ...screenOptions,
    },
  },
});

const SettingsStack = createStackNavigator({
  SettingsScreen: {
    screen: SettingsScreen,
    navigationOptions: {
      title: 'Settings',
      ...screenOptions,
    },
  },
});

const AboutStack = createStackNavigator({
  AboutScreen: {
    screen: AboutScreen,
    navigationOptions: {
      title: 'About',
      ...screenOptions,
    },
  },
});


const TabNavigator = TabNavigator = Tab.Navigator ? null : createBottomTabNavigator({
  Map: {
    screen: MapStack,
    navigationOptions: {
      tabBarLabel: 'Map',
      tabBarIcon: ({ tintColor }) => (
        <Text style={{ fontSize: 24, color: tintColor }}>🗺️</Text>
      ),
    },
  },
  Alerts: {
    screen: AlertsStack,
    navigationOptions: {
      tabBarLabel: 'Alerts',
      tabBarIcon: ({ tintColor }) => (
        <Text style={{ fontSize: 24, color: tintColor }}>🔔</Text>
      ),
    },
  },
  Settings: {
    screen: SettingsStack,
    navigationOptions: {
      tabBarLabel: 'Settings',
      tabBarIcon: ({ tintColor }) => (
        <Text style={{ fontSize: 24, color: tintColor }}>⚙️</Text>
      ),
    },
  },
  About: {
    screen: AboutStack,
    navigationOptions: {
      tabBarLabel: 'About',
      tabBarIcon: ({ tintColor }) => (
        <Text style={{ fontSize: 24, color: tintColor }}>ℹ️</Text>
      ),
    },
  },
}, {
  initialRouteName: 'Map',
  tabBarOptions: {
    activeTintColor: '#FFFFFF',
    inactiveTintColor: COLORS.inactive,
    style: {
      backgroundColor: '#0F0F0F',
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.08)',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      paddingBottom: 4,
      paddingTop: 4,
      height: 68,
    },
    labelStyle: {
      fontSize: 11,
      fontWeight: '600',
      marginBottom: 4,
    },
  },
});

const AppContainer = createAppContainer(TabNavigator);

export default AppContainer;
