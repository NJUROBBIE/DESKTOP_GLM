const { app } = require('electron');
const path = require('node:path');
const fs = require('node:fs');

module.exports = async function runSmokeTest(window, resizePet) {
  try {
    const output = path.join(__dirname, '../outputs');
    fs.mkdirSync(output, { recursive: true });
    const checks = await window.webContents.executeJavaScript(`(async () => {
      document.body.classList.add('paused');
      const results = [];
      for (const name of Object.keys(states)) {
        setState(name);
        await petImage.decode();
        rebuildMask();
        const count = Array.from(mask.data).filter((v, i) => i % 4 === 3 && v > 32).length;
        const ratio = count / (mask.width * mask.height);
        if (ratio < .12 || ratio > .8) throw new Error(name + ': bad alpha ratio ' + ratio);
        if (hitTest(0, 0)) throw new Error('transparent corner intercepts clicks');
        results.push({ name, ratio, width: innerWidth, height: innerHeight });
      }
      setState('wave'); await petImage.decode(); rebuildMask();
      const before = currentState;
      petButton.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
      if (currentState === before) throw new Error('double click did not change state');
      setState('wave'); await petImage.decode(); rebuildMask();
      return results;
    })()`);
    for (const size of [120, 200, 160]) {
      resizePet(size);
      await new Promise(resolve => setTimeout(resolve, 150));
      // Windows fractional display scaling can round the requested DIP by one.
      if (Math.abs(window.getBounds().height - size - 16) > 1) throw new Error('resize failed: ' + JSON.stringify({ size, bounds: window.getBounds() }));
    }
    fs.writeFileSync(path.join(output, 'smoke-results.json'), JSON.stringify(checks, null, 2));
    for (const name of ['wave', 'hat', 'side', 'back', 'walk', 'drink']) {
      await window.webContents.executeJavaScript(`(async () => {setState('${name}'); await petImage.decode(); rebuildMask();})()`);
      const capture = await window.webContents.capturePage();
      fs.writeFileSync(path.join(output, name + '-160.png'), capture.toPNG());
    }
    console.log(JSON.stringify(checks));
    app.quit();
  } catch (error) { console.error(error); app.exit(1); }
};
