/**
 * 连连看 - HTML 生成器
 *
 * 生成零依赖的单文件 HTML 游戏，卡通明亮风格，适合小学生。
 * 防作弊：配对关系通过 Base64 编码注入 JS 变量，运行时解码到内存。
 * DOM 上只显示文字内容，不写 data-answer 等属性，配对索引存在闭包中。
 * 跨模块调用方：src/games/matching/template.ts
 */
import type { GameContent, ExportOptions } from '../../types';
import { encodeBase64, getDecoderScript } from '../../engine/security/encode';
import { getShuffleScript } from '../shared/shuffle';
import { escapeHtml } from '../../engine/security/escape';

/** 主题配色方案 */
interface ThemeColors {
  primary: string;
  success: string;
  warning: string;
  danger: string;
  bg1: string;
  bg2: string;
}

const THEMES: Record<ExportOptions['theme'], ThemeColors> = {
  default: { primary: '#4A90D9', success: '#52C41A', warning: '#FAAD14', danger: '#FF4D4F', bg1: '#E6F3FF', bg2: '#F0F9FF' },
  forest:  { primary: '#3FA834', success: '#52C41A', warning: '#D4B106', danger: '#CF1322', bg1: '#F0F9EB', bg2: '#FCFFE6' },
  ocean:   { primary: '#1890FF', success: '#13C2C2', warning: '#FAAD14', danger: '#FF4D4F', bg1: '#E6F7FF', bg2: '#F0F9FF' },
  sunset:  { primary: '#FA541C', success: '#52C41A', warning: '#FAAD14', danger: '#FF4D4F', bg1: '#FFF2E8', bg2: '#FFF7E6' },
};

