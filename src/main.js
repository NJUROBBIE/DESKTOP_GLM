const { app, BrowserWindow, Menu, Tray, ipcMain, nativeImage, screen } = require('electron');
const path = require('node:path');

let petWindow;
let tray;
let isQuitting = false;

const createPetWindow = () => {
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.workAreaSize;

  petWindow = new BrowserWindow({
    width: 360,
    height: 420,
    x: Math.max(0, width - 420),
    y: Math.max(0, height - 480),
    frame: false,
    transparent: true,
    resizable: false,
    movable: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  petWindow.setAlwaysOnTop(true, 'floating');
  petWindow.loadFile(path.join(__dirname, 'index.html'));

  petWindow.on('closed', () => {
    petWindow = null;
  });
};

const buildTray = () => {
  const iconPath = path.join(__dirname, '..', 'assets', 'tray.png');
  tray = new Tray(nativeImage.createFromPath(iconPath));
  tray.setToolTip('GLM 桌宠');
  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: '显示桌宠',
      click: () => petWindow?.show(),
    },
    {
      label: '暂停动画',
      type: 'checkbox',
      click: (item) => petWindow?.webContents.send('set-paused', item.checked),
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => app.quit(),
    },
  ]));
};

app.whenReady().then(() => {
  createPetWindow();
  buildTray();

  ipcMain.on('pet-context-menu', () => {
    const menu = Menu.buildFromTemplate([
      { label: '挥手', click: () => petWindow?.webContents.send('set-state', 'wave') },
      { label: '整理帽子', click: () => petWindow?.webContents.send('set-state', 'hat') },
      { label: '拉行李箱', click: () => petWindow?.webContents.send('set-state', 'walk') },
      { label: '喝饮料', click: () => petWindow?.webContents.send('set-state', 'drink') },
      { type: 'separator' },
      { label: '隐藏', click: () => petWindow?.hide() },
    ]);
    menu.popup({ window: petWindow });
  });

  ipcMain.on('set-ignore-mouse-events', (_event, ignore) => {
    petWindow?.setIgnoreMouseEvents(ignore, { forward: true });
  });
});

app.on('window-all-closed', (event) => {
  if (!isQuitting) event.preventDefault();
});

app.on('before-quit', () => {
  isQuitting = true;
  tray?.destroy();
});
