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


const MapStack = createStackNavigator({
  MapScreen: {
    screen: MapScreen,
    navigationOptions: {
      title: 'Map',
      headerStyle: {
        backgroundColor: COLORS.white,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTitleStyle: {
        fontWeight: '700',
        fontSize: 18,
      },
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
    activeTintColor: COLORS.primary,
    inactiveTintColor: COLORS.inactive,
    style: {
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
    labelStyle: {
      fontSize: 11,
      fontWeight: '600',
      marginBottom: 4,
    },
  },
});

const AppContainer = createAppContainer(TabNavigator);

export default AppContainer;
