# FireLoc Developer Guide

Welcome to the FireLoc development team! This guide helps you understand and extend the codebase.

## Architecture Overview

FireLoc follows a clean, modular architecture:

```
┌─────────────────────────────────────────────┐
│          App.js (Root)                      │
│    - Initialize notifications               │
│    - Loading state management               │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│     RootNavigator.js (Navigation)           │
│    - Bottom tab navigation setup             │
└─────────────────┬───────────────────────────┘
                  │
        ┌─────────┼─────────┬──────────┐
        │         │         │          │
        ▼         ▼         ▼          ▼
    MapScreen AlertScreen Settings About
        │         │
        └────┬────┘
             │
        useFireData Hook
             │
        ┌─────────────────┐
        │   fireApi.js    │
        │  (Mock or Real) │
        └─────────────────┘
```

## Core Concepts

### 1. useFireData Hook

The **central data management** for fire and alert data.

```javascript
// Usage in any screen:
const {
  fires,           // Array of active fires
  alerts,          // Array of alerts
  loading,         // Is data loading?
  unreadCount,     // How many unread alerts?
  activeFireCount, // How many active fires?
  refetch,         // Manually refetch
  handleAlertRead, // Mark alert as read
} = useFireData(refreshInterval);
```

**Features:**
- Auto-fetches every 10 seconds
- Caches data in local state
- Manages loading/error states
- Provides computed values

### 2. API Service Layer

The **fireApi.js** handles all backend communication.

**With Real Backend:**
```javascript
// Edit app/services/fireApi.js
const API_BASE_URL = 'https://your-api.com';

// Uncomment real API calls:
const response = await apiClient.get('/active-fires');
return response.data;
```

**With Mock Data (Development):**
```javascript
// Mock data is returned by default
const mockFires = [
  { id: 'fire-1', latitude: 34.05, ... },
  // ...
];
return mockFires;
```

### 3. Component Hierarchy

**Screen Components** (Full screens):
- MapScreen
- AlertsScreen
- SettingsScreen
- AboutScreen
- LoadingScreen

**UI Components** (Reusable):
- FireMarker (Fire icon + detail card)
- AlertCard (Individual alert)
- AlertsPanel (Alert list container)

**Navigation Component**:
- RootNavigator (Tab navigation)

---

## Customization Guide

### Change Colors

Edit the `COLORS` constant at the top of any screen:

```javascript
const COLORS = {
  primary: '#FF4D2E',      // Main orange
  white: '#FFFFFF',        // Backgrounds
  gray: '#F5F5F5',         // Panels
  darkGray: '#333333',     // Text
  lightGray: '#EEEEEE',    // Borders
  border: '#DDDDDD',
};
```

Then use in styles:
```javascript
const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
  },
});
```

### Change Map Center Location

Edit `MapScreen.js`:

```javascript
const INITIAL_REGION = {
  latitude: 34.05,        // Your latitude
  longitude: -118.25,     // Your longitude
  latitudeDelta: 0.5,     // Zoom level (smaller = more zoomed)
  longitudeDelta: 0.5,
};
```

### Adjust Refresh Rate

Edit `useFireData` calls in screens:

```javascript
// Refresh every 5 seconds instead of 10
useFireData(5000)
```

Or globally in screen file:

```javascript
const { fires, alerts } = useFireData(5000); // 5 second refresh
```

### Add New Screens

To add a 6th tab (e.g., "History"):

1. **Create screen file:**
   ```javascript
   // app/screens/HistoryScreen.js
   export const HistoryScreen = ({ navigation }) => {
     return (
       <View style={styles.container}>
         {/* Your content */}
       </View>
     );
   };
   ```

2. **Add to navigation:**
   ```javascript
   // app/navigation/RootNavigator.js
   <Tab.Screen
     name="History"
     component={HistoryScreen}
     options={{
       tabBarLabel: 'History',
       tabBarIcon: ({ color }) => (
         <Text style={{ fontSize: 24, color }}>📜</Text>
       ),
     }}
   />
   ```

### Modify Alert Card

Edit `AlertCard.js`:

```javascript
// Change card appearance
const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 10,  // Increase for more rounded
    // Add new styles...
  },
});

// Change alert logic
export const AlertCard = ({ alert, onPress, onMarkAsRead }) => {
  // Add new fields or behavior here
};
```

---

## Data Models

### Fire Object

```javascript
{
  id: "fire-1",           // Unique identifier
  latitude: 34.05,        // GPS latitude
  longitude: -118.25,     // GPS longitude
  timestamp: "2024-01-15T14:30:00Z",  // ISO 8601
  confidence: 0.98,       // 0-1 (0-100%)
  viewed: false,          // Optional: if marked as viewed
}
```

### Alert Object

```javascript
{
  id: "alert-1",          // Unique identifier
  fireId: "fire-1",       // Reference to fire
  message: "Fire detected at 34.05°N, 118.25°W",  // Display message
  latitude: 34.05,        // GPS latitude (for map zoom)
  longitude: -118.25,     // GPS longitude
  timestamp: "2024-01-15T14:30:00Z",  // ISO 8601
  read: false,            // Has user read this?
}
```

---

## Backend Integration Checklist

When connecting to your backend:

- [ ] Update `API_BASE_URL` in `fireApi.js`
- [ ] Uncomment real API calls
- [ ] Comment out mock data
- [ ] Test GET `/active-fires` endpoint
- [ ] Test GET `/recent-alerts` endpoint
- [ ] Test POST `/alerts/:id/read` endpoint
- [ ] Test POST `/fires/:id/viewed` endpoint
- [ ] Get Expo Push Token from console
- [ ] Register token with backend
- [ ] Set up push notification endpoint
- [ ] Test incoming notifications

