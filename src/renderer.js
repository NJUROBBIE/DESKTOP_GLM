const petImage = document.querySelector('#pet-image');
const petButton = document.querySelector('#pet-button');
const statusBubble = document.querySelector('#status-bubble');

const states = {
  wave: { image: '../assets/sprites/wave.png', animation: 'bounce', message: '嗨！我是你的 GLM 桌宠～' },
  hat: { image: '../assets/sprites/hat.png', animation: 'bounce', message: '帽子戴好，准备出发！' },
  walk: { image: '../assets/sprites/walk.png', animation: 'walk', message: '一起去探索新任务！' },
  drink: { image: '../assets/sprites/drink.png', animation: 'float', message: '休息一下，喝口饮料吧。' },
};

let currentState = 'wave';
let paused = false;
let bubbleTimer;

function showMessage(message) {
  statusBubble.textContent = message;
  statusBubble.classList.add('visible');
  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => statusBubble.classList.remove('visible'), 3600);
}

function setState(name, announce = true) {
  const state = states[name] || states.wave;
  currentState = name in states ? name : 'wave';
  petImage.src = state.image;
  petImage.className = state.animation;
  if (paused) petImage.style.animationPlayState = 'paused';
  if (announce) showMessage(state.message);
}

petButton.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  window.desktopPet.openContextMenu();
});

petButton.addEventListener('dblclick', () => {
  const names = Object.keys(states);
  const next = names[(names.indexOf(currentState) + 1) % names.length];
  setState(next);
});

petButton.addEventListener('mouseenter', () => window.desktopPet.setIgnoreMouseEvents(false));
petButton.addEventListener('mouseleave', () => window.desktopPet.setIgnoreMouseEvents(false));

window.desktopPet.onState((name) => setState(name));
window.desktopPet.onPaused((value) => {
  paused = value;
  petImage.style.animationPlayState = paused ? 'paused' : 'running';
  if (!paused) showMessage(states[currentState].message);
});

setState('wave', false);
setTimeout(() => showMessage(states.wave.message), 700);
