/**
 * 闯关问答 - HTML 生成器
 *
 * 生成零依赖的单文件 HTML 游戏，卡通明亮风格，适合小学生。
 * 防作弊：答案通过 Base64 编码注入 JS 变量，运行时解码，不写入 DOM 属性。
 * 所有 CSS 内联到 <style>，所有 JS 内联到 <script>。
 * 跨模块调用方：src/games/quiz/template.ts
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

/** 生成闯关问答 CSS（含主题变量，内联到 <style> 标签） */
function getQuizCSS(t: ThemeColors): string {
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
      padding: 32px; max-width: 640px; width: 100%; animation: fadeIn 0.4s ease;
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
    .quiz-card { animation: slideIn 0.3s ease; }
    .quiz-header { margin-bottom: 20px; }
    .progress-bar { height: 10px; background: #E8E8E8; border-radius: 5px; overflow: hidden; margin-bottom: 12px; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, ${t.primary}, ${t.success}); border-radius: 5px; transition: width 0.4s ease; }
    .quiz-meta { display: flex; justify-content: space-between; align-items: center; }
    .q-counter { font-size: 15px; color: #666; font-weight: 500; }
    .q-timer { font-size: 15px; color: ${t.warning}; font-weight: 600; font-variant-numeric: tabular-nums; }
    .question-text { font-size: 20px; font-weight: 600; color: #333; margin-bottom: 20px; line-height: 1.8; min-height: 56px; }
    .options-container { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
    .option-btn {
      display: flex; align-items: center; gap: 12px; width: 100%;
      background: #F8FAFC; border: 2px solid #E2E8F0; border-radius: 12px;
      padding: 14px 18px; font-size: 18px; text-align: left; cursor: pointer;
      transition: all 0.2s ease; font-family: inherit; color: #333;
    }
    .option-btn:hover:not(.disabled) { border-color: ${t.primary}; background: #F0F7FF; transform: translateX(4px); }
    .option-btn:active:not(.disabled) { transform: scale(0.98); }
    .option-btn.disabled { cursor: default; }
    .option-btn.disabled:hover { transform: none; }
    .option-btn.correct { border-color: ${t.success}; background: #F6FFED; animation: pulseGreen 0.4s ease; }
    .option-btn.wrong { border-color: ${t.danger}; background: #FFF1F0; animation: shake 0.4s ease; }
    .opt-label {
      display: flex; align-items: center; justify-content: center;
      width: 32px; height: 32px; background: ${t.primary}; color: #fff;
      border-radius: 50%; font-size: 16px; font-weight: 600; flex-shrink: 0;
    }
    .option-btn.correct .opt-label { background: ${t.success}; }
    .option-btn.wrong .opt-label { background: ${t.danger}; }
    .opt-text { flex: 1; line-height: 1.5; }
    .tf-btn { justify-content: center; font-size: 20px; font-weight: 600; padding: 18px; }
    .feedback-area { margin-top: 16px; }
    .feedback { display: flex; align-items: flex-start; gap: 12px; padding: 16px; border-radius: 12px; margin-bottom: 16px; animation: fadeIn 0.3s ease; }
    .feedback-correct { background: #F6FFED; border: 1px solid ${t.success}; }
    .feedback-wrong { background: #FFF1F0; border: 1px solid ${t.danger}; }
    .feedback-icon { font-size: 28px; flex-shrink: 0; line-height: 1; }
    .feedback-title { font-size: 18px; font-weight: 600; }
    .feedback-correct .feedback-title { color: ${t.success}; }
    .feedback-wrong .feedback-title { color: ${t.danger}; }
    .feedback-explain { font-size: 15px; color: #666; margin-top: 4px; line-height: 1.6; }
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
      .card { padding: 24px; } .game-title { font-size: 24px; } .question-text { font-size: 18px; }
      .option-btn { font-size: 16px; padding: 12px 14px; } .btn-large { font-size: 20px; padding: 14px 32px; }
      .result-icon { font-size: 60px; }
    }
    @media (max-width: 480px) {
      #app { padding: 12px; } .card { padding: 20px; border-radius: 12px; }
      .game-title { font-size: 22px; } .game-subtitle { font-size: 16px; }
      .question-text { font-size: 17px; } .option-btn { font-size: 15px; padding: 10px 12px; gap: 8px; }
      .opt-label { width: 28px; height: 28px; font-size: 14px; } .btn-large { font-size: 18px; padding: 12px 24px; }
      .result-icon { font-size: 48px; } .stat-num { font-size: 22px; } .result-stats { gap: 16px; }
      .tf-btn { font-size: 18px; padding: 14px; }
    }
  `;
}

/** 闯关问答游戏逻辑（内联到 <script> 标签，运行时执行） */
const QUIZ_GAME_JS = `
  (function() {
    var DATA = _DATA;
    var questions = DATA.questions;
    var total = questions.length;
    var currentIdx = 0;
    var score = 0;
    var startTime = 0;
    var answered = false;
    var timerInterval = null;
    var currentButtons = [];

    /* 初始打乱（若配置开启） */
    if (DATA.shuffleQ) { questions = _shuffle(questions); }
    if (DATA.shuffleO) {
      questions.forEach(function(q) {
        if (q.type === 'choice') {
          var idx = [];
          for (var i = 0; i < q.options.length; i++) idx.push(i);
          q._perm = _shuffle(idx);
        }
      });
    }

    var app = document.getElementById('app');

    function fmtTime(sec) {
      var m = Math.floor(sec / 60);
      var s = sec % 60;
      return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }

    /* --- 开始页 --- */
    function renderStart() {
      if (total === 0) {
        app.innerHTML = '<div class="card start-card"><div class="start-icon">📄</div><h1 class="game-title">' + DATA.title + '</h1><p class="game-subtitle">暂无题目</p></div>';
        return;
      }
      app.innerHTML =
        '<div class="card start-card">' +
          '<div class="start-icon">📚</div>' +
          '<h1 class="game-title">' + DATA.title + '</h1>' +
          '<p class="game-subtitle">闯关问答</p>' +
          '<div class="info-row">' +
            '<span class="info-badge">📝 ' + total + ' 道题</span>' +
            (DATA.showTimer ? '<span class="info-badge">⏱️ 计时挑战</span>' : '') +
            '<span class="info-badge">🎯 即时反馈</span>' +
          '</div>' +
          '<button id="btn-start" class="btn-primary btn-large">开始闯关 🚀</button>' +
        '</div>';
      var btn = document.getElementById('btn-start');
      if (btn) { btn.addEventListener('click', startGame); btn.focus(); }
    }

    /* --- 开始游戏 --- */
    function startGame() {
      currentIdx = 0; score = 0; startTime = Date.now();
      answered = false; currentButtons = [];
      /* 每次重新开始都重新打乱 */
      if (DATA.shuffleQ) { questions = _shuffle(questions); }
      if (DATA.shuffleO) {
        questions.forEach(function(q) {
          if (q.type === 'choice') {
            var idx = [];
            for (var i = 0; i < q.options.length; i++) idx.push(i);
            q._perm = _shuffle(idx);
          }
        });
      }
      if (DATA.showTimer) {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 200);
      }
      renderQuestion();
    }

    function updateTimer() {
      var el = document.getElementById('timer');
      if (el) {
        var sec = Math.floor((Date.now() - startTime) / 1000);
        el.textContent = fmtTime(sec);
      }
    }

    /* --- 渲染题目 --- */
    function renderQuestion() {
      var q = questions[currentIdx];
      answered = false;
      currentButtons = [];
      var progress = total > 0 ? Math.round((currentIdx / total) * 100) : 0;

      app.innerHTML =
        '<div class="card quiz-card">' +
          '<div class="quiz-header">' +
            '<div class="progress-bar" role="progressbar" aria-valuenow="' + (currentIdx + 1) + '" aria-valuemin="0" aria-valuemax="' + total + '">' +
              '<div class="progress-fill" style="width:' + progress + '%"></div>' +
            '</div>' +
            '<div class="quiz-meta">' +
              '<span class="q-counter">第 ' + (currentIdx + 1) + ' / ' + total + ' 题</span>' +
              (DATA.showTimer ? '<span id="timer" class="q-timer">00:00</span>' : '') +
            '</div>' +
          '</div>' +
          '<div class="question-text">' + q.question + '</div>' +
          '<div id="options" class="options-container"></div>' +
          '<div id="feedback" class="feedback-area" aria-live="polite"></div>' +
        '</div>';

      var optionsContainer = document.getElementById('options');

      if (q.type === 'choice') {
        /* 选项按钮通过 DOM 创建，答案索引存在闭包中，不写入 DOM 属性 */
        var perm = q._perm;
        if (!perm) {
          perm = [];
          for (var i = 0; i < q.options.length; i++) perm.push(i);
        }
        perm.forEach(function(origIdx, displayIdx) {
          var btn = document.createElement('button');
          btn.className = 'option-btn';
          btn.innerHTML =
            '<span class="opt-label">' + String.fromCharCode(65 + displayIdx) + '</span>' +
            '<span class="opt-text">' + q.options[origIdx] + '</span>';
          btn.addEventListener('click', function() { handleAnswer(origIdx, btn); });
          currentButtons.push({ el: btn, origIdx: origIdx });
          optionsContainer.appendChild(btn);
        });
      } else {
        /* 判断题：对/错按钮 */
        var trueBtn = document.createElement('button');
        trueBtn.className = 'option-btn tf-btn';
        trueBtn.innerHTML = '<span class="opt-text">✓ 对</span>';
        trueBtn.addEventListener('click', function() { handleAnswer(true, trueBtn); });
        currentButtons.push({ el: trueBtn, origIdx: true });
        optionsContainer.appendChild(trueBtn);

        var falseBtn = document.createElement('button');
        falseBtn.className = 'option-btn tf-btn';
        falseBtn.innerHTML = '<span class="opt-text">✗ 错</span>';
        falseBtn.addEventListener('click', function() { handleAnswer(false, falseBtn); });
        currentButtons.push({ el: falseBtn, origIdx: false });
        optionsContainer.appendChild(falseBtn);
      }

      var first = optionsContainer.querySelector('.option-btn');
      if (first) first.focus();
    }

    /* --- 处理作答 --- */
    function handleAnswer(value, clickedBtn) {
      if (answered) return;
      answered = true;
      var q = questions[currentIdx];
      var correct = (value === q.answer);
      if (correct) score++;

      clickedBtn.classList.add(correct ? 'correct' : 'wrong');

      currentButtons.forEach(function(b) {
        b.el.classList.add('disabled');
        b.el.disabled = true;
      });

      /* 答错时高亮正确答案 */
      if (!correct) {
        currentButtons.forEach(function(b) {
          if (b.origIdx === q.answer) { b.el.classList.add('correct'); }
        });
      }

      var fb = document.getElementById('feedback');
      var isLast = (currentIdx + 1 >= total);
      fb.innerHTML =
        '<div class="feedback ' + (correct ? 'feedback-correct' : 'feedback-wrong') + '">' +
          '<div class="feedback-icon">' + (correct ? '✅' : '❌') + '</div>' +
          '<div>' +
            '<div class="feedback-title">' + (correct ? '回答正确！' : '回答错误') + '</div>' +
            (q.explanation ? '<div class="feedback-explain">' + q.explanation + '</div>' : '') +
          '</div>' +
        '</div>' +
        '<button id="btn-next" class="btn-primary">' + (isLast ? '查看成绩 🎉' : '下一题 →') + '</button>';

      var nextBtn = document.getElementById('btn-next');
      if (nextBtn) { nextBtn.addEventListener('click', nextQuestion); nextBtn.focus(); }
    }

    function nextQuestion() {
      currentIdx++;
      if (currentIdx < total) { renderQuestion(); }
      else { showResults(); }
    }

    /* --- 结算页 --- */
    function showResults() {
      if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
      var elapsed = Math.floor((Date.now() - startTime) / 1000);
      var accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
      var stars = accuracy >= 90 ? '⭐ ⭐ ⭐' : (accuracy >= 60 ? '⭐ ⭐' : '⭐');
      var icon = accuracy >= 90 ? '🏆' : (accuracy >= 60 ? '🎉' : '💪');

      var statsHTML =
        '<div class="stat-item"><span class="stat-num">' + score + ' / ' + total + '</span><span class="stat-label">答对题数</span></div>' +
        '<div class="stat-item"><span class="stat-num">' + accuracy + '%</span><span class="stat-label">正确率</span></div>' +
        (DATA.showTimer ? '<div class="stat-item"><span class="stat-num">' + fmtTime(elapsed) + '</span><span class="stat-label">用时</span></div>' : '');

      app.innerHTML =
        '<div class="card result-card">' +
          '<div class="result-icon">' + icon + '</div>' +
          '<h1 class="result-title">闯关完成！</h1>' +
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

/** 生成闯关问捽单文件 HTML */
export function generateQuizHTML(content: GameContent, options: ExportOptions): string {
  const theme = THEMES[options.theme] || THEMES.default;
  const title = content.title || '闯关问答';

  /* 构建题目数据（所有文本经 escapeHtml 转义后 Base64 编码） */
  const payload = {
    title: escapeHtml(title),
    questions: content.questions.map((q) => {
      if (q.type === 'choice') {
        return {
          type: 'choice' as const,
          question: escapeHtml(q.question),
          options: q.options.map(escapeHtml),
          answer: q.answer,
          explanation: escapeHtml(q.explanation || ''),
        };
      }
      return {
        type: 'truefalse' as const,
        question: escapeHtml(q.question),
        answer: q.answer,
        explanation: escapeHtml(q.explanation || ''),
      };
    }),
    shuffleQ: options.shuffleQuestions,
    shuffleO: options.shuffleOptions,
    showTimer: options.showTimer,
  };

  const encoded = encodeBase64(JSON.stringify(payload));

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} - 闯关问答</title>
  <style>${getQuizCSS(theme)}</style>
</head>
<body>
  <div id="app"></div>
  <script>
    ${getDecoderScript()}
    ${getShuffleScript()}
    var _DATA = JSON.parse(_dec("${encoded}"));
    ${QUIZ_GAME_JS}
  </script>
</body>
</html>`;
}