---

## Common Development Tasks

### Add a New API Endpoint

In `fireApi.js`:

```javascript
/**
 * Get fire details
 * @param {string} fireId - The fire ID
 * @returns {Promise<Object>} Fire details
 */
export const getFireDetails = async (fireId) => {
  try {
    // Uncomment when backend is ready:
    // const response = await apiClient.get(`/fires/${fireId}`);
    // return response.data;

    // Mock for now:
    return { id: fireId, details: "..." };
  } catch (error) {
    console.error(`Error fetching fire ${fireId}:`, error);
    throw error;
  }
};
```

### Add State to a Screen

```javascript
import React, { useState } from 'react';

export const MyScreen = () => {
  const [myState, setMyState] = useState(false);

  return (
    <View>
      <Button onPress={() => setMyState(!myState)} />
    </View>
  );
};
```

### Add a Modal/Dialog

Use React Native Paper:

```javascript
import { Dialog, Portal } from 'react-native-paper';

const [visible, setVisible] = useState(false);

return (
  <>
    <Button onPress={() => setVisible(true)} />
    <Portal>
      <Dialog visible={visible} onDismiss={() => setVisible(false)}>
        <Dialog.Title>Confirm</Dialog.Title>
        <Dialog.Content>
          <Text>Are you sure?</Text>
        </Dialog.Content>
      </Dialog>
    </Portal>
  </>
);
```

### Debug Network Calls

Add logging to `fireApi.js`:

```javascript
export const getActiveFires = async () => {
  try {
    console.log('Fetching fires...');
    const response = await apiClient.get('/active-fires');
    console.log('Fires response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
};
```

### Handle Loading States

```javascript
import { ActivityIndicator } from 'react-native';

const { fires, loading } = useFireData();

if (loading && fires.length === 0) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FF4D2E" />
    </View>
  );
}

// Show content when loaded
```

---

## Testing Tips

### Test with Mock Data

The app includes mock data. To test:

1. Run `npm start`
2. No backend needed
3. All features work with fake data
4. Great for UI/UX testing

### Test with Real Backend

1. Update `API_BASE_URL`
2. Uncomment API calls
3. Run `npm start`
4. App fetches real fire data

### Test Notifications

In Settings screen, tap **"📬 Send Test Notification"**:

```javascript
// This sends a local test notification
await sendTestNotification('Test', 'This is a test');
```

### Test Different Scenarios

Edit mock data in `fireApi.js`:

```javascript
const mockFires = [
  // Test with no fires:
  // return [];

  // Test with many fires:
  // return Array(100).fill().map((_, i) => ({...}));

  // Test with real fires:
  {
    id: 'fire-1',
    latitude: 34.05,
    longitude: -118.25,
    // ...
  },
];
```

---

## Performance Optimization

### Reduce Refresh Rate

If battery drain is high:

```javascript
// Instead of every 10 seconds:
useFireData(10000)

// Use 30 seconds:
useFireData(30000)
```

### Lazy Load Screens

Use React Navigation's `useFocusEffect`:

```javascript
import { useFocusEffect } from '@react-navigation/native';

useFocusEffect(
  React.useCallback(() => {
    // Only fetch when screen is focused
    refetch();
  }, [])
);
```

### Memoize Components

Prevent unnecessary re-renders:

```javascript
import { useMemo } from 'react';

const sortedAlerts = useMemo(() => {
  return alerts.sort(/* ... */);
}, [alerts]);
```

---

## Debugging

### Console Logs

```javascript
console.log('Value:', value);      // Info
console.warn('Warning:', msg);     // Warning
console.error('Error:', error);    // Error
```

**View in Terminal:**
```bash
npm start
# Logs appear here when you interact with app
```

### React DevTools

```bash
# Install
npm install -g react-devtools

# Run (in separate terminal)
react-devtools

# App will auto-connect
```

### Network Inspector

Edit `fireApi.js` to log all requests:

```javascript
apiClient.interceptors.request.use(request => {
  console.log('Request:', request.method.toUpperCase(), request.url);
  return request;
});

apiClient.interceptors.response.use(response => {
  console.log('Response:', response.status, response.data);
  return response;
});
```

---

## Code Style

**Naming Conventions:**

```javascript
// Screen components: PascalCase + "Screen"
export const MapScreen = () => {}

// Utility functions: camelCase
const getActiveFires = async () => {}

// React hooks: camelCase + "use"
export const useFireData = () => {}

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = '...'
```

**File Structure:**

```javascript
// 1. Imports at top
import React, { useState } from 'react';
import { View } from 'react-native';

// 2. Constants
const COLORS = { ... };

// 3. Component
export const MyComponent = () => { ... };

// 4. Styles at bottom
const styles = StyleSheet.create({ ... });

// 5. Export
export default MyComponent;
```

---

## Resources

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Google Maps React Native](https://github.com/react-native-maps/react-native-maps)

---

## Getting Help

1. **Check existing code** - Similar feature might exist
2. **Read comments** - Code is well-documented
3. **Check docs** - SETUP_INSTRUCTIONS.md has details
4. **Debug in terminal** - npm start shows errors
5. **Google the error** - Most issues have Stack Overflow answers

---

Happy coding! 🚀

Feel free to extend, customize, and improve FireLoc!
