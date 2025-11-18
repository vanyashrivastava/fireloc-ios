import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Initialize push notifications
 * TODO: Wire this to your backend to receive push notifications when fires are detected
 */
export const initializeNotifications = async () => {
  try {
    // Configure how notifications should be displayed when app is in foreground
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Request permissions (iOS only needs this)
    if (Platform.OS === 'ios') {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Notification permissions not granted');
      }
    }

    // Get the Expo push token
    // TODO: Send this token to your backend to register for push notifications
    const token = await Notifications.getExpoPushTokenAsync();
    console.log('Expo Push Token:', token.data);
    return token.data;
  } catch (error) {
    console.error('Error initializing notifications:', error);
  }
};

/**
 * Send a local test notification
 * Useful for testing notification behavior
 */
export const sendTestNotification = async (title, body) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
        badge: 1,
        data: { deeplink: 'map' },
      },
      trigger: null, // Send immediately
    });
  } catch (error) {
    console.error('Error sending test notification:', error);
  }
};

/**
 * Set up notification event listeners
 * TODO: Handle incoming notifications - navigate to fire location, update alerts, etc.
 */
export const setupNotificationListeners = (navigation) => {
  // Listen for notifications when app is in foreground
  const foregroundListener = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log('Notification received while app is open:', notification);
      // TODO: Update UI to show new fire or alert
    }
  );

  // Listen for user interaction with notifications
  const responseListener =
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('User interacted with notification:', response);
      const deeplink = response.notification.request.content.data?.deeplink;
      if (deeplink && navigation) {
        navigation.navigate(deeplink);
      }
    });

  // Return cleanup function
  return () => {
    Notifications.removeNotificationSubscription(foregroundListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
};

export default {
  initializeNotifications,
  sendTestNotification,
  setupNotificationListeners,
};