/** 生成连连看 CSS（含主题变量，内联到 <style> 标签） */
function getMatchingCSS(t: ThemeColors): string {
  return `
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html { font-size: 16px; -webkit-text-size-adjust: 100%; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", "Helvetica Neue", Arial, sans-serif;
      background: linear-gradient(135deg, ${t.bg1} 0%, ${t.bg2} 100%);
      min-height: 100vh; color: #333; line-height: 1.6;
      -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
    }
    #app { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
    *:focus { outline: none; }
    *:focus-visible { outline: 3px solid ${t.primary}; outline-offset: 2px; }
    .card {
      background: #fff; border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06);
      padding: 32px; max-width: 680px; width: 100%; animation: fadeIn 0.4s ease;
    }
    .btn-primary {
      display: inline-block; background: ${t.primary}; color: #fff; border: none;
      border-radius: 12px; padding: 14px 28px; font-size: 18px; font-weight: 600;
      cursor: pointer; transition: transform 0.15s ease, box-shadow 0.15s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-family: inherit;
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.2); }
    .btn-primary:active { transform: scale(0.97); }
    .btn-large { font-size: 22px; padding: 16px 40px; border-radius: 14px; }
    .start-card { text-align: center; }
    .start-icon { font-size: 64px; margin-bottom: 12px; }
    .game-title { font-size: 28px; color: ${t.primary}; margin-bottom: 4px; }
    .game-subtitle { font-size: 18px; color: #999; margin-bottom: 20px; }
    .info-row { display: flex; gap: 12px; justify-content: center; margin-bottom: 24px; flex-wrap: wrap; }
    .info-badge { background: #F0F7FF; color: ${t.primary}; padding: 6px 14px; border-radius: 20px; font-size: 14px; font-weight: 500; }
    /* 连连看棋盘 */
    .match-card { animation: slideIn 0.3s ease; }
    .match-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .q-counter { font-size: 15px; color: #666; font-weight: 500; }
    .q-timer { font-size: 15px; color: ${t.warning}; font-weight: 600; font-variant-numeric: tabular-nums; }
    .match-board { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 12px; }
    .match-col-wrapper { display: flex; flex-direction: column; gap: 8px; }
    .col-header { text-align: center; font-size: 14px; font-weight: 600; color: ${t.primary}; padding: 4px 0; }
    .match-column { display: flex; flex-direction: column; gap: 10px; }
    .match-item {
      background: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 12px;
      padding: 14px 16px; font-size: 17px; text-align: center; cursor: pointer;
      transition: all 0.2s ease; font-family: inherit; color: #333;
      width: 100%; line-height: 1.4;
    }
    .match-item:hover:not(.matched) { border-color: ${t.primary}; background: #F0F7FF; transform: translateY(-2px); }
    .match-item:active:not(.matched) { transform: scale(0.98); }
    .match-item.selected {
      border-color: ${t.primary}; background: #E6F3FF;
      box-shadow: 0 0 0 3px rgba(74, 144, 217, 0.2); transform: translateY(-2px);
    }
    .match-item.matched {
      border-color: ${t.success}; background: #F6FFED; cursor: default; opacity: 0.65;
      animation: pulseGreen 0.4s ease;
    }
    .match-item.wrong { border-color: ${t.danger}; background: #FFF1F0; animation: shake 0.4s ease; }
    .match-feedback { text-align: center; font-size: 15px; font-weight: 600; min-height: 24px; padding: 8px; border-radius: 8px; transition: all 0.2s ease; }
    .match-feedback.correct { color: ${t.success}; }
    .match-feedback.wrong { color: ${t.danger}; }
    .match-feedback.hint { color: ${t.warning}; }
    /* 结算页 */
    .result-card { text-align: center; }
    .result-icon { font-size: 72px; margin-bottom: 8px; animation: bounceIn 0.5s ease; }
    .result-title { font-size: 26px; color: ${t.primary}; margin-bottom: 8px; }
    .stars { font-size: 32px; margin-bottom: 20px; letter-spacing: 4px; }
    .result-stats { display: flex; justify-content: center; gap: 24px; margin-bottom: 24px; flex-wrap: wrap; }
    .stat-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
    .stat-num { font-size: 28px; font-weight: 700; color: ${t.primary}; }
    .stat-label { font-size: 13px; color: #999; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes pulseGreen { 0%,100% { transform: scale(1); } 50% { transform: scale(1.03); } }
    @keyframes shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
    @keyframes bounceIn { 0% { opacity: 0; transform: scale(0.3); } 50% { opacity: 1; transform: scale(1.1); } 100% { transform: scale(1); } }
    @media (max-width: 768px) {
      .card { padding: 24px; } .game-title { font-size: 24px; }
      .match-item { font-size: 15px; padding: 12px 10px; }
      .btn-large { font-size: 20px; padding: 14px 32px; } .result-icon { font-size: 60px; }
      .match-board { gap: 12px; }
    }
    @media (max-width: 480px) {
      #app { padding: 12px; } .card { padding: 16px; border-radius: 12px; }
      .game-title { font-size: 20px; } .game-subtitle { font-size: 16px; }
      .match-item { font-size: 13px; padding: 10px 6px; } .match-column { gap: 6px; }
      .match-board { gap: 8px; } .col-header { font-size: 13px; }
      .btn-large { font-size: 18px; padding: 12px 24px; }
      .result-icon { font-size: 48px; } .stat-num { font-size: 22px; } .result-stats { gap: 16px; }
    }
  `;
}

