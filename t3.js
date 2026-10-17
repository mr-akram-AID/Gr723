/* ============================================================
   AID Mathematics Academy · Grade 7 — t3.js
   Topic 3 · Analyze & Solve Percent Problems
   Lessons 3-1 to 3-6 (matches the uploaded workbook)
   ============================================================ */
(function () {
  'use strict';

  function hook() {
    if (!window.G7 || !G7.registerTopic) { setTimeout(hook, 100); return; }
    G7.registerTopic(T3);
  }

  /* ─── helpers ─── */
  function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a || 1; }
  function fstr(n, d) {
    var s = n < 0 ? '−' : '';
    n = Math.abs(n); d = Math.abs(d);
    var g = gcd(n, d); n /= g; d /= g;
    if (d === 1) return s + n;
    if (n > d) return s + Math.floor(n / d) + ' ' + (n % d) + '/' + d;
    return s + n + '/' + d;
  }
  function money(n) { return 'EGP ' + n; }

  function fill3(ok, ws, fallback) {
    var seen = {}, out = [], i, tries = 0;
    seen[String(ok)] = 1;
    for (i = 0; i < ws.length && out.length < 3; i++) {
      var t = String(ws[i].t);
      if (!seen[t]) { seen[t] = 1; out.push(ws[i]); }
    }
    while (out.length < 3 && tries < 40) {
      tries++;
      var f = fallback();
      if (f && !seen[String(f.t)]) { seen[String(f.t)] = 1; out.push(f); }
    }
    var bump = 2;
    while (out.length < 3 && bump < 12) {
      var alt = String(ok).replace(/[0-9]+/g, function (n) { return String(parseInt(n, 10) + bump); });
      if (!seen[alt]) { seen[alt] = 1; out.push({ t: alt, d: 'Read the choices again and apply the steps in order.' }); }
      bump++;
    }
    return out;
  }

  var T3 = {
    id: 't3', num: 3, icon: '💰', color: '#16a34a',
    title: 'Analyze & Solve Percent Problems',
    sub: 'Percents, proportions, change, markup, markdown and interest',
    lessons: []
  };

  /* ═══════════ 3-1 Analyze Percents of Numbers ═══════════ */
  T3.lessons.push({
    id: 't3l1', code: '3-1', title: 'Analyze Percents of Numbers',
    sub: 'Benchmarks · Mental math moves · Percent of a whole',
    calc: true,
    hintA: '🧭 Percent means "out of 100". Finding a percent of a number is a multiplication: part = percent × whole.',
    hintB: '👣 Write the percent as a decimal first (move the point two places left), then multiply — or use the 10% / 25% / 50% benchmarks.',
    guide: {
      key: 'A percent always means "out of 100". Finding a percent of a number is a multiplication: part = percent × whole. Benchmarks like 50%, 25% and 10% turn hard problems into mental math — and into fast checks.',
      rules: [
        { h: 'PERCENT = OUT OF 100', b: '45% = 45/100 = 0.45 · 7% = 0.07' },
        { h: 'BENCHMARKS', b: '50% = half · 25% = quarter · 10% = ÷ 10 · 5% = half of 10%' },
        { h: 'THE MULTIPLY MOVE', b: 'part = percent × whole: 30% of 80 = 0.3 × 80 = 24' },
        { h: 'MORE THAN 100%', b: 'The part beats the whole: 150% of 40 = 60 (40 + half of 40)' }
      ],
      steps: ['Write the percent as a decimal (move the point two places left)', 'Multiply by the whole — or use benchmarks (10%, 25%, 50%)', 'Sanity-check: compare your answer with a nearby benchmark'],
      ex: [
        { t: 'Find 30% of 80.', s: ['30% = 0.30', '0.30 × 80 = 24', 'Check with 10%: 10% of 80 = 8 → 3 × 8 = 24'] },
        { t: 'Find 15% of 60.', s: ['10% of 60 = 6', '5% = half of 10% = 3', '6 + 3 = 9'] },
        { t: 'Find 125% of 40.', s: ['125% = 1.25', '1.25 × 40 = 50', 'Check: 100% = 40 and 25% = 10 → 40 + 10 = 50'] }
      ],
      try: ['Find 40% of 90.', 'Find 65% of 200.', 'Find 150% of 24.'],
      tryAns: ['36', '130', '36']
    },
    gen: {
      easy: function () {
        /* Find p% of W — clean integers only */
        var p, W, part, guard = 0;
        do {
          p = pick([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 75, 80, 90]);
          W = ri(2, 60);
          guard++;
        } while ((p * W) % 100 !== 0 && guard < 200);
        if ((p * W) % 100 !== 0) { p = 50; W = 2 * Math.ceil(W / 2); }
        part = (p * W) / 100;
        var ok = String(part);
        var dec = p >= 10 ? '0.' + p : '0.0' + p;
        return {
          q: 'Find ' + p + '% of ' + W + '.',
          ok: ok,
          wrong: fill3(ok, [
            { t: String((p * W) / 10), d: p + '% = ' + dec + ', not ' + (p / 10) + '. Move the decimal point TWO places left: ' + dec + ' × ' + W + ' = ' + part + '.' },
            { t: String(W - part), d: 'That subtracts the part from the whole. The part itself is ' + dec + ' × ' + W + ' = ' + part + '.' },
            { t: String(part + p), d: 'Check with a benchmark: 10% of ' + W + ' = ' + (W / 10) + ' → use it to test your answer.' }
          ], function () { return { t: String(part + ri(3, 15)), d: dec + ' × ' + W + ' = ' + part + '.' }; }),
          steps: [p + '% = ' + dec, dec + ' × ' + W + ' = ' + part, 'Check: 10% of ' + W + ' = ' + (W / 10) + ' — does your answer fit?']
        };
      },
      medium: function () {
        var r = Math.random();
        if (r < 0.28) {
          /* more than 100% */
          var p1 = pick([105, 110, 125, 140, 150, 160, 175, 200]), W1 = ri(2, 48);
          if ((p1 * W1) % 100 !== 0) { W1 = 4 * Math.ceil(W1 / 4); }
          if ((p1 * W1) % 100 !== 0) { W1 = 20; }
          var part1 = (p1 * W1) / 100;
          var ok1 = String(part1);
          return {
            q: 'Find ' + p1 + '% of ' + W1 + '.',
            ok: ok1,
            wrong: fill3(ok1, [
              { t: String(part1 / 10), d: p1 + '% = ' + (p1 / 100) + '. Multiply: ' + (p1 / 100) + ' × ' + W1 + ' = ' + part1 + '.' },
              { t: String(part1 - W1), d: 'You removed the whole. The part GREW past the whole: ' + part1 + '.' },
              { t: String(W1), d: W1 + ' is 100% of itself — ' + p1 + '% is MORE than 100%.' }
            ], function () { return { t: String(part1 + ri(3, 12)), d: (p1 / 100) + ' × ' + W1 + ' = ' + part1 + '.' }; }),
            steps: [p1 + '% = ' + (p1 / 100) + ' (more than 1 whole)', (p1 / 100) + ' × ' + W1 + ' = ' + part1, 'Check: 100% = ' + W1 + ' and the extra ' + (p1 - 100) + '% = ' + ((p1 - 100) * W1 / 100)]
          };
        }
        if (r < 0.55) {
          /* word problem: class survey */
          var W2 = pick([20, 25, 40, 50, 60, 80, 200]);
          var p2 = pick([10, 20, 25, 40, 50, 60, 55, 75]);
          while ((p2 * W2) % 100 !== 0) { p2 = pick([10, 20, 25, 40, 50]); }
          var part2 = (p2 * W2) / 100;
          var ok2 = part2 + ' girls';
          return {
            q: 'In a class of ' + W2 + ' students, ' + p2 + '% are girls. How many girls are there?',
            ok: ok2,
            wrong: fill3(ok2, [
              { t: (W2 - part2) + ' girls', d: 'That is the BOYS count (the remaining ' + (100 - p2) + '%). Girls: ' + (p2 / 100) + ' × ' + W2 + '.' },
              { t: part2 / 10 + ' girls', d: 'Check the decimal: ' + p2 + '% = ' + (p2 / 100) + ' → × ' + W2 + ' = ' + part2 + '.' },
              { t: (part2 + W2) + ' girls', d: 'The part can never exceed the whole here — ' + p2 + '% of ' + W2 + ' = ' + part2 + '.' }
            ], function () { return { t: (part2 + ri(3, 10)) + ' girls', d: (p2 / 100) + ' × ' + W2 + ' = ' + part2 + '.' }; }),
            steps: ['Part = percent × whole', (p2 / 100) + ' × ' + W2 + ' = ' + part2, 'Answer: ' + part2 + ' girls']
          };
        }
        if (r < 0.75) {
          /* find the mistake: decimal placement */
          var p3 = pick([4, 6, 7, 8, 9]);
          var W3 = pick([100, 200, 300, 400, 500]);
          var real = (p3 * W3) / 100;
          var his = real * 10;
          var ok3 = real + ' — ' + p3 + '% = 0.0' + p3 + ', not 0.' + p3;
          return {
            q: 'FIND THE MISTAKE — Hassan wrote: ' + p3 + '% = 0.' + p3 + ', so ' + p3 + '% of ' + W3 + ' = ' + his + '. What is the correct answer?',
            ok: ok3,
            wrong: fill3(ok3, [
              { t: his + ' — Hassan is right', d: '0.' + p3 + ' is ' + (p3 * 10) + '%! ' + p3 + '% = 0.0' + p3 + ' (two places left).' },
              { t: real / 10 + ' — the point moves three places', d: 'Percent means hundredths: ' + p3 + '% = ' + p3 + '/100 = 0.0' + p3 + '.' },
              { t: (real + 1) + ' — round up', d: 'Exactly: 0.0' + p3 + ' × ' + W3 + ' = ' + real + '.' }
            ], function () { return { t: (real + ri(2, 9)) + ' — recheck', d: '0.0' + p3 + ' × ' + W3 + ' = ' + real + '.' }; }),
            steps: [p3 + '% = ' + p3 + '/100 = 0.0' + p3, '0.0' + p3 + ' × ' + W3 + ' = ' + real, 'Hassan moved the point only ONE place — it moves TWO']
          };
        }
        /* complementary percents */
        var W4 = pick([200, 300, 400, 500, 600, 800]);
        var a4 = pick([26, 38, 42, 46, 34, 22, 55]), b4 = pick([18, 24, 30, 12, 20, 15]);
        var rest = 100 - a4 - b4;
        while (rest < 5 || rest > 40) { a4 = pick([26, 38, 42, 46]); b4 = pick([18, 24, 30]); rest = 100 - a4 - b4; }
        var part4 = (rest * W4) / 100;
        var ok4 = part4 + ' people';
        return {
          q: 'In a survey of ' + W4 + ' people, ' + a4 + '% chose tea and ' + b4 + '% chose coffee. The rest chose juice. How many chose juice?',
          ok: ok4,
          wrong: fill3(ok4, [
            { t: ((a4 + b4) * W4 / 100) + ' people', d: 'That is tea + coffee. The rest = 100% − ' + a4 + '% − ' + b4 + '% = ' + rest + '%.' },
            { t: (100 - rest) + ' people', d: 'That is a percent, not a count. ' + rest + '% of ' + W4 + ' = ' + part4 + '.' },
            { t: (a4 * W4 / 100) + ' people', d: 'That is only the tea drinkers — find the REMAINING percent first: ' + rest + '%.' }
          ], function () { return { t: (part4 + ri(4, 20)) + ' people', d: 'Rest = ' + rest + '% → ' + rest + '% of ' + W4 + '.' }; }),
          steps: ['Rest of the people: 100% − ' + a4 + '% − ' + b4 + '% = ' + rest + '%', rest + '% of ' + W4 + ' = ' + (rest / 100) + ' × ' + W4, 'Answer: ' + part4 + ' people']
        };
      }
    }
  });

  /* ═══════════ 3-2 Connect Percent and Proportion ═══════════ */
  T3.lessons.push({
    id: 't3l2', code: '3-2', title: 'Connect Percent and Proportion',
    sub: 'part/whole = n/100 · Cross products · Three question types',
    calc: true,
    hintA: '🧭 Every percent statement hides a proportion: part/whole = n/100 — the percent always sits over 100.',
    hintB: '👣 Label first: the number after "is" is the part, the number after "of" is the whole. Then cross multiply.',
    guide: {
      key: 'Every percent statement hides a proportion: part over whole equals percent over 100. Cross products then solve all three question types — find the part, find the percent, or find the whole.',
      rules: [
        { h: 'THE PROPORTION', b: 'part/whole = n/100 — the percent always sits over 100: 12 out of 48 → 12/48 = n/100' },
        { h: 'CROSS PRODUCTS', b: 'part × 100 = whole × n: 12 × 100 = 48 × n → n = 25' },
        { h: 'IS / OF MAP', b: 'The number after "is" is the part; the number after "of" is the whole: 8 is 20% of 40' },
        { h: 'THREE QUESTIONS', b: 'Same proportion, different unknown: the part, the percent, or the whole' }
      ],
      steps: ['Label: the part (the "is" number), the whole (the "of" number) and the percent n', 'Write the proportion part/whole = n/100 with the unknown in its place', 'Cross multiply and solve — label the answer with % or units'],
      ex: [
        { t: 'What is 30% of 40?', s: ['Proportion: part/40 = 30/100', 'Cross multiply: part × 100 = 40 × 30 = 1,200', 'part = 1,200 ÷ 100 = 12'] },
        { t: '12 is what percent of 48?', s: ['Proportion: 12/48 = n/100', '12 × 100 = 48 × n → 1,200 = 48n', 'n = 1,200 ÷ 48 = 25 → 25%'] },
        { t: '15 is 60% of what number?', s: ['Proportion: 15/w = 60/100', '15 × 100 = 60 × w → 1,500 = 60w', 'w = 1,500 ÷ 60 = 25. Check: 60% of 25 = 15'] }
      ],
      try: ['What is 45% of 60?', '18 is what percent of 72?', '21 is 35% of what number?'],
      tryAns: ['27', '25%', '60']
    },
    gen: {
      easy: function () {
        var r = Math.random();
        if (r < 0.34) {
          /* find the part */
          var W = pick([20, 25, 40, 50, 60, 80, 100, 120, 150, 200]);
          var p = pick([10, 20, 25, 30, 40, 50, 60, 75]);
          while ((p * W) % 100 !== 0) { p = pick([10, 20, 25, 50]); }
          var part = (p * W) / 100;
          var ok = String(part);
          return {
            q: 'What is ' + p + '% of ' + W + '?  (Use a proportion: part/' + W + ' = ' + p + '/100)',
            ok: ok,
            wrong: fill3(ok, [
              { t: String(W - part), d: 'That is the remaining ' + (100 - p) + '%. Cross multiply: part × 100 = ' + W + ' × ' + p + '.' },
              { t: String((p * W) / 10), d: 'Check the cross products: ' + W + ' × ' + p + ' = ' + (W * p) + ', then ÷ 100 = ' + part + '.' },
              { t: String(part + 10), d: 'Cross multiply: ' + W + ' × ' + p + ' = ' + (W * p) + ' → ÷ 100 = ' + part + '.' }
            ], function () { return { t: String(part + ri(3, 12)), d: 'part = ' + W + ' × ' + p + ' ÷ 100 = ' + part + '.' }; }),
            steps: ['Proportion: part/' + W + ' = ' + p + '/100', 'Cross multiply: part × 100 = ' + W + ' × ' + p + ' = ' + (W * p), 'part = ' + (W * p) + ' ÷ 100 = ' + part]
          };
        }
        if (r < 0.67) {
          /* find the percent */
          var W2 = pick([20, 25, 40, 50, 60, 80, 90, 100, 120, 150, 200, 48]);
          var p2 = pick([10, 20, 25, 30, 40, 50, 60, 70, 75, 80]);
          while ((p2 * W2) % 100 !== 0) { p2 = pick([10, 20, 25, 50]); }
          var part2 = (p2 * W2) / 100;
          var ok2 = p2 + '%';
          return {
            q: part2 + ' is what percent of ' + W2 + '?',
            ok: ok2,
            wrong: fill3(ok2, [
              { t: (100 - p2) + '%', d: 'Cross multiply: ' + part2 + ' × 100 = ' + (part2 * 100) + ' and ' + W2 + ' × n → n = ' + p2 + '.' },
              { t: (p2 + 10) + '%', d: part2 + '/' + W2 + ' = n/100 → n = ' + part2 + ' × 100 ÷ ' + W2 + ' = ' + p2 + '.' },
              { t: Math.round(part2 * 100 / (W2 - part2)) + '%', d: 'That compares to the remaining part. Use the WHOLE: n = ' + part2 + ' × 100 ÷ ' + W2 + ' = ' + p2 + '.' }
            ], function () { return { t: (p2 + ri(5, 15)) + '%', d: part2 + ' × 100 ÷ ' + W2 + ' = ' + p2 + '.' }; }),
            steps: ['Proportion: ' + part2 + '/' + W2 + ' = n/100', 'Cross multiply: ' + part2 + ' × 100 = ' + W2 + ' × n', 'n = ' + (part2 * 100) + ' ÷ ' + W2 + ' = ' + p2 + ' → ' + p2 + '%']
          };
        }
        /* find the whole */
        var p3 = pick([10, 20, 25, 40, 50, 60, 75, 5]);
        var W3 = pick([20, 25, 40, 50, 60, 80, 100, 120, 200]);
        while ((p3 * W3) % 100 !== 0) { p3 = pick([10, 20, 25, 50]); }
        var part3 = (p3 * W3) / 100;
        var ok3 = String(W3);
        return {
          q: part3 + ' is ' + p3 + '% of what number?',
          ok: ok3,
          wrong: fill3(ok3, [
            { t: String(part3 * 100 / p3 / 10), d: 'Cross multiply: ' + part3 + ' × 100 = ' + (part3 * 100) + ' = ' + p3 + ' × whole → whole = ' + W3 + '.' },
            { t: String(part3 + p3), d: 'Solve ' + p3 + ' × whole = ' + (part3 * 100) + ' → whole = ' + (part3 * 100) + ' ÷ ' + p3 + '.' },
            { t: String(part3 * p3), d: 'Proportion: ' + part3 + '/w = ' + p3 + '/100 → w = ' + (part3 * 100) + ' ÷ ' + p3 + '.' }
          ], function () { return { t: String(W3 + ri(5, 20)), d: 'Check: ' + p3 + '% of ' + W3 + ' = ' + part3 + '.' }; }),
          steps: ['Proportion: ' + part3 + '/w = ' + p3 + '/100', 'Cross multiply: ' + part3 + ' × 100 = ' + p3 + ' × w', 'w = ' + (part3 * 100) + ' ÷ ' + p3 + ' = ' + W3]
        };
      },
      medium: function () {
        var r = Math.random();
        if (r < 0.3) {
          /* word: percent from counts */
          var W = pick([40, 45, 48, 50, 60, 72, 80, 90, 120, 150]);
          var p = pick([40, 50, 60, 70, 75, 80, 25, 20]);
          while ((p * W) % 100 !== 0) { p = pick([40, 50, 60, 75, 80]); }
          var won = (p * W) / 100;
          var ok = p + '%';
          return {
            q: 'A team won ' + won + ' of its ' + W + ' games. What percent of the games did it win?',
            ok: ok,
            wrong: fill3(ok, [
              { t: (100 - p) + '%', d: 'That is the losing percent. won/total = n/100 → ' + won + ' × 100 ÷ ' + W + '.' },
              { t: (p + 10) + '%', d: won + '/' + W + ' = n/100 → n = ' + won + ' × 100 ÷ ' + W + ' = ' + p + '.' },
              { t: (p - 10) + '%', d: 'Cross multiply: ' + W + ' × n = ' + won + ' × 100 = ' + (won * 100) + ' → n = ' + p + '.' }
            ], function () { return { t: (p + ri(5, 15)) + '%', d: 'n = ' + won + ' × 100 ÷ ' + W + ' = ' + p + '.' }; }),
            steps: ['Proportion: ' + won + '/' + W + ' = n/100', 'Cross multiply: ' + W + ' × n = ' + won + ' × 100', 'n = ' + (won * 100) + ' ÷ ' + W + ' = ' + p + ' → ' + p + '%']
          };
        }
        if (r < 0.55) {
          /* word: part from percent */
          var Q = pick([40, 48, 50, 60, 80, 100, 120, 200]);
          var p2 = pick([25, 50, 60, 70, 75, 80, 85, 90]);
          while ((p2 * Q) % 100 !== 0) { p2 = pick([25, 50, 75]); }
          var right = (p2 * Q) / 100;
          var ok2 = right + ' questions';
          return {
            q: 'A test has ' + Q + ' questions. A student answered ' + p2 + '% of them correctly. How many questions did she answer correctly?',
            ok: ok2,
            wrong: fill3(ok2, [
              { t: (Q - right) + ' questions', d: 'That is the wrong count (' + (100 - p2) + '%). Right: ' + p2 + '% of ' + Q + '.' },
              { t: (right / 10) + ' questions', d: p2 + '% = ' + (p2 / 100) + ' → ' + (p2 / 100) + ' × ' + Q + ' = ' + right + '.' },
              { t: (right + 5) + ' questions', d: 'Proportion: part/' + Q + ' = ' + p2 + '/100 → part = ' + right + '.' }
            ], function () { return { t: (right + ri(3, 10)) + ' questions', d: (p2 / 100) + ' × ' + Q + ' = ' + right + '.' }; }),
            steps: ['Proportion: part/' + Q + ' = ' + p2 + '/100', 'part = ' + Q + ' × ' + p2 + ' ÷ 100', 'part = ' + right + ' questions']
          };
        }
        if (r < 0.8) {
          /* find-the-mistake: proportion set up backwards */
          var part3 = pick([8, 9, 12, 10, 6]);
          var W3 = part3 * pick([2, 4, 5, 10]); /* part/W clean percent */
          var realPct = (part3 * 100) / W3;
          var ok3 = realPct + '% — write ' + part3 + '/' + W3 + ' = n/100';
          return {
            q: 'FIND THE MISTAKE — For "' + part3 + ' is what percent of ' + W3 + '?", Ali wrote ' + part3 + '/100 = n/' + W3 + ' and got a strange answer. What is the correct percent?',
            ok: ok3,
            wrong: fill3(ok3, [
              { t: Math.round(part3 * 100 / W3) / 10 + '% — Ali was right', d: 'The percent goes OVER 100: ' + part3 + '/' + W3 + ' = n/100.' },
              { t: (100 / W3) + '%', d: 'n = ' + part3 + ' × 100 ÷ ' + W3 + ' = ' + realPct + '.' },
              { t: (realPct + 10) + '%', d: part3 + ' × 100 = ' + (part3 * 100) + ' and ' + W3 + ' × n — divide: ' + realPct + '.' }
            ], function () { return { t: (realPct + ri(5, 15)) + '%', d: part3 + '/' + W3 + ' = n/100 → n = ' + realPct + '.' }; }),
            steps: ['The part goes on top, the whole on the bottom: ' + part3 + '/' + W3 + ' = n/100, ' + part3 + '/100 = n/' + W3, 'Cross multiply: ' + part3 + ' × 100 = ' + W3 + ' × n', 'n = ' + (part3 * 100) + ' ÷ ' + W3 + ' = ' + realPct + ' → ' + realPct + '%']
          };
        }
        /* girls/boys percent of class */
        var g = pick([12, 16, 18, 20, 24, 30]);
        var b = g + pick([2, 4, 6, 8, 10]);
        var tot = g + b;
        while ((g * 100) % tot !== 0 || (b * 100) % tot !== 0) { g = pick([12, 15, 20, 25]); b = g + pick([3, 5, 10, 15]); tot = g + b; }
        var gp = (g * 100) / tot, bp = (b * 100) / tot;
        var ok4 = gp + '% girls · ' + bp + '% boys';
        return {
          q: 'A class has ' + g + ' girls and ' + b + ' boys. What percent of the class is girls, and what percent is boys?',
          ok: ok4,
          wrong: fill3(ok4, [
            { t: bp + '% girls · ' + gp + '% boys', d: 'You swapped them: girls are ' + g + ' of ' + tot + ' → ' + g + ' × 100 ÷ ' + tot + ' = ' + gp + '%.' },
            { t: (gp + 10) + '% girls · ' + (bp - 10) + '% boys', d: 'Girls: ' + g + '/' + tot + ' = n/100 → n = ' + gp + '. Boys: ' + b + '/' + tot + ' → ' + bp + '.' },
            { t: g + '% girls · ' + b + '% boys', d: 'Those are counts, not percents. Divide by the total ' + tot + ' and × 100.' }
          ], function () { return { t: (gp + 5) + '% girls · ' + (bp - 5) + '% boys', d: 'Girls ' + g + ' ÷ ' + tot + ' × 100 = ' + gp + '%.' }; }),
          steps: ['Total: ' + g + ' + ' + b + ' = ' + tot + ' students', 'Girls: ' + g + '/' + tot + ' = n/100 → n = ' + gp + '%', 'Boys: ' + b + '/' + tot + ' = n/100 → n = ' + bp + '%']
        };
      }
    }
  });

  /* ═══════════ 3-3 Represent and Use the Percent Equation ═══════════ */
  T3.lessons.push({
    id: 't3l3', code: '3-3', title: 'Represent and Use the Percent Equation',
    sub: 'Part = Percent × Whole · Finding any missing value',
    calc: true,
    hintA: '🧭 The proportion collapses into one equation: A = r × W — A is the part, r the percent as a decimal, W the whole.',
    hintB: '👣 Decide which value is missing: A = r × W, or r = A ÷ W, or W = A ÷ r. If r is the unknown, × 100 at the end.',
    guide: {
      key: 'The proportion collapses into one powerful equation: Part = percent × whole, written A = r × W, with the percent as a decimal. Rearrange it to find whichever value is missing.',
      rules: [
        { h: 'THE EQUATION', b: 'A = r × W — A is the part, r the percent as a decimal, W the whole: 8% of 325 = 0.08 × 325 = 26' },
        { h: 'FIND THE PERCENT', b: 'r = A ÷ W, then × 100: 42 ÷ 56 = 0.75 → 75%' },
        { h: 'FIND THE WHOLE', b: 'W = A ÷ r: 27 ÷ 0.18 = 150' },
        { h: 'DECIMAL FIRST', b: '6% → 0.06 · 125% → 1.25 · 0.5% → 0.005 — convert before multiplying' }
      ],
      steps: ['Name A, r, W — decide which of the three is the unknown', 'Write the form you need: A = r × W, or r = A ÷ W, or W = A ÷ r', 'Compute — if r was the unknown, × 100 to name it as a percent'],
      ex: [
        { t: 'What is 24% of 150?', s: ['r = 24% = 0.24, W = 150', 'A = r × W = 0.24 × 150', 'A = 36'] },
        { t: '42 is what percent of 56?', s: ['A = 42, W = 56', 'r = A ÷ W = 42 ÷ 56 = 0.75', 'r = 75%'] },
        { t: '27 is 18% of what number?', s: ['A = 27, r = 0.18', 'W = A ÷ r = 27 ÷ 0.18', 'W = 150. Check: 18% of 150 = 27'] }
      ],
      try: ['Find 8% of 325.', '51 is what percent of 60?', '36 is 45% of what number?'],
      tryAns: ['26', '85%', '80']
    },
    gen: {
      easy: function () {
        var r = Math.random();
        if (r < 0.34) {
          /* find A */
          var p = pick([10, 15, 20, 24, 25, 30, 40, 50, 60, 70, 75, 80]);
          var W = pick([40, 50, 60, 80, 100, 120, 150, 200, 240, 320]);
          while ((p * W) % 100 !== 0) { p = pick([10, 20, 25, 50]); }
          var A = (p * W) / 100;
          var ok = String(A);
          return {
            q: 'Use the percent equation A = r × W.  Find A: ' + p + '% of ' + W + '.',
            ok: ok,
            wrong: fill3(ok, [
              { t: String(A / 10), d: 'r = ' + (p / 100) + ' (two places left!). A = ' + (p / 100) + ' × ' + W + ' = ' + A + '.' },
              { t: String(W - A), d: 'That is the remaining part. A = ' + (p / 100) + ' × ' + W + ' = ' + A + '.' },
              { t: String(A + p), d: 'A = r × W = ' + (p / 100) + ' × ' + W + ' = ' + A + '.' }
            ], function () { return { t: String(A + ri(3, 15)), d: (p / 100) + ' × ' + W + ' = ' + A + '.' }; }),
            steps: ['r = ' + p + '% = ' + (p / 100) + ', W = ' + W, 'A = r × W = ' + (p / 100) + ' × ' + W, 'A = ' + A]
          };
        }
        if (r < 0.67) {
          /* find r */
          var W2 = pick([40, 50, 56, 60, 64, 80, 88, 100, 120, 150]);
          var p2 = pick([10, 15, 20, 25, 30, 35, 40, 50, 60, 70, 75, 85]);
          while ((p2 * W2) % 100 !== 0) { p2 = pick([10, 20, 25, 50]); }
          var A2 = (p2 * W2) / 100;
          var ok2 = p2 + '%';
          return {
            q: 'Use r = A ÷ W.  ' + A2 + ' is what percent of ' + W2 + '?',
            ok: ok2,
            wrong: fill3(ok2, [
              { t: (100 - p2) + '%', d: 'r = ' + A2 + ' ÷ ' + W2 + ' = ' + (p2 / 100) + ' → ' + p2 + '%.' },
              { t: (p2 + 10) + '%', d: 'r = ' + A2 + ' ÷ ' + W2 + ' = ' + (p2 / 100) + ' → × 100 = ' + p2 + '%.' },
              { t: (p2 - 5) + '%', d: 'Divide first: ' + A2 + ' ÷ ' + W2 + ' = ' + (p2 / 100) + ', then × 100.' }
            ], function () { return { t: (p2 + ri(5, 15)) + '%', d: A2 + ' ÷ ' + W2 + ' = ' + (p2 / 100) + '.' }; }),
            steps: ['A = ' + A2 + ', W = ' + W2, 'r = A ÷ W = ' + A2 + ' ÷ ' + W2 + ' = ' + (p2 / 100), '× 100 → r = ' + p2 + '%']
          };
        }
        /* find W */
        var p3 = pick([10, 15, 20, 25, 30, 40, 50, 60, 75]);
        var W3 = pick([40, 50, 60, 80, 100, 120, 150, 200]);
        while ((p3 * W3) % 100 !== 0) { p3 = pick([10, 20, 25, 50]); }
        var A3 = (p3 * W3) / 100;
        var ok3 = String(W3);
        return {
          q: 'Use W = A ÷ r.  ' + A3 + ' is ' + p3 + '% of what number?',
          ok: ok3,
          wrong: fill3(ok3, [
            { t: String(A3 * p3), d: 'W = A ÷ r = ' + A3 + ' ÷ ' + (p3 / 100) + ' = ' + W3 + '.' },
            { t: String(A3 + p3), d: 'Divide by the DECIMAL percent: ' + A3 + ' ÷ ' + (p3 / 100) + ' = ' + W3 + '.' },
            { t: String(A3 / (p3 * 10)), d: 'r = ' + (p3 / 100) + ' (two places left). W = ' + A3 + ' ÷ ' + (p3 / 100) + ' = ' + W3 + '.' }
          ], function () { return { t: String(W3 + ri(5, 20)), d: 'Check: ' + (p3 / 100) + ' × ' + W3 + ' = ' + A3 + '.' }; }),
          steps: ['A = ' + A3 + ', r = ' + (p3 / 100), 'W = A ÷ r = ' + A3 + ' ÷ ' + (p3 / 100) + ' = ' + W3]
        };
      },
      medium: function () {
        var r = Math.random();
        if (r < 0.25) {
          /* decimal percent */
          var p10 = pick([125, 375, 625, 875]) / 10; /* 12.5, 37.5 ... */
          var W = pick([64, 160, 240, 320, 400, 480]);
          var A = (p10 * 10 * W) / 1000;
          var ok = String(A);
          return {
            q: 'Use the equation A = r × W.  Find ' + p10 + '% of ' + W + '.',
            ok: ok,
            wrong: fill3(ok, [
              { t: String(A * 10), d: p10 + '% = ' + (p10 / 100) + ' — two places left, not one: ' + (p10 / 100) + ' × ' + W + ' = ' + A + '.' },
              { t: String(W - A), d: 'That subtracts the part. A = ' + (p10 / 100) + ' × ' + W + ' = ' + A + '.' },
              { t: String(A + 10), d: (p10 / 100) + ' × ' + W + ' = ' + A + '.' }
            ], function () { return { t: String(A + ri(5, 20)), d: (p10 / 100) + ' × ' + W + ' = ' + A + '.' }; }),
            steps: [p10 + '% = ' + (p10 / 100), 'A = ' + (p10 / 100) + ' × ' + W, 'A = ' + A]
          };
        }
        if (r < 0.5) {
          /* tiny percent */
          var p2 = pick([0.5, 1.5, 2.5]);
          var W2 = pick([200, 400, 600, 800, 1000]);
          var A2 = (p2 * 10 * W2) / 1000;
          var ok2 = String(A2);
          return {
            q: 'Find ' + p2 + '% of ' + W2 + '.  (Watch the decimal!)',
            ok: ok2,
            wrong: fill3(ok2, [
              { t: String(A2 * 10), d: p2 + '% = ' + (p2 / 100) + ' — move the point TWO places left. ' + (p2 / 100) + ' × ' + W2 + ' = ' + A2 + '.' },
              { t: String(A2 * 100), d: p2 + '% = ' + (p2 / 100) + ' → ' + (p2 / 100) + ' × ' + W2 + ' = ' + A2 + '.' },
              { t: String(A2 + 2), d: (p2 / 100) + ' × ' + W2 + ' = ' + A2 + ' exactly.' }
            ], function () { return { t: String(A2 + ri(2, 8)), d: (p2 / 100) + ' × ' + W2 + ' = ' + A2 + '.' }; }),
            steps: [p2 + '% = ' + p2 + '/100 = ' + (p2 / 100), 'A = ' + (p2 / 100) + ' × ' + W2, 'A = ' + A2]
          };
        }
        if (r < 0.75) {
          /* reverse percent: number increased by p% gives N */
          var p3 = pick([10, 20, 25, 50]);
          var mult = { 10: 10, 20: 5, 25: 4, 50: 2 }[p3];
          var x3 = mult * ri(2, 15);
          var N3 = x3 + (p3 * x3) / 100;
          var ok3 = String(x3);
          return {
            q: 'A number increased by ' + p3 + '% gives ' + N3 + '. Find the number.',
            ok: ok3,
            wrong: fill3(ok3, [
              { t: String(N3 - (p3 * N3) / 100), d: 'You removed ' + p3 + '% of the NEW number — the percent acts on the ORIGINAL: x × ' + (1 + p3 / 100) + ' = ' + N3 + '.' },
              { t: String(N3 - p3), d: 'The increase is a percent of x, not ' + p3 + ' units: x × ' + (1 + p3 / 100) + ' = ' + N3 + '.' },
              { t: String(N3), d: 'That is the number AFTER the increase — divide by ' + (1 + p3 / 100) + ' to go back.' }
            ], function () { return { t: String(x3 + ri(2, 10)), d: 'x = ' + N3 + ' ÷ ' + (1 + p3 / 100) + ' = ' + x3 + '.' }; }),
            steps: ['x × (1 + ' + p3 / 100 + ') = ' + N3, 'x = ' + N3 + ' ÷ ' + (1 + p3 / 100), 'x = ' + x3]
          };
        }
        /* find-the-mistake: multiply instead of divide */
        var p4 = pick([15, 18, 24, 30, 45, 60]);
        var W4 = pick([40, 50, 60, 80, 100, 120, 150, 200]);
        while ((p4 * W4) % 100 !== 0) { p4 = pick([15, 30, 60]); }
        var A4 = (p4 * W4) / 100;
        var hisProd = Math.round(A4 * (p4 / 100) * 10) / 10;
        var ok4 = W4 + ' — divide: W = ' + A4 + ' ÷ ' + (p4 / 100);
        return {
          q: 'FIND THE MISTAKE — For "' + A4 + ' is ' + p4 + '% of what number?", Nour wrote ' + A4 + ' × ' + (p4 / 100) + ' = ' + hisProd + '. What is the correct answer?',
          ok: ok4,
          wrong: fill3(ok4, [
            { t: hisProd + ' — Nour is right', d: 'Multiplying finds ' + p4 + '% OF ' + A4 + ' — but the whole is MISSING, so divide: ' + A4 + ' ÷ ' + (p4 / 100) + '.' },
            { t: (W4 + p4) + ' — add the percent', d: 'W = A ÷ r = ' + A4 + ' ÷ ' + (p4 / 100) + ' = ' + W4 + '.' },
            { t: (A4 + W4) + ' — add part and whole', d: 'W = ' + A4 + ' ÷ ' + (p4 / 100) + ' = ' + W4 + '.' }
          ], function () { return { t: (W4 + ri(5, 20)) + ' — divide', d: 'Check: ' + p4 + '% of ' + W4 + ' = ' + A4 + '.' }; }),
          steps: ['The whole is missing → use W = A ÷ r', 'W = ' + A4 + ' ÷ ' + (p4 / 100), 'W = ' + W4 + '. Check: ' + p4 + '% of ' + W4 + ' = ' + A4]
        };
      }
    }
  });

  /* ═══════════ 3-4 Solve Percent Change and Percent Error Problems ═══════════ */
  T3.lessons.push({
    id: 't3l4', code: '3-4', title: 'Solve Percent Change and Percent Error Problems',
    sub: 'New − old · Divide by the base · Accuracy',
    calc: true,
    hintA: '🧭 Percent change = (change ÷ original) × 100. The change is new − old.',
    hintB: '👣 Chant it: "New on top, old on the bottom." Always divide by the ORIGINAL — never by the new value.',
    guide: {
      key: 'Percent change measures how much a value changed compared to the ORIGINAL. Percent error measures how far a measurement is from the EXACT value. In both, divide the change by the base — then multiply by 100.',
      rules: [
        { h: 'PERCENT CHANGE', b: '% change = (change/original) × 100 — the change is new − old: 80 → 100 is 20/80 = 25% increase' },
        { h: 'INCREASE OR DECREASE', b: 'New > original → increase · New < original → decrease: 45 → 36 = 20% decrease' },
        { h: 'PERCENT ERROR', b: '% error = (|measured − exact|/exact) × 100 — always use the exact value as the base' },
        { h: 'BASE RULE', b: 'Always divide by the original (or exact) — never by the new value: 80 → 100 is +25%, not +20%' }
      ],
      steps: ['Find the change: new − original (or the error |measured − exact|)', 'Divide by the base: the original value (or the exact value for error)', '× 100 and label: increase, decrease, or percent error'],
      ex: [
        { t: 'A value changes from 80 to 100. Find the percent of change.', s: ['Change: 100 − 80 = 20 (increase)', 'Divide by the ORIGINAL: 20 ÷ 80 = 0.25', '25% increase. Check: 80 × 1.25 = 100'] },
        { t: 'A value changes from 45 to 36. Find the percent of change.', s: ['Change: 36 − 45 = −9 (decrease)', 'Divide by the original: 9 ÷ 45 = 0.2', '20% decrease. Check: 45 × 0.8 = 36'] },
        { t: 'A bag is labeled 250 g. A scale reads 260 g. Find the percent error.', s: ['Error: |260 − 250| = 10 g', 'Divide by the exact value: 10 ÷ 250 = 0.04', '4% error. Check: 4% of 250 = 10'] }
      ],
      try: ['Find the percent of change: 50 → 65.', 'Find the percent of change: 200 → 150.', 'Exact 80, measured 84 — find the percent error.'],
      tryAns: ['30% increase', '25% decrease', '5% error']
    },
    gen: {
      easy: function () {
        /* clean percent change: O → N */
        var O, pct, N, guard = 0, inc;
        do {
          O = pick([20, 25, 40, 50, 60, 80, 100, 120, 160, 200, 250]);
          pct = pick([5, 10, 15, 20, 25, 30, 40, 50]);
          guard++;
        } while ((O * pct) % 100 !== 0 && guard < 200);
        if ((O * pct) % 100 !== 0) { O = 100; pct = 20; }
        inc = Math.random() < 0.55;
        var diff = (O * pct) / 100;
        N = inc ? O + diff : O - diff;
        var ok = pct + '% ' + (inc ? 'increase' : 'decrease');
        return {
          q: 'Find the percent of change: ' + O + ' → ' + N + '.',
          ok: ok,
          wrong: fill3(ok, [
            { t: Math.round(diff * 100 / N) + '% ' + (inc ? 'increase' : 'decrease'), d: 'You divided by the NEW value. The base is the ORIGINAL: ' + diff + ' ÷ ' + O + '.' },
            { t: diff + '% ' + (inc ? 'increase' : 'decrease'), d: diff + ' is the CHANGE, not the percent. Divide it by the original ' + O + '.' },
            { t: (100 - pct) + '% ' + (inc ? 'decrease' : 'increase'), d: 'The value went ' + (inc ? 'UP' : 'DOWN') + ' — and the percent is ' + diff + ' ÷ ' + O + ' × 100.' }
          ], function () { return { t: (pct + ri(5, 20)) + '% ' + (inc ? 'increase' : 'decrease'), d: diff + ' ÷ ' + O + ' = ' + (pct / 100) + '.' }; }),
          steps: ['Change: ' + N + ' − ' + O + ' = ' + (inc ? '' : '−') + diff + ' (' + (inc ? 'increase' : 'decrease') + ')', 'Divide by the ORIGINAL: ' + diff + ' ÷ ' + O + ' = ' + (pct / 100), '× 100 and label: ' + pct + '% ' + (inc ? 'increase' : 'decrease')]
        };
      },
      medium: function () {
        var r = Math.random();
        if (r < 0.3) {
          /* word: price/temperature/population */
          var ctxs = [
            { make: function (O, N) { return 'A price rises from EGP ' + O + ' to EGP ' + N + '. Find the percent of increase.'; }, inc: true },
            { make: function (O, N) { return 'The temperature falls from ' + O + '°C to ' + N + '°C. Find the percent of decrease.'; }, inc: false },
            { make: function (O, N) { return 'A town\'s population grows from ' + (O * 100) + ' to ' + (N * 100) + '. Find the percent of increase.'; }, inc: true }
          ];
          var ctx = pick(ctxs);
          var O2, pct2, N2, guard2 = 0;
          do {
            O2 = pick([20, 40, 50, 80, 100, 120, 160, 200, 250]);
            pct2 = pick([5, 10, 20, 25, 40, 50]);
            guard2++;
          } while ((O2 * pct2) % 100 !== 0 && guard2 < 200);
          if ((O2 * pct2) % 100 !== 0) { O2 = 100; pct2 = 25; }
          var diff2 = (O2 * pct2) / 100;
          N2 = ctx.inc ? O2 + diff2 : O2 - diff2;
          var ok2 = pct2 + '% ' + (ctx.inc ? 'increase' : 'decrease');
          return {
            q: ctx.make(O2, N2),
            ok: ok2,
            wrong: fill3(ok2, [
              { t: Math.round(diff2 * 100 / N2) + '% ' + (ctx.inc ? 'increase' : 'decrease'), d: 'New on top is the classic trap — divide by the ORIGINAL ' + O2 + ': ' + diff2 + ' ÷ ' + O2 + '.' },
              { t: diff2 + '% ' + (ctx.inc ? 'increase' : 'decrease'), d: 'The change is ' + diff2 + ' units — turn it into a percent by dividing by ' + O2 + ' and × 100.' },
              { t: (pct2 + 10) + '% ' + (ctx.inc ? 'increase' : 'decrease'), d: diff2 + ' ÷ ' + O2 + ' = ' + (pct2 / 100) + ' → ' + pct2 + '%.' }
            ], function () { return { t: (pct2 + ri(5, 15)) + '% ' + (ctx.inc ? 'increase' : 'decrease'), d: diff2 + ' ÷ ' + O2 + ' × 100 = ' + pct2 + '.' }; }),
            steps: ['Change: ' + N2 + ' − ' + O2 + ' = ' + (ctx.inc ? '' : '−') + diff2, 'Divide by the original: ' + diff2 + ' ÷ ' + O2 + ' = ' + (pct2 / 100), '× 100 → ' + pct2 + '% ' + (ctx.inc ? 'increase' : 'decrease')]
          };
        }
        if (r < 0.58) {
          /* percent error */
          var E = pick([25, 40, 50, 80, 100, 200, 250, 48]);
          var pe = pick([2, 4, 5, 10, 20, 25]);
          while ((E * pe) % 100 !== 0) { pe = pick([5, 10, 20, 25, 50]); }
          var err = (E * pe) / 100;
          var up = Math.random() < 0.5;
          var M = up ? E + err : E - err;
          var ok3 = pe + '% error';
          return {
            q: 'A bottle\'s exact capacity is ' + E + ' L, but a scale shows ' + M + ' L. Find the percent error.',
            ok: ok3,
            wrong: fill3(ok3, [
              { t: Math.round(err * 100 / M) + '% error', d: 'The base is the EXACT value ' + E + ', not the measurement: ' + err + ' ÷ ' + E + '.' },
              { t: err + '% error', d: err + ' is the size of the error — divide by the exact value ' + E + ' and × 100.' },
              { t: (pe + 5) + '% error', d: '|' + M + ' − ' + E + '| = ' + err + ', then ' + err + ' ÷ ' + E + ' × 100 = ' + pe + '.' }
            ], function () { return { t: (pe + ri(3, 12)) + '% error', d: err + ' ÷ ' + E + ' × 100 = ' + pe + '.' }; }),
            steps: ['Error: |' + M + ' − ' + E + '| = ' + err, 'Divide by the EXACT value: ' + err + ' ÷ ' + E + ' = ' + (pe / 100), '× 100 → ' + pe + '% error']
          };
        }
        if (r < 0.8) {
          /* find-the-mistake: divided by new */
          var O4 = pick([40, 60, 80, 100, 120, 200]);
          var pct4 = pick([10, 20, 25, 50]);
          while ((O4 * pct4) % 100 !== 0) { pct4 = pick([10, 20, 25, 50]); }
          var diff4 = (O4 * pct4) / 100;
          var N4 = O4 + diff4;
          var hisPct = Math.round(diff4 * 100 / N4);
          var ok4 = pct4 + '% — divide by the original ' + O4 + ', not the new ' + N4;
          return {
            q: 'FIND THE MISTAKE — A price changed from EGP ' + O4 + ' to EGP ' + N4 + '. Karim said: change = ' + diff4 + ', so the percent of change = ' + diff4 + ' ÷ ' + N4 + ' = ' + hisPct + '%. What is the correct percent of change?',
            ok: ok4,
            wrong: fill3(ok4, [
              { t: hisPct + '% — Karim is right', d: 'He divided by the NEW price. The base is the ORIGINAL: ' + diff4 + ' ÷ ' + O4 + ' = ' + (pct4 / 100) + '.' },
              { t: diff4 + '% — just report the change', d: 'The change is ' + diff4 + ' EGP — a percent needs ÷ original × 100.' },
              { t: (pct4 + 10) + '% — add 10%', d: diff4 + ' ÷ ' + O4 + ' × 100 = ' + pct4 + '.' }
            ], function () { return { t: (pct4 + ri(5, 15)) + '% — recheck', d: 'Check: ' + O4 + ' × ' + (1 + pct4 / 100) + ' = ' + N4 + '.' }; }),
            steps: ['Change: ' + N4 + ' − ' + O4 + ' = ' + diff4, 'Divide by the ORIGINAL: ' + diff4 + ' ÷ ' + O4 + ' = ' + (pct4 / 100), '× 100 → ' + pct4 + '% increase']
          };
        }
        /* sequential change */
        var B = pick([100, 200, 400]);
        var i5 = pick([10, 20, 25, 50]), d5 = pick([10, 20, 25, 50]);
        var step1 = B + (B * i5) / 100;
        var final = step1 - (step1 * d5) / 100;
        var ok5 = final + ' — the two percents act on DIFFERENT bases';
        return {
          q: 'A quantity of ' + B + ' increases by ' + i5 + '%, then the result decreases by ' + d5 + '%. What is the final value?',
          ok: ok5,
          wrong: fill3(ok5, [
            { t: B + ' — the percents cancel out', d: 'They only cancel when the base is the SAME. Here the second percent acts on ' + step1 + ', not on ' + B + '.' },
            { t: (B + i5 - d5) + ' — add and subtract the percents', d: 'Percents are not plain numbers: ' + B + ' × ' + (1 + i5 / 100) + ' = ' + step1 + ', then × ' + (1 - d5 / 100) + '.' },
            { t: step1 + ' — only the increase happened', d: 'Now apply the ' + d5 + '% decrease: ' + step1 + ' × ' + (1 - d5 / 100) + ' = ' + final + '.' }
          ], function () { return { t: (final + ri(5, 25)) + ' — recheck', d: B + ' × ' + (1 + i5 / 100) + ' × ' + (1 - d5 / 100) + '.' }; }),
          steps: ['Increase: ' + B + ' × ' + (1 + i5 / 100) + ' = ' + step1, 'Decrease: ' + step1 + ' × ' + (1 - d5 / 100) + ' = ' + final, 'Final value: ' + final]
        };
      }
    }
  });

  /* ═══════════ 3-5 Solve Markup and Markdown Problems ═══════════ */
  T3.lessons.push({
    id: 't3l5', code: '3-5', title: 'Solve Markup and Markdown Problems',
    sub: 'Cost → selling price · Regular → sale price · Profit',
    calc: true,
    hintA: '🧭 Markup percent acts on the COST. Discount percent acts on the REGULAR price. Always ask: percent OF WHAT?',
    hintB: '👣 One-multiply shortcut: increase → × (1 + r), decrease → × (1 − r). Selling = cost + markup · Sale = regular − discount.',
    guide: {
      key: 'A markup lifts the cost up to a selling price; a markdown (discount) cuts the regular price down to a sale price. Each percent acts on its own base: markup percent on the cost, discount percent on the regular price.',
      rules: [
        { h: 'MARKUP', b: 'selling price = cost + markup · markup = markup% × cost: cost 200, markup 40% → 200 × 1.4 = 280' },
        { h: 'MARKDOWN (DISCOUNT)', b: 'sale price = regular − discount · discount = discount% × regular: 350 with 20% off → 350 × 0.8 = 280' },
        { h: 'ONE-MULTIPLY SHORTCUT', b: 'Increase → × (1 + r): +25% → × 1.25 · Decrease → × (1 − r): −30% → × 0.7' },
        { h: 'PROFIT', b: 'profit = selling price − cost: sell 208 − cost 160 = profit 48' }
      ],
      steps: ['Spot the base: cost (for markup) or regular price (for discount)', 'Find the amount: percent × base — or use the × (1 ± r) shortcut', 'Add or subtract — label the final price with EGP'],
      ex: [
        { t: 'A shop buys a vase for EGP 200 and marks it up 40%. Find the selling price.', s: ['Base = cost = EGP 200', 'Markup: 0.40 × 200 = EGP 80', 'Selling price = 200 + 80 = EGP 280. Check: 200 × 1.4 = 280'] },
        { t: 'A jacket\'s regular price is EGP 350 with a 20% discount. Find the sale price.', s: ['Base = regular = EGP 350', 'Discount: 0.20 × 350 = EGP 70', 'Sale price = 350 − 70 = EGP 280. Check: 350 × 0.8 = 280'] },
        { t: 'A shirt costs EGP 160 and sells for EGP 208. Find the markup percent.', s: ['Markup: 208 − 160 = EGP 48', 'Divide by the cost: 48 ÷ 160 = 0.3', '30% markup. Check: 160 × 1.3 = 208'] }
      ],
      try: ['Cost EGP 300, markup 25% — find the selling price.', 'Regular EGP 480, discount 25% — find the sale price.', 'Cost EGP 250, selling EGP 300 — find the markup percent.'],
      tryAns: ['EGP 375', 'EGP 360', '20%']
    },
    gen: {
      easy: function () {
        var r = Math.random();
        if (r < 0.5) {
          /* markup: selling price */
          var C, m, guard = 0;
          do {
            C = pick([60, 80, 100, 120, 150, 200, 240, 300, 400]);
            m = pick([10, 15, 20, 25, 30, 40, 50]);
            guard++;
          } while ((C * m) % 100 !== 0 && guard < 200);
          if ((C * m) % 100 !== 0) { C = 100; m = 30; }
          var mk = (C * m) / 100, SP = C + mk;
          var ok = 'EGP ' + SP;
          return {
            q: 'A shop buys a vase for ' + money(C) + ' and marks it up ' + m + '%. Find the selling price.',
            ok: ok,
            wrong: fill3(ok, [
              { t: 'EGP ' + mk, d: 'That is the markup AMOUNT — add it to the cost: ' + C + ' + ' + mk + ' = ' + SP + '.' },
              { t: 'EGP ' + (C + m), d: 'The markup is ' + m + '% of ' + C + ' = ' + mk + ' EGP, not ' + m + ' EGP.' },
              { t: 'EGP ' + (C - mk), d: 'A markup RAISES the price: ' + C + ' + ' + mk + ' = ' + SP + '.' }
            ], function () { return { t: 'EGP ' + (SP + ri(10, 40)), d: 'Check: ' + C + ' × ' + (1 + m / 100) + ' = ' + SP + '.' }; }),
            steps: ['Markup: ' + (m / 100) + ' × ' + C + ' = ' + money(mk), 'Selling price = cost + markup = ' + C + ' + ' + mk, 'Selling price = ' + money(SP) + ' (shortcut: ' + C + ' × ' + (1 + m / 100) + ')']
          };
        }
        /* markdown: sale price */
        var R, d, guard2 = 0;
        do {
          R = pick([90, 100, 150, 200, 250, 300, 350, 400, 480]);
          d = pick([10, 20, 25, 30, 40, 50]);
          guard2++;
        } while ((R * d) % 100 !== 0 && guard2 < 200);
        if ((R * d) % 100 !== 0) { R = 100; d = 20; }
        var disc = (R * d) / 100, sale = R - disc;
        var ok2 = 'EGP ' + sale;
        return {
          q: 'A jacket\'s regular price is ' + money(R) + ' with a ' + d + '% discount. Find the sale price.',
          ok: ok2,
          wrong: fill3(ok2, [
            { t: 'EGP ' + disc, d: 'That is the DISCOUNT amount — subtract it: ' + R + ' − ' + disc + ' = ' + sale + '.' },
            { t: 'EGP ' + (R - d), d: 'The discount is ' + d + '% of ' + R + ' = ' + money(disc) + ', not ' + d + ' EGP.' },
            { t: 'EGP ' + (R + disc), d: 'A discount LOWERS the price: ' + R + ' − ' + disc + ' = ' + sale + '.' }
          ], function () { return { t: 'EGP ' + (sale + ri(10, 40)), d: 'Check: ' + R + ' × ' + (1 - d / 100) + ' = ' + sale + '.' }; }),
          steps: ['Discount: ' + (d / 100) + ' × ' + R + ' = ' + money(disc), 'Sale price = regular − discount = ' + R + ' − ' + disc, 'Sale price = ' + money(sale) + ' (shortcut: ' + R + ' × ' + (1 - d / 100) + ')']
        };
      },
      medium: function () {
        var r = Math.random();
        if (r < 0.28) {
          /* find the markup percent */
          var C2 = pick([60, 80, 100, 120, 150, 160, 200, 220, 240, 300]);
          var m2 = pick([10, 15, 20, 25, 30, 40, 50]);
          while ((C2 * m2) % 100 !== 0) { m2 = pick([10, 20, 25, 50]); }
          var mk2 = (C2 * m2) / 100, SP2 = C2 + mk2;
          var ok = m2 + '% markup';
          return {
            q: 'A table costs ' + money(C2) + ' and sells for ' + money(SP2) + '. Find the markup percent.',
            ok: ok,
            wrong: fill3(ok, [
              { t: Math.round(mk2 * 100 / SP2) + '% markup', d: 'The base is the COST ' + C2 + ', not the selling price: ' + mk2 + ' ÷ ' + C2 + '.' },
              { t: mk2 + '% markup', d: mk2 + ' is the markup in EGP — divide by the cost ' + C2 + ' and × 100.' },
              { t: (m2 + 10) + '% markup', d: 'Markup = ' + SP2 + ' − ' + C2 + ' = ' + mk2 + ', then ' + mk2 + ' ÷ ' + C2 + ' × 100 = ' + m2 + '.' }
            ], function () { return { t: (m2 + ri(5, 15)) + '% markup', d: 'Check: ' + C2 + ' × ' + (1 + m2 / 100) + ' = ' + SP2 + '.' }; }),
            steps: ['Markup: ' + SP2 + ' − ' + C2 + ' = ' + money(mk2), 'Divide by the cost: ' + mk2 + ' ÷ ' + C2 + ' = ' + (m2 / 100), '× 100 → ' + m2 + '% markup']
          };
        }
        if (r < 0.5) {
          /* markup then discount (sequential) */
          var C3 = pick([100, 200, 240, 400, 500]);
          var m3 = pick([20, 25, 40, 50]);
          while ((C3 * m3) % 100 !== 0) { m3 = pick([20, 25, 50]); }
          var SP3 = C3 + (C3 * m3) / 100;
          var d3 = pick([10, 20, 25]);
          while ((SP3 * d3) % 100 !== 0) { d3 = pick([10, 20, 25, 50]); }
          var final3 = SP3 - (SP3 * d3) / 100;
          var ok3 = 'EGP ' + final3;
          return {
            q: 'A shop buys a vase for ' + money(C3) + ', marks it up ' + m3 + '%, then offers a ' + d3 + '% discount on the selling price. What is the final price?',
            ok: ok3,
            wrong: fill3(ok3, [
              { t: 'EGP ' + C3, d: 'The percents do not cancel — they act on different bases (' + C3 + ' then ' + SP3 + ').' },
              { t: 'EGP ' + (SP3), d: 'That is after the markup only. Now apply the ' + d3 + '% discount: ' + SP3 + ' × ' + (1 - d3 / 100) + '.' },
              { t: 'EGP ' + (C3 + m3 - d3), d: 'Use the percents properly: ' + C3 + ' × ' + (1 + m3 / 100) + ' × ' + (1 - d3 / 100) + '.' }
            ], function () { return { t: 'EGP ' + (final3 + ri(10, 40)), d: C3 + ' × ' + (1 + m3 / 100) + ' × ' + (1 - d3 / 100) + ' = ' + final3 + '.' }; }),
            steps: ['Markup: ' + C3 + ' × ' + (1 + m3 / 100) + ' = ' + money(SP3), 'Discount: ' + SP3 + ' × ' + (1 - d3 / 100) + ' = ' + money(final3), 'Final price: ' + money(final3)]
          };
        }
        if (r < 0.72) {
          /* find-the-mistake: discount as sale price */
          var R4 = pick([300, 400, 600, 450, 900, 750]);
          var d4 = pick([20, 30, 25, 50]);
          while ((R4 * d4) % 100 !== 0) { d4 = pick([20, 50]); }
          var disc4 = (R4 * d4) / 100, sale4 = R4 - disc4;
          var ok4 = 'EGP ' + sale4 + ' — subtract the discount from the regular price';
          return {
            q: 'FIND THE MISTAKE — A jacket costs ' + money(R4) + ' with a ' + d4 + '% discount. Mona computed ' + R4 + ' × ' + (d4 / 100) + ' = ' + disc4 + ' and said the sale price is ' + money(disc4) + '. What is the correct sale price?',
            ok: ok4,
            wrong: fill3(ok4, [
              { t: 'EGP ' + disc4 + ' — Mona is right', d: disc4 + ' is the DISCOUNT amount. The sale price is what remains: ' + R4 + ' − ' + disc4 + '.' },
              { t: 'EGP ' + (R4 + disc4), d: 'A discount LOWERS the price: ' + R4 + ' − ' + disc4 + ' = ' + sale4 + '.' },
              { t: 'EGP ' + (R4 - d4), d: 'The discount is ' + money(disc4) + ', not ' + d4 + ' EGP.' }
            ], function () { return { t: 'EGP ' + (sale4 + ri(10, 50)), d: 'Check: ' + R4 + ' × ' + (1 - d4 / 100) + ' = ' + sale4 + '.' }; }),
            steps: ['Discount: ' + (d4 / 100) + ' × ' + R4 + ' = ' + money(disc4), 'Sale price = regular − discount = ' + R4 + ' − ' + disc4, 'Sale price = ' + money(sale4) + ' (shortcut: ' + R4 + ' × ' + (1 - d4 / 100) + ')']
          };
        }
        /* profit on n items */
        var C5 = pick([40, 50, 80, 100, 120, 140, 150]);
        var m5 = pick([20, 25, 30, 40, 50]);
        while ((C5 * m5) % 100 !== 0) { m5 = pick([20, 25, 50]); }
        var SP5 = C5 + (C5 * m5) / 100;
        var n5 = pick([5, 10, 15, 20, 25]);
        var profitEach = SP5 - C5, total = profitEach * n5;
        var ok5 = 'EGP ' + total;
        return {
          q: 'A shirt costs ' + money(C5) + ' and sells for ' + money(SP5) + '. Find the profit on selling ' + n5 + ' shirts.',
          ok: ok5,
          wrong: fill3(ok5, [
            { t: 'EGP ' + (SP5 * n5), d: 'That is the total REVENUE. Profit per shirt = ' + SP5 + ' − ' + C5 + ' = ' + profitEach + '.' },
            { t: 'EGP ' + (profitEach + n5), d: 'Profit per shirt = ' + profitEach + ' EGP, then × ' + n5 + ' shirts.' },
            { t: 'EGP ' + (C5 * n5), d: 'That is the total COST. Profit = (' + SP5 + ' − ' + C5 + ') × ' + n5 + '.' }
          ], function () { return { t: 'EGP ' + (total + ri(20, 90)), d: 'Profit = ' + profitEach + ' × ' + n5 + '.' }; }),
          steps: ['Profit per shirt: ' + SP5 + ' − ' + C5 + ' = ' + money(profitEach), 'Total profit: ' + profitEach + ' × ' + n5, 'Total profit = ' + money(total)]
        };
      }
    }
  });

  /* ═══════════ 3-6 Solve Simple Interest Problems ═══════════ */
  T3.lessons.push({
    id: 't3l6', code: '3-6', title: 'Solve Simple Interest Problems',
    sub: 'I = Prt · Principal, rate and time · Total amount',
    calc: true,
    hintA: '🧭 Simple interest pays the same amount every year: I = P × r × t — principal × rate (as a decimal) × time in years.',
    hintB: '👣 Convert BEFORE substituting: 6% → 0.06, and 9 months → 0.75 year. Then I = Prt and A = P + I.',
    guide: {
      key: 'Simple interest pays the same amount every year: I = P × r × t — the principal times the annual rate (as a decimal) times the time in years. Add the interest to the principal for the total amount.',
      rules: [
        { h: 'THE FORMULA', b: 'I = P × r × t: 2,000 × 0.05 × 3 = 300' },
        { h: 'TOTAL AMOUNT', b: 'A = P + I: 2,000 + 300 = 2,300' },
        { h: 'FIND r OR t', b: 'r = I ÷ (P × t) · t = I ÷ (P × r): I = 240, P = 1,500, t = 2 → r = 0.08 = 8%' },
        { h: 'SAME EVERY YEAR', b: 'Simple interest adds the same I each year — it does not grow on itself: 100 at 10% → +10, +10, +10…' }
      ],
      steps: ['List P, r, t — convert r to a decimal and t to years', 'Substitute into I = Prt and multiply carefully', 'Add for the total: A = P + I — label the answer with EGP'],
      ex: [
        { t: 'EGP 2,000 is deposited at 5% simple interest for 3 years. Find the interest and the total amount.', s: ['P = 2,000, r = 5% = 0.05, t = 3', 'I = 2,000 × 0.05 × 3 = EGP 300', 'A = 2,000 + 300 = EGP 2,300'] },
        { t: 'EGP 4,500 is invested at 4% for 6 months. Find the interest.', s: ['6 months = 1/2 year → t = 0.5', 'I = 4,500 × 0.04 × 0.5', 'I = EGP 90'] },
        { t: 'EGP 1,500 earns EGP 240 of interest in 2 years. Find the rate.', s: ['r = I ÷ (P × t) = 240 ÷ (1,500 × 2)', 'r = 240 ÷ 3,000 = 0.08', 'r = 8%. Check: 1,500 × 0.08 × 2 = 240'] }
      ],
      try: ['P = EGP 800 at 6% for 5 years. Find I.', 'P = EGP 2,000 at 3% for 9 months. Find I.', 'P = EGP 5,000, t = 4 years, I = EGP 800. Find r.'],
      tryAns: ['EGP 240', 'EGP 45', '4%']
    },
    gen: {
      easy: function () {
        /* I = Prt — P is a multiple of 100, so I is always a clean integer */
        var P = 100 * ri(8, 60), r = ri(2, 9), t = ri(2, 5);
        var I = (P * r * t) / 100;
        var ok = 'EGP ' + I;
        return {
          q: money(P) + ' is deposited at ' + r + '% simple interest for ' + t + ' years. Find the interest I.',
          ok: ok,
          wrong: fill3(ok, [
            { t: 'EGP ' + (P * r * t), d: 'You forgot to convert the rate: ' + r + '% = ' + (r / 100) + '. I = ' + P + ' × ' + (r / 100) + ' × ' + t + '.' },
            { t: 'EGP ' + (P + I), d: 'That is the TOTAL amount A = P + I. The interest alone is ' + I + '.' },
            { t: 'EGP ' + ((P * r) / 100), d: 'That is one year of interest only — multiply by ' + t + ' years.' }
          ], function () { return { t: 'EGP ' + (I + ri(30, 120)), d: 'I = ' + P + ' × ' + (r / 100) + ' × ' + t + ' = ' + I + '.' }; }),
          steps: ['P = ' + P + ', r = ' + r + '% = ' + (r / 100) + ', t = ' + t, 'I = P × r × t = ' + P + ' × ' + (r / 100) + ' × ' + t, 'I = ' + money(I)]
        };
      },
      medium: function () {
        var r0 = Math.random();
        if (r0 < 0.22) {
          /* months conversion */
          var m = pick([3, 6, 9]);
          var P2 = 100 * ri(10, 40);
          var r2 = ri(2, 8);
          /* I = P·r·(m/12)/100 = P·r·m/1200 — integer iff P·r·m mult of 1200; P mult 100 → r·m mult 12 */
          while ((r2 * m) % 12 !== 0) { r2 = ri(2, 12); }
          var I2 = (P2 * r2 * m) / 1200;
          var ok = 'EGP ' + I2;
          return {
            q: money(P2) + ' is invested at ' + r2 + '% simple interest for ' + m + ' months. Find the interest.',
            ok: ok,
            wrong: fill3(ok, [
              { t: 'EGP ' + ((P2 * r2 * (m / 12)) / 10), d: 'Convert the months FIRST: ' + m + ' months = ' + (m / 12) + ' year, then I = ' + P2 + ' × ' + (r2 / 100) + ' × ' + (m / 12) + '.' },
              { t: 'EGP ' + ((P2 * r2) / 100), d: 'That is ONE year of interest — ' + m + ' months is only ' + (m / 12) + ' of a year.' },
              { t: 'EGP ' + ((P2 * r2 * m) / 100), d: 'The time must be in YEARS: ' + m + ' months = ' + (m / 12) + ' year.' }
            ], function () { return { t: 'EGP ' + (I2 + ri(10, 60)), d: 'I = ' + P2 + ' × ' + (r2 / 100) + ' × ' + (m / 12) + ' = ' + I2 + '.' }; }),
            steps: [m + ' months = ' + (m / 12) + ' year', 'I = ' + P2 + ' × ' + (r2 / 100) + ' × ' + (m / 12), 'I = ' + money(I2)]
          };
        }
        if (r0 < 0.44) {
          /* total amount */
          var P3 = 100 * ri(10, 50), r3 = ri(2, 9), t3 = ri(2, 6);
          var I3 = (P3 * r3 * t3) / 100;
          var A3 = P3 + I3;
          var ok2 = 'EGP ' + A3;
          return {
            q: money(P3) + ' is deposited at ' + r3 + '% simple interest for ' + t3 + ' years. Find the TOTAL amount after ' + t3 + ' years.',
            ok: ok2,
            wrong: fill3(ok2, [
              { t: 'EGP ' + I3, d: 'That is the INTEREST only. Total = P + I = ' + P3 + ' + ' + I3 + '.' },
              { t: 'EGP ' + (P3 + r3), d: 'The interest is ' + P3 + ' × ' + (r3 / 100) + ' × ' + t3 + ' = ' + I3 + ', then ADD it.' },
              { t: 'EGP ' + (P3 * 2), d: 'Money does not double here — compute I = Prt first: I = ' + I3 + '.' }
            ], function () { return { t: 'EGP ' + (A3 + ri(50, 200)), d: 'A = ' + P3 + ' + ' + I3 + ' = ' + A3 + '.' }; }),
            steps: ['I = ' + P3 + ' × ' + (r3 / 100) + ' × ' + t3 + ' = ' + money(I3), 'A = P + I = ' + P3 + ' + ' + I3, 'A = ' + money(A3)]
          };
        }
        if (r0 < 0.66) {
          /* find the rate */
          var P4 = 100 * ri(10, 50), t4 = ri(2, 5), r4 = ri(2, 9);
          var I4 = (P4 * r4 * t4) / 100;
          var ok3 = r4 + '%';
          return {
            q: money(P4) + ' earns ' + money(I4) + ' of interest in ' + t4 + ' years. Find the rate r.',
            ok: ok3,
            wrong: fill3(ok3, [
              { t: (r4 * 100) + '%', d: 'r = I ÷ (P × t) = ' + I4 + ' ÷ ' + (P4 * t4) + ' = ' + (r4 / 100) + ' — a decimal. × 100 → ' + r4 + '%.' },
              { t: (r4 + t4) + '%', d: 'r = ' + I4 + ' ÷ (' + P4 + ' × ' + t4 + ') = ' + (r4 / 100) + '.' },
              { t: (r4 + 2) + '%', d: 'Check: ' + P4 + ' × ' + (r4 / 100) + ' × ' + t4 + ' = ' + I4 + '.' }
            ], function () { return { t: (r4 + ri(1, 4)) + '%', d: 'r = ' + I4 + ' ÷ ' + (P4 * t4) + ' × 100.' }; }),
            steps: ['r = I ÷ (P × t)', 'r = ' + I4 + ' ÷ (' + P4 + ' × ' + t4 + ') = ' + I4 + ' ÷ ' + (P4 * t4), 'r = ' + (r4 / 100) + ' → ' + r4 + '%']
          };
        }
        if (r0 < 0.85) {
          /* find the time */
          var P5 = 100 * ri(6, 30), r5 = ri(2, 10), t5 = ri(2, 8);
          var I5 = (P5 * r5 * t5) / 100;
          var ok4 = t5 + ' years';
          return {
            q: money(P5) + ' at ' + r5 + '% simple interest earns ' + money(I5) + '. Find the time t.',
            ok: ok4,
            wrong: fill3(ok4, [
              { t: (I5 / r5) + ' years', d: 't = I ÷ (P × r) = ' + I5 + ' ÷ (' + P5 + ' × ' + r5 + ') — the principal is missing from your division.' },
              { t: (t5 + 1) + ' years', d: 'Check: ' + P5 + ' × ' + (r5 / 100) + ' × ' + (t5 + 1) + ' ≠ ' + I5 + '.' },
              { t: (I5 / P5) + ' years', d: 't = I ÷ (P × r) = ' + I5 + ' ÷ (' + P5 + ' × ' + (r5 / 100) + ') = ' + t5 + '.' }
            ], function () { return { t: (t5 + ri(1, 3)) + ' years', d: 'Check: ' + P5 + ' × ' + (r5 / 100) + ' × ' + t5 + ' = ' + I5 + '.' }; }),
            steps: ['t = I ÷ (P × r)', 't = ' + I5 + ' ÷ (' + P5 + ' × ' + (r5 / 100) + ')', 't = ' + t5 + ' years']
          };
        }
        /* doubling time */
        var r6 = pick([2, 4, 5, 8, 10, 20, 25]);
        var ok5 = (100 / r6) + ' years';
        return {
          q: 'How long does it take for money to DOUBLE at ' + r6 + '% simple interest per year?',
          ok: ok5,
          wrong: fill3(ok5, [
            { t: r6 + ' years', d: 'Interest per year is ' + r6 + '% of P — to collect 100% of P you need 100 ÷ ' + r6 + ' years.' },
            { t: (100 / (r6 * 2)) + ' years', d: 'Each year adds ' + r6 + '% — you need 100 ÷ ' + r6 + ' years, not half of that.' },
            { t: (100 - r6) + ' years', d: 'Set I = P: P × ' + (r6 / 100) + ' × t = P → t = 100 ÷ ' + r6 + '.' }
          ], function () { return { t: (100 / r6 + ri(1, 5)) + ' years', d: 't = 100 ÷ ' + r6 + '.' }; }),
          steps: ['To double: I must equal P', 'P × ' + (r6 / 100) + ' × t = P  →  t = 1 ÷ ' + (r6 / 100), 't = ' + (100 / r6) + ' years']
        };
      }
    }
  });

  hook();
})();
