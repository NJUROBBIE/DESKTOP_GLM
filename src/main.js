const { app, BrowserWindow, Menu, Tray, ipcMain, nativeImage, screen } = require('electron');
const path = require('node:path');
const fs = require('node:fs');

let petWindow, tray, cursorTimer, drag;
let size = 160;
let paused = false;
let ignored = false;
const smokeTest = process.argv.includes('--smoke-test');
if (smokeTest) {
  const testProfile = path.join(__dirname, '../outputs/test-profile');
  fs.mkdirSync(testProfile, { recursive: true });
  app.setPath('userData', testProfile);
}
const views = [['wave', '挥手 · 三分之二侧面'], ['hat', '正面 · 整理帽子'],
  ['side', '右侧面 · 站立'], ['back', '背面 · 背包'], ['walk', '左侧面 · 拉行李'], ['drink', '侧面 · 喝饮料']];

function resizePet(next) {
  size = next;
  const bounds = petWindow.getBounds();
  const edge = size + 16;
  const area = screen.getDisplayMatching(bounds).workArea;
  petWindow.setBounds({ width: edge, height: edge,
    x: Math.max(area.x, Math.min(bounds.x + bounds.width - edge, area.x + area.width - edge)),
    y: Math.max(area.y, Math.min(bounds.y + bounds.height - edge, area.y + area.height - edge)) });
}

function menuItems() {
  return [
    { label: '显示桌宠', click: () => petWindow.show() },
    { label: '动作与视角', submenu: views.map(([name, label]) => ({ label,
      click: () => petWindow.webContents.send('set-state', name) })) },
    { label: '大小', submenu: [[120, '迷你 · 120'], [160, '小巧 · 160'], [200, '适中 · 200']]
      .map(([value, label]) => ({ label, type: 'radio', checked: size === value, click: () => resizePet(value) })) },
    { label: '暂停轻微动画', type: 'checkbox', checked: paused, click: (item) => {
      paused = item.checked; petWindow.webContents.send('set-paused', paused);
    } },
    { type: 'separator' },
    { label: '隐藏', click: () => petWindow.hide() },
    { label: '退出', click: () => app.quit() },
  ];
}
function popup() { Menu.buildFromTemplate(menuItems()).popup({ window: petWindow }); }

if (!smokeTest && !app.requestSingleInstanceLock()) app.quit();
else app.whenReady().then(async () => {
  const area = screen.getPrimaryDisplay().workArea;
  petWindow = new BrowserWindow({ width: size + 16, height: size + 16,
    x: area.x + area.width - size - 40, y: area.y + area.height - size - 24,
    frame: false, transparent: true, resizable: false, alwaysOnTop: true,
    skipTaskbar: true, hasShadow: false, backgroundColor: '#00000000', show: !smokeTest,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, sandbox: true },
  });
  petWindow.setAlwaysOnTop(true, 'floating');
  ipcMain.on('pet-context-menu', popup);
  ipcMain.on('pet-drag-start', () => {
    ignored = false;
    petWindow.setIgnoreMouseEvents(false);
    drag = { pointer: screen.getCursorScreenPoint(), bounds: petWindow.getBounds() };
  });
  ipcMain.on('pet-drag-end', () => { drag = null; });
  ipcMain.on('set-ignore-mouse-events', (_event, value) => {
    if (typeof value !== 'boolean' || drag || value === ignored) return;
    ignored = value;
    petWindow.setIgnoreMouseEvents(value, { forward: true });
  });
  await petWindow.loadFile(path.join(__dirname, 'index.html'));
  if (smokeTest) { await require('./smoke-test')(petWindow, resizePet); return; }
  cursorTimer = setInterval(() => {
    if (!petWindow || petWindow.isDestroyed() || !petWindow.isVisible()) return;
    const p = screen.getCursorScreenPoint();
    if (drag) {
      const a = screen.getDisplayNearestPoint(p).workArea;
      petWindow.setPosition(
        Math.round(Math.max(a.x, Math.min(drag.bounds.x + p.x - drag.pointer.x, a.x + a.width - drag.bounds.width))),
        Math.round(Math.max(a.y, Math.min(drag.bounds.y + p.y - drag.pointer.y, a.y + a.height - drag.bounds.height))));
    }
    const b = petWindow.getBounds();
    petWindow.webContents.send('pointer-position', { x: p.x - b.x, y: p.y - b.y });
  }, 50);
  const icon = nativeImage.createFromPath(path.join(__dirname, '../assets/sprites/hat.png')).resize({ height: 24 });
  tray = new Tray(icon);
  tray.setToolTip('GLM 桌宠 · 右键切换视角和大小');
  tray.on('right-click', popup);
  tray.on('click', () => petWindow.show());
});
app.on('second-instance', () => petWindow?.show());
app.on('window-all-closed', () => app.quit());
app.on('before-quit', () => { clearInterval(cursorTimer); tray?.destroy(); });
