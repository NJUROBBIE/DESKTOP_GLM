const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopPet', {
  openContextMenu: () => ipcRenderer.send('pet-context-menu'),
  startDrag: () => ipcRenderer.send('pet-drag-start'),
  endDrag: () => ipcRenderer.send('pet-drag-end'),
  onPointer: (callback) => ipcRenderer.on('pointer-position', (_event, position) => callback(position)),
  setIgnoreMouseEvents: (ignore) => ipcRenderer.send('set-ignore-mouse-events', ignore),
  onState: (callback) => ipcRenderer.on('set-state', (_event, state) => callback(state)),
  onPaused: (callback) => ipcRenderer.on('set-paused', (_event, paused) => callback(paused)),
});
