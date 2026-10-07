# 🚀 QUICKSTART GUIDE

## Installation

```bash
npm install
```

## Run in Debug Mode (Windows)

```bash
npm run start
```

This will:
1. Start React dev server on `http://localhost:3000`
2. Launch Electron with dev tools open
3. Hot-reload enabled for fast iteration

## Features

✨ **Advanced AIOS Dashboard**
- Real-time network telemetry
- Node details panel with file stats
- System information display
- Cyberpunk neon aesthetic

🎮 **3D Visualization**
- Click nodes to expand directories
- Drag to rotate camera (free orbit)
- Scroll to zoom in/out
- Color-coded node types (drives, folders, files)

💾 **File System Integration**
- Browse all Windows drives
- Real-time file/folder information
- Open files directly in Explorer
- Display file size, creation date, modification date

## Keyboard Shortcuts

- `Ctrl+Shift+I` - Toggle Developer Tools
- `F5` - Reload the app

## Troubleshooting

### React dev server won't start
```bash
kill-port 3000
npm start
```

### Electron won't connect
Wait 5-10 seconds for React to fully compile. Check terminal for errors.

### Can't access certain drives
Run with admin privileges:
1. Right-click Command Prompt → Run as administrator
2. Navigate to project folder
3. Run `npm start`

### 3D canvas is black
Check for WebGL support. Ensure graphics drivers are up to date.

## Build for Distribution

```bash
npm run build
```

Creates installer in `dist/` folder.

## Debugging Tips

1. **View Electron console**: Ctrl+Shift+I opens dev tools
2. **Check main process logs**: Look at terminal window
3. **React component issues**: Use React DevTools (installed with dev tools)
4. **IPC communication**: Add `console.log()` in `public/electron.js`

## Project Structure

```
.
├── public/
│   ├── electron.js      ← Main Electron process (Windows APIs)
│   ├── preload.js       ← IPC bridge (secure communication)
│   └── index.html       ← HTML entry point
├── src/
│   ├── App.js           ← Main app component
│   ├── App.css
│   ├── components/
│   │   ├── NodeGraph.js ← 3D visualization (Three.js)
│   │   ├── Dashboard.js ← AIOS telemetry panel
│   │   └── *.css
│   └── index.js
└── package.json
```

## Tips for Development

- **Faster iteration**: Edit React components and they auto-reload
- **Test new drive**: Change `ipcMain.handle('get-drives')` in electron.js
- **Debug 3D**: Open Three.js inspector or use `camera.position` logging
- **Performance**: Check FPS in Chrome DevTools → Performance tab

Enjoy! 🌐✨
