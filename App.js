import React, { useEffect, useState } from 'react';
import { StatusBar, SafeAreaView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import RootNavigator from './app/navigation/RootNavigator';
import LoadingScreen from './app/screens/LoadingScreen';
import {
  initializeNotifications,
  setupNotificationListeners,
} from './app/services/notifications';

export default function App() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Initialize notifications and app
    const initialize = async () => {
      try {
        // Initialize push notifications
        const token = await initializeNotifications();
        console.log('App initialized with push token:', token);
        setAppReady(true);
      } catch (error) {
        console.error('Error initializing app:', error);
        // Still show app even if notifications fail to initialize
        setAppReady(true);
      }
    };

    initialize();
  }, []);

  if (!appReady) {
    return <LoadingScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          <RootNavigator />
        </SafeAreaView>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
