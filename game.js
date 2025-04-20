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
    notes = data.notes; // JSON形式：[{ time: 秒数, lane: 0~3 }]
  });

document.addEventListener('keydown', (e) => {
  if (!isPlaying && e.code === 'Space') {
    startTime = performance.now();
    audio.play();
    isPlaying = true;
    requestAnimationFrame(gameLoop);
  }
});

function gameLoop(timestamp) {
  const currentTime = (performance.now() - startTime) / 1000;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // レーンを描画（4レーン）
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = '#333';
    ctx.fillRect(i * 200, 0, 200, canvas.height);
  }

  // ノーツを描画
  for (let note of notes) {
    const timeDiff = note.time - currentTime;
    const y = canvas.height - timeDiff * 300; // 落下スピード調整

    if (y < -50 || y > canvas.height + 50) continue;

    ctx.fillStyle = 'white';
    ctx.fillRect(note.lane * 200 + 50, y, 100, 20);
  }

  if (isPlaying) requestAnimationFrame(gameLoop);
}