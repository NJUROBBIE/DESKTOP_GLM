const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopPet', {
  openContextMenu: () => ipcRenderer.send('pet-context-menu'),
  setIgnoreMouseEvents: (ignore) => ipcRenderer.send('set-ignore-mouse-events', ignore),
  onState: (callback) => ipcRenderer.on('set-state', (_event, state) => callback(state)),
  onPaused: (callback) => ipcRenderer.on('set-paused', (_event, paused) => callback(paused)),
});
