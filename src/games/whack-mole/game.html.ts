/**
 * 打地鼠 - 游戏 HTML 生成器
 *
 * 生成单文件离线 HTML，零依赖。
 * 地鼠头顶显示选项文字，快速点击正确答案。
 * 支持评分报告 + 验证码查询。
 */
import type { GameContent, ExportOptions, ChoiceQuestion } from '../../types';
import { getDecoderScript, escapeHtml } from '../shared/shuffle';

/** 获取打地鼠游戏 HTML */
export function generateWhackMoleHTML(content: GameContent, options: ExportOptions): string {
  const { title = '打地鼠游戏', questions } = content;
  const choiceQuestions = questions.filter((q) => q.type === 'choice') as ChoiceQuestion[];
  const gameData = choiceQuestions.map((q) => ({
    question: q.question,
    options: q.options,
    answer: q.answer,
  }));

  const password = options.scorePassword || '';
  const enableScore = options.enableScoreReport !== false;

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
.game-container {
  background: white;
  border-radius: 24px;
  padding: 30px;
  max-width: 700px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.header h1 { font-size: 20px; color: #333; }
.header .stats {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #666;
}
.header .stats span { font-weight: 600; color: #667eea; }
.question-area {
  background: #f8f9ff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  min-height: 60px;
  text-align: center;
  font-size: 18px;
  color: #333;
  line-height: 1.6;
}
.mole-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}
.mole-hole {
  position: relative;
  height: 140px;
  overflow: hidden;
  cursor: pointer;
}
.mole {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) translateY(100%);
  width: 100%;
  height: 120px;
  background: linear-gradient(180deg, #8B4513 0%, #A0522D 50%, #8B4513 100%);
  border-radius: 50% 50% 40% 40%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  transition: transform 0.15s ease-out;
  font-size: 14px;
  font-weight: 600;
  color: white;
  text-align: center;
  word-break: break-all;
  line-height: 1.2;
  user-select: none;
}
.mole.show { transform: translateX(-50%) translateY(0); }
.mole.correct {
  background: linear-gradient(180deg, #22c55e 0%, #16a34a 100%);
}
.mole.wrong {
  background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%);
  animation: shake 0.3s;
}
.mole.hit { transform: translateX(-50%) translateY(100%); }
.hole {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  height: 24px;
  background: #5D4037;
  border-radius: 50%;
  z-index: 1;
}
@keyframes shake {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  25% { transform: translateX(-50%) translateY(-5px) rotate(-5deg); }
  75% { transform: translateX(-50%) translateY(-5px) rotate(5deg); }
}
.score-bar {
  text-align: center;
  padding: 16px;
  background: #f0f4ff;
  border-radius: 12px;
  margin-bottom: 16px;
}
.score-bar .score { font-size: 28px; font-weight: 700; color: #667eea; }
.score-bar .label { font-size: 13px; color: #888; }
.timer-bar {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  margin-bottom: 16px;
  overflow: hidden;
}
.timer-bar .fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #eab308, #ef4444);
  border-radius: 3px;
  transition: width 1s linear;
}
.controls { text-align: center; }
.controls button {
  padding: 12px 32px;
  font-size: 16px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  background: #667eea;
  color: white;
  font-weight: 600;
  transition: opacity 0.2s;
}
.controls button:hover { opacity: 0.9; }
.controls button:disabled { opacity: 0.5; cursor: not-allowed; }

/* 结果页 */
.result-screen {
  display: none;
  text-align: center;
}
.result-screen.show { display: block; }
.game-screen.hide { display: none; }
.result-screen .big-score { font-size: 48px; font-weight: 700; color: #667eea; }
.result-screen .stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 20px 0;
}
.result-screen .stat-card {
  background: #f8f9ff;
  border-radius: 12px;
  padding: 16px;
}
.result-screen .stat-card .value { font-size: 24px; font-weight: 700; color: #333; }
.result-screen .stat-card .label { font-size: 12px; color: #888; margin-top: 4px; }
.code-display {
  background: #f0f4ff;
  border: 2px dashed #667eea;
  border-radius: 12px;
  padding: 12px;
  margin: 16px 0;
  text-align: center;
}
.code-display .code { font-size: 24px; font-weight: 700; color: #667eea; letter-spacing: 4px; }
.code-display .hint { font-size: 12px; color: #888; margin-top: 4px; }
</style>
</head>
<body>
<div class="game-container">
  <div id="gameScreen" class="game-screen">
    <div class="header">
      <h1>${escapeHtml(title)}</h1>
      <div class="stats">
        <div>⏱ <span id="timerDisplay">60</span>s</div>
        <div>✅ <span id="scoreDisplay">0</span>/<span id="totalDisplay">${gameData.length}</span></div>
      </div>
    </div>
    <div class="timer-bar"><div class="fill" id="timerFill" style="width:100%"></div></div>
    <div class="question-area" id="questionDisplay">准备开始！</div>
    <div class="mole-grid" id="moleGrid">
      <div class="mole-hole" data-index="0"><div class="mole" id="mole0"></div><div class="hole"></div></div>
      <div class="mole-hole" data-index="1"><div class="mole" id="mole1"></div><div class="hole"></div></div>
      <div class="mole-hole" data-index="2"><div class="mole" id="mole2"></div><div class="hole"></div></div>
      <div class="mole-hole" data-index="3"><div class="mole" id="mole3"></div><div class="hole"></div></div>
    </div>
    <div class="score-bar">
      <div class="score"><span id="currentScore">0</span></div>
      <div class="label">当前得分</div>
    </div>
    <div class="controls">
      <button id="startBtn">开始游戏</button>
    </div>
  </div>

  <div id="resultScreen" class="result-screen">
    <h2 style="margin-bottom:16px;color:#333;">游戏结束！</h2>
    <div class="big-score"><span id="finalScore">0</span>分</div>
    <div class="stats-grid">
      <div class="stat-card"><div class="value" id="finalCorrect">0</div><div class="label">答对</div></div>
      <div class="stat-card"><div class="value" id="finalAccuracy">0%</div><div class="label">正确率</div></div>
      <div class="stat-card"><div class="value" id="finalTime">0s</div><div class="label">用时</div></div>
    </div>
    <div id="codeDiv" class="code-display" style="display:none;">
      <div class="code" id="scoreCode">XXXXXX</div>
      <div class="hint">将此代码发给老师即可查看成绩</div>
    </div>
    <div class="controls" style="margin-top:20px;">
      <button onclick="location.reload()">再来一局</button>
    </div>
  </div>
</div>
<script>
${getDecoderScript()}
(function() {
  const DATA = ${JSON.stringify(gameData)};
  const TOTAL = DATA.length;
  const TIMER = 60;
  const PASSWORD = '${password}';
  const ENABLE_SCORE = ${enableScore};

  let currentIndex = 0;
  let score = 0;
  let correct = 0;
  let timeLeft = TIMER;
  let isPlaying = false;
  let isAnswered = false;
  let timerInterval = null;
  let startTime = null;
  let details = [];

  const $ = id => document.getElementById(id);
  const questionDisplay = $('questionDisplay');
  const timerDisplay = $('timerDisplay');
  const timerFill = $('timerFill');
  const scoreDisplay = $('scoreDisplay');
  const totalDisplay = $('totalDisplay');
  const currentScore = $('currentScore');
  const startBtn = $('startBtn');
  const moles = [0,1,2,3].map(i => $('mole'+i));
  const holes = document.querySelectorAll('.mole-hole');

  totalDisplay.textContent = TOTAL;

  // 洗牌
  function shuffle(arr) {
    for (let i = arr.length-1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i+1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // 显示当前题目
  function showQuestion() {
    if (currentIndex >= TOTAL) { endGame(); return; }
    const q = DATA[currentIndex];
    questionDisplay.textContent = q.question;
    isAnswered = false;

    // 随机打乱选项顺序，记录正确答案的新位置
    const indices = [0,1,2,3];
    shuffle(indices);
    const correctAnswer = indices.indexOf(q.answer);

    // 重置所有地鼠
    moles.forEach(m => { m.className = 'mole'; m.textContent = ''; });

    // 0.5秒后依次弹出地鼠
    moles.forEach((mole, i) => {
      const optIndex = indices[i];
      mole.textContent = q.options[optIndex];
      mole.dataset.isCorrect = optIndex === q.answer ? '1' : '0';

      // 延迟弹出，制造依次冒出的效果
      setTimeout(() => {
        if (!isAnswered) mole.classList.add('show');
      }, 300 + i * 200);
    });
  }

  // 点击地鼠
  holes.forEach((hole, index) => {
    hole.addEventListener('click', function() {
      if (!isPlaying || isAnswered) return;
      const mole = moles[index];
      if (!mole.classList.contains('show')) return;

      isAnswered = true;
      const isCorrect = mole.dataset.isCorrect === '1';
      const elapsed = Math.round((Date.now() - startTime) / 1000);

      if (isCorrect) {
        mole.className = 'mole show correct';
        score += Math.max(10, 100 - elapsed * 2);
        correct++;
      } else {
        mole.className = 'mole show wrong';
        score = Math.max(0, score - 5);
      }
      score = Math.round(score);
      currentScore.textContent = score;
      scoreDisplay.textContent = correct;

      details.push({
        index: currentIndex,
        question: DATA[currentIndex].question,
        correct: isCorrect,
        correctAnswer: DATA[currentIndex].options[DATA[currentIndex].answer],
        timeSpent: elapsed
      });

      // 0.8秒后下一题
      setTimeout(() => {
        if (isPlaying) {
          currentIndex++;
          showQuestion();
        }
      }, 800);
    });
  });

  // 开始
  function startGame() {
    isPlaying = true;
    startBtn.disabled = true;
    startBtn.textContent = '游戏中...';
    currentIndex = 0;
    score = 0;
    correct = 0;
    timeLeft = TIMER;
    details = [];
    scoreDisplay.textContent = '0';
    currentScore.textContent = '0';
    startTime = Date.now();
    showQuestion();
    startTimer();
  }

  // 计时器
  function startTimer() {
    timerInterval = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = timeLeft;
      timerFill.style.width = (timeLeft / TIMER * 100) + '%';
      if (timeLeft <= 0) endGame();
    }, 1000);
  }

  // 结束
  function endGame() {
    isPlaying = false;
    clearInterval(timerInterval);
    const totalTime = Math.round((Date.now() - startTime) / 1000);
    const accuracy = TOTAL > 0 ? correct / TOTAL : 0;
    const finalScore = Math.round(accuracy * 100);

    // 生成验证码
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const report = {
      gameId: 'whack-mole',
      gameName: '打地鼠',
      title: '${escapeHtml(title)}',
      totalQuestions: TOTAL,
      correctCount: correct,
      score: finalScore,
      accuracy: accuracy,
      timeSpent: totalTime,
      details: details,
      timestamp: Date.now(),
      code: code
    };

    // 保存到 localStorage
    const reports = JSON.parse(localStorage.getItem('kygf_score_reports') || '{}');
    reports[code] = report;
    localStorage.setItem('kygf_score_reports', JSON.stringify(reports));

    $('gameScreen').classList.add('hide');
    $('resultScreen').classList.add('show');
    $('finalScore').textContent = finalScore;
    $('finalCorrect').textContent = correct + '/' + TOTAL;
    $('finalAccuracy').textContent = Math.round(accuracy * 100) + '%';
    $('finalTime').textContent = totalTime + 's';

    if (ENABLE_SCORE && PASSWORD) {
      $('codeDiv').style.display = 'block';
      $('scoreCode').textContent = code;
    }
  }

  startBtn.addEventListener('click', startGame);
  questionDisplay.textContent = '点击「开始游戏」打地鼠！';
})();
</script>
</body>
</html>`;
}