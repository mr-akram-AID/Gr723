/* ============================================================
   AID Mathematics Academy · Grade 7 — engine.js
   Core engine: 20-question quizzes · 3-level hint ladder ·
   per-answer diagnostics · Checkpoints + Final · results ·
   sounds · progress. Content files (t1.js / t4.js / t5.js)
   register their topics here.
   ============================================================ */
var G7 = (function () {
  'use strict';

  /* ═══════════════ helpers ═══════════════ */
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
  /* answer mask: digits become ● and letters ▢ — the student shapes the final answer */
  function mask(s) {
    return String(s).replace(/[0-9]/g, '●').replace(/[a-zA-Z]/g, '▢');
  }
  function fmtT(sec) {
    var m = Math.floor(sec / 60), s = sec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  /* ═══════════════ event bus (for sheet7 / print7) ═══════════════ */
  var EV = {};
  function on(k, fn) { (EV[k] = EV[k] || []).push(fn); }
  function emit(k, d) {
    var list = EV[k] || [];
    for (var i = 0; i < list.length; i++) { try { list[i](d); } catch (e) {} }
  }

  /* ═══════════════ topic registry ═══════════════ */
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

  /* ═══════════════ state (localStorage) ═══════════════ */
  var LSKEY = 'G7V2';
  var ST = { name: '', sound: true, coins: 0, badges: {}, lessons: {}, exams: {} };
  function save() { try { localStorage.setItem(LSKEY, JSON.stringify(ST)); } catch (e) {} }
  function load() {
    try {
      var raw = localStorage.getItem(LSKEY);
      if (!raw && localStorage.getItem('G7V1')) raw = localStorage.getItem('G7V1');
      if (raw) {
        var o = JSON.parse(raw);
        if (o && o.name !== undefined) {
          /* copy into the same object — G7.state stays a live reference */
          var k;
          for (k in ST) { if (Object.prototype.hasOwnProperty.call(ST, k)) delete ST[k]; }
          for (k in o) { if (Object.prototype.hasOwnProperty.call(o, k)) ST[k] = o[k]; }
          ST.badges = ST.badges || {};
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

  /* ═══════════════ sounds (Web Audio) ═══════════════ */
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

  /* ═══════════════ screen navigation ═══════════════ */
  function show(id) {
    qsAll('.screen').forEach(function (s) { s.classList.remove('active'); });
    $(id).classList.add('active');
    window.scrollTo(0, 0);
  }

  /* ═══════════════ toast + modal ═══════════════ */
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

  /* ═══════════════ exams ═══════════════ */
  /* course order: T1 (5) → T2 (5) → T3 (6) → T4 (8) → T5 (7) = 31 lessons */
  var EXAMS = [
    { id: 'cp1', ico: '🎯', title: 'Checkpoint 1', need: 10, from: 0,  len: 10, perLesson: 2, sub: 'Lessons 1–10 · Rational Numbers & Proportional Relationships' },
    { id: 'cp2', ico: '🎯', title: 'Checkpoint 2', need: 20, from: 10, len: 10, perLesson: 2, sub: 'Lessons 11–20 · Percent Problems & Equivalent Expressions' },
    { id: 'cp3', ico: '🎯', title: 'Checkpoint 3', need: 25, from: 20, len: 11, perLesson: 2, sub: 'Lessons 21–31 · Equations & Inequalities' },
    { id: 'fin', ico: '🏆', title: 'Final Exam',    need: 31, from: 0,  len: 0,  perLesson: 2, sub: 'The whole course · 30 questions' }
  ];

  /* ═══════════════ badges (a gift for every lesson) ═══════════════ */
  var BADGES = {
    t1l1: { ico: '⚡', name: 'Sign Master' },
    t1l2: { ico: '✖️', name: 'Fraction Forger' },
    t1l3: { ico: '➗', name: 'Division Dynamo' },
    t1l4: { ico: '🎯', name: 'Rational Ranger' },
    t1l5: { ico: '🧠', name: 'Problem Slayer' },
    t2l1: { ico: '🏁', name: 'Speed Scout' },
    t2l2: { ico: '🌀', name: 'Flip Master' },
    t2l3: { ico: '⚖️', name: 'Balance Keeper' },
    t2l4: { ico: '🔑', name: 'Key Finder' },
    t2l5: { ico: '📈', name: 'Line Rider' },
    t3l1: { ico: '💯', name: 'Percent Pro' },
    t3l2: { ico: '🔗', name: 'Cross-Product Champ' },
    t3l3: { ico: '🧮', name: 'Equation Ace' },
    t3l4: { ico: '📊', name: 'Change Chaser' },
    t3l5: { ico: '🏷️', name: 'Deal Hunter' },
    t3l6: { ico: '🏦', name: 'Interest Idol' },
    t4l1: { ico: '✍️', name: 'Expression Writer' },
    t4l2: { ico: '🔄', name: 'Equivalent Expert' },
    t4l3: { ico: '🧹', name: 'Simplifier' },
    t4l4: { ico: '💥', name: 'Expander' },
    t4l5: { ico: '🔍', name: 'Factor Detective' },
    t4l6: { ico: '➕', name: 'The Collector' },
    t4l7: { ico: '➖', name: 'The Subtractor' },
    t4l8: { ico: '🕵️', name: 'Proof Master' },
    t5l1: { ico: '📝', name: 'Equation Architect' },
    t5l2: { ico: '🔓', name: 'The Unlocker' },
    t5l3: { ico: '📦', name: 'The Distributor' },
    t5l4: { ico: '⛓️', name: 'Inequality Starter' },
    t5l5: { ico: '🔀', name: 'Flip Guardian' },
    t5l6: { ico: '🎚️', name: 'Range Master' },
    t5l7: { ico: '🏆', name: 'Final Solver' }
  };
  function badgeOf(L) { return BADGES[L.id] || { ico: '🏅', name: L.code + ' Champion' }; }
  function badgeCount() {
    var n = 0, k;
    for (k in ST.badges) { if (Object.prototype.hasOwnProperty.call(ST.badges, k)) n++; }
    return n;
  }
  function fmtDate() {
    var d = new Date();
    return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
  }

  /* ═══════════════ splash + name ═══════════════ */
  function initLogin() {
    show('scr-splash');
    $('btn-begin').onclick = function () {
      sfx.ok();
      if (ST.name) { goHome(); return; }
      show('scr-login');
    };
    $('btn-start').onclick = function () {
      var n = $('inp-name').value.trim();
      if (n.length < 2) {
        $('name-err').textContent = 'Please write your full name, champion.';
        $('inp-name').classList.add('shake');
        setTimeout(function () { $('inp-name').classList.remove('shake'); }, 400);
        return;
      }
      $('name-err').textContent = '';
      ST.name = n; save(); goHome();
      toast('Welcome, ' + esc(n) + '! 🌟');
    };
    $('inp-name').onkeydown = function (e) { if (e.key === 'Enter') $('btn-start').click(); };
  }

  /* ═══════════════ home ═══════════════ */
  function goHome() { SES = killTimer(SES); renderHome(); show('scr-home'); }

  function renderHome() {
    $('topics-hello').textContent = 'Welcome, ' + ST.name;
    $('btn-sound').textContent = ST.sound ? 'Sound · On' : 'Sound · Off';

    var box = $('topics-list'); box.innerHTML = '';

    TOPICS.forEach(function (t) {
      var done = 0, total = t.lessons.length, pct;
      t.lessons.forEach(function (L) { if (bestStars(L.id) > 0) done++; });
      pct = total ? Math.round(done / total * 100) : 0;

      var card = el('div', 'topic-card');
      card.innerHTML =
        '<div class="tc-head">' +
          '<div class="tc-num">' + t.icon + '</div>' +
          '<div class="tc-info">' +
            '<div class="tc-title">Topic ' + t.num + ' · ' + esc(t.title) + '</div>' +
            '<div class="tc-sub">' + esc(t.sub) + ' — ' + total + ' lessons</div>' +
          '</div>' +
          '<div class="lr-stars">' + starsHTML(pct) + '</div>' +
        '</div>' +
        '<div class="tc-prog"><div class="pbar"><div style="width:' + pct + '%"></div></div>' +
        '<div class="tc-pct">' + done + '/' + total + ' complete</div></div>';
      card.onclick = function () { openTopic(t); };
      box.appendChild(card);
    });

    /* locked Topic 5 card — disappears by itself once t5.js loads */
    var has5 = TOPICS.some(function (t) { return t.num === 5; });
    if (!has5) {
      var lk = el('div', 'topic-card locked');
      lk.innerHTML =
        '<div class="tc-head">' +
          '<div class="tc-num">🔒</div>' +
          '<div class="tc-info">' +
            '<div class="tc-title">Topic 5 · Solve Problems Using Equations</div>' +
            '<div class="tc-sub">Coming soon — the next part of the platform</div>' +
          '</div>' +
        '</div>';
      box.appendChild(lk);
    }

    renderExams();

    var all = allLessons(), comp = lessonsCompleted();
    $('topics-progress').innerHTML = 'Course progress · <b>' + comp + '/' + all.length +
      '</b> lessons completed · <b>🎁 ' + badgeCount() + '</b> badges earned · <b>' + ST.coins + '</b> coins';
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
          '<b>' + esc(ex.title) + '</b>' +
          '<span>' + esc(ex.sub) +
            (unlocked ? (best ? ' · <span class="exam-best">Best: ' + best + '%</span>' : '') : '') +
          '</span>' +
        '</div>' +
        (unlocked
          ? '<button class="btn primary">Start</button>'
          : '<span class="lock-note">Locked · ' + (ex.need - comp) + ' more lessons</span>');
      if (unlocked) {
        card.querySelector('button').onclick = function () { startExam(ex); };
      }
      box.appendChild(card);
    });
  }

  /* ═══════════════ topic screen ═══════════════ */
  var CURT = null;
  function openTopic(t) {
    CURT = t;
    $('tp-title').textContent = 'Topic ' + t.num + ' · ' + t.title;
    $('tp-sub').textContent = t.sub;
    var box = $('lessons-list'); box.innerHTML = '';

    var done = 0;
    t.lessons.forEach(function (L) { if (bestStars(L.id) > 0) done++; });

    t.lessons.forEach(function (L) {
      var row = el('div', 'lesson-row');
      var st = bestStars(L.id);
      var got = !!ST.badges[L.id];
      row.innerHTML =
        '<div class="lr-head">' +
          '<span class="lr-code">' + esc(L.code) + '</span>' +
          '<div class="lr-mid">' +
            '<div class="lr-title">' + esc(L.title) + '</div>' +
            '<div class="lr-sub">' + esc(L.sub) + '</div>' +
          '</div>' +
          '<span class="lr-side">' +
            (got ? '<span class="lr-badge" title="' + esc(badgeOf(L).name) + '">' + badgeOf(L).ico + '</span>' : '') +
            '<span class="lr-stars">' + (st ? '⭐'.repeat(st) : '') + '</span>' +
          '</span>' +
        '</div>' +
        '<div class="lr-btns">' +
          '<button class="btn ghost lvl easy">🌱 Easy</button>' +
          '<button class="btn ghost lvl med">🔥 Medium</button>' +
          '<button class="btn ghost lvl guide">📖 Guide</button>' +
        '</div>';
      var btns = row.querySelectorAll('button');
      btns[0].onclick = function () { startLesson(L, 'easy'); };
      btns[1].onclick = function () { startLesson(L, 'medium'); };
      btns[2].onclick = function () {
        if (G7.printStudyGuide) G7.printStudyGuide(L.id);
        else toast('Print module did not load.');
      };
      box.appendChild(row);
    });

    $('tp-progress').innerHTML = 'Topic progress · <b>' + done + '/' + t.lessons.length +
      '</b> lessons completed · <b>🎁 ' + t.lessons.filter(function (L) { return !!ST.badges[L.id]; }).length +
      '</b> badges · <b>' + ST.coins + '</b> coins earned';
    show('scr-topic');
  }

  /* ═══════════════ build session questions ═══════════════ */
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

  /* ═══════════════ session ═══════════════ */
  var SES = null;
  var LASTBADGE = null; /* badge earned in the run that just finished */

  function startLesson(L, level) {
    var qs = buildQs(L, level, 20, true);
    if (qs.length < 20) {
      var more = buildQs(L, level, 20 - qs.length, false);
      qs = qs.concat(more);
    }
    if (!qs.length) { toast('This lesson is still being prepared.'); return; }

    SES = {
      kind: 'lesson', lesson: L, level: level, qs: qs,
      i: 0, correct: 0, streak: 0, coins: 0, hints: 0, mistakes: 0,
      wrongs: [], t0: Date.now(), pausedMs: 0, pausedAt: null,
      locked: false, hintLv: 0, timer: null
    };
    quizHead(L.code + ' · ' + L.title, level === 'easy' ? '🌱 Easy' : '🔥 Medium', L);
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
    if (!qs.length) { toast('The exam is still being prepared.'); return; }
    qs = shuffle(qs);
    if (ex.id === 'fin' && qs.length > 30) qs = qs.slice(0, 30);

    SES = {
      kind: 'exam', exam: ex, lesson: null, level: 'mix', qs: qs,
      i: 0, correct: 0, streak: 0, coins: 0, hints: 0, mistakes: 0,
      wrongs: [], t0: Date.now(), pausedMs: 0, pausedAt: null,
      locked: false, hintLv: 0, timer: null
    };
    quizHead(ex.ico + ' ' + ex.title, 'Exam · ' + qs.length + ' questions', null);
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
    var ts = $('qz-timer'); ts.textContent = '0:00';
    var subEl = $('qz-count'); subEl.textContent = '1/' + (SES ? SES.qs.length : 20);
  }

  /* timer */
  function startTimer() {
    killTimer(SES);
    if (!SES) return;
    SES.timer = setInterval(function () {
      if (!SES || SES.pausedAt) return;
      $('qz-timer').textContent = fmtT(elapsed());
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

  /* ═══════════════ render question ═══════════════ */
  function renderQ() {
    var q = SES.qs[SES.i];
    SES.locked = false; SES.hintLv = 0;

    $('qz-count').textContent = (SES.i + 1) + '/' + SES.qs.length;
    $('qz-pfill').style.width = (SES.i / SES.qs.length * 100) + '%';
    $('qz-num').textContent = 'Question ' + (SES.i + 1);
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
    updCoins();
  }

  /* ═══════════════ answer + diagnosis ═══════════════ */
  function answer(idx, btn) {
    if (!SES || SES.locked) return;
    SES.locked = true;
    var q = SES.qs[SES.i];
    var btns = qsAll('#qz-choices .choice');
    var okk = idx === q.a;
    var i;

    /* hints close after answering */
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

    /* feedback + diagnosis */
    var fb = $('fb-box');
    var html = '<div class="fb-head">' + (okk
      ? '✅ Correct' + (SES.streak >= 3 ? ' — streak of ' + SES.streak + '! 🔥' : '!')
      : '❌ Not this one — here is exactly where you slipped:') + '</div>';

    if (!okk) {
      if (q.diag[q.choices[idx]]) {
        html += '<div class="diag"><b>🎯 Exactly Where You Slipped:</b> ' + q.diag[q.choices[idx]] + '</div>';
      }
      html += '<div class="diag" style="border-left:3px solid var(--good); padding-left:.8rem; margin-top:.6rem"><b>✅ The right answer:</b> ' + q.ok + '</div>';
    }
    if (q.steps && q.steps.length) {
      html += '<div class="stepsbox"><div class="st-t">The right way, step by step:</div><ol>';
      for (i = 0; i < q.steps.length; i++) html += '<li>' + q.steps[i] + '</li>';
      html += '</ol></div>';
    }
    fb.innerHTML = html;
    fb.className = 'fb ' + (okk ? 'okk' : 'badd');
    fb.classList.remove('hidden');

    $('btn-next').innerHTML = (SES.i + 1 >= SES.qs.length) ? '🏁 See your result' : 'Next Question &#8594;';
    $('btn-next').classList.remove('hidden');
    $('btn-next').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function updCoins() { if (SES) $('qz-coins').textContent = '🪙 ' + SES.coins; }

  /* ═══════════════ hint ladder 🧭👣🗺️ ═══════════════ */
  function hint(lv) {
    if (!SES || SES.locked || SES.kind === 'exam') return;
    var ladder = qsAll('.lad-btn');
    if (ladder[lv] && ladder[lv].disabled) return;
    if (ladder[lv]) ladder[lv].disabled = true;
    SES.hints++;
    sfx.hint();

    var L = SES.lesson, txt = '';
    if (lv === 0) txt = (L && L.hintA) || '🧭 Read the question slowly and identify exactly what is asked first.';
    if (lv === 1) txt = (L && L.hintB) || '👣 Carry out the steps in order — one at a time.';
    if (lv === 2) {
      txt = (L && L.hintC) ||
        ('🗺️ The answer looks like this: <b>' + mask(SES.qs[SES.i].ok) + '</b> — find it among the choices.');
    }
    var hb = $('hint-box');
    hb.innerHTML += '<div class="h-row"><span class="h-lvl">Hint ' + (lv + 1) + '</span>' + txt + '</div>';
    hb.classList.remove('hidden');
  }

  /* ═══════════════ next question + game break ═══════════════ */
  function nextQ() {
    if (!SES) return;
    SES.i++;
    if (SES.i >= SES.qs.length) { finish(); return; }

    /* game break: after every 5 questions in lessons only (80%) — games are embedded, not a separate zone */
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

  /* ═══════════════ session end ═══════════════ */
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

      /* 🎁 badge gift — earned on a real pass (70%+) */
      LASTBADGE = null;
      if (pct >= 70) {
        var bd = ST.badges[SES.lesson.id];
        if (!bd) {
          LASTBADGE = badgeOf(SES.lesson);
          ST.badges[SES.lesson.id] = { d: fmtDate(), pct: pct, level: SES.level };
          ST.coins += 50; /* gift bonus coins */
        } else {
          bd.pct = Math.max(bd.pct || 0, pct);
          bd.level = SES.level;
        }
      }

      emit('sendResult', {
        student: ST.name, coach: 'Mr. Akram', mode: 'Lesson',
        item: SES.lesson.code + ' · ' + (SES.level === 'easy' ? 'Easy' : 'Medium'),
        score: SES.correct, total: total, percent: pct,
        hints: SES.hints, seconds: secs, mistakes: SES.mistakes
      });
    } else {
      var er = ST.exams[SES.exam.id] = ST.exams[SES.exam.id] || {};
      er.best = Math.max(er.best || 0, pct);
      er.plays = (er.plays || 0) + 1;
      emit('sendResult', {
        student: ST.name, coach: 'Mr. Akram', mode: SES.exam.title,
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

    /* 🎁 gift card — a new badge was unlocked this run */
    var gift = $('res-gift');
    if (LASTBADGE) {
      gift.innerHTML =
        '<div class="g-ico">' + LASTBADGE.ico + '</div>' +
        '<div class="g-mid">' +
          '<div class="g-l1">New gift unlocked!</div>' +
          '<div class="g-l2">' + esc(LASTBADGE.name) + ' — Lesson ' + esc(SES.lesson.code) + ' badge</div>' +
          '<div class="g-l3">🪙 +50 gift coins · see it in My Statistics</div>' +
        '</div>';
      gift.classList.remove('hidden');
    } else {
      gift.classList.add('hidden');
    }

    var passed = pct >= 70;
    var msg = pct === 100 ? 'Flawless — a perfect run! 🌟'
      : pct >= 90 ? 'Outstanding performance! 🔥'
      : pct >= 70 ? 'Excellent — you passed!'
      : pct >= 50 ? 'Good effort — you are almost there 💪'
      : 'Keep training — you will master it 💪';
    if (SES.kind === 'exam') msg += (passed ? ' — Exam result: <b style="color:var(--good)">PASS</b>' : ' — Exam result: <b style="color:var(--bad)">try again</b>');
    $('res-msg').innerHTML = msg;

    $('res-nums').innerHTML =
      '<div class="rn"><b>' + SES.correct + '/' + total + '</b>Correct</div>' +
      '<div class="rn"><b>🪙 +' + SES.coins + '</b>Coins earned</div>' +
      '<div class="rn"><b>' + fmtT(secs) + '</b>Time</div>' +
      '<div class="rn"><b>🧭 ' + SES.hints + '</b>Hints used</div>' +
      '<div class="rn"><b>💡 ' + SES.mistakes + '</b>Mistakes</div>';

    /* mistakes review */
    var rev = $('res-review'); rev.innerHTML = '';
    if (!SES.wrongs.length) {
      $('rev-title').classList.add('hidden');
    } else {
      $('rev-title').classList.remove('hidden');
      $('rev-title').textContent = 'Exactly Where You Slipped (' + SES.wrongs.length + ')';
      SES.wrongs.forEach(function (w) {
        var it = el('div', 'rev-item');
        var h = '<div class="rq">' + w.q + '</div>' +
          '<div class="rp">❌ You picked: ' + w.picked + (w.diag ? ' — <i>' + w.diag + '</i>' : '') + '</div>' +
          '<div class="ra">✅ The right answer: ' + w.right + '</div>';
        if (w.steps && w.steps.length) {
          h += '<div class="stepsbox"><div class="st-t">The right way:</div><ol>';
          for (var k = 0; k < w.steps.length; k++) h += '<li>' + w.steps[k] + '</li>';
          h += '</ol></div>';
        }
        it.innerHTML = h;
        rev.appendChild(it);
      });
    }

    /* buttons */
    var retry = $('btn-retry'), nextl = $('btn-next-l'), sheet = $('btn-sheet'), certl = $('btn-cert-l');
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
        if (!nxt) { toast('All available lessons complete! The next part is coming.'); goHome(); return; }
        openTopic(topicOf(nxt));
      };
      sheet.classList.remove('hidden');
      sheet.onclick = function () {
        if (G7.printWorksheet) G7.printWorksheet(SES.lesson.id, SES.level);
        else toast('Print module did not load.');
      };
      /* 🎓 per-lesson certificate — reveals on screen, printable, signed by Mr. Akram */
      if (passed) {
        var cinfo = { pct: pct, score: SES.correct, total: total, level: SES.level };
        certl.classList.remove('hidden');
        certl.onclick = function () {
          if (G7.showLessonCert) G7.showLessonCert(SES.lesson.id, cinfo);
          else if (G7.printLessonCert) G7.printLessonCert(SES.lesson.id, cinfo);
          else toast('Print module did not load.');
        };
        /* the celebration moment — the certificate rises on its own */
        setTimeout(function () {
          if ($('scr-result').classList.contains('active') && G7.showLessonCert) {
            G7.showLessonCert(SES.lesson.id, cinfo);
          }
        }, 1600);
      } else {
        certl.classList.add('hidden');
        certl.onclick = null;
      }
    } else {
      nextl.classList.add('hidden');
      sheet.classList.add('hidden');
      certl.classList.add('hidden');
      certl.onclick = null;
    }
  }

  function topicOf(lesson) {
    for (var i = 0; i < TOPICS.length; i++) {
      if (TOPICS[i].lessons.indexOf(lesson) >= 0) return TOPICS[i];
    }
    return TOPICS[0];
  }

  /* ═══════════════ print center ═══════════════ */
  function openPrint() {
    var box = $('print-lessons'); box.innerHTML = '';
    allLessons().forEach(function (L) {
      var row = el('div', 'pl-row');
      row.innerHTML =
        '<div class="pl-title">' + esc(L.code) + ' · ' + esc(L.title) +
        '<small>' + esc(L.sub) + '</small></div>' +
        '<button class="btn ghost print">📖 Study Guide</button>' +
        '<button class="btn ghost print">📝 Easy Sheet</button>' +
        '<button class="btn ghost print">📝 Medium Sheet</button>';
      var btns = row.querySelectorAll('button');
      btns[0].onclick = function () {
        if (G7.printStudyGuide) G7.printStudyGuide(L.id); else toast('Print module did not load.');
      };
      btns[1].onclick = function () {
        if (G7.printWorksheet) G7.printWorksheet(L.id, 'easy'); else toast('Print module did not load.');
      };
      btns[2].onclick = function () {
        if (G7.printWorksheet) G7.printWorksheet(L.id, 'medium'); else toast('Print module did not load.');
      };
      box.appendChild(row);
    });

    /* certificate */
    var all = allLessons(), done = 0;
    all.forEach(function (L) { if (bestStars(L.id) > 0) done++; });
    var hint = $('cert-hint');
    if (done >= all.length && all.length >= 13) {
      hint.textContent = 'Every lesson is complete — your certificate is ready!';
      $('btn-cert').disabled = false;
    } else {
      hint.textContent = 'The certificate unlocks when all lessons are complete — ' + (all.length - done) + ' to go.';
      $('btn-cert').disabled = true;
    }
    show('scr-print');
  }

  /* ═══════════════ stats screen ═══════════════ */
  function openStats() {
    var box = $('stats-body'); box.innerHTML = '';
    var all = allLessons(), comp = lessonsCompleted();

    var g = el('div', 'stat-grid');
    g.innerHTML =
      '<div class="stat-card"><div class="sv">' + ST.coins + '</div><div class="sl">🪙 Coins earned</div></div>' +
      '<div class="stat-card"><div class="sv">' + comp + '/' + all.length + '</div><div class="sl">📚 Lessons completed</div></div>' +
      '<div class="stat-card"><div class="sv">' + badgeCount() + '/' + all.length + '</div><div class="sl">🎁 Badges earned</div></div>';
    box.appendChild(g);

    /* 🎁 badge gallery — one gift for every lesson in the course */
    var bh = el('div', 'bdg-head');
    bh.innerHTML = '<div class="eyebrow">My Badge Collection</div>' +
      '<h2 style="margin-bottom:.6rem">Gifts from Mr. Akram 🎁</h2>' +
      '<p class="muted" style="font-size:.85rem;margin-bottom:1rem">Pass any lesson with 70% or more to unlock its badge — plus 50 gift coins.</p>';
    box.appendChild(bh);
    var grid = el('div', 'badge-grid');
    allLessons().forEach(function (L) {
      var got = ST.badges[L.id];
      var bd = badgeOf(L);
      var cell = el('div', 'bdg' + (got ? '' : ' off'));
      cell.innerHTML =
        '<div class="b-ico">' + bd.ico + '</div>' +
        '<div class="b-nm">' + esc(bd.name) + '</div>' +
        '<div class="b-cd">' + esc(L.code) + (got ? ' · ' + got.pct + '%' : ' · locked') + '</div>';
      grid.appendChild(cell);
    });
    box.appendChild(grid);

    TOPICS.forEach(function (t) {
      var done = 0;
      t.lessons.forEach(function (L) { if (bestStars(L.id) > 0) done++; });
      var w = el('div', 'topic-card');
      w.style.cursor = 'default';
      w.innerHTML =
        '<div class="tc-head"><div class="tc-num">' + t.icon + '</div>' +
        '<div class="tc-info"><div class="tc-title">Topic ' + t.num + '</div>' +
        '<div class="tc-sub">' + done + '/' + t.lessons.length + ' lessons</div></div></div>' +
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

  /* ═══════════════ boot ═══════════════ */
  function boot() {
    load();

    $('btn-sound').onclick = function () {
      ST.sound = !ST.sound; save();
      $('btn-sound').textContent = ST.sound ? 'Sound · On' : 'Sound · Off';
      if (ST.sound) sfx.ok();
    };
    $('btn-stats').onclick = openStats;
    $('btn-print').onclick = openPrint;
    $('btn-logout').onclick = function () {
      confirmBox('Change the student name? Progress stays saved on this device.', function () {
        ST.name = ''; save(); initLogin();
      });
    };
    $('btn-back-home').onclick = goHome;
    $('btn-stats-back').onclick = goHome;
    $('btn-print-back').onclick = goHome;
    $('btn-home2').onclick = goHome;

    $('btn-quit').onclick = function () {
      confirmBox('Leave this session? This run will <b>not</b> be saved.', goHome);
    };
    $('btn-next').onclick = nextQ;

    qsAll('.lad-btn').forEach(function (b) {
      b.onclick = function () { hint(parseInt(b.getAttribute('data-l'), 10)); };
    });

    $('modal-yes').onclick = function () {
      $('modal').classList.add('hidden');
      if (modalYes) { var f = modalYes; modalYes = null; f(); }
    };
    $('modal-no').onclick = function () { $('modal').classList.remove('hidden'); modalYes = null; };

    $('btn-cert').onclick = function () {
      if (G7.printCertificate) G7.printCertificate(); else toast('Print module did not load.');
    };

    initLogin();

    /* coach preview mode (?coach=1) — lets Mr. Akram see the correct answers while testing */
    if (location.search.indexOf('coach') >= 0) {
      G7.peek = function () { return SES ? SES.qs[SES.i].a : -1; };
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }

  /* ═══════════════ public interface ═══════════════ */
  return {
    booted: true,
    on: on, emit: emit,
    registerTopic: registerTopic,
    topicCount: topicCount,
    allLessons: allLessons,
    lessonById: lessonById,
    lessonsCompleted: lessonsCompleted,
    bestStars: bestStars,
    badgeOf: badgeOf,
    state: ST,
    save: save,
    show: show,
    toast: toast,
    confirmBox: confirmBox,
    sfx: sfx,
    esc: esc
  };
})();
