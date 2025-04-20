const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const chartFile = 'chart.json';
const audioFile = 'opposition.ogg';

let notes = [];
let startTime = 0;
let audio = new Audio(audioFile);
let isPlaying = false;

fetch(chartFile)
  .then(response => response.json())
  .then(data => {
    notes = data.notes;
  });

document.addEventListener('keydown', (e) => {
  if (!isPlaying && e.code === 'Space') {
    startTime = performance.now();
    audio.play();
    isPlaying = true;
    requestAnimationFrame(gameLoop);
  }
});

const keyMap = {
  'ArrowLeft': 0,
  'ArrowDown': 1,
  'ArrowUp': 2,
  'ArrowRight': 3
};

document.addEventListener('keydown', (e) => {
  if (keyMap.hasOwnProperty(e.code)) {
    checkHit(keyMap[e.code]);
  }
});

// タッチ対応
document.querySelectorAll('#touch-controls button').forEach(button => {
  button.addEventListener('touchstart', () => {
    const lane = parseInt(button.dataset.lane);
    checkHit(lane);
  });
});

function checkHit(lane) {
  const currentTime = (performance.now() - startTime) / 1000;

  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    const timeDiff = Math.abs(note.time - currentTime);

    if (note.lane === lane && timeDiff < 0.2) {
      console.log(`Hit! Lane: ${lane}, TimeDiff: ${timeDiff}`);
      notes.splice(i, 1);
      break;
    }
  }
}

function gameLoop() {
  const currentTime = (performance.now() - startTime) / 1000;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = '#333';
    ctx.fillRect(i * 200, 0, 200, canvas.height);
  }

  for (let note of notes) {
    const timeDiff = note.time - currentTime;
    const y = canvas.height - timeDiff * 300;

    if (y < -50 || y > canvas.height + 50) continue;

    ctx.fillStyle = 'white';
    ctx.fillRect(note.lane * 200 + 50, y, 100, 20);
  }

  if (isPlaying) requestAnimationFrame(gameLoop);
}