window.onload = async () => {
  const audio = new Audio('opposition.mp3');
  const response = await fetch('opposition.json');
  const chart = await response.json();

  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');

  let startTime = null;
  let notes = chart.notes;

  // キー入力処理
  const pressed = {};
  document.addEventListener('keydown', e => pressed[e.key] = true);
  document.addEventListener('keyup', e => pressed[e.key] = false);

  function drawNote(note, currentTime) {
    const timeDiff = note.time - currentTime;
    const y = canvas.height - timeDiff * 300;
    const x = 100 + note.lane * 100;
    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, 80, 20);
  }

  function gameLoop(timestamp) {
    if (!startTime) {
      startTime = timestamp;
      audio.play();
    }
    const currentTime = (timestamp - startTime) / 1000;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    notes.forEach(note => {
      if (note.time > currentTime - 2 && note.time < currentTime + 2) {
        drawNote(note, currentTime);
      }
    });

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
};