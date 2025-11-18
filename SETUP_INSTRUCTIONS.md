# FireLoc - Real-Time Fire Detection Mobile App

A complete React Native + Expo mobile app that displays real-time fire detections with interactive maps, alerts, and notifications.

## Overview

**FireLoc** uses YOLOv8 and mobile phone camera feeds for real-time fire detection. The mobile app provides hazard alerts and active fire visualization to help communities stay informed about fire threats.

### Core Features

✅ **Interactive Map** - Google Maps integration showing real-time fire markers  
✅ **Active Fire Tracking** - Live fire detection and location visualization  
✅ **Alert Dashboard** - Recent alerts with unread tracking  
✅ **Push Notifications** - Instant alerts for new fire detections  
✅ **Settings Panel** - Customize notifications, location sharing, and refresh rates  
✅ **About Screen** - App information and technology details  
✅ **Bottom Navigation** - Easy tab-based navigation  

## Project Structure

```
/app
  /screens
    - MapScreen.js       # Interactive map with fire markers
    - AlertsScreen.js    # Alert dashboard and list
    - SettingsScreen.js  # App settings and preferences
    - AboutScreen.js     # App information and features
    - LoadingScreen.js   # Splash screen with loading animation
  /components
    - FireMarker.js      # Fire marker component and detail card
    - AlertCard.js       # Individual alert card component
    - AlertsPanel.js     # Alert panel container component
  /navigation
    - RootNavigator.js   # Bottom tab navigation setup
  /services
    - fireApi.js         # API calls for fire data and alerts
    - notifications.js   # Expo Notifications setup and handlers
  /hooks
    - useFireData.js     # Custom hook for fire data management
/assets                  # Images and icons (to be created)

App.js                   # Root app component with initialization
index.js                 # Expo entry point
app.json                 # Expo configuration
package.json             # Dependencies and scripts
babel.config.js          # Babel configuration
```

## Installation & Setup

### Prerequisites

- **Node.js** 16+ and **npm** (or **yarn**)
- **Expo Go** app installed on your mobile device (iOS or Android)
- Active Google Maps API key (for the map provider)

### Step 1: Clone the Repository

```bash
git clone https://github.com/vanyashrivastava/fireloc-ios.git
cd fireloc-ios
```

### Step 2: Install Dependencies

```bash
npm install
```

Or with yarn:

```bash
yarn install
```

### Step 3: Configure Google Maps API

The app uses `react-native-maps` with Google Maps provider. For development, basic maps functionality works without a key, but for production:

