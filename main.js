document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startButton');
  const gameContainer = document.getElementById('game-container');

  startButton.addEventListener('click', () => {
    startGame();
  });

  function startGame() {
    // 仮の初期化：今はOppositionが始まるメッセージだけ表示
    gameContainer.innerHTML = `
      <h2>Starting "Opposition"...</h2>
      <p>ここにゲームのエンジンを読み込む処理などを入れていきます。</p>
    `;
    
    // 将来的にここでゲームのエンジンや譜面などを読み込む
  }
});
