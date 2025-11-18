# FireLoc Assets

This folder contains image assets for the app.

## Required Files

### logo.png
- Size: 1024x1024 pixels (recommended)
- Purpose: App icon, splash screen, and about screen
- Format: PNG with transparency
- Note: Currently using emoji 🔥 as placeholder

### fire-icon.png (optional)
- Size: 64x64 pixels
- Purpose: Custom fire marker icon for map
- Format: PNG with transparency
- Note: Currently using emoji 🔥 as fallback

## Generating Assets

You can use the emoji fire icon 🔥 during development. For production:

1. Design or download custom icons
2. Place PNG files in this directory
3. Import in components with `require('./assets/logo.png')`
4. Update app.json `icon` field: `"icon": "./assets/logo.png"`

## Icon Resources

- [Flaticon](https://www.flaticon.com) - Free and premium icons
- [The Noun Project](https://thenounproject.com) - Curated icon library
- [Ionicons](https://ionicons.com) - Modern icon pack (many themes)
- [Font Awesome](https://fontawesome.com) - Popular icon library

## Using SVG Icons

For SVG icons, convert to PNG first using:
- [CloudConvert](https://cloudconvert.com)
- [Online-Convert](https://image.online-convert.com)
- ImageMagick: `convert logo.svg -background white logo.png`
