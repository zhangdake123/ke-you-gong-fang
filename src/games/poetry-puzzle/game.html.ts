/**
 * 诗句拼图 - 游戏 HTML 生成器
 *
 * 生成单文件离线 HTML，零依赖。
 * 拖拽排序诗句片段，支持评分报告。
 */
import type { GameContent, ExportOptions, OrderingQuestion } from '../../types';
import { getDecoderScript, escapeHtml } from '../shared/shuffle';

/** 获取诗句拼图游戏 HTML */
export function generatePoetryPuzzleHTML(content: GameContent, options: ExportOptions): string {
  const { title = '诗句拼图游戏', questions } = content;
  const orderingQuestions = questions.filter((q) => q.type === 'ordering') as OrderingQuestion[];
  const gameData = orderingQuestions.map((q) => ({
    question: q.question,
    segments: q.segments,
    correctOrder: q.correctOrder,
    explanation: q.explanation || '',
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
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
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
  max-width: 600px;
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
.header .stats span { font-weight: 600; color: #1e3c72; }
.progress {
  text-align: center;
  color: #888;
  font-size: 14px;
  margin-bottom: 12px;
}
.question-area {
  background: #f0f4ff;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  text-align: center;
  font-size: 15px;
  color: #555;
  line-height: 1.5;
}
.puzzle-area {
  min-height: 200px;
  border: 3px dashed #d1d5db;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.3s;
}
.puzzle-area.drag-over { border-color: #1e3c72; background: #f0f4ff; }
.puzzle-area.filled { border-style: solid; border-color: #22c55e; background: #f0fdf4; }
.puzzle-slot {
  background: #f8f9ff;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px 16px;
  min-height: 48px;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  cursor: pointer;
}
.puzzle-slot.filled { background: white; border-color: #6366f1; }
.puzzle-slot .empty-hint { color: #bbb; font-size: 13px; }
.puzzle-slot .segment-text { font-size: 18px; color: #333; font-weight: 500; }
.pieces-area {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 16px;
  background: #f8f9ff;
  border-radius: 16px;
  margin-bottom: 16px;
  min-height: 60px;
}
.piece {
  background: white;
  border: 2px solid #6366f1;
  border-radius: 10px;
  padding: 10px 18px;
  font-size: 16px;
  color: #333;
  cursor: grab;
  user-select: none;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.piece:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
.piece:active { cursor: grabbing; }
.piece.used {
  opacity: 0.3;
  pointer-events: none;
  border-style: dashed;
}
.controls {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 16px;
}
.controls button {
  padding: 12px 28px;
  font-size: 15px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.2s;
}
.controls .btn-check { background: #1e3c72; color: white; }
.controls .btn-next { background: #22c55e; color: white; }
.controls .btn-reset { background: #e5e7eb; color: #666; }
.controls button:hover { opacity: 0.9; }
.controls button:disabled { opacity: 0.4; cursor: not-allowed; }
.explanation {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  padding: 12px;
  margin-top: 12px;
  font-size: 14px;
  color: #166534;
  display: none;
}
.explanation.show { display: block; }
.result-screen {
  display: none;
  text-align: center;
}
.result-screen.show { display: block; }
.game-screen.hide { display: none; }
.result-screen .big-score { font-size: 48px; font-weight: 700; color: #1e3c72; }
.result-screen .stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 20px 0;
}
.result-screen .stat-card { background: #f8f9ff; border-radius: 12px; padding: 16px; }
.result-screen .stat-card .value { font-size: 24px; font-weight: 700; color: #333; }
.result-screen .stat-card .label { font-size: 12px; color: #888; margin-top: 4px; }
.code-display {
  background: #f0f4ff; border: 2px dashed #1e3c72;
  border-radius: 12px; padding: 12px; margin: 16px 0; text-align: center;
}
.code-display .code { font-size: 24px; font-weight: 700; color: #1e3c72; letter-spacing: 4px; }
.code-display .hint { font-size: 12px; color: #888; margin-top: 4px; }
</style>
</head>
<body>
<div class="game-container">
  <div id="gameScreen" class="game-screen">
    <div class="header">
      <h1>${escapeHtml(title)}</h1>
      <div class="stats">
        <div>📜 <span id="currentRound">1</span>/<span id="totalRounds">${gameData.length}</span></div>
        <div>✅ <span id="correctCount">0</span></div>
      </div>
    </div>
    <div class="progress" id="progressText">第 1 关，共 ${gameData.length} 关</div>
    <div class="question-area" id="questionDisplay">请将以下诗句片段按正确顺序排列</div>
    <div class="puzzle-area" id="puzzleArea">
      <div class="puzzle-slot"><span class="empty-hint">点击碎片拼到这里</span></div>
    </div>
    <div class="pieces-area" id="piecesArea"></div>
    <div class="explanation" id="explanation"></div>
    <div class="controls">
      <button class="btn-reset" id="resetBtn">重置</button>
      <button class="btn-check" id="checkBtn">检查答案</button>
      <button class="btn-next" id="nextBtn" style="display:none;" disabled>下一关</button>
    </div>
  </div>

  <div id="resultScreen" class="result-screen">
    <h2 style="margin-bottom:16px;color:#333;">拼图完成！</h2>
    <div class="big-score"><span id="finalScore">0</span>分</div>
    <div class="stats-grid">
      <div class="stat-card"><div class="value" id="finalCorrect">0</div><div class="label">正确</div></div>
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
(function() {
  const DATA = ${JSON.stringify(gameData)};
  const TOTAL = DATA.length;
  const PASSWORD = '${password}';
  const ENABLE_SCORE = ${enableScore};

  let currentIndex = 0;
  let correctTotal = 0;
  let wrongTotal = 0;
  let startTime = Date.now();
  let details = [];

  const $ = id => document.getElementById(id);
  const puzzleArea = $('puzzleArea');
  const piecesArea = $('piecesArea');
  const questionDisplay = $('questionDisplay');
  const currentRound = $('currentRound');
  const totalRounds = $('totalRounds');
  const correctCount = $('correctCount');
  const progressText = $('progressText');
  const checkBtn = $('checkBtn');
  const resetBtn = $('resetBtn');
  const nextBtn = $('nextBtn');
  const explanation = $('explanation');

  let currentSegments = [];
  let currentOrder = [];
  let placedSegments = [];
  let isChecked = false;

  function shuffle(arr) {
    for (let i = arr.length-1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i+1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function loadRound(index) {
    const data = DATA[index];
    currentSegments = [...data.segments];
    currentOrder = [...data.correctOrder];
    placedSegments = new Array(currentSegments.length).fill(null);
    isChecked = false;

    // 洗牌碎片
    const shuffled = shuffle([...currentSegments]);

    // 更新 UI
    questionDisplay.textContent = data.question;
    currentRound.textContent = index + 1;
    progressText.textContent = '第 ' + (index + 1) + ' 关，共 ' + TOTAL + ' 关';

    // 清空拼图区
    puzzleArea.innerHTML = '';
    for (let i = 0; i < currentSegments.length; i++) {
      const slot = document.createElement('div');
      slot.className = 'puzzle-slot';
      slot.dataset.slotIndex = i;
      slot.innerHTML = '<span class="empty-hint">点击碎片拼到这里</span>';
      slot.addEventListener('click', function() {
        const idx = parseInt(this.dataset.slotIndex);
        if (placedSegments[idx] !== null) {
          // 移回碎片区
          const seg = placedSegments[idx];
          placedSegments[idx] = null;
          addPiece(seg);
          renderPuzzle();
        }
      });
      puzzleArea.appendChild(slot);
    }
    puzzleArea.classList.remove('filled');

    // 填充碎片区
    piecesArea.innerHTML = '';
    shuffled.forEach(seg => addPiece(seg));

    checkBtn.disabled = false;
    checkBtn.textContent = '检查答案';
    nextBtn.style.display = 'none';
    explanation.classList.remove('show');
    explanation.textContent = '';
  }

  function addPiece(text) {
    const piece = document.createElement('div');
    piece.className = 'piece';
    piece.textContent = text;
    piece.draggable = true;
    piece.addEventListener('dragstart', function(e) {
      e.dataTransfer.setData('text/plain', text);
    });
    piece.addEventListener('click', function() {
      // 点击碎片放入第一个空位
      placePiece(text);
    });
    piecesArea.appendChild(piece);
  }

  function placePiece(text) {
    const emptyIndex = placedSegments.indexOf(null);
    if (emptyIndex === -1) return;
    placedSegments[emptyIndex] = text;
    // 从碎片区移除
    const pieces = piecesArea.querySelectorAll('.piece');
    for (const p of pieces) {
      if (p.textContent === text && !p.classList.contains('used')) {
        p.remove();
        break;
      }
    }
    renderPuzzle();
  }

  // 拖拽放置
  puzzleArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    puzzleArea.classList.add('drag-over');
  });
  puzzleArea.addEventListener('dragleave', function() {
    puzzleArea.classList.remove('drag-over');
  });
  puzzleArea.addEventListener('drop', function(e) {
    e.preventDefault();
    puzzleArea.classList.remove('drag-over');
    const text = e.dataTransfer.getData('text/plain');
    if (text) placePiece(text);
  });

  // 暂时使用点击逻辑替代拖拽（更易用）
  // 拖拽作为辅助保留

  function renderPuzzle() {
    const slots = puzzleArea.querySelectorAll('.puzzle-slot');
    const allFilled = placedSegments.every(s => s !== null);
    if (allFilled) {
      puzzleArea.classList.add('filled');
    } else {
      puzzleArea.classList.remove('filled');
    }
    placedSegments.forEach((seg, i) => {
      const slot = slots[i];
      if (seg !== null) {
        slot.classList.add('filled');
        slot.innerHTML = '<span class="segment-text">' + seg + '</span>';
      } else {
        slot.classList.remove('filled');
        slot.innerHTML = '<span class="empty-hint">点击碎片拼到这里</span>';
      }
    });
  }

  // 检查答案
  checkBtn.addEventListener('click', function() {
    if (isChecked) return;
    const allFilled = placedSegments.every(s => s !== null);
    if (!allFilled) {
      alert('请先把所有碎片放入拼图区！');
      return;
    }

    isChecked = true;
    let correct = 0;
    const slots = puzzleArea.querySelectorAll('.puzzle-slot');
    placedSegments.forEach((seg, i) => {
      const expectedIdx = currentOrder[i];
      const expected = currentSegments[expectedIdx];
      if (seg === expected) {
        slots[i].style.borderColor = '#22c55e';
        slots[i].style.background = '#f0fdf4';
        correct++;
      } else {
        slots[i].style.borderColor = '#ef4444';
        slots[i].style.background = '#fef2f2';
      }
    });

    const isAllCorrect = correct === currentSegments.length;
    if (isAllCorrect) {
      correctTotal++;
      explanation.textContent = '✓ 全部正确！' + (DATA[currentIndex].explanation ? ' ' + DATA[currentIndex].explanation : '');
      explanation.className = 'explanation show';
      explanation.style.background = '#f0fdf4';
      explanation.style.borderColor = '#bbf7d0';
      explanation.style.color = '#166534';
      checkBtn.textContent = '✓ 正确！';
      checkBtn.disabled = true;
      nextBtn.style.display = 'inline-block';
      nextBtn.disabled = false;
    } else {
      wrongTotal++;
      explanation.textContent = '✗ 有 ' + (currentSegments.length - correct) + ' 处错误，再试试吧！' + (DATA[currentIndex].explanation ? ' 提示：' + DATA[currentIndex].explanation : '');
      explanation.className = 'explanation show';
      explanation.style.background = '#fef2f2';
      explanation.style.borderColor = '#fecaca';
      explanation.style.color = '#991b1b';
      checkBtn.textContent = '再试一次';
      isChecked = false;
    }
    correctCount.textContent = correctTotal;
  });

  // 重置
  resetBtn.addEventListener('click', function() {
    loadRound(currentIndex);
  });

  // 下一关
  nextBtn.addEventListener('click', function() {
    if (currentIndex < TOTAL - 1) {
      currentIndex++;
      loadRound(currentIndex);
    } else {
      endGame();
    }
  });

  // 结束
  function endGame() {
    const totalTime = Math.round((Date.now() - startTime) / 1000);
    const totalDone = correctTotal + wrongTotal;
    const accuracy = totalDone > 0 ? correctTotal / totalDone : 0;
    const finalScore = Math.round(accuracy * 100);

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const report = {
      gameId: 'poetry-puzzle',
      gameName: '诗句拼图',
      title: '${escapeHtml(title)}',
      totalQuestions: TOTAL,
      correctCount: correctTotal,
      score: finalScore,
      accuracy: accuracy,
      timeSpent: totalTime,
      details: [],
      timestamp: Date.now(),
      code: code
    };

    const reports = JSON.parse(localStorage.getItem('kygf_score_reports') || '{}');
    reports[code] = report;
    localStorage.setItem('kygf_score_reports', JSON.stringify(reports));

    $('gameScreen').classList.add('hide');
    $('resultScreen').classList.add('show');
    $('finalScore').textContent = finalScore;
    $('finalCorrect').textContent = correctTotal + '/' + TOTAL;
    $('finalAccuracy').textContent = Math.round(accuracy * 100) + '%';
    $('finalTime').textContent = totalTime + 's';

    if (ENABLE_SCORE && PASSWORD) {
      $('codeDiv').style.display = 'block';
      $('scoreCode').textContent = code;
    }
  }

  // 开始
  loadRound(0);
  totalRounds.textContent = TOTAL;
})();
</script>
</body>
</html>`;
}