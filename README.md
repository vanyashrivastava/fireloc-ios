# FireLoc - Real-Time Fire Detection Mobile App

A complete **React Native + Expo** mobile application that provides real-time fire detection, interactive mapping, and instant alert notifications.

## 🔥 Features

- **Interactive Google Maps** - Real-time visualization of fire locations
- **Active Fire Tracking** - Live fire markers with detailed information
- **Alert Dashboard** - Browse and manage recent fire alerts
- **Push Notifications** - Instant alerts for new fire detections
- **Custom Settings** - Notification preferences and data refresh configuration
- **Bottom Navigation** - Intuitive tab-based interface
- **Cross-Platform** - Runs on iOS and Android via Expo Go

## 📱 Main Screens

1. **Map Screen** - Interactive Google Maps with fire markers (🔥)
2. **Alerts Screen** - Dashboard showing active fires and alert list
3. **Settings Screen** - Configure notifications and app preferences
4. **About Screen** - Information about FireLoc and its technology
5. **Loading Screen** - Splash screen shown during app initialization

## ⚡ Quick Start

### Requirements

- Node.js 16+ and npm
- Expo Go app (free, download from App Store or Google Play)
- iPhone or Android device with internet connection

### Installation & Launch

```bash
# 1. Install dependencies
npm install

# 2. Start the Expo dev server
npm start

# 3. Scan QR code with Expo Go
# iOS: Open Expo Go → Scan QR Code
# Android: Open Expo Go → Scan QR Code
```

The app launches immediately on your device!

## 📁 Project Structure

```
/app
  /screens
    - MapScreen.js              # Interactive map with fire markers
    - AlertsScreen.js           # Alert dashboard
    - SettingsScreen.js         # App settings
    - AboutScreen.js            # App information
    - LoadingScreen.js          # Splash screen
  /components
    - FireMarker.js             # Fire marker + detail card
    - AlertCard.js              # Individual alert card
    - AlertsPanel.js            # Alert panel container
  /services
    - fireApi.js                # API calls (with mock data)
    - notifications.js          # Expo Notifications setup
  /hooks
    - useFireData.js            # Custom fire data hook
  /navigation
    - RootNavigator.js          # Bottom tab navigation

App.js                          # Root component
app.json                        # Expo config
package.json                    # Dependencies
index.js                        # Entry point
babel.config.js                 # Babel setup
```

## 🔧 Configuration

### Connecting to Your Backend

Edit `app/services/fireApi.js`:

```javascript
const API_BASE_URL = 'https://your-backend-url.com';
```

Then uncomment the actual API calls and comment out the mock data.

### Mock Data

For development/testing, the app includes mock fire and alert data. Switch between mock and real data by editing `fireApi.js`:

```javascript
// Mock data is returned by default
const mockFires = [
  { id: 'fire-1', latitude: 34.05, longitude: -118.25, ... },
  // ...
];
return mockFires; // Comment this out and uncomment the real API call below
```

### Environment Variables

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Then edit with your configuration:

```
EXPO_PUBLIC_API_URL=https://your-api.com
EXPO_PUBLIC_ENABLE_MOCK_DATA=true
```

## 📡 API Specification

Your backend should provide these endpoints:

```
GET /active-fires
  Returns: [
    { id, latitude, longitude, timestamp, confidence },
    ...
  ]

GET /recent-alerts  
  Returns: [
    { id, fireId, message, latitude, longitude, timestamp, read },
    ...
  ]

POST /alerts/:alertId/read
  Returns: { id, read: true }

POST /fires/:fireId/viewed
  Returns: { id, viewed: true }
```

## 🔔 Push Notifications

The app auto-initializes Expo Notifications:

1. **Get Token**: Printed to console on app startup
2. **Register**: Send token to your backend
3. **Send Alerts**: Use Expo API to push notifications when fires detected

Example push payload:
```javascript
{
  to: "ExponentPushToken[...]",
  sound: "default",
  title: "🔥 Fire Alert",
  body: "Fire detected at 34.05°N, 118.25°W",
  data: { deeplink: "map" },
}
```

## 🎨 Theme & Colors

- **Primary Orange**: `#FF4D2E` (Alerts, buttons, highlights)
- **White**: `#FFFFFF` (Backgrounds)
- **Dark Gray**: `#333333` (Text)
- **Light Gray**: `#F5F5F5` (Panels, cards)

Edit `COLORS` constant in each screen to customize.

## 📦 Core Dependencies

- `react-native` - Mobile framework
- `expo` - Development & deployment
- `@react-navigation` - Navigation
- `react-native-maps` - Google Maps
- `react-native-paper` - Material UI
- `expo-notifications` - Push notifications
- `axios` - HTTP requests

See `package.json` for full list.

## 🚀 Running on Specific Platforms

```bash
# iOS Simulator (macOS only)
npm run ios

# Android Emulator
npm run android

# Web (limited features)
npm run web
```

## 🐛 Troubleshooting

**Maps show blank?**
- Check internet connection
- Verify Google Maps API is enabled
- Try reloading the app (R in terminal)

**Notifications not triggering?**
- Grant permissions in OS settings
- Verify Expo account is authenticated
- Check backend is sending correct payloads

**App crashes on load?**
```bash
npm install                    # Re-install dependencies
expo start -c                  # Clear cache
expo upgrade                   # Update Expo
```

**Port 8081 already in use?**
```bash
expo start -p 8082             # Use different port
```

## 📚 Full Documentation

See **[SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)** for:
- Detailed step-by-step setup
- Google Maps API key setup
- Complete API reference
- Development tips
- Building for production

## 🚀 Production Build

To submit to App Stores:

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure
eas build:configure

# Build for app stores
eas build --platform all
```

See Expo docs for detailed EAS setup.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - See LICENSE file

## 👤 Author

**Vanya Shrivastava**  
GitHub: [@vanyashrivastava](https://github.com/vanyashrivastava)

## 🙏 Acknowledgments

- **YOLOv8** - Fire detection AI model
- **React Native & Expo** - Mobile development framework
- **Google Maps** - Mapping platform
- Open source community

---

**Stay Alert. Stay Safe.** 🔥

*FireLoc provides real-time fire detection to help communities prepare and respond.*
