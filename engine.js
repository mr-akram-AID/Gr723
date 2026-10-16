/* ============================================================
   AID Mathematics Academy · Grade 7 — engine.js
   المحرك: كويز 20 سؤال · سلّم هنت 3 مستويات (ال third auto-mask)
   تشخيص كل إجابة غلط · Checkpoints + Final · نتائج · أصوات · تقدم
   ملفات المحتوى (t1.js / t4.js / t5.js) بتتسجل هنا.
   ============================================================ */
var G7 = (function () {
  'use strict';

  /* ═══════════════ أدوات عامة ═══════════════ */
  function $(id) { return document.getElementById(id); }
  function qsAll(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
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
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  /* قناع الإجابة: الأرقام ● والحروف ▢ — الطالب يشكل الشكل النهائي */
  function mask(s) {
    return String(s).replace(/[0-9]/g, '●').replace(/[a-zA-Z]/g, '▢');
  }
  function fmtT(sec) {
    var m = Math.floor(sec / 60), s = sec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  /* ═══════════════ ناقل أحداث (لsheet7 و print7) ═══════════════ */
  var EV = {};
  function on(k, fn) { (EV[k] = EV[k] || []).push(fn); }
  function emit(k, d) {
    var list = EV[k] || [];
    for (var i = 0; i < list.length; i++) { try { list[i](d); } catch (e) {} }
  }

  /* ═══════════════ سجل التوبكات ═══════════════ */
  var TOPICS = [];
  function registerTopic(t) {
    if (!t || !t.id || !t.lessons || !t.lessons.length) return;
    TOPICS.push(t);
    if ($('scr-home').classList.contains('active')) renderHome();
  }
  function topicCount() { return TOPICS.length; }
  function allLessons() {
    var out = [], i, j;
    for (i = 0; i < TOPICS.length; i++)
      for (j = 0; j < TOPICS[i].lessons.length; j++)
        out.push(TOPICS[i].lessons[j]);
    return out;
  }
  function lessonById(id) {
    var all = allLessons();
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }

  /* ═══════════════ الحالة (localStorage) ═══════════════ */
  var LSKEY = 'G7V1';
  var ST = { name: '', sound: true, coins: 0, lessons: {}, exams: {} };
  function save() { try { localStorage.setItem(LSKEY, JSON.stringify(ST)); } catch (e) {} }
  function load() {
    try {
      var raw = localStorage.getItem(LSKEY);
      if (raw) {
        var o = JSON.parse(raw);
        if (o && o.name !== undefined) {
          /* ننقل داخل نفس الكائن — عشان G7.state يفضل مرجع حي بعد أي تحديث للصفحة */
          var k;
          for (k in ST) { if (Object.prototype.hasOwnProperty.call(ST, k)) delete ST[k]; }
          for (k in o) { if (Object.prototype.hasOwnProperty.call(o, k)) ST[k] = o[k]; }
        }
      }
    } catch (e) {}
  }

  function lessonRec(id) { ST.lessons[id] = ST.lessons[id] || { easy: {}, medium: {} }; return ST.lessons[id]; }
  function bestStars(id) {
    var r = ST.lessons[id]; if (!r) return 0;
    var a = r.easy ? (r.easy.stars || 0) : 0, b = r.medium ? (r.medium.stars || 0) : 0;
    return Math.max(a, b);
  }
  function lessonsCompleted() {
    var all = allLessons(), n = 0;
    for (var i = 0; i < all.length; i++) if (bestStars(all[i].id) > 0) n++;
    return n;
  }

  /* ═══════════════ الأصوات (Web Audio) ═══════════════ */
  var AC = null;
  function ac() {
    if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
    if (AC && AC.state === 'suspended') { try { AC.resume(); } catch (e) {} }
    return AC;
  }
  function tone(f, dur, type, delay, vol) {
    if (!ST.sound) return;
    var c = ac(); if (!c) return;
    try {
      var o = c.createOscillator(), g = c.createGain();
      o.type = type || 'sine'; o.frequency.value = f;
      var t0 = c.currentTime + (delay || 0);
      g.gain.setValueAtTime(vol || 0.12, t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(c.destination);
      o.start(t0); o.stop(t0 + dur + 0.05);
    } catch (e) {}
  }
  var sfx = {
    ok:   function () { tone(660, .12); tone(880, .16, 'sine', .1); },
    bad:  function () { tone(196, .22, 'sawtooth', 0, .08); },
    hint: function () { tone(520, .09, 'triangle'); },
    coin: function () { tone(988, .08, 'square', 0, .06); tone(1319, .12, 'square', .07, .06); },
    win:  function () { tone(523, .14, 'triangle', 0, .1); tone(659, .14, 'triangle', .12, .1); tone(784, .14, 'triangle', .24, .1); tone(1047, .22, 'triangle', .36, .12); }
  };

  /* ═══════════════ تنقّل الشاشات ═══════════════ */
  function show(id) {
    qsAll('.screen').forEach(function (s) { s.classList.remove('active'); });
    $(id).classList.add('active');
    window.scrollTo(0, 0);
  }

  /* ═══════════════ توست + مودال ═══════════════ */
  var toastTO = null;
  function toast(msg) {
    var t = $('toast');
    t.innerHTML = msg; t.classList.remove('hidden');
    if (toastTO) clearTimeout(toastTO);
    toastTO = setTimeout(function () { t.classList.add('hidden'); }, 3200);
  }
  var modalYes = null;
  function confirmBox(txt, onYes) {
    $('modal-txt').innerHTML = txt;
    modalYes = onYes;
    $('modal').classList.remove('hidden');
  }

  /* ═══════════════ الامتحانات ═══════════════ */
  var EXAMS = [
    { id: 'cp1', ico: '🎯', title: 'Checkpoint 1', need: 5,  from: 0,  len: 5, perLesson: 3, sub: 'الدروس 1 → 5 (Topic 1)' },
    { id: 'cp2', ico: '🎯', title: 'Checkpoint 2', need: 10, from: 5,  len: 5, perLesson: 3, sub: 'الدروس 6 → 10 (Topic 4)' },
    { id: 'cp3', ico: '🎯', title: 'Checkpoint 3', need: 15, from: 10, len: 5, perLesson: 3, sub: 'الدروس 11 → 15' },
    { id: 'fin', ico: '🏆', title: 'Final Exam',    need: 20, from: 0,  len: 0,  perLesson: 2, sub: 'المنهج كله — 30 سؤال' }
  ];

  /* ═══════════════ شاشة الدخول ═══════════════ */
  function initLogin() {
    if (ST.name) { goHome(); return; }
    show('scr-login');
    $('btn-start').onclick = function () {
      var n = $('inp-name').value.trim();
      if (n.length < 2) { $('name-err').textContent = 'اكتب اسم كامل شوية يا نجم 😊'; return; }
      $('name-err').textContent = '';
      ST.name = n; save(); goHome();
      toast('أهلاً يا ' + esc(n) + '! 🌟');
    };
    $('inp-name').onkeydown = function (e) { if (e.key === 'Enter') $('btn-start').click(); };
  }

  /* ═══════════════ الرئيسية ═══════════════ */
  function goHome() { SES = killTimer(SES); renderHome(); show('scr-home'); }

  function renderHome() {
    $('chip-name').textContent = '👤 ' + ST.name;
    $('chip-coins').textContent = '🪙 ' + ST.coins;
    $('btn-sound').textContent = ST.sound ? '🔊' : '🔇';

    var box = $('topics-list'); box.innerHTML = '';

    TOPICS.forEach(function (t) {
      var done = 0, total = t.lessons.length, pct;
      t.lessons.forEach(function (L) { if (bestStars(L.id) > 0) done++; });
      pct = total ? Math.round(done / total * 100) : 0;

      var card = el('div', 'topic-card');
      card.style.setProperty('--tc', t.color);
      card.innerHTML =
        '<div class="tc-head">' +
          '<div class="tc-num">' + t.icon + '</div>' +
          '<div class="tc-info">' +
            '<div class="tc-title">Topic ' + t.num + ' · ' + esc(t.title) + '</div>' +
            '<div class="tc-sub">' + esc(t.sub) + ' — ' + total + ' دروس</div>' +
          '</div>' +
          '<div class="lr-stars">' + starsHTML(pct) + '</div>' +
        '</div>' +
        '<div class="tc-prog"><div class="pbar"><div style="width:' + pct + '%"></div></div>' +
        '<div class="tc-pct">' + done + '/' + total + ' دروس مكتملة</div></div>';
      card.onclick = function () { openTopic(t); };
      box.appendChild(card);
    });

    /* كارت Topic 5 المقفول — بختفي لوحده لما t5.js يوصل */
    var has5 = TOPICS.some(function (t) { return t.num === 5; });
    if (!has5) {
      var lk = el('div', 'topic-card locked');
      lk.style.setProperty('--tc', '#ea580c');
      lk.innerHTML =
        '<div class="tc-head">' +
          '<div class="tc-num">🔒</div>' +
          '<div class="tc-info">' +
            '<div class="tc-title">Topic 5 · Solve Problems Using Equations</div>' +
            '<div class="tc-sub">جاي قريباً 🚀 الجزء الجاي من المنصة</div>' +
          '</div>' +
        '</div>';
      box.appendChild(lk);
    }

    renderExams();
  }

  function starsHTML(pct) {
    var n = pct >= 90 ? 3 : (pct >= 70 ? 2 : (pct >= 50 ? 1 : 0));
    var s = '';
    for (var i = 0; i < 3; i++) s += i < n ? '⭐' : '☆';
    return s;
  }

  function renderExams() {
    var box = $('exams-list'); box.innerHTML = '';
    var comp = lessonsCompleted();
    EXAMS.forEach(function (ex) {
      var unlocked = comp >= ex.need;
      var best = ST.exams[ex.id] ? ST.exams[ex.id].best : 0;
      var card = el('div', 'exam-card' + (unlocked ? '' : ' locked'));
      card.innerHTML =
        '<div class="exam-ico">' + ex.ico + '</div>' +
        '<div class="exam-info">' +
          '<div class="exam-title">' + esc(ex.title) + '</div>' +
          '<div class="exam-sub">' + esc(ex.sub) +
            (unlocked ? (best ? ' · <span class="exam-best">أحسن نتيجة: ' + best + '%</span>' : '') : '') +
          '</div>' +
        '</div>' +
        (unlocked
          ? '<button class="btn primary exam">ابدأ 🚀</button>'
          : '<span class="chip">🔒 باقي ' + (ex.need - comp) + ' دروس</span>');
      if (unlocked) {
        card.querySelector('button').onclick = function () { startExam(ex); };
      }
      box.appendChild(card);
    });
  }

  /* ═══════════════ شاشة التوبك ═══════════════ */
  var CURT = null;
  function openTopic(t) {
    CURT = t;
    $('tp-title').textContent = 'Topic ' + t.num + ' · ' + t.title;
    $('tp-sub').textContent = t.sub;
    $('tp-coins').textContent = '🪙 ' + ST.coins;
    var box = $('lessons-list'); box.innerHTML = '';

    t.lessons.forEach(function (L) {
      var row = el('div', 'lesson-row');
      var st = bestStars(L.id);
      row.innerHTML =
        '<div class="lr-head">' +
          '<span class="lr-code">' + esc(L.code) + '</span>' +
          '<div style="flex:1">' +
            '<div class="lr-title">' + esc(L.title) + '</div>' +
            '<div class="lr-sub">' + esc(L.sub) + '</div>' +
          '</div>' +
          '<span class="lr-stars">' + (st ? '⭐'.repeat(st) : '') + '</span>' +
        '</div>' +
        '<div class="lr-btns">' +
          '<button class="btn lvl easy">🌱 سهل</button>' +
          '<button class="btn lvl med">🔥 متوسط</button>' +
          '<button class="btn lvl guide">📖 الدليل</button>' +
        '</div>';
      var btns = row.querySelectorAll('button');
      btns[0].onclick = function () { startLesson(L, 'easy'); };
      btns[1].onclick = function () { startLesson(L, 'medium'); };
      btns[2].onclick = function () {
        if (G7.printStudyGuide) G7.printStudyGuide(L.id);
        else toast('ملف الطباعة print7.js مش واصل 🙈');
      };
      box.appendChild(row);
    });
    show('scr-topic');
  }

  /* ═══════════════ بناء أسئلة الجلسة ═══════════════ */
  function buildQs(L, level, n, strict) {
    var out = [], seen = {}, guard = 0;
    while (out.length < n && guard < 600) {
      guard++;
      var q = null;
      try { q = L.gen[level](); } catch (e) { q = null; }
      if (!q || !q.q || !q.ok) continue;
      if (strict && seen[q.q]) continue;
      seen[q.q] = 1;
      out.push(finalizeQ(q));
    }
    return out;
  }
  function finalizeQ(q) {
    var okTxt = String(q.ok);
    var texts = [okTxt];
    (q.wrong || []).forEach(function (w) { texts.push(w.t); });
    var arr = shuffle(texts);
    var a = arr.indexOf(okTxt);
    var diag = {};
    (q.wrong || []).forEach(function (w) { diag[w.t] = w.d; });
    return { q: q.q, choices: arr, a: a, diag: diag, steps: q.steps || [], ok: okTxt };
  }

  /* ═══════════════ الجلسة ═══════════════ */
  var SES = null;

  function startLesson(L, level) {
    var qs = buildQs(L, level, 20, true);
    if (qs.length < 20) {
      var more = buildQs(L, level, 20 - qs.length, false);
      qs = qs.concat(more);
    }
    if (!qs.length) { toast('الدرس ده لسه بيتجهز 😅'); return; }

    SES = {
      kind: 'lesson', lesson: L, level: level, qs: qs,
      i: 0, correct: 0, streak: 0, coins: 0, hints: 0, mistakes: 0,
      wrongs: [], t0: Date.now(), pausedMs: 0, pausedAt: null,
      locked: false, hintLv: 0, timer: null
    };
    quizHead(L.code + ' · ' + L.title, level === 'easy' ? '🌱 المستوى السهل' : '🔥 المستوى المتوسط', L);
    startTimer();
    renderQ();
    show('scr-quiz');
  }

  function startExam(ex) {
    var all = allLessons();
    var win = ex.len ? all.slice(ex.from, ex.from + ex.len) : all.slice(0);
    var qs = [];
    win.forEach(function (L) {
      var per = Math.min(ex.perLesson, ex.id === 'fin' ? 2 : 3);
      var strictQs = buildQs(L, 'easy', 1, true);
      qs = qs.concat(strictQs);
      var med = buildQs(L, 'medium', per - 1, true);
      qs = qs.concat(med);
    });
    if (!qs.length) { toast('الامتحان لسه بيتجهز 😅'); return; }
    qs = shuffle(qs);
    if (ex.id === 'fin' && qs.length > 30) qs = qs.slice(0, 30);

    SES = {
      kind: 'exam', exam: ex, lesson: null, level: 'mix', qs: qs,
      i: 0, correct: 0, streak: 0, coins: 0, hints: 0, mistakes: 0,
      wrongs: [], t0: Date.now(), pausedMs: 0, pausedAt: null,
      locked: false, hintLv: 0, timer: null
    };
    quizHead(ex.ico + ' ' + ex.title, 'امتحان · ' + qs.length + ' سؤال', null);
    startTimer();
    renderQ();
    show('scr-quiz');
  }

  function quizHead(title, sub, L) {
    $('qz-title').textContent = title;
    $('qz-sub').textContent = sub;
    var cc = $('calc-chip');
    if (L && L.calc) { cc.classList.remove('hidden'); } else { cc.classList.add('hidden'); }
    var lad = $('hint-ladder');
    if (SES && SES.kind === 'exam') lad.classList.add('hidden'); else lad.classList.remove('hidden');
  }

  /* المؤقت */
  function startTimer() {
    killTimer(SES);
    if (!SES) return;
    SES.timer = setInterval(function () {
      if (!SES || SES.pausedAt) return;
      $('qz-timer').textContent = '⏱ ' + fmtT(elapsed());
    }, 500);
  }
  function killTimer(s) {
    if (s && s.timer) { clearInterval(s.timer); s.timer = null; }
    return null;
  }
  function elapsed() {
    if (!SES) return 0;
    return Math.max(0, Math.round((Date.now() - SES.t0 - SES.pausedMs) / 1000));
  }
  function pauseTimer() { if (SES && !SES.pausedAt) SES.pausedAt = Date.now(); }
  function resumeTimer() {
    if (SES && SES.pausedAt) { SES.pausedMs += Date.now() - SES.pausedAt; SES.pausedAt = null; }
  }

  /* ═══════════════ عرض السؤال ═══════════════ */
  function renderQ() {
    var q = SES.qs[SES.i];
    SES.locked = false; SES.hintLv = 0;

    $('qz-count').textContent = (SES.i + 1) + '/' + SES.qs.length;
    $('qz-pfill').style.width = (SES.i / SES.qs.length * 100) + '%';
    $('qz-num').textContent = 'سؤال ' + (SES.i + 1);
    $('qz-q').innerHTML = q.q;

    var box = $('qz-choices'); box.innerHTML = '';
    var letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    q.choices.forEach(function (txt, i) {
      var b = el('button', 'choice');
      b.innerHTML = '<span class="letter">' + letters[i] + '</span><span class="ctext">' + txt + '</span>';
      b.onclick = function () { answer(i, b); };
      box.appendChild(b);
    });

    var hb = $('hint-box'); hb.classList.add('hidden'); hb.innerHTML = '';
    var fb = $('fb-box'); fb.classList.add('hidden'); fb.innerHTML = '';
    $('btn-next').classList.add('hidden');

    var ladBtns = qsAll('.lad-btn');
    for (var i = 0; i < ladBtns.length; i++) { ladBtns[i].disabled = false; }
  }

  /* ═══════════════ الإجابة والتشخيص ═══════════════ */
  function answer(idx, btn) {
    if (!SES || SES.locked) return;
    SES.locked = true;
    var q = SES.qs[SES.i];
    var btns = qsAll('#qz-choices .choice');
    var okk = idx === q.a;
    var i;

    /* الهنت بيتقفل بعد الإجابة — خلص وقت الاستعانة */
    var lads = qsAll('.lad-btn');
    for (i = 0; i < lads.length; i++) { lads[i].disabled = true; }

    for (i = 0; i < btns.length; i++) {
      btns[i].classList.remove('dim');
      if (i === q.a) btns[i].classList.add('correct');
      else if (i === idx) btns[i].classList.add('wrong');
      else btns[i].classList.add('dim');
    }

    if (okk) {
      SES.correct++; SES.streak++;
      SES.coins += 10 + (SES.streak >= 3 ? 5 : 0);
      sfx.ok(); if (SES.streak >= 3) sfx.coin();
    } else {
      SES.streak = 0; SES.mistakes++;
      SES.wrongs.push({
        q: q.q, picked: q.choices[idx], right: q.ok,
        diag: q.diag[q.choices[idx]], steps: q.steps
      });
      sfx.bad();
    }
    updCoins();

    /* صندوق الفيدباك + التشخيص */
    var fb = $('fb-box');
    var html = '<div class="fb-head">' + (okk
      ? '✅ برافو' + (SES.streak >= 3 ? ' 🔥 سلسلة ' + SES.streak + '!' : '!')
      : '❌ مش دي — بس شوف فين وقعت بالظبط:') + '</div>';

    if (!okk) {
      if (q.diag[q.choices[idx]]) {
        html += '<div class="diag"><b>🎯 Exactly Where You Slipped:</b> ' + q.diag[q.choices[idx]] + '</div>';
      }
      html += '<div class="diag" style="border-right-color:#16a34a"><b>✅ الصح:</b> ' + q.ok + '</div>';
    }
    if (q.steps && q.steps.length) {
      html += '<div class="stepsbox"><div class="st-t">الطريقة الصح خطوة بخطوة:</div><ol>';
      for (i = 0; i < q.steps.length; i++) html += '<li>' + q.steps[i] + '</li>';
      html += '</ol></div>';
    }
    fb.innerHTML = html;
    fb.className = 'fb ' + (okk ? 'okk' : 'badd');
    fb.classList.remove('hidden');

    $('btn-next').innerHTML = (SES.i + 1 >= SES.qs.length) ? '🏁 شوف نتيجتك' : 'السؤال اللي بعده ➡️';
    $('btn-next').classList.remove('hidden');
    $('btn-next').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function updCoins() { $('qz-coins').textContent = '🪙 ' + SES.coins; }

  /* ═══════════════ سلّم الهنت 🧭👣🗺️ ═══════════════ */
  function hint(lv) {
    if (!SES || SES.locked || SES.kind === 'exam') return;
    var ladder = qsAll('.lad-btn');
    if (ladder[lv] && ladder[lv].disabled) return;
    if (ladder[lv]) ladder[lv].disabled = true;
    SES.hints++;
    sfx.hint();

    var L = SES.lesson, txt = '';
    if (lv === 0) txt = (L && L.hintA) || '🧭 اقرا السؤال ببطء وحد المطلوب الأول.';
    if (lv === 1) txt = (L && L.hintB) || '👣 نفّذ الخطوات بالترتيب — واحدة واحدة.';
    if (lv === 2) {
      txt = (L && L.hintC) ||
        ('🗺️ الإجابة شكلها كده: <b dir="ltr">' + mask(SES.qs[SES.i].ok) + '</b> — دوّر عليها بين الاختيارات.');
    }
    var hb = $('hint-box');
    hb.innerHTML += '<div class="h-row"><span class="h-lvl">تلميح ' + (lv + 1) + '</span>' + txt + '</div>';
    hb.classList.remove('hidden');
  }

  /* ═══════════════ السؤال اللي بعده + بريك اللعبة ═══════════════ */
  function nextQ() {
    if (!SES) return;
    SES.i++;
    if (SES.i >= SES.qs.length) { finish(); return; }

    /* بريك اللعبة: بعد كل 5 أسئلة في الدروس بس (80%) — الألعاب مدمجة مش شاشة منفصلة */
    if (SES.kind === 'lesson' && SES.i % 5 === 0 && window.Breaks && Math.random() < 0.8) {
      pauseTimer();
      window.Breaks.go(function (earned) {
        if (earned > 0) { SES.coins += earned; updCoins(); }
        resumeTimer();
        renderQ();
      });
      return;
    }
    renderQ();
  }

  /* ═══════════════ نهاية الجلسة ═══════════════ */
  function finish() {
    killTimer(SES);
    var secs = elapsed();
    var total = SES.qs.length;
    var pct = Math.round(SES.correct / total * 100);
    var stars = pct >= 90 ? 3 : (pct >= 70 ? 2 : (pct >= 50 ? 1 : 0));

    if (SES.kind === 'lesson') {
      var rec = lessonRec(SES.lesson.id)[SES.level];
      rec.best = Math.max(rec.best || 0, pct);
      rec.stars = Math.max(rec.stars || 0, stars);
      rec.plays = (rec.plays || 0) + 1;
      emit('sendResult', {
        student: ST.name, coach: 'أكرم', mode: 'Lesson',
        item: SES.lesson.code + ' · ' + (SES.level === 'easy' ? 'Easy' : 'Medium'),
        score: SES.correct, total: total, percent: pct,
        hints: SES.hints, seconds: secs, mistakes: SES.mistakes
      });
    } else {
      var er = ST.exams[SES.exam.id] = ST.exams[SES.exam.id] || {};
      er.best = Math.max(er.best || 0, pct);
      er.plays = (er.plays || 0) + 1;
      emit('sendResult', {
        student: ST.name, coach: 'أكرم', mode: SES.exam.title,
        item: SES.exam.sub, score: SES.correct, total: total, percent: pct,
        hints: SES.hints, seconds: secs, mistakes: SES.mistakes
      });
    }

    ST.coins += SES.coins;
    save();
    if (pct >= 70) sfx.win(); else sfx.ok();
    renderResult(pct, stars, secs, total);
    show('scr-result');
  }

  function renderResult(pct, stars, secs, total) {
    var ring = $('res-ring');
    ring.style.setProperty('--p', pct);
    $('res-pct').textContent = pct + '%';

    var sh = '';
    for (var i = 0; i < 3; i++) {
      sh += '<span class="st" style="animation-delay:' + (i * 0.18) + 's">' + (i < stars ? '⭐' : '☆') + '</span>';
    }
    $('res-stars').innerHTML = sh;

    var passed = pct >= 70;
    var msg = pct === 100 ? 'مثالي! انت نجم 🌟'
      : pct >= 90 ? 'خطير! أداء مذهل 🔥'
      : pct >= 70 ? 'ممتاز — عدّيت بنجاح ✅'
      : pct >= 50 ? 'كويس! كمان شوية وتقفلها 💪'
      : 'محتاجين تدريب أكتر — جرب تاني وانت هتتقنها 💪';
    if (SES.kind === 'exam') msg += (passed ? ' — نتيجة الامتحان: <b style="color:#16a34a">PASS</b>' : ' — نتيجة الامتحان: <b style="color:#dc2626">حاول تاني</b>');
    $('res-msg').innerHTML = msg;

    $('res-nums').innerHTML =
      'إجابات صح: <b>' + SES.correct + '/' + total + '</b> · ' +
      '🪙 <b>+' + SES.coins + '</b> · ' +
      '⏱ ' + fmtT(secs) + ' · ' +
      '🧭 هنت: ' + SES.hints + ' · ' +
      '💡 غلطات: ' + SES.mistakes;

    /* مراجعة الغلطات */
    var rev = $('res-review'); rev.innerHTML = '';
    if (!SES.wrongs.length) {
      $('rev-title').classList.add('hidden');
    } else {
      $('rev-title').classList.remove('hidden');
      $('rev-title').textContent = 'مراجعة الغلطات 💡 (' + SES.wrongs.length + ')';
      SES.wrongs.forEach(function (w) {
        var it = el('div', 'rev-item');
        var h = '<div class="rq">' + w.q + '</div>' +
          '<div class="rp">❌ اخترت: ' + w.picked + (w.diag ? ' — <i>' + w.diag + '</i>' : '') + '</div>' +
          '<div class="ra">✅ الصح: ' + w.right + '</div>';
        if (w.steps && w.steps.length) {
          h += '<div class="stepsbox"><div class="st-t">الطريقة:</div><ol>';
          for (var k = 0; k < w.steps.length; k++) h += '<li>' + w.steps[k] + '</li>';
          h += '</ol></div>';
        }
        it.innerHTML = h;
        rev.appendChild(it);
      });
    }

    /* الأزرار */
    var retry = $('btn-retry'), nextl = $('btn-next-l'), sheet = $('btn-sheet');
    retry.onclick = function () {
      if (SES.kind === 'lesson') startLesson(SES.lesson, SES.level);
      else startExam(SES.exam);
    };
    if (SES.kind === 'lesson') {
      var all = allLessons(), idx = -1;
      for (var j = 0; j < all.length; j++) if (all[j].id === SES.lesson.id) { idx = j; break; }
      var nxt = idx >= 0 ? all[idx + 1] : null;
      nextl.classList.remove('hidden');
      nextl.onclick = function () {
        if (!nxt) { toast('خلصت كل الدروس المتاحة! جاي في الجزء الجاي 🚀'); goHome(); return; }
        openTopic(topicOf(nxt));
      };
      sheet.classList.remove('hidden');
      sheet.onclick = function () {
        if (G7.printWorksheet) G7.printWorksheet(SES.lesson.id, SES.level);
        else toast('ملف الطباعة print7.js مش واصل 🙈');
      };
    } else {
      nextl.classList.add('hidden');
      sheet.classList.add('hidden');
    }
  }

  function topicOf(lesson) {
    for (var i = 0; i < TOPICS.length; i++) {
      if (TOPICS[i].lessons.indexOf(lesson) >= 0) return TOPICS[i];
    }
    return TOPICS[0];
  }

  /* ═══════════════ مركز الطباعة ═══════════════ */
  function openPrint() {
    var box = $('print-lessons'); box.innerHTML = '';
    allLessons().forEach(function (L) {
      var row = el('div', 'pl-row');
      row.innerHTML =
        '<div class="pl-title">' + esc(L.code) + ' · ' + esc(L.title) +
        '<small>' + esc(L.sub) + '</small></div>' +
        '<button class="btn print b1">📖 دليل مراجعة</button>' +
        '<button class="btn print b2">📝 تدريب سهل</button>' +
        '<button class="btn print b3">📝 تدريب متوسط</button>';
      var btns = row.querySelectorAll('button');
      btns[0].onclick = function () {
        if (G7.printStudyGuide) G7.printStudyGuide(L.id); else toast('print7.js مش واصل 🙈');
      };
      btns[1].onclick = function () {
        if (G7.printWorksheet) G7.printWorksheet(L.id, 'easy'); else toast('print7.js مش واصل 🙈');
      };
      btns[2].onclick = function () {
        if (G7.printWorksheet) G7.printWorksheet(L.id, 'medium'); else toast('print7.js مش واصل 🙈');
      };
      box.appendChild(row);
    });

    /* الشهادة */
    var all = allLessons(), done = 0;
    all.forEach(function (L) { if (bestStars(L.id) > 0) done++; });
    var hint = $('cert-hint');
    if (done >= all.length && all.length >= 13) {
      hint.textContent = 'كل الدروس المتاحة اتخلصت! الشهادة جاهزة 🎉';
      $('btn-cert').disabled = false;
    } else {
      hint.textContent = 'الشهادة بتتفتح لما تخلص كل الدروس — باقي ' + (all.length - done) + ' درس 💪';
      $('btn-cert').disabled = true;
    }
    show('scr-print');
  }

  /* ═══════════════ شاشة التقدم ═══════════════ */
  function openStats() {
    $('st-coins').textContent = '🪙 ' + ST.coins;
    var box = $('stats-body'); box.innerHTML = '';
    var all = allLessons(), comp = lessonsCompleted();

    var g = el('div', 'stat-grid');
    g.innerHTML =
      '<div class="stat-card"><div class="sv">' + ST.coins + '</div><div class="sl">🪙 الرصيد الكلي</div></div>' +
      '<div class="stat-card"><div class="sv">' + comp + '/' + all.length + '</div><div class="sl">📚 دروس مكتملة</div></div>';
    box.appendChild(g);

    TOPICS.forEach(function (t) {
      var done = 0;
      t.lessons.forEach(function (L) { if (bestStars(L.id) > 0) done++; });
      var w = el('div', 'topic-card');
      w.style.setProperty('--tc', t.color);
      w.style.cursor = 'default';
      w.innerHTML =
        '<div class="tc-head"><div class="tc-num">' + t.icon + '</div>' +
        '<div class="tc-info"><div class="tc-title">Topic ' + t.num + '</div>' +
        '<div class="tc-sub">' + done + '/' + t.lessons.length + ' دروس</div></div></div>' +
        '<div class="tc-prog"><div class="pbar"><div style="width:' + Math.round(done / t.lessons.length * 100) + '%"></div></div></div>';
      box.appendChild(w);
    });

    all.forEach(function (L) {
      var r = el('div', 'st-lesson');
      var s = bestStars(L.id);
      var ss = '';
      for (var i = 0; i < 3; i++) ss += i < s ? '⭐' : '·';
      r.innerHTML = '<span class="slc">' + esc(L.code) + '</span><span class="sln">' + esc(L.title) + '</span><span class="sls">' + ss + '</span>';
      box.appendChild(r);
    });
    show('scr-stats');
  }

  /* ═══════════════ تشغيل ═══════════════ */
  function boot() {
    load();

    $('btn-sound').onclick = function () {
      ST.sound = !ST.sound; save();
      $('btn-sound').textContent = ST.sound ? '🔊' : '🔇';
      if (ST.sound) sfx.ok();
    };
    $('btn-stats').onclick = openStats;
    $('btn-print').onclick = openPrint;
    $('btn-logout').onclick = function () {
      confirmBox('تغيير اسم الطالب؟ التقدم هيفضل محفوظ على الجهاز ده 🙂', function () {
        ST.name = ''; save(); initLogin();
      });
    };
    $('btn-back-home').onclick = goHome;
    $('btn-stats-back').onclick = goHome;
    $('btn-print-back').onclick = goHome;
    $('btn-home2').onclick = goHome;

    $('btn-quit').onclick = function () {
      confirmBox('الخروج من الدرس؟ نتيجة الجلسة دي <b>مش هتتحفظ</b> 🙏', goHome);
    };
    $('btn-next').onclick = nextQ;

    qsAll('.lad-btn').forEach(function (b) {
      b.onclick = function () { hint(parseInt(b.getAttribute('data-l'), 10)); };
    });

    $('modal-yes').onclick = function () {
      $('modal').classList.add('hidden');
      if (modalYes) { var f = modalYes; modalYes = null; f(); }
    };
    $('modal-no').onclick = function () { $('modal').classList.add('hidden'); modalYes = null; };

    $('btn-cert').onclick = function () {
      if (G7.printCertificate) G7.printCertificate(); else toast('print7.js مش واصل 🙈');
    };

    initLogin();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }

  /* ═══════════════ الواجهة العامة ═══════════════ */
  return {
    booted: true,
    on: on, emit: emit,
    registerTopic: registerTopic,
    topicCount: topicCount,
    allLessons: allLessons,
    lessonById: lessonById,
    lessonsCompleted: lessonsCompleted,
    bestStars: bestStars,
    state: ST,
    save: save,
    show: show,
    toast: toast,
    confirmBox: confirmBox,
    sfx: sfx,
    esc: esc
  };
})();
