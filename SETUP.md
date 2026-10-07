# 3D File Explorer - Quick Setup Guide

## What You Need to Do

### 1. Install Dependencies
```bash
npm install
```

### 2. Install Electron Dependencies
Since we're using the latest Electron, you'll need:
```bash
npm install --save-dev electron-is-dev
```

Update the top of `public/electron.js`:
```javascript
const isDev = require('electron-is-dev');
```

### 3. Run Development Server
```bash
npm start
```

This runs both the React dev server and Electron app simultaneously.

### 4. Build Installer
```bash
npm run build
```

Creates an NSIS installer in the `dist` folder.

## Project Highlights

✨ **Features Implemented**:
- ✅ Full Windows drive detection
- ✅ Real-time directory traversal
- ✅ 3D node graph with Three.js
- ✅ Interactive camera controls (drag, zoom)
- ✅ Click-to-expand navigation
- ✅ File info sidebar with stats
- ✅ Open in Explorer integration
- ✅ Cyberpunk neon theme
- ✅ Smooth animations and glowing effects

🎨 **Visual Design**:
- Cyan (#00d4ff) for drives
- Green (#00ff88) for folders  
- Magenta (#ff006e) for files
- Dual neon lights for sci-fi atmosphere
- Pulsing node glows

🎮 **Interactions**:
- Click nodes to expand directories
- Drag to rotate the 3D view
- Scroll to zoom in/out
- Hover effects on buttons
- Real-time node highlighting

## Troubleshooting

### "Cannot find module 'electron-is-dev'"
```bash
npm install --save-dev electron-is-dev
```

### App won't start
Make sure React dev server is running first (wait for "compiled successfully")

### 3D canvas not showing
Check browser console (Ctrl+Shift+I when dev tools open) for WebGL errors

### File paths not loading
Ensure app has read permissions to directories being scanned

## Next Steps

1. Test the app locally
2. Try clicking on drive letters to expand them
3. Explore the 3D space by dragging your mouse
4. Build the installer when ready: `npm run build`

Enjoy your cyberpunk file explorer! 🌐✨
