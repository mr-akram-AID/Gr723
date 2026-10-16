/* ============================================================
   AID Mathematics Academy · Grade 7 — print7.js
   الطباعة العالمية:
   · دليل مراجعة ملون (صفحتين) زي كتاب الشغل بالظبط
   · ورقة تدريب 20 سؤال بمكان للحل + ورقة فقاعات + مفتاح إجابات
   · شهادة إنجاز
   ملف مستقل: لو حذفته المنصة تشتغل من غير طباعة.
   ============================================================ */
(function () {
  'use strict';

  function $(id) { return document.getElementById(id); }
  function shuffle(arr) {
    var a = arr.slice(), i, j, t;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function today() {
    var d = new Date();
    return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
  }

  function doPrint(html) {
    var area = $('print-area');
    area.innerHTML = html;
    setTimeout(function () { try { window.print(); } catch (e) {} }, 200);
  }

  function head(meta) {
    return '<div class="ws-head">' +
      '<div class="ws-brand">AID MATHEMATICS ACADEMY<small>Grade 7 · Savvas enVision · Mr. Akram</small></div>' +
      '<div class="ws-meta">' + (meta || 'Name: ____________<br>Class: ________ Date: ________') + '</div>' +
    '</div>';
  }

  /* توليد 20 سؤال زي المحرك بالظبط (نسخة محلية مستقلة) */
  function genSheet(lesson, level) {
    var out = [], seen = {}, guard = 0;
    while (out.length < 20 && guard < 600) {
      guard++;
      var q = null;
      try { q = lesson.gen[level](); } catch (e) { q = null; }
      if (!q || !q.q || !q.ok) continue;
      if (seen[q.q]) continue;
      seen[q.q] = 1;
      var okTxt = String(q.ok);
      var texts = [okTxt];
      (q.wrong || []).forEach(function (w) { texts.push(w.t); });
      var arr = shuffle(texts);
      out.push({
        q: q.q, choices: arr, a: arr.indexOf(okTxt),
        steps: q.steps || [], ok: okTxt
      });
    }
    return out;
  }

  /* ═══════════════ 1) دليل المراجعة (صفحتين) ═══════════════ */
  function printStudyGuide(lessonId) {
    var L = G7.lessonById(lessonId);
    if (!L || !L.guide) { G7.toast('الدرس ده مالوش دليل لسه 😅'); return; }
    var g = L.guide;

    var rules = '';
    (g.rules || []).forEach(function (r) {
      rules += '<div class="sg-rule"><h4>' + r.h + '</h4><p>' + r.b + '</p></div>';
    });

    var steps = '';
    (g.steps || []).forEach(function (s, i) {
      steps += '<div class="sg-step"><span class="n">' + (i + 1) + '</span><p>' + s + '</p></div>';
    });

    var exs = '';
    (g.ex || []).forEach(function (x) {
      var li = '';
      (x.s || []).forEach(function (st) { li += '<li>' + st + '</li>'; });
      exs += '<div class="sg-ex"><h4>EXAMPLE · ' + x.t + '</h4><ol>' + li + '</ol></div>';
    });

    var tries = '';
    (g.try || []).forEach(function (t, i) { tries += '<div class="tryi">(' + String.fromCharCode(97 + i) + ') ' + t + '</div>'; });
    var ans = (g.tryAns || []).join(' · ');

    var html =
      '<div class="pg-sheet">' +
        head('Name: ____________<br>Class: ________ Date: ________') +
        '<div class="ws-title">📖 STUDY GUIDE · Lesson ' + L.code + '</div>' +
        '<div class="ws-sub">' + L.title + ' — ' + L.sub + '</div>' +
        '<div class="sg-key"><b>KEY IDEA</b> — ' + g.key + '</div>' +
        (rules ? '<div class="sg-rules">' + rules + '</div>' : '') +
        (steps ? '<div class="sg-steps">' + steps + '</div>' : '') +
      '</div>' +
      '<div class="pg-sheet">' +
        head('') +
        '<div class="ws-title">Worked Examples · ' + L.code + '</div>' +
        exs +
        '<div class="sg-try"><h4>TRY IT YOURSELF ✏️</h4>' + tries +
        (ans ? '<div class="sg-ans">Check yourself: ' + ans + '</div>' : '') +
        '</div>' +
      '</div>';
    doPrint(html);
  }

  /* ═══════════════ 2) ورقة التدريب + فقاعات + مفتاح ═══════════════ */
  function printWorksheet(lessonId, level) {
    var L = G7.lessonById(lessonId);
    if (!L) return;
    var qs = genSheet(L, level);
    if (!qs.length) { G7.toast('مفيش أسئلة متاحة 😅'); return; }

    var letters = ['A', 'B', 'C', 'D', 'E', 'F'];

    /* صفحات الأسئلة — 10 أسئلة في الصفحة */
    var qPages = '';
    for (var p = 0; p < Math.ceil(qs.length / 10); p++) {
      var grid = '';
      for (var i = p * 10; i < Math.min((p + 1) * 10, qs.length); i++) {
        var q = qs[i];
        grid += '<div class="ws-q">' +
          '<div class="wq"><span class="qn">' + (i + 1) + '</span>' + q.q + '</div>' +
          '<div class="ws-ws"></div>' +
          '<div class="ws-ans"><span>Answer:</span><i>' + letters[q.a] + '</i></div>' +
        '</div>';
      }
      qPages += '<div class="pg-sheet">' +
        head(p === 0 ? 'Name: ____________<br>Class: ________ Date: ________' : '') +
        (p === 0
          ? '<div class="ws-title">📝 PRACTICE WORKSHEET · ' + L.code + ' ' + L.title + '</div>' +
            '<div class="ws-sub">' + L.sub + ' — Level: ' + (level === 'easy' ? 'Basic' : 'Practice') + ' · 20 Questions</div>'
          : '') +
        '<div class="ws-qgrid">' + grid + '</div>' +
      '</div>';
    }

    /* ورقة الفقاعات */
    var bub = '';
    for (var b = 0; b < qs.length; b++) {
      var row = '<span class="bub-n">' + (b + 1) + '</span>';
      for (var c = 0; c < qs[b].choices.length; c++) {
        row += '<span class="bub">' + letters[c] + '</span>';
      }
      bub += '<div class="bub-row">' + row + '</div>';
    }
    var bubSheet = '<div class="pg-sheet">' +
      head('Name: ____________<br>') +
      '<div class="bub-head">🫧 BUBBLE SHEET — ' + L.code + ' ( shade the letter of your answer )</div>' +
      '<div class="bub-grid">' + bub + '</div>' +
    '</div>';

    /* مفتاح الإجابات */
    var key = '';
    qs.forEach(function (q, i) {
      key += '<div class="key-cell"><b>' + (i + 1) + '.</b> ' + letters[q.a] + ' — ' + q.ok + '</div>';
    });
    var keySheet = '<div class="pg-sheet">' +
      head('') +
      '<div class="bub-head">🔑 ANSWER KEY — ' + L.code + ' ' + L.title + '</div>' +
      '<div class="key-grid">' + key + '</div>' +
    '</div>';

    doPrint(qPages + bubSheet + keySheet);
  }

  /* ═══════════════ 3) الشهادة ═══════════════ */
  function printCertificate() {
    var st = G7.state;
    var all = G7.allLessons(), done = 0, stars = 0;
    all.forEach(function (L) {
      if (G7.bestStars(L.id) > 0) done++;
      stars += G7.bestStars(L.id);
    });
    if (done < all.length || all.length < 13) {
      G7.toast('الشهادة بتتفتح بعد إكمال كل الدروس — باقي ' + (all.length - done) + ' 💪');
      return;
    }
    var st2 = '';
    for (var i = 0; i < Math.min(10, Math.round(stars / 3)); i++) st2 += '⭐';

    var html = '<div class="pg-sheet"><div class="cert">' +
      '<div class="c-brand">🧮 AID MATHEMATICS ACADEMY</div>' +
      '<div class="c-t">CERTIFICATE OF ACHIEVEMENT</div>' +
      '<div class="c-line">This certificate is proudly presented to</div>' +
      '<div class="c-name">' + st.name + '</div>' +
      '<div class="c-line">for outstanding dedication and mastery of<br><b>Grade 7 Mathematics · Topics 1, 4 & 5</b><br>(Operations with Rational Numbers · Equivalent Expressions · Equations & Inequalities)</div>' +
      '<div class="c-stars">' + st2 + '</div>' +
      '<div class="c-line">Completed ' + done + ' lessons · Final Exam Passed · Coins earned: 🪙 ' + st.coins + '</div>' +
      '<div class="c-foot">' +
        '<div class="c-sig"><div class="sigline"><b>Mr. Akram</b><br>Math Coach</div></div>' +
        '<div class="c-sig"><div class="sigline"><b>' + today() + '</b><br>Date</div></div>' +
      '</div>' +
    '</div></div>';
    doPrint(html);
  }

  /* التسجيل على المحرك */
  function hook() {
    if (!window.G7 || !G7.on) { setTimeout(hook, 120); return; }
    G7.printStudyGuide = printStudyGuide;
    G7.printWorksheet = printWorksheet;
    G7.printCertificate = printCertificate;
  }
  hook();
})();