/** 连连看游戏逻辑（内联到 <script> 标签，运行时执行） */
const MATCHING_GAME_JS = `
  (function() {
    var DATA = _DATA;
    var pairs = DATA.pairs;
    var total = pairs.length;
    var matched = 0;
    var errors = 0;
    var startTime = 0;
    var timerInterval = null;
    var selectedLeft = -1;
    var leftButtons = [];
    var rightButtons = [];

    var app = document.getElementById('app');

    function fmtTime(sec) {
      var m = Math.floor(sec / 60);
      var s = sec % 60;
      return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }

    /* --- 开始页 --- */
    function renderStart() {
      if (total === 0) {
        app.innerHTML = '<div class="card start-card"><div class="start-icon">🔗</div><h1 class="game-title">' + DATA.title + '</h1><p class="game-subtitle">暂无配对数据</p></div>';
        return;
      }
      app.innerHTML =
        '<div class="card start-card">' +
          '<div class="start-icon">🔗</div>' +
          '<h1 class="game-title">' + DATA.title + '</h1>' +
          '<p class="game-subtitle">连连看</p>' +
          '<div class="info-row">' +
            '<span class="info-badge">📋 ' + total + ' 组配对</span>' +
            (DATA.showTimer ? '<span class="info-badge">⏱️ 计时挑战</span>' : '') +
            '<span class="info-badge">👆 左选右配</span>' +
          '</div>' +
          '<button id="btn-start" class="btn-primary btn-large">开始配对 🚀</button>' +
        '</div>';
      var btn = document.getElementById('btn-start');
      if (btn) { btn.addEventListener('click', startGame); btn.focus(); }
    }

    /* --- 开始游戏 --- */
    function startGame() {
      matched = 0; errors = 0; startTime = Date.now();
      selectedLeft = -1; leftButtons = []; rightButtons = [];
      if (DATA.showTimer) {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 200);
      }
      renderBoard();
    }

    function updateTimer() {
      var el = document.getElementById('timer');
      if (el) {
        var sec = Math.floor((Date.now() - startTime) / 1000);
        el.textContent = fmtTime(sec);
      }
    }

    /* --- 渲染配对棋盘 --- */
    function renderBoard() {
      var indices = [];
      for (var i = 0; i < total; i++) indices.push(i);
      var leftOrder = DATA.shuffle ? _shuffle(indices.slice()) : indices.slice();
      var rightOrder = _shuffle(indices.slice());

      app.innerHTML =
        '<div class="card match-card">' +
          '<div class="match-header">' +
            '<span id="match-counter" class="q-counter">已配对 0 / ' + total + '</span>' +
            (DATA.showTimer ? '<span id="timer" class="q-timer">00:00</span>' : '') +
          '</div>' +
          '<div class="match-board">' +
            '<div class="match-col-wrapper">' +
              '<div class="col-header">题目</div>' +
              '<div id="left-col" class="match-column"></div>' +
            '</div>' +
            '<div class="match-col-wrapper">' +
              '<div class="col-header">答案</div>' +
              '<div id="right-col" class="match-column"></div>' +
            '</div>' +
          '</div>' +
          '<div id="match-feedback" class="match-feedback hint" aria-live="polite">点击左侧题目开始配对</div>' +
        '</div>';

      var leftCol = document.getElementById('left-col');
      var rightCol = document.getElementById('right-col');
      leftButtons = [];
      rightButtons = [];

      /* 通过 DOM 创建按钮，配对索引存在闭包中，不写入 DOM 属性 */
      leftOrder.forEach(function(pairIdx) {
        var btn = document.createElement('button');
        btn.className = 'match-item left-item';
        btn.innerHTML = pairs[pairIdx].left;
        btn.addEventListener('click', function() { selectLeft(pairIdx, btn); });
        leftButtons.push({ el: btn, pairIdx: pairIdx });
        leftCol.appendChild(btn);
      });

      rightOrder.forEach(function(pairIdx) {
        var btn = document.createElement('button');
        btn.className = 'match-item right-item';
        btn.innerHTML = pairs[pairIdx].right;
        btn.addEventListener('click', function() { selectRight(pairIdx, btn); });
        rightButtons.push({ el: btn, pairIdx: pairIdx });
        rightCol.appendChild(btn);
      });
    }

    /* --- 选择左侧题目 --- */
    function selectLeft(pairIdx, btn) {
      if (btn.classList.contains('matched')) return;
      leftButtons.forEach(function(b) { b.el.classList.remove('selected'); });
      btn.classList.add('selected');
      selectedLeft = pairIdx;
      setFeedback('已选择，请点击对应答案', 'hint');
    }

    /* --- 选择右侧答案，尝试配对 --- */
    function selectRight(pairIdx, btn) {
      if (btn.classList.contains('matched')) return;
      if (selectedLeft === -1) {
        setFeedback('请先选择左侧题目', 'hint');
        return;
      }

      if (selectedLeft === pairIdx) {
        /* 配对正确 */
        btn.classList.add('matched');
        leftButtons.forEach(function(b) {
          if (b.pairIdx === selectedLeft) {
            b.el.classList.remove('selected');
            b.el.classList.add('matched');
          }
        });
        matched++;
        selectedLeft = -1;
        var counter = document.getElementById('match-counter');
        if (counter) counter.textContent = '已配对 ' + matched + ' / ' + total;
        setFeedback('配对正确！', 'correct');
        if (matched >= total) {
          setTimeout(showResults, 700);
        }
      } else {
        /* 配对错误 */
        errors++;
        btn.classList.add('wrong');
        setTimeout(function() { btn.classList.remove('wrong'); }, 600);
        leftButtons.forEach(function(b) { b.el.classList.remove('selected'); });
        selectedLeft = -1;
        setFeedback('配对错误，请再试一次', 'wrong');
      }
    }

    function setFeedback(msg, type) {
      var fb = document.getElementById('match-feedback');
      if (fb) {
        fb.textContent = msg;
        fb.className = 'match-feedback ' + type;
      }
    }

    /* --- 结算页 --- */
    function showResults() {
      if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
      var elapsed = Math.floor((Date.now() - startTime) / 1000);
      var stars = errors === 0 ? '⭐ ⭐ ⭐' : (errors <= 3 ? '⭐ ⭐' : '⭐');
      var icon = errors === 0 ? '🏆' : '🎉';

      var statsHTML =
        (DATA.showTimer ? '<div class="stat-item"><span class="stat-num">' + fmtTime(elapsed) + '</span><span class="stat-label">用时</span></div>' : '') +
        '<div class="stat-item"><span class="stat-num">' + errors + '</span><span class="stat-label">错误次数</span></div>' +
        '<div class="stat-item"><span class="stat-num">' + total + '</span><span class="stat-label">配对总数</span></div>';

      app.innerHTML =
        '<div class="card result-card">' +
          '<div class="result-icon">' + icon + '</div>' +
          '<h1 class="result-title">配对完成！</h1>' +
          '<div class="stars">' + stars + '</div>' +
          '<div class="result-stats">' + statsHTML + '</div>' +
          '<button id="btn-restart" class="btn-primary btn-large">再玩一次 🔄</button>' +
        '</div>';

      var btn = document.getElementById('btn-restart');
      if (btn) { btn.addEventListener('click', startGame); btn.focus(); }
    }

    /* 初始化 */
    renderStart();
  })();
`;

/** 生成连连看单文件 HTML */
export function generateMatchingHTML(content: GameContent, options: ExportOptions): string {
  const theme = THEMES[options.theme] || THEMES.default;
  const title = content.title || '连连看';

  /* 构建配对数据（所有文本经 escapeHtml 转义后 Base64 编码） */
  const payload = {
    title: escapeHtml(title),
    pairs: content.pairs.map((p) => ({
      left: escapeHtml(p.left),
      right: escapeHtml(p.right),
    })),
    shuffle: options.shuffleQuestions,
    showTimer: options.showTimer,
  };

  const encoded = encodeBase64(JSON.stringify(payload));

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} - 连连看</title>
  <style>${getMatchingCSS(theme)}</style>
</head>
<body>
  <div id="app"></div>
  <script>
    ${getDecoderScript()}
    ${getShuffleScript()}
    var _DATA = JSON.parse(_dec("${encoded}"));
    ${MATCHING_GAME_JS}
  </script>
</body>
</html>`;
}
