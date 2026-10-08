const petImage = document.querySelector('#pet-image');
const petButton = document.querySelector('#pet-button');
const states = {
  wave: { image: '../assets/sprites/wave.png', label: '挥手' },
  hat: { image: '../assets/sprites/hat.png', label: '正面 · 整理帽子' },
  side: { image: '../assets/sprites/side.png', label: '右侧面' },
  back: { image: '../assets/sprites/back.png', label: '背面' },
  walk: { image: '../assets/sprites/walk.png', label: '左侧面 · 拉行李' },
  drink: { image: '../assets/sprites/drink.png', label: '侧面 · 喝饮料' },
};
let currentState = 'wave';
let mask;
let dragging = false;
const maskCanvas = document.createElement('canvas');
const maskContext = maskCanvas.getContext('2d', { willReadFrequently: true });

function rebuildMask() {
  if (!petImage.complete || !petImage.naturalWidth) return;
  maskCanvas.width = innerWidth;
  maskCanvas.height = innerHeight;
  const rect = petImage.getBoundingClientRect();
  maskContext.drawImage(petImage, rect.x, rect.y, rect.width, rect.height);
  mask = maskContext.getImageData(0, 0, innerWidth, innerHeight);
}
function hitTest(x, y) {
  x = Math.floor(x); y = Math.floor(y);
  return !!mask && x >= 0 && y >= 0 && x < mask.width && y < mask.height && mask.data[(y * mask.width + x) * 4 + 3] > 32;
}
function setState(name) {
  if (!Object.hasOwn(states, name)) return;
  currentState = name;
  mask = null;
  petImage.src = states[name].image;
  petImage.alt = states[name].label;
  petButton.title = states[name].label + ' · 拖动移动 / 双击换视角 / 右键调大小';
}
petImage.addEventListener('load', rebuildMask);
window.addEventListener('resize', rebuildMask);
petButton.addEventListener('contextmenu', (event) => {
  event.preventDefault(); window.desktopPet.openContextMenu();
});
petButton.addEventListener('dblclick', () => {
  const names = Object.keys(states);
  setState(names[(names.indexOf(currentState) + 1) % names.length]);
});
petButton.addEventListener('pointerdown', (event) => {
  if (event.button !== 0 || !hitTest(event.clientX, event.clientY)) return;
  dragging = true;
  petButton.setPointerCapture(event.pointerId);
  window.desktopPet.startDrag();
});
function endDrag() { if (dragging) { dragging = false; window.desktopPet.endDrag(); } }
petButton.addEventListener('pointerup', endDrag);
petButton.addEventListener('pointercancel', endDrag);
petButton.addEventListener('lostpointercapture', endDrag);
window.addEventListener('blur', endDrag);
window.addEventListener('keydown', (event) => { if (event.key === 'Escape') endDrag(); });
window.desktopPet.onPointer(({ x, y }) => {
  if (!dragging) window.desktopPet.setIgnoreMouseEvents(!hitTest(x, y));
});
window.desktopPet.onState(setState);
window.desktopPet.onPaused((value) => document.body.classList.toggle('paused', value));
setState('wave');
