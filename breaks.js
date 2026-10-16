/* ============================================================
   AID Mathematics Academy · Grade 7 — breaks.js
   بريكات الألعاب المدمجة:
   بعد كل 5 أسئلة (بنسبة 80%) يظهر overlay فيه لعبة عشوائية
   مدتها 30 ثانية، ثم يرجع الطالب للكويز تلقائياً.
   مفيش شاشة Games Zone منفصلة — الألعاب مدمجة جوه الدرس.
   ملف مستقل: لو حذفته الكويز يكمل عادي من غير بريكات.
   ============================================================ */
(function () {
  'use strict';

  var RUN = false;          /* حماية من تشغيل بريكين مع بعض */
  var DUR = 30;             /* مدة اللعبة بالثواني */
  var CLEAN = [];           /* دوال التنظيف عند النهاية */

  function $(id) { return document.getElementById(id); }
  function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function shuffle(arr) {
    var a = arr.slice(), i, j, t;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function n2s(n) { return n < 0 ? '−' + Math.abs(n) : String(n); }
  var S = (function () {
    var dummy = { ok: function () {}, bad: function () {}, hint: function () {}, coin: function () {}, win: function () {} };
    return function () { return (window.G7 && G7.sfx) ? G7.sfx : dummy; };
  })();

  /* ═══════════ ستايل البريك (مدموج هنا — مش محتاج style.css) ═══════════ */
  var CSS =
  '#br-ov{position:fixed;inset:0;z-index:9000;background:rgba(15,23,42,.72);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:14px;animation:brFade .25s;}' +
  '@keyframes brFade{from{opacity:0}to{opacity:1}}' +
  '.br-panel{background:#fff;border-radius:26px;width:min(96vw,540px);max-height:94vh;overflow:auto;padding:18px 16px;box-shadow:0 24px 60px rgba(0,0,0,.4);direction:rtl;}' +
  '.br-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}' +
  '.br-title{font-weight:900;font-size:1.15rem;color:#4f46e5;}' +
  '.br-chip{background:#fef3c7;color:#92400e;border-radius:99px;padding:4px 14px;font-weight:800;font-size:.95rem;}' +
  '.br-timer{background:#e2e8f0;border-radius:99px;height:12px;overflow:hidden;margin-bottom:12px;}' +
  '#br-bar{height:100%;width:100%;background:linear-gradient(90deg,#f59e0b,#ef4444);border-radius:99px;transition:width .15s linear;}' +
  '.br-q{direction:ltr;text-align:center;font-weight:900;font-size:1.5rem;color:#1e293b;background:#eef2ff;border:2px dashed #93c5fd;border-radius:14px;padding:10px;margin-bottom:12px;min-height:52px;}' +
  '#br-zone{position:relative;min-height:330px;}' +
  '.br-foot{text-align:center;color:#64748b;font-size:.85rem;margin-top:10px;}' +
  /* فقاعات */
  '.br-bub{position:absolute;width:74px;height:74px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.25rem;font-weight:900;color:#fff;cursor:pointer;direction:ltr;' +
  'background:radial-gradient(circle at 30% 30%,rgba(255,255,255,.55),rgba(255,255,255,0) 45%),linear-gradient(135deg,#6366f1,#8b5cf6);box-shadow:0 8px 18px rgba(99,102,241,.45);animation:brFloat linear infinite;}' +
  '@keyframes brFloat{0%{transform:translateY(0)}50%{transform:translateY(-16px)}100%{transform:translateY(0)}}' +
  '.br-bub:hover{filter:brightness(1.08);}' +
  '.br-bub.bpop{animation:brPop .3s forwards;pointer-events:none;}' +
  '@keyframes brPop{to{transform:scale(1.5);opacity:0}}' +
  '.br-bub.bshake{animation:brShake .35s;}' +
  '@keyframes brShake{25%{transform:translateX(5px)}75%{transform:translateX(-5px)}}' +
  /* بطاقات الذاكرة */
  '.br-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;}' +
  '@media(max-width:430px){.br-cards{grid-template-columns:repeat(3,1fr);}}' +
  '.br-card{background:#e2e8f0;border:0;border-radius:12px;height:84px;font-size:.95rem;font-weight:800;color:#1e293b;cursor:pointer;direction:ltr;' +
  'display:flex;align-items:center;justify-content:center;padding:4px;text-align:center;transition:transform .18s,background .18s;}' +
  '.br-card:hover{transform:translateY(-3px);}' +
  '.br-card.open{background:#eef2ff;border:2px solid #6366f1;}' +
  '.br-card.matched{background:#dcfce7;border:2px solid #16a34a;pointer-events:none;animation:brPop2 .35s;}' +
  '@keyframes brPop2{50%{transform:scale(1.07)}}' +
  /* أزرار الإجابة السريعة */
  '.br-ans{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;place-content:center;height:100%;}' +
  '.br-ab{background:linear-gradient(135deg,#0d9488,#14b8a6);color:#fff;border:0;border-radius:18px;min-height:76px;font-size:1.6rem;font-weight:900;cursor:pointer;direction:ltr;transition:transform .12s;box-shadow:0 6px 14px rgba(13,148,136,.35);}' +
  '.br-ab:hover{transform:translateY(-3px);}' +
  '.br-ab.bshake{animation:brShake .35s;}' +
  /* شرائح الترتيب */
  '.br-ord{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;align-content:center;height:100%;}' +
  '.br-chip2{background:#fff;border:2px solid #e2e8f0;border-radius:14px;padding:16px 20px;font-size:1.4rem;font-weight:900;color:#1e293b;cursor:pointer;direction:ltr;box-shadow:var(0 2px 8px rgba(30,41,59,.08));transition:transform .12s,opacity .2s;}' +
  '.br-chip2:hover{transform:translateY(-3px);border-color:#6366f1;}' +
  '.br-chip2.done{opacity:.25;pointer-events:none;background:#dcfce7;border-color:#16a34a;}' +
  '.br-chip2.bshake{animation:brShake .35s;border-color:#dc2626;}' +
  /* المقارنة */
  '.br-cmp{display:grid;grid-template-columns:1fr 1fr;gap:14px;place-content:center;height:100%;}' +
  '.br-cb{background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;border:0;border-radius:22px;min-height:150px;font-size:2.2rem;font-weight:900;cursor:pointer;direction:ltr;transition:transform .12s;box-shadow:0 10px 22px rgba(124,58,237,.35);}' +
  '.br-cb:hover{transform:translateY(-4px);}' +
  /* شاشة النهاية */
  '#br-end{position:absolute;inset:0;background:rgba(255,255,255,.96);border-radius:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;animation:brFade .25s;}' +
  '#br-end .be1{font-size:3rem;animation:brPop2 .5s;}' +
  '#br-end .be2{font-size:1.5rem;font-weight:900;color:#16a34a;}' +
  '#br-end .be3{color:#64748b;font-weight:700;}';

  function ensureStyle() {
    if ($('br-style')) return;
    var st = document.createElement('style');
    st.id = 'br-style';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  /* ═══════════ تشغيل البريك ═══════════ */
  function go(cb) {
    if (RUN) { if (cb) cb(0); return; }
    RUN = true; CLEAN = [];
    ensureStyle();

    var state = { score: 0, ended: false, t: DUR };
    var ov = document.createElement('div');
    ov.id = 'br-ov';
    ov.innerHTML =
      '<div class="br-panel">' +
        '<div class="br-head"><span class="br-title">🎮 وقت اللعب!</span><span class="br-chip" id="br-score">⭐ 0</span></div>' +
        '<div class="br-timer"><div id="br-bar"></div></div>' +
        '<div class="br-q" id="br-q"></div>' +
        '<div id="br-zone"></div>' +
        '<div class="br-foot">بترجع للأسئلة تلقائياً بعد انتهاء الوقت ⏳</div>' +
        '<div id="br-end" class="hidden">' +
          '<div class="be1">🎉</div><div class="be2" id="be2"></div><div class="be3" id="be3"></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(ov);

    function add(n) {
      if (state.ended) return;
      state.score += n;
      var sc = $('br-score');
      if (sc) sc.textContent = '⭐ ' + state.score;
    }

    /* المؤقت */
    var tick = setInterval(function () {
      if (state.ended) return;
      state.t -= 0.1;
      if (state.t <= 0) { state.t = 0; end(); return; }
      var bar = $('br-bar');
      if (bar) bar.style.width = (state.t / DUR * 100) + '%';
    }, 100);
    CLEAN.push(function () { clearInterval(tick); });

    function end() {
      if (state.ended) return;
      state.ended = true;
      for (var i = 0; i < CLEAN.length; i++) { try { CLEAN[i](); } catch (e) {} }
      var coins = Math.min(15, Math.floor(state.score / 10));
      $('be2').textContent = 'برافو! ' + state.score + ' نقطة';
      $('be3').textContent = coins > 0 ? '( +' + coins + ' 🪙 هتتضاف لرصيدك )' : 'يلا نكمل الأسئلة 💪';
      $('br-end').classList.remove('hidden');
      S().win();
      setTimeout(function () {
        if (ov.parentNode) ov.parentNode.removeChild(ov);
        RUN = false;
        if (cb) cb(coins);
      }, 2600);
    }

    var game = pick(GAMES);
    game($('br-zone'), { add: add, q: $('br-q'), end: end, state: state });
  }

  /* ═══════════ الألعاب ═══════════ */
  var GAMES = [gBubble, gMemory, gFlash, gGcd, gOrder, gCompare];

  /* 1) فقاعات الضرب السريع */
  function gBubble(zone, api) {
    function round() {
      if (api.state.ended) return;
      var a = ri(2, 12), b = ri(2, 12);
      var ok = a * b;
      api.q.innerHTML = a + ' × ' + b + ' = ?';
      zone.innerHTML = '';
      var vals = [ok];
      var g1 = 0;
      while (vals.length < 6 && g1 < 200) {
        g1++;
        var v = ok + pick([-9, -6, -4, -3, -2, 2, 3, 4, 6, 9]);
        if (v > 0 && vals.indexOf(v) < 0) vals.push(v);
      }
      for (var d1 = 1; vals.length < 6 && d1 < 60; d1++) {
        if (ok + d1 > 0 && vals.indexOf(ok + d1) < 0) vals.push(ok + d1);
      }
      vals = shuffle(vals);
      vals.forEach(function (v, i) {
        var el = document.createElement('div');
        el.className = 'br-bub';
        el.textContent = v;
        el.style.left = (4 + i * 15.5 + ri(0, 4)) + '%';
        el.style.top = (10 + (i % 2) * 42 + ri(0, 6)) + '%';
        el.style.animationDuration = (2 + Math.random() * 1.6).toFixed(2) + 's';
        el.style.animationDelay = (Math.random() * 1.2).toFixed(2) + 's';
        el.onclick = function () {
          if (api.state.ended || el.classList.contains('bpop') || el.classList.contains('bshake')) return;
          if (v === ok) {
            el.classList.add('bpop');
            api.add(10); S().coin();
            setTimeout(round, 350);
          } else {
            el.classList.add('bshake');
            S().bad();
            setTimeout(function () { el.classList.remove('bshake'); }, 380);
          }
        };
        zone.appendChild(el);
      });
    }
    round();
  }

  /* 2) الذاكرة: عبارة ↔ صورتها المبسطة */
  function gMemory(zone, api) {
    var POOL = [
      ['3(x + 4)', '3x + 12'], ['5(x − 2)', '5x − 10'],
      ['4x + 3 + 2x + 5', '6x + 8'], ['2(x + 1)', '2x + 2'],
      ['6x + 12', '6(x + 2)'], ['9y − 6', '3(3y − 2)'],
      ['2x + x + 4', '3x + 4'], ['8x + 4', '4(2x + 1)'],
      ['x + x + x', '3x'], ['7(x + 2)', '7x + 14'],
      ['10a − 5', '5(2a − 1)'], ['4(x + 6)', '4x + 24']
    ];
    var pairs = shuffle(POOL).slice(0, 6);
    var cards = [];
    pairs.forEach(function (p) { cards.push({ t: p[0], pair: p[1] }); cards.push({ t: p[1], pair: p[0] }); });
    cards = shuffle(cards);
    api.q.textContent = 'طابق كل عبارة مع المكافئة ليها 🃏';
    zone.innerHTML = '<div class="br-cards"></div>';
    var grid = zone.firstChild;
    var open = [], lock = false, matched = 0;

    cards.forEach(function (c) {
      var el = document.createElement('button');
      el.className = 'br-card';
      el.textContent = '?';
      el.onclick = function () {
        if (api.state.ended || lock || el.classList.contains('open') || el.classList.contains('matched')) return;
        el.classList.add('open');
        el.textContent = c.t;
        open.push({ el: el, c: c });
        if (open.length === 2) {
          lock = true;
          var A = open[0], B = open[1];
          if (A.c.t === B.c.pair) {
            setTimeout(function () {
              A.el.classList.add('matched'); B.el.classList.add('matched');
              A.el.classList.remove('open'); B.el.classList.remove('open');
              api.add(15); S().coin();
              open = []; lock = false;
            }, 250);
          } else {
            setTimeout(function () {
              A.el.classList.remove('open'); B.el.classList.remove('open');
              A.el.textContent = '?'; B.el.textContent = '?';
              open = []; lock = false;
            }, 750);
          }
        }
      };
      grid.appendChild(el);
    });
  }

  /* 3) البرق: حقائق سريعة */
  function gFlash(zone, api) {
    zone.innerHTML = '<div class="br-ans"></div>';
    var grid = zone.firstChild;
    var streak = 0;
    function round() {
      if (api.state.ended) return;
      var a = ri(2, 12), b = ri(2, 12), op = pick(['×', '×', '+', '−']);
      var ok;
      if (op === '×') ok = a * b;
      else if (op === '+') ok = a + b;
      else { a = a + b; ok = a - b; }
      api.q.innerHTML = a + ' ' + op + ' ' + b + ' = ?';
      var vals = [ok];
      var g2 = 0;
      while (vals.length < 4 && g2 < 200) {
        g2++;
        var v = ok + pick([-10, -7, -5, -3, 3, 5, 7, 10]);
        if (v >= 0 && vals.indexOf(v) < 0) vals.push(v);
      }
      for (var d2 = 1; vals.length < 4 && d2 < 60; d2++) {
        if (ok + d2 >= 0 && vals.indexOf(ok + d2) < 0) vals.push(ok + d2);
      }
      vals = shuffle(vals);
      grid.innerHTML = '';
      vals.forEach(function (v) {
        var el = document.createElement('button');
        el.className = 'br-ab';
        el.textContent = v;
        el.onclick = function () {
          if (api.state.ended || el.classList.contains('bshake')) return;
          if (v === ok) {
            streak++;
            api.add(10 + (streak >= 3 ? 5 : 0));
            S().coin();
            round();
          } else {
            streak = 0;
            el.classList.add('bshake'); S().bad();
            setTimeout(function () { el.classList.remove('bshake'); }, 380);
          }
        };
        grid.appendChild(el);
      });
    }
    round();
  }

  /* 4) فرقع العامل المشترك الأكبر */
  function gGcd(zone, api) {
    var PAIRS = [[12, 18], [8, 12], [16, 24], [9, 12], [15, 20], [10, 25], [14, 21], [18, 27], [12, 20], [16, 28], [6, 9], [24, 36]];
    function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }
    function round() {
      if (api.state.ended) return;
      var P = pick(PAIRS);
      var ok = gcd(P[0], P[1]);
      api.q.innerHTML = 'GCF of ' + P[0] + ' and ' + P[1] + ' = ?';
      zone.innerHTML = '';
      var vals = [ok];
      var g3 = 0;
      while (vals.length < 4 && g3 < 200) {
        g3++;
        var v = pick([ok / 2, ok * 2, ok + 1, ok - 1, 2, 3]);
        v = Math.round(v);
        if (v > 0 && v !== ok && vals.indexOf(v) < 0 && v < 40) vals.push(v);
      }
      for (var d3 = 1; vals.length < 4 && d3 < 60; d3++) {
        var v3 = ok + d3;
        if (v3 > 0 && v3 !== ok && v3 < 40 && vals.indexOf(v3) < 0) vals.push(v3);
      }
      vals = shuffle(vals);
      var wrap = document.createElement('div');
      wrap.className = 'br-ans';
      vals.forEach(function (v) {
        var el = document.createElement('button');
        el.className = 'br-ab';
        el.style.background = 'linear-gradient(135deg,#ea580c,#f59e0b)';
        el.style.boxShadow = '0 6px 14px rgba(234,88,12,.35)';
        el.textContent = v;
        el.onclick = function () {
          if (api.state.ended || el.classList.contains('bshake')) return;
          if (v === ok) { api.add(10); S().coin(); round(); }
          else {
            el.classList.add('bshake'); S().bad();
            setTimeout(function () { el.classList.remove('bshake'); }, 380);
          }
        };
        wrap.appendChild(el);
      });
      zone.appendChild(wrap);
    }
    round();
  }

  /* 5) رتب تصاعدياً */
  function gOrder(zone, api) {
    function round() {
      if (api.state.ended) return;
      api.q.textContent = 'اضغط الأرقام من الأصغر للأكبر ⬆️';
      var nums = [];
      var g4 = 0;
      while (nums.length < 5 && g4 < 200) {
        g4++;
        var v = ri(-12, 15);
        if (nums.indexOf(v) < 0) nums.push(v);
      }
      for (var v4 = -12; nums.length < 5 && v4 <= 15; v4++) {
        if (nums.indexOf(v4) < 0) nums.push(v4);
      }
      var sorted = nums.slice().sort(function (x, y) { return x - y; });
      var next = 0;
      zone.innerHTML = '<div class="br-ord"></div>';
      var box = zone.firstChild;
      shuffle(nums).forEach(function (v) {
        var el = document.createElement('button');
        el.className = 'br-chip2';
        el.textContent = n2s(v);
        el.onclick = function () {
          if (api.state.ended || el.classList.contains('done') || el.classList.contains('bshake')) return;
          if (v === sorted[next]) {
            el.classList.add('done');
            next++;
            S().ok();
            if (next === 5) { api.add(15); S().coin(); setTimeout(round, 420); }
          } else {
            el.classList.add('bshake'); S().bad();
            setTimeout(function () { el.classList.remove('bshake'); }, 380);
          }
        };
        box.appendChild(el);
      });
    }
    round();
  }

  /* 6) مين أكبر؟ */
  function gCompare(zone, api) {
    api.q.textContent = 'اضغط الرقم الأكبر ⚖️';
    zone.innerHTML = '<div class="br-cmp"></div>';
    var box = zone.firstChild;
    function round() {
      if (api.state.ended) return;
      var a = ri(-20, 25), b = ri(-20, 25), g5 = 0;
      while (b === a && g5 < 100) { g5++; b = ri(-20, 25); }
      if (b === a) b = a + 1;
      box.innerHTML = '';
      [a, b].forEach(function (v) {
        var el = document.createElement('button');
        el.className = 'br-cb';
        el.textContent = n2s(v);
        el.onclick = function () {
          if (api.state.ended) return;
          if (v === Math.max(a, b)) { api.add(8); S().coin(); round(); }
          else { S().bad(); el.style.background = 'linear-gradient(135deg,#dc2626,#ef4444)'; setTimeout(round, 350); }
        };
        box.appendChild(el);
      });
    }
    round();
  }

  /* التصدير */
  window.Breaks = { go: go };
})();
