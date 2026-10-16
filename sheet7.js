/* ============================================================
   AID Mathematics Academy · Grade 7
   sheet7.js — إرسال النتائج لجوجل شيت (تب Grade7)
   يبعت JSON بنفس فورمات Grade 8 بالظبط:
   { g7:1, ts, name, coach, mode, item, score, total, pct, hints, secs, wrong }
   ال router في Apps Script (doPost) بيشوف d.g7 → doPostG7(d)
   ملف مستقل تماماً: لو حذفته المنصة تشتغل عادي من غير إرسال.
   ============================================================ */
(function () {
  'use strict';

  // ⚠️ لازم يطابق رابط الـ Web App بتاع مشروع Score1 بالظبط
  // (Deploy ← Manage deployments ← الرابط اللي هناك)
  var SHEET_URL =
    'https://script.google.com/macros/s/AKfycbzCxaazPm07ytgMgYht-oDnMjzlYALSyiMQgY1mURBR6ccCLGGwIXgXRPGHKgs-iK0N/exec';

  // محاولة الإرسال — ما تكسرش المنصة أبداً لو الشيت مش متاح
  function send(rec) {
    try {
      if (!rec || !rec.item) return;

      // نفس أسماء الحقول اللي doPostG7 في Apps Script بيستقبلها
      var payload = {
        g7: 1,                                   // الراوتر: يوجه لتب Grade7
        ts: new Date().toISOString(),            // Timestamp
        name: rec.student || '',                 // Student
        coach: rec.coach || 'أكرم',              // Coach
        mode: rec.mode || 'Lesson',              // Mode
        item: rec.item,                          // Item
        score: rec.score,                        // Score
        total: rec.total,                        // Total
        pct: rec.percent,                        // Percent
        hints: rec.hints || 0,                   // Hints
        secs: rec.seconds || 0,                  // Seconds
        wrong: rec.mistakes || 0                 // Mistakes
      };

      // text/plain + no-cors = مفيش preflight — نفس حيلة Grade 8
      fetch(SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      })
        .then(function () { G7.toast('📤 Score sent to Mr. Akram'); })
        .catch(function () { G7.toast('📝 Saved locally — will send once you are back online'); });
    } catch (e) { /* سكوت — ممنوع نعطّل الكويز */ }
  }

  // ننتظر المحرك يجهز ثم نوصّل الدالة
  function hook() {
    if (!window.G7 || !G7.on) { setTimeout(hook, 120); return; }
    G7.on('sendResult', function (rec) { send(rec); });
  }
  hook();
})();
