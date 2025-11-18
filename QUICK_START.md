# FireLoc Quick Start Guide

Get FireLoc running on your phone in **5 minutes**! 🚀

## Prerequisites

Before starting, you need:

1. **Node.js 16+** - [Download](https://nodejs.org/)
   - Verify: `node --version`

2. **Expo Go App** - Free app for iOS & Android
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

3. **A smartphone** - iPhone or Android with internet

## Step 1: Clone & Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/vanyashrivastava/fireloc-ios.git
cd fireloc-ios

# Install all dependencies
npm install
```

## Step 2: Start Development Server (1 minute)

```bash
npm start
```

You'll see output like:
```
› Opening on iOS simulator...
Or scan this QR code:

██████████████████████████████
██████████████████████████████
██████ ▀███████████████▀ ██████
████   ████████████████   ████
...
```

## Step 3: Open in Expo Go (2 minutes)

### iOS
1. Open **Expo Go** app on your iPhone
2. Tap **Scan QR Code** at the bottom
3. Point camera at terminal QR code
4. Tap the link that appears

### Android
1. Open **Expo Go** app on your Android phone
2. Tap **Scan QR Code** (might be in menu)
3. Point camera at terminal QR code
4. Tap the link that appears

## Step 4: Test the App

Once loaded, you should see:

✅ **Map Screen** (default) - Shows 3 fire markers on Los Angeles map  
✅ **Alerts Tab** - Shows 3 mock fire alerts  
✅ **Settings Tab** - Toggle notifications, send test alerts  
✅ **About Tab** - Learn about FireLoc  

## Mock Data

The app comes with **mock data** for testing:
- 3 active fires near Los Angeles
- 3 alerts (some read, some unread)
- Auto-refresh every 10 seconds

This lets you test the full app without a backend!

## 🔌 Connect to Your Backend

When you have a backend running:

1. Edit `app/services/fireApi.js`
2. Change the API URL:
   ```javascript
   const API_BASE_URL = 'https://your-backend-url.com';
   ```
3. Uncomment the real API calls (comment out mock data)
4. Press `R` in terminal to reload

See [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) for full backend details.

## 📍 Hot Reload

The app automatically reloads when you save files:

- **Edit any file** → App updates on phone automatically
- **Press R in terminal** → Force reload
- **Press D in terminal** → Open developer menu

## 🐛 Quick Fixes

**App won't load?**
```bash
npm install                 # Reinstall deps
npm start -c               # Clear cache
```

**Can't see QR code?**
```bash
npm start -qr              # Show larger QR code
npm start -p 8082          # Try different port
```

**App crashes?**
- Check terminal for error messages
- Make sure Node.js is version 16+
- Update Expo: `npm install -g expo-cli`

## 📚 Next Steps

1. **Set up Google Maps** (optional for dev)
   - See [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)

2. **Configure your backend URL**
   - See [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)

3. **Add real fire data**
   - Replace mock data with actual API calls

4. **Set up push notifications**
   - See `app/services/notifications.js`

## 🚀 Advanced Commands

```bash
# Run on iOS Simulator (macOS only)
npm run ios

# Run on Android Emulator
npm run android

# Run on web browser (limited features)
npm run web

# Build for production
npm install -g eas-cli
eas build --platform ios
```

## 🤔 Need Help?

1. Check [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) for detailed docs
2. Review error messages in terminal
3. Open an issue on [GitHub](https://github.com/vanyashrivastava/fireloc-ios/issues)

## 📱 What's Included?

✅ Fully functional React Native app  
✅ Google Maps integration  
✅ Fire markers & alert system  
✅ Push notification setup  
✅ Settings & about screens  
✅ Mock data for testing  
✅ Complete project structure  

## 🎉 You're Done!

Your FireLoc app is now running! 

**Next:** Connect your backend and add real fire data.

---

**Need to make changes?** Just edit files in `/app` and watch them reload on your phone! 🔥

**Questions?** See [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) or the main [README.md](README.md)