1. Get a **Google Maps API key** from [Google Cloud Console](https://console.cloud.google.com/)
2. The key will be used automatically on Android; for iOS, add it to `app.json` under the `ios` section

### Step 4: Start the Development Server

```bash
npm start
```

You'll see a QR code in the terminal.

### Step 5: Open in Expo Go

- **iOS**: Open Expo Go app → "Scan QR Code" → Scan the code from terminal
- **Android**: Open Expo Go app → "Scan QR Code" → Scan the code from terminal

The app should launch immediately on your device!

## Running on Specific Platforms

```bash
# iOS Simulator (macOS only)
npm run ios

# Android Emulator
npm run android

# Web Browser (limited functionality)
npm run web
```

## Configuration

### Backend API Endpoint

Edit `app/services/fireApi.js` to point to your backend:

```javascript
const API_BASE_URL = 'https://your-backend-api.com';
```

Currently, the app uses **mock data** for development. Uncomment the actual API calls when your backend is ready:

```javascript
// const response = await apiClient.get('/active-fires');
// return response.data;
```

### Push Notifications

1. The app initializes Expo Notifications automatically
2. Get your **Expo Push Token** (printed in console during initialization)
3. Send this token to your backend to register for push notifications
4. Use Expo's notification API to send alerts when fires are detected

See `app/services/notifications.js` for setup details.

## Data Flow

### Map Screen

1. **useFireData** hook fetches active fires every 10 seconds
2. Fires displayed as 🔥 emoji markers on Google Maps
3. Tapping a marker shows fire details:
   - Coordinates
   - Detection timestamp
   - Confidence score
   - "Mark as Viewed" button

### Alerts Screen

1. **useFireData** hook fetches recent alerts
2. Display active fire count and unread alert count
3. Alert cards show:
   - Fire detection message
   - Relative timestamp (e.g., "5m ago")
   - Unread indicator (badge)
   - "Mark Read" button
4. Pull-to-refresh to manually update

### Settings Screen

- Toggle push notifications
- Toggle location sharing
- Set data refresh rate
- Send test notification
- Clear app cache
- Logout

### About Screen

- App description and features
- Technology stack
- Developer credits
- Links to privacy policy and terms

## API Endpoints (Placeholder)

The app expects these endpoints from your backend. Currently returns mock data:

```
GET /active-fires
  Response: [
    {
      id: string,
      latitude: number,
      longitude: number,
      timestamp: ISO8601,
      confidence: number (0-1)
    }
  ]

GET /recent-alerts
  Response: [
    {
      id: string,
      fireId: string,
      message: string,
      latitude: number,
      longitude: number,
      timestamp: ISO8601,
      read: boolean
    }
  ]

POST /alerts/:alertId/read
  Response: { id, read: true }

POST /fires/:fireId/viewed
  Response: { id, viewed: true }
```

## Styling & Colors

The app uses a consistent color scheme:

- **Primary Orange**: `#FF4D2E` (alerts, buttons, highlights)
- **White**: `#FFFFFF` (backgrounds, cards)
- **Dark Gray**: `#333333` (text)
- **Light Gray**: `#F5F5F5` (section backgrounds)
- **Border Gray**: `#DDDDDD` (dividers)

All colors are defined in component files and can be easily customized.

## Dependencies

### Core
- `react-native` - Cross-platform mobile framework
- `expo` - Development platform and toolkit
- `react` - UI library

### Navigation
- `@react-navigation/native` - Navigation library
- `@react-navigation/bottom-tabs` - Bottom tab navigator
- `react-native-gesture-handler` - Touch handling
- `react-native-reanimated` - Animation library
- `react-native-screens` - Performance optimization

### UI & Components
- `react-native-paper` - Material Design components
- `react-native-maps` - Map display with Google Maps

### Notifications
- `expo-notifications` - Push notifications

### API
- `axios` - HTTP client for API calls

## Development Tips

### Mock Data

To test the app without a backend, it uses mock data in `app/services/fireApi.js`. The mock includes:
- 3 active fires at different LA coordinates
- 3 alerts with varying read states and timestamps

### Testing Notifications

In Settings, tap "📬 Send Test Notification" to trigger a local test notification.

### Environment Variables

For sensitive data (API keys, backend URLs), create a `.env` file:

```
EXPO_PUBLIC_API_URL=https://your-api.com
EXPO_PUBLIC_GOOGLE_MAPS_KEY=your-key-here
```

Access them in code with `process.env.EXPO_PUBLIC_*`

## Known Limitations

- Google Maps requires network connectivity
- Push notifications require Expo account (free tier available)
- Some features (location tracking) may require explicit user permissions
- The app is optimized for portrait orientation

## Troubleshooting

### "Cannot find module 'expo-location'"

Install missing location permissions:

```bash
npm install expo-location
```

### Maps not showing

1. Ensure you have an internet connection
2. Check Google Maps API is enabled in Google Cloud Console
3. For Android, verify Google Play Services is installed

### Notifications not working

1. Ensure "Allow Notifications" is granted in OS settings
2. Check Expo notification permissions in the app
3. Verify you've copied the Expo Push Token to your backend

### App crashes on startup

Check the terminal for detailed error messages. Common causes:
- Missing dependencies: run `npm install`
- Outdated Expo CLI: run `npm install -g expo-cli`
- Node version too old: upgrade to Node 16+

## Future Enhancements

- [ ] Real backend integration
- [ ] User authentication & accounts
- [ ] Favorite/saved fire locations
- [ ] Custom notification preferences per location
- [ ] Dark mode support
- [ ] Offline maps caching
- [ ] Fire severity/risk levels
- [ ] Historical fire data
- [ ] Community reporting features

## License

MIT License - See LICENSE file for details

## Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

For issues, feature requests, or questions:

- **GitHub Issues**: [fireloc-ios/issues](https://github.com/vanyashrivastava/fireloc-ios/issues)
- **Email**: [contact information]

## Authors

**Vanya Shrivastava** - [GitHub Profile](https://github.com/vanyashrivastava)

## Acknowledgments

- YOLOv8 for fire detection model
- React Native & Expo communities
- Google Maps API
- Firebase Notifications

---

**Stay Alert. Stay Safe.** 🔥

Built with ❤️ for community fire awareness
