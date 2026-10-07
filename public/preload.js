const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('fileAPI', {
  getDrives: () => ipcRenderer.invoke('get-drives'),
  getDirectoryContents: (dirPath) =>
    ipcRenderer.invoke('get-directory-contents', dirPath),
  getFileStats: (filePath) => ipcRenderer.invoke('get-file-stats', filePath),
  openFileExplorer: (dirPath) =>
    ipcRenderer.invoke('open-file-explorer', dirPath),
  getDirectoryStats: (dirPath) =>
    ipcRenderer.invoke('get-directory-stats', dirPath),
});
