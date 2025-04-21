const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const chartFile = 'chart.json';

// 修正ポイント：明示的に public フォルダから読み込むように（ただし Vercel では 'public/' は書かない！）
const audioFile = 'opposition.ogg'; // ← これでOK（public内にあること前提）

let notes = [];
let startTime = 0;
let audio = new Audio(audioFile);
let isPlaying = false;

// 譜面データ読み込み
fetch(chartFile)
  .then(response => response.json())
  .then(data => {
    notes = data.notes;
  });

// スペースキーで再生開始
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

// キーボード入力チェック
document.addEventListener('keydown', (e) => {
  if (keyMap.hasOwnProperty(e.code)) {
    checkHit(keyMap[e.code]);
  }
});

// タッチ操作チェック
document.querySelectorAll('#touch-controls button').forEach(button => {
  button.addEventListener('touchstart', () => {
    const lane = parseInt(button.dataset.lane);
    checkHit(lane);
  });
});

// ノーツ判定処理
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

// メイン描画ループ
function gameLoop() {
  const currentTime = (performance.now() - startTime) / 1000;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // レーン描画
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = '#333';
    ctx.fillRect(i * 200, 0, 200, canvas.height);
  }

  // ノーツ描画
  for (let note of notes) {
    const timeDiff = note.time - currentTime;
    const y = canvas.height - timeDiff * 300;

    if (y < -50 || y > canvas.height + 50) continue;

    ctx.fillStyle = 'white';
    ctx.fillRect(note.lane * 200 + 50, y, 100, 20);
  }

  if (isPlaying) requestAnimationFrame(gameLoop);
}

// ロード成功／失敗のログ確認
audio.addEventListener('canplaythrough', () => {
  console.log('音声ファイルが読み込まれました');
});

audio.addEventListener('error', (e) => {
  console.error('音声ファイルの読み込みエラー:', e);
});