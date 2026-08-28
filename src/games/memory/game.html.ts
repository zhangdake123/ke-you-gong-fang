/**
 * 翻牌记忆 - HTML 生成器
 *
 * 生成零依赖的单文件 HTML 游戏，卡通明亮风格，适合小学生。
 * 防作弊：配对关系通过 Base64 编码注入 JS 变量，运行时解码到内存。
 * 卡片只显示文字内容，配对关系在 JS 内存中，不写入 DOM 属性。
 * 使用 CSS 3D transform 实现卡片翻转动画。
 * 跨模块调用方：src/games/memory/template.ts
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

/** 生成翻牌记忆 CSS（含主题变量，内联到 <style> 标签） */
function getMemoryCSS(t: ThemeColors): string {
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
      padding: 32px; max-width: 600px; width: 100%; animation: fadeIn 0.4s ease;
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
    /* 棋盘头部 */
    .memory-container { animation: slideIn 0.3s ease; }
    .match-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .header-left { display: flex; gap: 12px; align-items: center; }
    .q-counter { font-size: 15px; color: #666; font-weight: 500; }
    .q-timer { font-size: 15px; color: ${t.warning}; font-weight: 600; font-variant-numeric: tabular-nums; }
    /* 卡片网格 */
    .memory-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(85px, 1fr));
      gap: 8px; max-width: 500px; margin: 0 auto 12px;
    }
    /* 卡片 3D 翻转 */
    .mem-card {
      position: relative; height: 110px; perspective: 600px;
      cursor: pointer; transition: transform 0.15s ease;
    }
    .mem-card:not(.matched):not(.flipped):hover { transform: translateY(-3px); }
    .mem-card-inner {
      position: relative; width: 100%; height: 100%;
      transform-style: preserve-3d; -webkit-transform-style: preserve-3d;
      transition: transform 0.5s ease;
    }
    .mem-card.flipped .mem-card-inner { transform: rotateY(180deg); }
    .mem-cover {
      position: absolute; width: 100%; height: 100%;
      backface-visibility: hidden; -webkit-backface-visibility: hidden;
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, ${t.primary}, ${t.bg1});
      border-radius: 10px; font-size: 32px; font-weight: 700; color: #fff;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .mem-face {
      position: absolute; width: 100%; height: 100%;
      backface-visibility: hidden; -webkit-backface-visibility: hidden;
      transform: rotateY(180deg);
      display: flex; align-items: center; justify-content: center;
      background: #fff; border: 2px solid #E2E8F0; border-radius: 10px;
      padding: 6px; text-align: center; font-size: 14px; color: #333;
      overflow: hidden; word-break: break-word; line-height: 1.3;
    }
    .mem-card.matched .mem-face { border-color: ${t.success}; background: #F6FFED; animation: pulseGreen 0.4s ease; }
    .mem-card.matched { transform: scale(0.95); }
    .mem-card.wrong .mem-face { border-color: ${t.danger}; background: #FFF1F0; animation: shake 0.4s ease; }
    .match-feedback { text-align: center; font-size: 15px; font-weight: 600; min-height: 24px; padding: 8px; border-radius: 8px; }
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
      .mem-card { height: 95px; } .memory-grid { gap: 8px; }
      .btn-large { font-size: 20px; padding: 14px 32px; } .result-icon { font-size: 60px; }
    }
    @media (max-width: 480px) {
      #app { padding: 12px; } .card { padding: 16px; border-radius: 12px; }
      .game-title { font-size: 20px; } .game-subtitle { font-size: 16px; }
      .memory-grid { grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)); gap: 6px; }
      .mem-card { height: 80px; } .mem-cover { font-size: 24px; }
      .mem-face { font-size: 12px; padding: 4px; }
      .btn-large { font-size: 18px; padding: 12px 24px; }
      .result-icon { font-size: 48px; } .stat-num { font-size: 22px; } .result-stats { gap: 16px; }
    }
  `;
}

/** 翻牌记忆游戏逻辑（内联到 <script> 标签，运行时执行） */
const MEMORY_GAME_JS = `
  (function() {
    var DATA = _DATA;
    var pairs = DATA.pairs;
    var totalPairs = pairs.length;
    var cards = [];
    var flipped = [];
    var matched = 0;
    var steps = 0;
    var startTime = 0;
    var timerInterval = null;
    var locked = false;

    var app = document.getElementById('app');

    function fmtTime(sec) {
      var m = Math.floor(sec / 60);
      var s = sec % 60;
      return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }

    /* --- 开始页 --- */
    function renderStart() {
      if (totalPairs === 0) {
        app.innerHTML = '<div class="card start-card"><div class="start-icon">🃏</div><h1 class="game-title">' + DATA.title + '</h1><p class="game-subtitle">暂无配对数据</p></div>';
        return;
      }
      app.innerHTML =
        '<div class="card start-card">' +
          '<div class="start-icon">🃏</div>' +
          '<h1 class="game-title">' + DATA.title + '</h1>' +
          '<p class="game-subtitle">翻牌记忆</p>' +
          '<div class="info-row">' +
            '<span class="info-badge">🃏 ' + (totalPairs * 2) + ' 张牌</span>' +
            '<span class="info-badge">📋 ' + totalPairs + ' 组配对</span>' +
            (DATA.showTimer ? '<span class="info-badge">⏱️ 计时挑战</span>' : '') +
          '</div>' +
          '<button id="btn-start" class="btn-primary btn-large">开始翻牌 🚀</button>' +
        '</div>';
      var btn = document.getElementById('btn-start');
      if (btn) { btn.addEventListener('click', startGame); btn.focus(); }
    }

    /* --- 开始游戏 --- */
    function startGame() {
      /* 为每对配对生成两张牌（左+右），打乱排列 */
      cards = [];
      pairs.forEach(function(pair, idx) {
        cards.push({ pairIdx: idx, side: 'left', text: pair.left, matched: false, el: null });
        cards.push({ pairIdx: idx, side: 'right', text: pair.right, matched: false, el: null });
      });
      cards = _shuffle(cards);
      flipped = [];
      matched = 0;
      steps = 0;
      startTime = Date.now();
      locked = false;
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

    /* --- 渲染牌面 --- */
    function renderBoard() {
      app.innerHTML =
        '<div class="card memory-container">' +
          '<div class="match-header">' +
            '<div class="header-left">' +
              '<span id="step-counter" class="q-counter">步数 0</span>' +
              '<span id="match-counter" class="q-counter">已配对 0 / ' + totalPairs + '</span>' +
            '</div>' +
            (DATA.showTimer ? '<span id="timer" class="q-timer">00:00</span>' : '') +
          '</div>' +
          '<div id="memory-grid" class="memory-grid"></div>' +
          '<div id="mem-feedback" class="match-feedback hint" aria-live="polite">点击卡片翻开</div>' +
        '</div>';

      var grid = document.getElementById('memory-grid');

      /* 通过 DOM 创建卡片，配对索引存在闭包中，不写入 DOM 属性 */
      cards.forEach(function(card, idx) {
        var el = document.createElement('div');
        el.className = 'mem-card';
        el.innerHTML =
          '<div class="mem-card-inner">' +
            '<div class="mem-cover">?</div>' +
            '<div class="mem-face">' + card.text + '</div>' +
          '</div>';
        card.el = el;
        el.addEventListener('click', function() { flipCard(idx); });
        grid.appendChild(el);
      });
    }

    /* --- 翻牌 --- */
    function flipCard(idx) {
      if (locked) return;
      if (cards[idx].matched) return;
      if (flipped.indexOf(idx) !== -1) return;

      cards[idx].el.classList.add('flipped');
      flipped.push(idx);

      if (flipped.length === 2) {
        steps++;
        var stepEl = document.getElementById('step-counter');
        if (stepEl) stepEl.textContent = '步数 ' + steps;

        var c1 = cards[flipped[0]];
        var c2 = cards[flipped[1]];

        if (c1.pairIdx === c2.pairIdx && c1.side !== c2.side) {
          /* 配对成功：保持翻开 */
          c1.matched = true;
          c2.matched = true;
          c1.el.classList.add('matched');
          c2.el.classList.add('matched');
          matched++;
          flipped = [];

          var counter = document.getElementById('match-counter');
          if (counter) counter.textContent = '已配对 ' + matched + ' / ' + totalPairs;

          setFeedback('配对成功！', 'correct');

          if (matched >= totalPairs) {
            setTimeout(showResults, 700);
          }
        } else {
          /* 配对失败：翻回 */
          locked = true;
          c1.el.classList.add('wrong');
          c2.el.classList.add('wrong');
          setFeedback('不匹配，再试试', 'wrong');
          setTimeout(function() {
            c1.el.classList.remove('wrong');
            c2.el.classList.remove('wrong');
            c1.el.classList.remove('flipped');
            c2.el.classList.remove('flipped');
            flipped = [];
            locked = false;
          }, 1000);
        }
      }
    }

    function setFeedback(msg, type) {
      var fb = document.getElementById('mem-feedback');
      if (fb) {
        fb.textContent = msg;
        fb.className = 'match-feedback ' + type;
      }
    }

    /* --- 结算页 --- */
    function showResults() {
      if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
      var elapsed = Math.floor((Date.now() - startTime) / 1000);
      var threshold3 = Math.ceil(totalPairs * 1.5);
      var threshold2 = totalPairs * 2;
      var stars = steps <= threshold3 ? '⭐ ⭐ ⭐' : (steps <= threshold2 ? '⭐ ⭐' : '⭐');
      var icon = steps <= threshold3 ? '🏆' : '🎉';

      var statsHTML =
        '<div class="stat-item"><span class="stat-num">' + steps + '</span><span class="stat-label">总步数</span></div>' +
        (DATA.showTimer ? '<div class="stat-item"><span class="stat-num">' + fmtTime(elapsed) + '</span><span class="stat-label">用时</span></div>' : '') +
        '<div class="stat-item"><span class="stat-num">' + totalPairs + '</span><span class="stat-label">配对数</span></div>';

      app.innerHTML =
        '<div class="card result-card">' +
          '<div class="result-icon">' + icon + '</div>' +
          '<h1 class="result-title">翻牌完成！</h1>' +
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

/** 生成翻牌记忆单文件 HTML */
export function generateMemoryHTML(content: GameContent, options: ExportOptions): string {
  const theme = THEMES[options.theme] || THEMES.default;
  const title = content.title || '翻牌记忆';

  /* 构建配对数据（所有文本经 escapeHtml 转义后 Base64 编码） */
  const payload = {
    title: escapeHtml(title),
    pairs: content.pairs.map((p) => ({
      left: escapeHtml(p.left),
      right: escapeHtml(p.right),
    })),
    showTimer: options.showTimer,
  };

  const encoded = encodeBase64(JSON.stringify(payload));

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} - 翻牌记忆</title>
  <style>${getMemoryCSS(theme)}</style>
</head>
<body>
  <div id="app"></div>
  <script>
    ${getDecoderScript()}
    ${getShuffleScript()}
    var _DATA = JSON.parse(_dec("${encoded}"));
    ${MEMORY_GAME_JS}
  </script>
</body>
</html>`;
}
