/* ============================================================
   AID Mathematics Academy · Grade 7 — t5.js
   Topic 5 · Solve Problems Using Equations & Inequalities
   الدروس 5-1 → 5-7 (متطابقة مع كتاب الشغل المرفوع)
   ============================================================ */
(function () {
  'use strict';

  /* ─── أدوات ─── */
  function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function shuffle(arr) {
    var a = arr.slice(), i, j, t;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function n2s(n) { return n < 0 ? '−' + Math.abs(n) : String(n); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function fmtnum(n) {
    if (Number.isInteger(n)) return n2s(n);
    return (n < 0 ? '−' : '') + Math.abs(n).toFixed(1).replace(/\.0$/, '');
  }
  /* يضمن 3 اختيارات غلط مختلفة عن الصحيح — ولها حد أقصى ضد أي تكرار لا نهائي */
  function fill3(ok, ws, fallback) {
    var seen = {}, out = [], i, tries = 0;
    seen[String(ok)] = 1;
    for (i = 0; i < ws.length && out.length < 3; i++) {
      if (!ws[i]) continue;
      var t = String(ws[i].t);
      if (!seen[t]) { seen[t] = 1; out.push(ws[i]); }
    }
    while (out.length < 3 && tries < 40) {
      tries++;
      var f = fallback();
      if (f && !seen[String(f.t)]) { seen[t = String(f.t)] = 1; out.push(f); }
    }
    var bump = 2;
    while (out.length < 3 && bump < 12) {
      var alt = String(ok).replace(/[0-9]+/g, function (n) { return String(parseInt(n, 10) + bump); });
      if (!seen[alt]) { seen[alt] = 1; out.push({ t: alt, d: 'Read the choices again and apply the steps in order.' }); }
      bump++;
    }
    return out;
  }
  function near(ok, d) {
    ok = String(ok);
    var m = ok.match(/^(.*?)([0-9]+)(\s*)$/);
    if (m) { return { t: m[1] + (parseInt(m[2], 10) + 1), d: d }; }
    return { t: ok.replace(/([0-9]+)(?=[^0-9]*$)/, function (n) { return String(parseInt(n, 10) + 1); }), d: d };
  }

  /* ─── أدوات المتباينات ─── */
  var SYMS = ['<', '>', '≤', '≥'];
  function flipS(s) { return s === '<' ? '>' : (s === '>' ? '<' : (s === '≤' ? '≥' : '≤')); }
  function tightS(s) { return s === '<' ? '≤' : (s === '>' ? '≥' : (s === '≤' ? '<' : '>')); }
  function openS(s) { return s === '<' || s === '>'; }
  function symWord(s) {
    return s === '<' ? 'less than' : (s === '>' ? 'greater than' : (s === '≤' ? 'less than or equal to' : 'greater than or equal to'));
  }
  /* المجموعة القياسية: قلب الإشارة / قيمة غلط / الاتنين مع بعض */
  function ineqWs(v, S, badV, dFlip, dVal) {
    var vTxt = 'x ' + S + ' ' + n2s(v), fTxt = 'x ' + flipS(S) + ' ' + n2s(v);
    return [
      { t: fTxt, d: dFlip },
      { t: 'x ' + S + ' ' + n2s(badV), d: dVal },
      { t: 'x ' + flipS(S) + ' ' + n2s(badV), d: 'Two fixes are needed: the sign must be ' + S + ' (not ' + flipS(S) + ') and the value must be ' + n2s(v) + '.' }
    ];
  }

  var T5 = {
    id: 't5', num: 5, icon: '⚖️', color: '#ea580c',
    title: 'Solve Problems Using Equations & Inequalities',
    sub: 'كتابة وحل المعادلات والمتباينات خطوة بخطوة',
    lessons: []
  };

  /* ═══════════ 5-1 Write Two-Step Equations ═══════════ */
  T5.lessons.push({
    id: 't5l1', code: '5-1', title: 'Write Two-Step Equations',
    sub: 'Rate · Fixed amount · Total',
    calc: false,
    hintA: '🧭 Name the variable, find the RATE (each / per — it multiplies the variable), find the FIXED amount (fee / spent), then set them equal to the TOTAL.',
    hintB: '👣 Key words: is / equals / total → = · each / per → × · plus / fee → + · minus / spent → −. Write rate × variable ± fixed = total.',
    guide: {
      key: 'A two-step equation uses two operations. To write one, name the variable, find the rate (each / per) and the fixed amount, then set them equal to the total.',
      rules: [
        { h: 'RATE (EACH / PER)', b: '4x + 10 = 34 → the amount for one unit; it multiplies the variable' },
        { h: 'FIXED AMOUNT', b: 'a one-time amount (fee, deposit, start) → added or subtracted' },
        { h: 'KEY WORDS', b: 'is / equals / total → = · each / per → × · plus / fee → + · minus / spent → −' },
        { h: 'WATCH OUT', b: '"5 less than x" means x − 5 — it comes FROM the other amount' }
      ],
      steps: ['Define the variable — let a letter stand for the unknown', 'Find the rate (each / per) — it multiplies the variable', 'Find the fixed amount — add it (fee) or subtract it (spent)', 'Write the equation: rate × variable ± fixed = total'],
      ex: [
        { t: 'A gym charges EGP 50 to join plus EGP 20 per month. Mona paid EGP 170 in total (m = months).', s: ['Let m = number of months', 'Rate: 20 each month; fixed: 50', 'Equation: 20m + 50 = 170'] },
        { t: 'Sara had EGP 90. She bought 3 books at price p and has EGP 24 left.', s: ['3 books cost 3p — that is money spent', 'Start from 90 and subtract the books', '90 − 3p = 24'] }
      ],
      try: ['A taxi charges EGP 8 plus EGP 3 per km. The fare is EGP 29. Write an equation for the km k.', 'Twice a number minus 5 equals 11. Write an equation.', 'Ali had EGP 60 and spent EGP 7 on each of s snacks. He has EGP 25 left. Write an equation.'],
      tryAns: ['8 + 3k = 29', '2n − 5 = 11', '60 − 7s = 25']
    },
    gen: {
      easy: function () {
        var mode = ri(1, 3);
        if (mode === 1) {
          var a = ri(2, 9), b = ri(2, 9), x = ri(2, 9);
          while (b === a) { b = ri(2, 9); }
          var T = a * x + b;
          return {
            q: 'Write an equation: "' + a + ' times a number n, plus ' + b + ', equals ' + T + '."',
            ok: a + 'n + ' + b + ' = ' + T,
            wrong: [
              { t: b + 'n + ' + a + ' = ' + T, d: '"times n" uses the ' + a + ' → ' + a + 'n. The ' + b + ' stands alone as the constant: ' + a + 'n + ' + b + '.' },
              { t: a + '(n + ' + b + ') = ' + T, d: 'Only n is multiplied by ' + a + ' — the "plus ' + b + '" comes after: ' + a + 'n + ' + b + '.' },
              { t: a + 'n − ' + b + ' = ' + T, d: '"plus" means ADD: ' + a + 'n + ' + b + ' = ' + T + '.' }
            ],
            steps: ['"times n" → ' + a + 'n', '"plus ' + b + '" → + ' + b, '"equals ' + T + '" → = ' + T, 'Equation: ' + a + 'n + ' + b + ' = ' + T]
          };
        }
        if (mode === 2) {
          var k = ri(3, 9), m = ri(2, 9), less = Math.random() < 0.5;
          var tot = less ? (2 * m - k) : (2 * m + k);
          if (tot < 1) { tot = 2 * m + k; less = false; }
          var okE = '2n ' + (less ? '− ' : '+ ') + k + ' = ' + tot;
          return {
            q: 'Write an equation: "' + (less ? k + ' less than' : k + ' more than') + ' twice a number n is ' + tot + '."',
            ok: okE,
            wrong: [
              { t: '2(n ' + (less ? '− ' : '+ ') + k + ') = ' + tot, d: '"Twice" multiplies ONLY the n: 2n, and then the ' + k + ' comes ' + (less ? 'off' : 'on') + ': ' + okE + '.' },
              { t: '2n ' + (less ? '+ ' : '− ') + k + ' = ' + tot, d: (less ? '"LESS than" means subtract' : '"MORE than" means add') + ' the ' + k + ': ' + okE + '.' },
              { t: k + 'n ' + (less ? '− ' : '+ ') + '2 = ' + tot, d: '"Twice" = 2 times → 2n. The ' + k + ' is the alone number: ' + okE + '.' }
            ],
            steps: ['"twice n" → 2n', '"' + (less ? k + ' less than" → − ' + k : k + ' more than" → + ' + k) + '', '"is" → = ' + tot, 'Equation: ' + okE]
          };
        }
        var d = ri(2, 6), kk = ri(2, 9), c = ri(2, 9), TT = kk + c;
        var okF = 'y/' + d + ' + ' + c + ' = ' + TT;
        return {
          q: 'Write an equation: "A number y divided by ' + d + ', plus ' + c + ', equals ' + TT + '."',
          ok: okF,
          wrong: [
            { t: d + 'y + ' + c + ' = ' + TT, d: '"divided by ' + d + '" puts the ' + d + ' on the BOTTOM: y/' + d + ' — not ' + d + 'y.' },
            { t: 'y/' + d + ' − ' + c + ' = ' + TT, d: '"plus ' + c + '" means ADD: ' + okF + '.' },
            { t: '(y + ' + c + ')/' + d + ' = ' + TT, d: 'Only the y is divided by ' + d + '. The +' + c + ' comes AFTER the division: ' + okF + '.' }
          ],
          steps: ['"y divided by ' + d + '" → y/' + d, '"plus ' + c + '" → + ' + c, '"equals" → = ' + TT, 'Equation: ' + okF]
        };
      },
      medium: function () {
        var mode = ri(1, 4);
        if (mode === 1) {
          var R = ri(2, 6) * 5, F = ri(2, 10) * 10, mm = ri(2, 9);
          while (F === R) { F = ri(2, 10) * 10; }
          var T = R * mm + F;
          var okE = R + 'm + ' + F + ' = ' + T;
          return {
            q: 'A phone plan costs EGP ' + R + ' per month plus a EGP ' + F + ' setup fee. After m months the total is EGP ' + T + '.<br>Which equation finds m?',
            ok: okE,
            wrong: [
              { t: F + 'm + ' + R + ' = ' + T, d: 'The MONTHLY rate multiplies m: ' + R + 'm. The setup fee is the fixed ' + F + ' → ' + okE + '.' },
              { t: R + '(m + ' + F + ') = ' + T, d: 'Only the months are multiplied by ' + R + ' — the fee is added after: ' + okE + '.' },
              { t: R + 'm − ' + F + ' = ' + T, d: 'The setup fee is ADDED on top: ' + okE + '.' }
            ],
            steps: ['Rate: EGP ' + R + ' per month → ' + R + 'm', 'Fixed: EGP ' + F + ' setup fee → + ' + F, 'Total: EGP ' + T + ' → = ' + T, 'Equation: ' + okE]
          };
        }
        if (mode === 2) {
          var p = ri(5, 20), N = ri(3, 6), L = ri(5, 30);
          while (N * p === L) { L = ri(5, 30); }
          var H = N * p + L;
          var okH = H + ' − ' + N + 't = ' + L;
          return {
            q: 'Tarek had EGP ' + H + '. After buying ' + N + ' tickets at EGP ' + p + ' each (price t), he has EGP ' + L + ' left.<br>Which equation finds t?',
            ok: okH,
            wrong: [
              { t: H + ' + ' + N + 't = ' + L, d: 'Buying tickets SPENDS money, so the ' + N + 't is subtracted: ' + okH + '.' },
              { t: N + 't = ' + L, d: 'EGP ' + L + ' is what is LEFT, not the cost of the tickets. Start from what he had: ' + okH + '.' },
              { t: H + ' − ' + N + 't = ' + (H - L), d: 'The right side is what is LEFT (EGP ' + L + '), not what was spent on tickets.' }
            ],
            steps: ['Start from what he had: ' + H, 'Spend: ' + N + ' tickets × t → subtract ' + N + 't', 'What is left: ' + L, 'Equation: ' + okH]
          };
        }
        if (mode === 3) {
          var Rd = ri(1, 6) * 5, h = ri(2, 9), W = ri(5, 30) * 10;
          while (Rd * h === W) { W = ri(5, 30) * 10; }
          var V = Rd * h + W;
          var okV = V + ' − ' + Rd + 'h = ' + W;
          return {
            q: 'A pool holds ' + V + ' L. It loses ' + Rd + ' L every hour. After h hours it holds ' + W + ' L.<br>Which equation finds h?',
            ok: okV,
            wrong: [
              { t: V + ' + ' + Rd + 'h = ' + W, d: 'The pool is LOSING water — the ' + Rd + 'h is subtracted: ' + okV + '.' },
              { t: V + ' − ' + Rd + 'h = ' + (V - W), d: 'The right side is what it HOLDS after h hours (' + W + ' L), not what was lost.' },
              { t: V + ' − h/' + Rd + ' = ' + W, d: 'It loses ' + Rd + ' L EACH hour → ' + Rd + ' × h, so subtract ' + Rd + 'h: ' + okV + '.' }
            ],
            steps: ['Start from the full pool: ' + V + ' L', 'Lose: ' + Rd + ' L each hour → − ' + Rd + 'h', 'After h hours it holds ' + W + ' L', 'Equation: ' + okV]
          };
        }
        var a = ri(2, 9), Fx = ri(2, 9) * 10, n = ri(2, 9), TT = a * n + Fx;
        var testN = Math.random() < 0.5 ? n : n + 1;
        var val = a * testN + Fx;
        var isSol = val === TT;
        var yes = 'Yes — ' + a + '(' + testN + ') + ' + Fx + ' = ' + val + ' = ' + TT + ' ✓';
        var no = 'No — ' + a + '(' + testN + ') + ' + Fx + ' = ' + val + ' ≠ ' + TT;
        return {
          q: 'A school trip costs EGP ' + a + ' per student plus EGP ' + Fx + ' for the bus: ' + a + 's + ' + Fx + ' = ' + TT + '.<br>Is s = ' + testN + ' a solution of this equation?',
          ok: isSol ? yes : no,
          wrong: [
            { t: isSol ? no : yes, d: 'Substitute and compare: ' + a + '(' + testN + ') + ' + Fx + ' = ' + val + ', and the total is ' + TT + ' — they ' + (isSol ? 'MATCH' : 'do NOT match') + '.' },
            { t: 'Yes — any value of s makes it true', d: 'An equation is true only for values that make both sides match. Here ' + a + 's + ' + Fx + ' = ' + TT + ' gives exactly one solution.' },
            { t: 'No — you must solve for s first', d: 'Checking does not need solving: just substitute s = ' + testN + ' and compare with ' + TT + '.' }
          ],
          steps: [
            'Substitute s = ' + testN + ': ' + a + '(' + testN + ') + ' + Fx,
            'Compute: ' + (a * testN) + ' + ' + Fx + ' = ' + val,
            'Compare with the total ' + TT + ' → ' + (isSol ? 'match ✓ — it IS a solution' : 'no match — it is NOT a solution')
          ]
        };
      }
    }
  });

  /* ═══════════ 5-2 Solve Two-Step Equations ═══════════ */
  T5.lessons.push({
    id: 't5l2', code: '5-2', title: 'Solve Two-Step Equations',
    sub: 'Inverse operations · Keeping the equation balanced',
    calc: false,
    hintA: '🧭 Undo in the REVERSE order of operations: first undo + or −, then undo × or ÷ — and do the same to both sides.',
    hintB: '👣 After each move check the balance. Example: 3x + 5 = 20 → subtract 5 → 3x = 15 → divide by 3 → x = 5. Check: 3(5) + 5 = 20 ✓',
    guide: {
      key: 'To solve a two-step equation, use inverse operations to get the variable alone: undo + or − first, then undo × or ÷, and do the same to both sides.',
      rules: [
        { h: 'UNDO ORDER', b: 'reverse of operations: first undo + / −, then undo × / ÷' },
        { h: 'KEEP BALANCED', b: 'do the same to BOTH sides' },
        { h: 'NEGATIVES', b: '−2x = −6 → x = −6 ÷ (−2) = 3' },
        { h: 'ALWAYS CHECK', b: 'substitute back — both sides must match' }
      ],
      steps: ['Undo + or −: add or subtract on both sides', 'Undo × or ÷: multiply or divide on both sides', 'State the solution clearly', 'Check: substitute back into the original equation'],
      ex: [
        { t: '3x + 5 = 20', s: ['Subtract 5: 3x = 15', 'Divide by 3: x = 5', 'Check: 3(5) + 5 = 20 ✓'] },
        { t: 'x/4 − 2 = 3', s: ['Add 2: x/4 = 5', 'Multiply by 4: x = 20', 'Check: 20/4 − 2 = 3 ✓'] }
      ],
      try: ['2x + 3 = 11', '5y − 4 = 16', 'n/3 + 1 = 6'],
      tryAns: ['x = 4', 'y = 4', 'n = 15']
    },
    gen: {
      easy: function () {
        var mode = ri(1, 3);
        if (mode === 1) {
          var a = ri(2, 9), x = ri(2, 9), b = ri(2, 9), c = a * x + b;
          var wA = c - b - a, wB = c - b + a;
          var addErr = (c + b) % a === 0 ? { t: 'x = ' + ((c + b) / a), d: 'You ADDED ' + b + ' instead of subtracting it: ' + c + ' − ' + b + ' = ' + (c - b) + ', then ÷ ' + a + '.' } : null;
          return {
            q: 'Solve: ' + a + 'x + ' + b + ' = ' + c,
            ok: 'x = ' + x,
            wrong: fill3('x = ' + x, [
              { t: 'x = ' + wA, d: 'You subtracted ' + a + ' instead of DIVIDING by it. First undo +' + b + ': ' + a + 'x = ' + (c - b) + ', then ÷ ' + a + '.' },
              addErr,
              { t: 'x = ' + (x + 1), d: 'Check by substituting: ' + a + '(' + (x + 1) + ') + ' + b + ' = ' + (a * (x + 1) + b) + ' ≠ ' + c + '.' }
            ], function () { return { t: 'x = ' + (x - 1), d: 'Check by substituting: ' + a + '(' + (x - 1) + ') + ' + b + ' = ' + (a * (x - 1) + b) + ' ≠ ' + c + '.' }; }),
            steps: [
              'Subtract ' + b + ' from both sides: ' + a + 'x = ' + (c - b),
              'Divide both sides by ' + a + ': x = ' + (c - b) + ' ÷ ' + a,
              'x = ' + x + ' · Check: ' + a + '(' + x + ') + ' + b + ' = ' + c + ' ✓'
            ]
          };
        }
        if (mode === 2) {
          var d = ri(2, 6), k = ri(2, 9), bb = ri(2, 9), cc = k + bb, xx = d * k;
          return {
            q: 'Solve: x/' + d + ' + ' + bb + ' = ' + cc,
            ok: 'x = ' + xx,
            wrong: fill3('x = ' + xx, [
              { t: 'x = ' + k, d: 'You found x/' + d + ' = ' + k + ' — now MULTIPLY both sides by ' + d + ' to get x.' },
              { t: 'x = ' + (d * cc), d: 'Undo +' + bb + ' FIRST: x/' + d + ' = ' + cc + ' − ' + bb + ' = ' + k + ', then × ' + d + '.' },
              { t: 'x = ' + (xx - d), d: 'Check: (' + (xx - d) + ')/' + d + ' + ' + bb + ' = ' + (k - 1 + bb) + ' ≠ ' + cc + '.' }
            ], function () { return { t: 'x = ' + (xx + d), d: 'Check: (' + (xx + d) + ')/' + d + ' + ' + bb + ' = ' + (k + 1 + bb) + ' ≠ ' + cc + '.' }; }),
            steps: [
              'Subtract ' + bb + ': x/' + d + ' = ' + cc + ' − ' + bb + ' = ' + k,
              'Multiply both sides by ' + d + ': x = ' + k + ' × ' + d,
              'x = ' + xx + ' · Check: ' + xx + '/' + d + ' + ' + bb + ' = ' + cc + ' ✓'
            ]
          };
        }
        var b3 = ri(2, 5), x3 = ri(2, 9), c3 = ri(1, 9), a3 = b3 * x3 + c3;
        return {
          q: 'Solve: ' + a3 + ' − ' + b3 + 'x = ' + c3,
          ok: 'x = ' + x3,
          wrong: fill3('x = ' + x3, [
            { t: 'x = ' + (a3 - c3 - b3), d: 'You subtracted ' + b3 + ' instead of DIVIDING by it: ' + b3 + 'x = ' + a3 + ' − ' + c3 + ' = ' + (a3 - c3) + ', then ÷ ' + b3 + '.' },
            { t: 'x = ' + (x3 + 1), d: 'Check: ' + a3 + ' − ' + b3 + '(' + (x3 + 1) + ') = ' + (a3 - b3 * (x3 + 1)) + ' ≠ ' + c3 + '.' },
            (a3 + c3) % b3 === 0 ? { t: 'x = ' + ((a3 + c3) / b3), d: 'The ' + c3 + ' moves with a MINUS: ' + b3 + 'x = ' + a3 + ' − ' + c3 + ' = ' + (a3 - c3) + ' — not ' + a3 + ' + ' + c3 + '.' } : null
          ], function () { return { t: 'x = ' + (x3 - 1), d: 'Check: ' + a3 + ' − ' + b3 + '(' + (x3 - 1) + ') = ' + (a3 - b3 * (x3 - 1)) + ' ≠ ' + c3 + '.' }; }),
          steps: [
            'Isolate the x-term: ' + b3 + 'x = ' + a3 + ' − ' + c3 + ' = ' + (a3 - c3),
            'Divide both sides by ' + b3 + ': x = ' + (a3 - c3) + ' ÷ ' + b3,
            'x = ' + x3 + ' · Check: ' + a3 + ' − ' + b3 + '(' + x3 + ') = ' + c3 + ' ✓'
          ]
        };
      },
      medium: function () {
        var mode = ri(1, 4);
        if (mode === 1) {
          var a = ri(2, 5), x = ri(2, 9), b = ri(2, 9), c = b - a * x;
          return {
            q: 'Solve: −' + a + 'x + ' + b + ' = ' + n2s(c),
            ok: 'x = ' + x,
            wrong: fill3('x = ' + x, [
              { t: 'x = ' + (-x), d: 'Watch the double negative: −' + a + 'x = ' + n2s(c - b) + ', and ' + n2s(c - b) + ' ÷ (−' + a + ') = +' + x + '.' },
              { t: 'x = ' + (x + 1), d: 'Check: −' + a + '(' + (x + 1) + ') + ' + b + ' = ' + n2s(b - a * (x + 1)) + ' ≠ ' + n2s(c) + '.' },
              { t: 'x = ' + (x - 2), d: 'Check: −' + a + '(' + (x - 2) + ') + ' + b + ' = ' + n2s(b - a * (x - 2)) + ' ≠ ' + n2s(c) + '.' }
            ], function () { return { t: 'x = ' + (x + 2), d: 'Check: −' + a + '(' + (x + 2) + ') + ' + b + ' = ' + n2s(b - a * (x + 2)) + ' ≠ ' + n2s(c) + '.' }; }),
            steps: [
              'Subtract ' + b + ': −' + a + 'x = ' + n2s(c) + ' − ' + b + ' = ' + n2s(c - b),
              'Divide by −' + a + ': x = ' + n2s(c - b) + ' ÷ (−' + a + ')',
              'x = ' + x + ' · Check: −' + a + '(' + x + ') + ' + b + ' = ' + n2s(c) + ' ✓'
            ]
          };
        }
        if (mode === 2) {
          var a2 = pick([0.5, 1.5]), b2 = pick([3, 6, 9]), x2 = ri(2, 6) * 2, c2 = a2 * x2 + b2;
          var astr = a2 === 0.5 ? '0.5' : '1.5';
          return {
            q: 'Solve: ' + astr + 'x + ' + b2 + ' = ' + c2,
            ok: 'x = ' + x2,
            wrong: fill3('x = ' + x2, [
              { t: 'x = ' + ((c2 + b2) / a2), d: 'You ADDED ' + b2 + ' instead of subtracting: ' + c2 + ' − ' + b2 + ' = ' + (c2 - b2) + ', then ÷ ' + astr + '.' },
              { t: 'x = ' + (x2 + 2), d: 'Check: ' + astr + '(' + (x2 + 2) + ') + ' + b2 + ' = ' + (a2 * (x2 + 2) + b2) + ' ≠ ' + c2 + '.' },
              { t: 'x = ' + (x2 - 2), d: 'Check: ' + astr + '(' + (x2 - 2) + ') + ' + b2 + ' = ' + (a2 * (x2 - 2) + b2) + ' ≠ ' + c2 + '.' }
            ], function () { return { t: 'x = ' + (x2 + 4), d: 'Undo +' + b2 + ' first, then divide both sides by ' + astr + '.' }; }),
            steps: [
              'Subtract ' + b2 + ': ' + astr + 'x = ' + (c2 - b2),
              'Divide by ' + astr + ': x = ' + (c2 - b2) + ' ÷ ' + astr,
              'x = ' + x2 + ' · Check: ' + astr + '(' + x2 + ') + ' + b2 + ' = ' + c2 + ' ✓'
            ]
          };
        }
        if (mode === 3) {
          var R = ri(2, 6) * 5, F = ri(2, 10) * 10, m = ri(2, 9), T = R * m + F;
          var wrong1 = (T + F) % R === 0 ? { t: (T + F) / R + ' months', d: 'You ADDED the fee: ' + T + ' − ' + F + ' = ' + (T - F) + ', then ÷ ' + R + '.' } : null;
          return {
            q: 'A gym charges EGP ' + F + ' to join plus EGP ' + R + ' per month. Mona paid EGP ' + T + ' in total.<br>For how many months did she train? (Write and solve Rm + F = T)',
            ok: m + ' months',
            wrong: fill3(m + ' months', [
              { t: (m + R) + ' months', d: 'After ' + R + 'm = ' + (T - F) + ', DIVIDE by ' + R + ' — don\'t add it to the ' + m + '.' },
              wrong1,
              { t: (m + 1) + ' months', d: 'Check: ' + R + '(' + (m + 1) + ') + ' + F + ' = ' + (R * (m + 1) + F) + ' ≠ ' + T + '.' }
            ], function () { return { t: (m - 1) + ' months', d: 'Check: ' + R + '(' + (m - 1) + ') + ' + F + ' = ' + (R * (m - 1) + F) + ' ≠ ' + T + '.' }; }),
            steps: [
              'Equation: ' + R + 'm + ' + F + ' = ' + T,
              'Subtract ' + F + ': ' + R + 'm = ' + (T - F),
              'Divide by ' + R + ': m = ' + (T - F) + ' ÷ ' + R + ' = ' + m + ' months'
            ]
          };
        }
        var a4 = ri(2, 6), b4 = ri(2, 9), c4 = a4 * ri(2, 9) + b4;
        return {
          q: 'What is the FIRST step to solve ' + a4 + 'x + ' + b4 + ' = ' + c4 + '?',
          ok: 'Subtract ' + b4 + ' from both sides',
          wrong: [
            { t: 'Divide both sides by ' + a4, d: 'Undo the +' + b4 + ' FIRST — + and − are undone before × and ÷ when isolating x.' },
            { t: 'Add ' + b4 + ' to both sides', d: '+' + b4 + ' is undone by SUBTRACTING ' + b4 + ' — adding would give ' + a4 + 'x + ' + (2 * b4) + ' = ' + c4 + '.' },
            { t: 'Multiply both sides by ' + a4, d: 'The ' + a4 + ' MULTIPLIES x — it is undone by dividing, and only AFTER moving the +' + b4 + '.' }
          ],
          steps: [
            'Undo + / − first: subtract ' + b4 + ' → ' + a4 + 'x = ' + (c4 - b4),
            'Then undo × / ÷: divide by ' + a4,
            'x = ' + ((c4 - b4) / a4)
          ]
        };
      }
    }
  });

  /* ═══════════ 5-3 Solve Equations Using the Distributive Property ═══════════ */
  T5.lessons.push({
    id: 't5l3', code: '5-3', title: 'Solve Equations Using the Distributive Property',
    sub: 'Distribute first or divide first',
    calc: false,
    hintA: '🧭 With parentheses you have two ways: distribute the outside number to every term inside, OR divide both sides by it first — then finish like a two-step equation.',
    hintB: '👣 Quickest when the outside number divides the right side evenly? Divide first. And a negative outside flips BOTH signs: −2(x − 4) = −2x + 8.',
    guide: {
      key: 'When an equation has parentheses, either distribute first or divide both sides by the outside number. Then finish with the two-step equation steps.',
      rules: [
        { h: 'METHOD 1: DISTRIBUTE', b: '3(x + 2) = 15 → 3x + 6 = 15' },
        { h: 'METHOD 2: DIVIDE FIRST', b: '3(x + 2) = 15 → x + 2 = 5' },
        { h: 'NEGATIVE OUTSIDE', b: '−2(x − 4) = −2x + 8 — flips both signs' },
        { h: 'DISTRIBUTE TO EVERY TERM', b: '3(x + 4) = 3x + 12, NOT 3x + 4' }
      ],
      steps: ['Choose a method: distribute first or divide first', 'Remove the parentheses', 'Solve the two-step equation with inverse operations', 'Check by substituting into the ORIGINAL equation'],
      ex: [
        { t: '3(x + 2) = 15', s: ['Distribute: 3x + 6 = 15', 'Subtract 6: 3x = 9', 'Divide by 3: x = 3'] },
        { t: '−2(x − 4) = 6', s: ['Distribute −2: −2x + 8 = 6', 'Subtract 8: −2x = −2', 'Divide by −2: x = 1'] }
      ],
      try: ['2(x + 3) = 14', '5(y − 2) = 20', '−3(n + 1) = 9'],
      tryAns: ['x = 4', 'y = 6', 'n = −4']
    },
    gen: {
      easy: function () {
        var mode = ri(1, 2);
        if (mode === 1) {
          var a = ri(2, 9), b = ri(1, 9), x = ri(2, 9), c = a * (x + b);
          var distErr = (c - b) % a === 0 ? { t: 'x = ' + ((c - b) / a), d: 'The ' + a + ' multiplies BOTH numbers inside: ' + a + '(x + ' + b + ') = ' + a + 'x + ' + (a * b) + ' — not ' + a + 'x + ' + b + '.' } : null;
          return {
            q: 'Solve: ' + a + '(x + ' + b + ') = ' + c,
            ok: 'x = ' + x,
            wrong: fill3('x = ' + x, [
              { t: 'x = ' + (x + 2 * b), d: 'Divide first: x + ' + b + ' = ' + (x + b) + '. Then SUBTRACT ' + b + ': x = ' + x + ' — don\'t add it.' },
              distErr,
              { t: 'x = ' + (x + 1), d: 'Check: ' + a + '(' + (x + 1) + ' + ' + b + ') = ' + (a * (x + 1 + b)) + ' ≠ ' + c + '.' }
            ], function () { return { t: 'x = ' + (x - 1), d: 'Check: ' + a + '(' + (x - 1) + ' + ' + b + ') = ' + (a * (x - 1 + b)) + ' ≠ ' + c + '.' }; }),
            steps: [
              'Divide both sides by ' + a + ': x + ' + b + ' = ' + (x + b),
              'Subtract ' + b + ': x = ' + (x + b) + ' − ' + b,
              'x = ' + x + ' · Check: ' + a + '(' + x + ' + ' + b + ') = ' + c + ' ✓'
            ]
          };
        }
        var a2 = ri(2, 9), b2 = ri(1, 5), x2 = 2 * b2 + ri(1, 9), c2 = a2 * (x2 - b2);
        return {
          q: 'Solve: ' + a2 + '(x − ' + b2 + ') = ' + c2,
          ok: 'x = ' + x2,
          wrong: fill3('x = ' + x2, [
            { t: 'x = ' + (x2 - 2 * b2), d: 'Divide first: x − ' + b2 + ' = ' + (x2 - b2) + '. Then ADD ' + b2 + ': x = ' + x2 + ' — don\'t subtract it.' },
            { t: 'x = ' + (x2 + 1), d: 'Check: ' + a2 + '(' + (x2 + 1) + ' − ' + b2 + ') = ' + (a2 * (x2 + 1 - b2)) + ' ≠ ' + c2 + '.' },
            (c2 + b2) % a2 === 0 ? { t: 'x = ' + ((c2 + b2) / a2), d: 'After dividing by ' + a2 + ', the equation is x − ' + b2 + ' = ' + (x2 - b2) + ' — the ' + b2 + ' moves with a PLUS.' } : null
          ], function () { return { t: 'x = ' + (x2 - 1), d: 'Check: ' + a2 + '(' + (x2 - 1) + ' − ' + b2 + ') = ' + (a2 * (x2 - 1 - b2)) + ' ≠ ' + c2 + '.' }; }),
          steps: [
            'Divide both sides by ' + a2 + ': x − ' + b2 + ' = ' + (x2 - b2),
            'Add ' + b2 + ': x = ' + (x2 - b2) + ' + ' + b2,
            'x = ' + x2 + ' · Check: ' + a2 + '(' + x2 + ' − ' + b2 + ') = ' + c2 + ' ✓'
          ]
        };
      },
      medium: function () {
        var mode = ri(1, 5);
        if (mode === 1) {
          var a = ri(2, 6), b = ri(1, 6), x = ri(2, 9), c = ri(1, 9), d = a * (x + b) + c;
          return {
            q: 'Solve: ' + a + '(x + ' + b + ') + ' + c + ' = ' + d,
            ok: 'x = ' + x,
            wrong: fill3('x = ' + x, [
              (d - a * b) % a === 0 ? { t: 'x = ' + ((d - a * b) / a), d: 'The +' + c + ' is OUTSIDE — undo it before the parentheses: subtract ' + c + ' first.' } : null,
              (d - b - c) % a === 0 ? { t: 'x = ' + ((d - b - c) / a), d: 'The ' + a + ' multiplies BOTH numbers inside: ' + a + '(x + ' + b + ') = ' + a + 'x + ' + (a * b) + ' — not ' + a + 'x + ' + b + '.' } : null,
              { t: 'x = ' + (x + 1), d: 'Check: ' + a + '(' + (x + 1) + ' + ' + b + ') + ' + c + ' = ' + (a * (x + 1 + b) + c) + ' ≠ ' + d + '.' }
            ], function () { return { t: 'x = ' + (x - 1), d: 'Expand ' + a + '(x + ' + b + ') = ' + a + 'x + ' + (a * b) + ' first, then undo +' + (a * b + c) + '.' }; }),
            steps: [
              'Distribute: ' + a + 'x + ' + (a * b) + ' + ' + c + ' = ' + d,
              'Combine: ' + a + 'x + ' + (a * b + c) + ' = ' + d,
              'Subtract ' + (a * b + c) + ': ' + a + 'x = ' + (d - a * b - c) + ' → x = ' + x
            ]
          };
        }
        if (mode === 2) {
          var a2 = ri(2, 4), b2 = ri(2, 4), c2 = ri(1, 5), x2 = ri(2, 9), d2 = a2 * (b2 * x2 - c2);
          return {
            q: 'Solve: ' + a2 + '(' + b2 + 'x − ' + c2 + ') = ' + d2,
            ok: 'x = ' + x2,
            wrong: fill3('x = ' + x2, [
              { t: 'x = ' + ((d2 + a2 * c2) / a2), d: 'Divide by the FULL coefficient of x (' + (a2 * b2) + '), not just ' + a2 + ' — expand first: ' + (a2 * b2) + 'x − ' + (a2 * c2) + ' = ' + d2 + '.' },
              { t: 'x = ' + (x2 + 1), d: 'Check: ' + a2 + '(' + b2 + '(' + (x2 + 1) + ') − ' + c2 + ') = ' + (a2 * (b2 * (x2 + 1) - c2)) + ' ≠ ' + d2 + '.' },
              (d2 + c2) % (a2 * b2) === 0 ? { t: 'x = ' + ((d2 + c2) / (a2 * b2)), d: 'The ' + a2 + ' multiplies the ' + c2 + ' too: ' + a2 + ' × ' + c2 + ' = ' + (a2 * c2) + ' — undo that.' } : null
            ], function () { return { t: 'x = ' + (x2 - 1), d: 'Distribute ' + a2 + ' to BOTH terms: ' + (a2 * b2) + 'x − ' + (a2 * c2) + ' = ' + d2 + '.' }; }),
            steps: [
              'Distribute: ' + (a2 * b2) + 'x − ' + (a2 * c2) + ' = ' + d2,
              'Add ' + (a2 * c2) + ': ' + (a2 * b2) + 'x = ' + (d2 + a2 * c2),
              'Divide by ' + (a2 * b2) + ': x = ' + x2
            ]
          };
        }
        if (mode === 3) {
          var a3 = ri(2, 4), b3 = ri(1, 6), x3 = -ri(2, 9), c3 = a3 * (b3 - x3);
          return {
            q: 'Solve: −' + a3 + '(x − ' + b3 + ') = ' + c3,
            ok: 'x = ' + x3,
            wrong: fill3('x = ' + x3, [
              { t: 'x = ' + (-x3), d: 'Watch the negative divisor: −' + a3 + 'x = ' + (c3 - a3 * b3) + ', and ' + (c3 - a3 * b3) + ' ÷ (−' + a3 + ') = ' + x3 + '.' },
              { t: 'x = ' + (2 * b3 - x3), d: 'Distribute the −' + a3 + ' to BOTH terms: −' + a3 + 'x + ' + (a3 * b3) + ' = ' + c3 + ' — the −' + a3 + ' × (−' + b3 + ') gives +' + (a3 * b3) + '.' },
              { t: 'x = ' + (x3 + 1), d: 'Check: −' + a3 + '(' + (x3 + 1) + ' − ' + b3 + ') = ' + (-a3 * (x3 + 1 - b3)) + ' ≠ ' + c3 + '.' }
            ], function () { return { t: 'x = ' + (x3 - 1), d: 'Check: −' + a3 + '(' + (x3 - 1) + ' − ' + b3 + ') = ' + (-a3 * (x3 - 1 - b3)) + ' ≠ ' + c3 + '.' }; }),
            steps: [
              'Distribute −' + a3 + ': −' + a3 + 'x + ' + (a3 * b3) + ' = ' + c3,
              'Subtract ' + (a3 * b3) + ': −' + a3 + 'x = ' + (c3 - a3 * b3),
              'Divide by −' + a3 + ': x = ' + x3
            ]
          };
        }
        if (mode === 4) {
          var b4 = ri(2, 6), c4 = ri(2, 9);
          var x4 = c4 + b4;
          return {
            q: 'Solve: ½(x + ' + (2 * b4) + ') = ' + c4,
            ok: 'x = ' + (2 * (c4 - b4)),
            wrong: fill3('x = ' + (2 * (c4 - b4)), [
              { t: 'x = ' + (2 * (c4 + b4)), d: 'After × 2: x + ' + (2 * b4) + ' = ' + (2 * c4) + ' — SUBTRACT ' + (2 * b4) + ', don\'t add it.' },
              { t: 'x = ' + (c4 - b4), d: 'Multiply BOTH sides by 2 FIRST: x + ' + (2 * b4) + ' = ' + (2 * c4) + ', then subtract ' + (2 * b4) + '.' },
              { t: 'x = ' + (2 * (c4 - b4) + 2), d: 'Check: ½(' + (2 * (c4 - b4) + 2) + ' + ' + (2 * b4) + ') = ' + (c4 + 1) + ' ≠ ' + c4 + '.' }
            ], function () { return { t: 'x = ' + (2 * (c4 - b4) - 2), d: 'Check: ½(' + (2 * (c4 - b4) - 2) + ' + ' + (2 * b4) + ') = ' + (c4 - 1) + ' ≠ ' + c4 + '.' }; }),
            steps: [
              'Multiply both sides by 2: x + ' + (2 * b4) + ' = ' + (2 * c4),
              'Subtract ' + (2 * b4) + ': x = ' + (2 * c4) + ' − ' + (2 * b4),
              'x = ' + (2 * (c4 - b4)) + ' · Check: ½(' + (2 * (c4 - b4)) + ' + ' + (2 * b4) + ') = ' + c4 + ' ✓'
            ]
          };
        }
        var a5 = ri(2, 5), b5 = ri(2, 6), x5 = ri(2, 9), R5 = a5 * (x5 + b5);
        return {
          q: 'Salma solved ' + a5 + '(x + ' + b5 + ') = ' + R5 + ' like this:<br>' + a5 + 'x + ' + b5 + ' = ' + R5 + ' , ' + a5 + 'x = ' + (R5 - b5) + '<br>What was her mistake?',
          ok: 'She forgot to distribute the ' + a5 + ' to the +' + b5,
          wrong: [
            { t: 'She should have divided by ' + b5 + ' first', d: 'Dividing first is allowed — but by ' + a5 + ' (the outside number), and she never divided: she kept ' + a5 + 'x + ' + b5 + '.' },
            { t: 'She moved the ' + b5 + ' to the wrong side', d: 'The ' + b5 + ' never moved — the real problem is that it was never multiplied by ' + a5 + '. The correct line is ' + a5 + 'x + ' + (a5 * b5) + ' = ' + R5 + '.' },
            { t: 'The equation has no solution', d: 'It has one: ' + a5 + 'x + ' + (a5 * b5) + ' = ' + R5 + ' → ' + a5 + 'x = ' + (R5 - a5 * b5) + ' → x = ' + x5 + '.' }
          ],
          steps: [
            'Distribute to EVERY term inside: ' + a5 + '(x + ' + b5 + ') = ' + a5 + 'x + ' + (a5 * b5),
            'Now solve: ' + a5 + 'x = ' + (R5 - a5 * b5),
            'Divide by ' + a5 + ': x = ' + x5
          ]
        };
      }
    }
  });

  /* ═══════════ 5-4 Solve Inequalities Using Addition or Subtraction ═══════════ */
  T5.lessons.push({
    id: 't5l4', code: '5-4', title: 'Solve Inequalities Using Addition or Subtraction',
    sub: 'Symbols · Open and closed circles · Graphing',
    calc: false,
    hintA: '🧭 Solve it like an equation: add or subtract the same number on both sides — the sign STAYS the same.',
    hintB: '👣 < and > get an OPEN circle ○ · ≤ and ≥ get a CLOSED circle ●. Shade right for > / ≥, left for < / ≤.',
    guide: {
      key: 'An inequality compares quantities with <, >, ≤ or ≥. Solve it like an equation: adding or subtracting the same number on both sides does not change the sign.',
      rules: [
        { h: 'SYMBOLS', b: '< less than · > greater than · ≤ less or equal · ≥ greater or equal' },
        { h: 'OPEN / CLOSED', b: '< or > → open circle ○ · ≤ or ≥ → closed circle ●' },
        { h: 'SAME SIGN RULE', b: 'add or subtract on both sides → the sign STAYS' },
        { h: 'GRAPH', b: 'shade right for > / ≥ · shade left for < / ≤' }
      ],
      steps: ['Undo + or −: do the same to both sides (the sign stays)', 'Write the solution with the SAME sign', 'Graph: open or closed circle, then shade', 'Check with one value from the shaded part'],
      ex: [
        { t: 'x + 4 > 9', s: ['Subtract 4: x > 5', 'Open circle at 5, shade right', 'Check x = 6: 6 + 4 = 10 > 9 ✓'] },
        { t: 'n + 7 < 3', s: ['Subtract 7: n < −4', 'Open circle at −4, shade left', 'Check n = −5: −5 + 7 = 2 < 3 ✓'] }
      ],
      try: ['x + 6 ≥ 10', 'y − 5 < 1', 'n + 8 ≤ 3'],
      tryAns: ['x ≥ 4', 'y < 6', 'n ≤ −5']
    },
    gen: {
      easy: function () {
        var mode = ri(1, 3);
        if (mode === 1) {
          var S = pick(SYMS), b = ri(2, 9), x = ri(2, 9), c = x + b;
          return {
            q: 'Solve: x + ' + b + ' ' + S + ' ' + c,
            ok: 'x ' + S + ' ' + x,
            wrong: [
              { t: 'x ' + flipS(S) + ' ' + x, d: 'Adding or subtracting on both sides does NOT flip the sign — it stays ' + S + '.' },
              { t: 'x ' + S + ' ' + c, d: 'Subtract ' + b + ' from ' + c + ': ' + c + ' − ' + b + ' = ' + x + '.' },
              { t: 'x ' + flipS(S) + ' ' + c, d: 'Subtract ' + b + ' on both sides AND keep the sign ' + S + ': x ' + S + ' ' + x + '.' }
            ],
            steps: [
              'Subtract ' + b + ' from both sides (the sign stays ' + S + ')',
              'x ' + S + ' ' + c + ' − ' + b,
              'x ' + S + ' ' + x
            ]
          };
        }
        if (mode === 2) {
          var S2 = pick(SYMS), n2 = ri(-4, 9);
          var closed = !openS(S2);
          var dir = (S2 === '<' || S2 === '≤') ? 'LEFT' : 'RIGHT';
          return {
            q: 'A number line shows a ' + (closed ? 'CLOSED' : 'OPEN') + ' circle at ' + n2 + ' with shading to the ' + dir + '.<br>Which inequality matches the graph?',
            ok: 'x ' + S2 + ' ' + n2,
            wrong: [
              { t: 'x ' + flipS(S2) + ' ' + n2, d: 'Shading to the ' + dir.toLowerCase() + ' of ' + n2 + ' means the solutions are ' + (dir === 'LEFT' ? 'smaller' : 'bigger') + ' than ' + n2 + ' → the symbol must be ' + S2 + ', not ' + flipS(S2) + '.' },
              { t: 'x ' + tightS(S2) + ' ' + n2, d: 'A ' + (closed ? 'CLOSED ●' : 'OPEN ○') + ' circle at ' + n2 + ' means ' + n2 + ' itself is ' + (closed ? 'INCLUDED (≤ or ≥)' : 'NOT included (< or >)') + ' → the symbol is ' + S2 + '.' },
              { t: 'x ' + flipS(tightS(S2)) + ' ' + n2, d: 'Two fixes: the shading ' + dir.toLowerCase() + ' of ' + n2 + ' gives ' + S2 + ', and the ' + (closed ? 'closed' : 'open') + ' circle keeps it as ' + S2 + '.' }
            ],
            steps: [
              'Circle: ' + (closed ? 'CLOSED ● → ≤ or ≥' : 'OPEN ○ → < or >'),
              'Shading: to the ' + dir + ' → ' + (dir === 'LEFT' ? '< or ≤' : '> or ≥'),
              'Both together → x ' + S2 + ' ' + n2
            ]
          };
        }
        var V = pick([
          { w: 'at most', ok: '≤' }, { w: 'at least', ok: '≥' }, { w: 'more than', ok: '>' },
          { w: 'fewer than', ok: '<' }, { w: 'no more than', ok: '≤' }, { w: 'no less than', ok: '≥' },
          { w: 'below', ok: '<' }, { w: 'above', ok: '>' }
        ]);
        var others = SYMS.filter(function (s) { return s !== V.ok; });
        return {
          q: 'Which symbol means "' + V.w + '"?',
          ok: V.ok,
          wrong: others.map(function (s) {
            return { t: s, d: symWord(s) + ' — e.g. "x ' + s + ' 5" reads: x is ' + symWord(s) + ' 5. That is not the same as "' + V.w + '".' };
          }),
          steps: [
            '"at most" / "no more than" → ≤ (the limit itself is allowed)',
            '"at least" / "no less than" → ≥ (the limit itself is allowed)',
            '"' + V.w + '" → ' + V.ok
          ]
        };
      },
      medium: function () {
        var mode = ri(1, 3);
        if (mode === 1) {
          var S = pick(SYMS), b = ri(3, 9), x = -ri(1, 9), c = x + b;
          var swap = Math.random() < 0.5;
          var qTxt = swap ? (b + ' + x ' + S + ' ' + n2s(c)) : ('x + ' + b + ' ' + S + ' ' + n2s(c));
          return {
            q: 'Solve: ' + qTxt,
            ok: 'x ' + S + ' ' + n2s(x),
            wrong: [
              { t: 'x ' + flipS(S) + ' ' + n2s(x), d: 'Adding or subtracting on both sides keeps the sign ' + S + ' — it does NOT flip.' },
              { t: 'x ' + S + ' ' + n2s(c + b), d: 'Moving the +' + b + ' to the other side SUBTRACTS it: ' + n2s(c) + ' − ' + b + ' = ' + n2s(x) + '.' },
              { t: 'x ' + flipS(S) + ' ' + n2s(c + b), d: 'Subtract ' + b + ': ' + n2s(c) + ' − ' + b + ' = ' + n2s(x) + ', and keep the sign ' + S + '.' }
            ],
            steps: [
              'Subtract ' + b + ' from both sides (the sign stays ' + S + ')',
              'x ' + S + ' ' + n2s(c) + ' − ' + b,
              'x ' + S + ' ' + n2s(x)
            ]
          };
        }
        if (mode === 2) {
          var S2 = pick(['>', '≥']), b2 = ri(2, 9), t2 = ri(4, 12), c2 = t2 - b2;
          var v2 = pick([t2 + 1, t2, t2 - 1]);
          var val2 = v2 - b2;
          var isSol = val2 > c2 || (S2 === '≥' && val2 === c2);
          var yes = 'Yes — ' + v2 + ' − ' + b2 + ' = ' + val2 + ' and ' + val2 + ' ' + S2 + ' ' + c2 + ' is true';
          var no = 'No — ' + v2 + ' − ' + b2 + ' = ' + val2 + ' and ' + val2 + ' ' + S2 + ' ' + c2 + ' is false';
          return {
            q: 'Is x = ' + v2 + ' a solution of x − ' + b2 + ' ' + S2 + ' ' + c2 + '?',
            ok: isSol ? yes : no,
            wrong: [
              { t: isSol ? no : yes, d: 'Substitute and compare: ' + v2 + ' − ' + b2 + ' = ' + val2 + ', and ' + val2 + ' ' + S2 + ' ' + c2 + ' is ' + (isSol ? 'TRUE' : 'FALSE') + '.' },
              { t: 'Yes — any value of x is a solution', d: 'An inequality has MANY solutions, but not every number: here x must be ' + symWord(S2) + ' ' + (c2 + b2) + '.' },
              { t: 'No — inequalities never have whole-number solutions', d: 'They do! The question is only about x = ' + v2 + ': ' + val2 + ' ' + S2 + ' ' + c2 + ' is ' + (isSol ? 'true' : 'false') + '.' }
            ],
            steps: [
              'Substitute x = ' + v2 + ': ' + v2 + ' − ' + b2 + ' = ' + val2,
              'Compare: ' + val2 + ' ' + S2 + ' ' + c2 + ' → ' + (isSol ? 'true ✓' : 'false ✗'),
              (isSol ? 'So x = ' + v2 + ' IS a solution' : 'So x = ' + v2 + ' is NOT a solution')
            ]
          };
        }
        var W = shuffle([
          (function () {
            var S3 = ri(3, 8) * 5, C3 = S3 + ri(2, 8) * 5;
            return {
              q: 'Ali has saved EGP ' + S3 + '. A game costs EGP ' + C3 + '. He saves the extra money e.<br>Write and solve the inequality for e.',
              ok: 'e ≥ ' + (C3 - S3),
              ws: [
                { t: 'e ≤ ' + (C3 - S3), d: '"To afford it" means at LEAST the full price → ≥ (more saving is fine, less is not).' },
                { t: 'e ≥ ' + (C3 + S3), d: 'Subtract: ' + C3 + ' − ' + S3 + ' = ' + (C3 - S3) + ' — the savings reduce what is still needed.' },
                { t: 'e > ' + (C3 - S3), d: 'Saving exactly ' + (C3 - S3) + ' more reaches the price exactly, and that is enough → ≥.' }
              ],
              st: ['He needs the total to reach at least ' + C3 + ': ' + S3 + ' + e ≥ ' + C3, 'Subtract ' + S3 + ': e ≥ ' + C3 + ' − ' + S3, 'e ≥ ' + (C3 - S3)]
            };
          })(),
          (function () {
            var K = pick([400, 500, 600]), I = pick([130, 210, 260]);
            return {
              q: 'An elevator can carry at most ' + K + ' kg. The people inside weigh ' + I + ' kg in total.<br>How much more weight w can be added?',
              ok: 'w ≤ ' + (K - I),
              ws: [
                { t: 'w ≥ ' + (K - I), d: '"AT MOST" sets a ceiling → ≤ (adding more would overload it).' },
                { t: 'w ≤ ' + (K + I), d: 'Subtract: ' + K + ' − ' + I + ' = ' + (K - I) + ' — the people already inside use up part of the limit.' },
                { t: 'w < ' + (K - I), d: 'Adding exactly ' + (K - I) + ' kg reaches the limit, which is allowed → ≤.' }
              ],
              st: ['At most ' + K + ' kg total: ' + I + ' + w ≤ ' + K, 'Subtract ' + I + ': w ≤ ' + K + ' − ' + I, 'w ≤ ' + (K - I) + ' kg']
            };
          })(),
          (function () {
            var B = ri(3, 8) * 3, Cap = B + ri(2, 8) * 2;
            return {
              q: 'At 9 a.m. the temperature is ' + B + ' °C. It must stay BELOW ' + Cap + ' °C.<br>Which inequality gives the allowed rise t?',
              ok: 't < ' + (Cap - B),
              ws: [
                { t: 't ≤ ' + (Cap - B), d: '"BELOW" is strict — reaching exactly ' + Cap + ' °C is not allowed → <.' },
                { t: 't > ' + (Cap - B), d: 'The rise must stay under ' + (Cap - B) + ' °C → t < ' + (Cap - B) + '.' },
                { t: 't < ' + (Cap + B), d: 'Subtract: ' + Cap + ' − ' + B + ' = ' + (Cap - B) + ' — start from the current temperature.' }
              ],
              st: [B + ' + t < ' + Cap, 'Subtract ' + B + ': t < ' + Cap + ' − ' + B, 't < ' + (Cap - B) + ' °C']
            };
          })()
        ])[0];
        return { q: W.q, ok: W.ok, wrong: W.ws, steps: W.st };
      }
    }
  });

  /* ═══════════ 5-5 Solve Inequalities Using Multiplication or Division ═══════════ */
  T5.lessons.push({
    id: 't5l5', code: '5-5', title: 'Solve Inequalities Using Multiplication or Division',
    sub: 'Flip the sign when you multiply or divide by a negative',
    calc: false,
    hintA: '🧭 Multiply or divide both sides by the same number. If that number is NEGATIVE, you must FLIP the inequality sign.',
    hintB: '👣 Why flip? 2 < 5, but (−1)(2) > (−1)(5) — multiplying by a negative reverses the order. Always ask: did I touch a negative?',
    guide: {
      key: 'To solve with multiplication or division, do the same to both sides. If you multiply or divide by a negative number, you must flip the inequality sign.',
      rules: [
        { h: 'POSITIVE NUMBER', b: '3x < 12 → x < 4 (keep the sign)' },
        { h: 'NEGATIVE NUMBER', b: '−2x < 12 → x > −6 (FLIP the sign)' },
        { h: 'WHY FLIP?', b: '2 < 5 but (−1)(2) > (−1)(5) — order reverses' },
        { h: 'ALWAYS ASK', b: 'did I multiply or divide by a negative? If yes, FLIP' }
      ],
      steps: ['Undo × or ÷: do the same to both sides', 'Negative number? FLIP the sign', 'Write the solution', 'Graph and check with one value'],
      ex: [
        { t: '−3x > 12', s: ['Divide by −3 and FLIP', 'x < −4', 'Check x = −5: −3(−5) = 15 > 12 ✓'] },
        { t: 'x/3 < 2', s: ['Multiply by 3: x < 6', 'Open circle at 6, shade left', 'Check x = 0: 0/3 = 0 < 2 ✓'] }
      ],
      try: ['5x > 30', 'n/2 ≤ 4', '−4y ≥ 16'],
      tryAns: ['x > 6', 'n ≤ 8', 'y ≤ −4']
    },
    gen: {
      easy: function () {
        var mode = ri(1, 3);
        if (mode === 1) {
          var S = pick(SYMS), a = ri(2, 9), x = ri(2, 9), c = a * x;
          return {
            q: 'Solve: ' + a + 'x ' + S + ' ' + c,
            ok: 'x ' + S + ' ' + x,
            wrong: [
              { t: 'x ' + flipS(S) + ' ' + x, d: 'Dividing by the POSITIVE ' + a + ' keeps the sign ' + S + ' — no flip here.' },
              { t: 'x ' + S + ' ' + c, d: 'Divide both sides: ' + c + ' ÷ ' + a + ' = ' + x + '.' },
              { t: 'x ' + flipS(S) + ' ' + c, d: 'Divide ' + c + ' ÷ ' + a + ' = ' + x + ' and keep the sign ' + S + '.' }
            ],
            steps: [
              'Divide both sides by ' + a + ' (positive → the sign stays ' + S + ')',
              'x ' + S + ' ' + c + ' ÷ ' + a,
              'x ' + S + ' ' + x
            ]
          };
        }
        if (mode === 2) {
          var S2 = pick(SYMS), d2 = ri(2, 6), k2 = ri(2, 9), x2 = d2 * k2;
          return {
            q: 'Solve: x/' + d2 + ' ' + S2 + ' ' + k2,
            ok: 'x ' + S2 + ' ' + x2,
            wrong: [
              { t: 'x ' + S2 + ' ' + k2, d: 'You stopped at x/' + d2 + ' — MULTIPLY both sides by ' + d2 + ': ' + k2 + ' × ' + d2 + ' = ' + x2 + '.' },
              { t: 'x ' + flipS(S2) + ' ' + x2, d: 'Multiplying by the POSITIVE ' + d2 + ' keeps the sign ' + S2 + '.' },
              { t: 'x ' + flipS(S2) + ' ' + k2, d: 'Multiply ' + k2 + ' × ' + d2 + ' = ' + x2 + ' and keep the sign ' + S2 + '.' }
            ],
            steps: [
              'Multiply both sides by ' + d2 + ' (positive → the sign stays ' + S2 + ')',
              'x ' + S2 + ' ' + k2 + ' × ' + d2,
              'x ' + S2 + ' ' + x2
            ]
          };
        }
        var a3 = ri(2, 5), m3 = ri(2, 6), c3 = a3 * m3;
        return {
          q: 'Solve: −' + a3 + 'x < ' + c3,
          ok: 'x > −' + m3,
          wrong: [
            { t: 'x < −' + m3, d: 'Dividing by the NEGATIVE −' + a3 + ' FLIPS the sign: < becomes >.' },
            { t: 'x > ' + m3, d: 'Divide first: ' + c3 + ' ÷ (−' + a3 + ') = −' + m3 + ' — the value keeps the negative sign.' },
            { t: 'x < ' + m3, d: 'Divide ' + c3 + ' ÷ (−' + a3 + ') = −' + m3 + ', and FLIP < to >: x > −' + m3 + '.' }
          ],
          steps: [
            'Divide both sides by −' + a3,
            'Negative divisor → FLIP the sign: < becomes >',
            'x > ' + c3 + ' ÷ (−' + a3 + ') = −' + m3
          ]
        };
      },
      medium: function () {
        var mode = ri(1, 4);
        if (mode === 1) {
          var S = pick(SYMS), a = ri(2, 5), m = ri(2, 9), c = a * m;
          return {
            q: 'Solve: −' + a + 'x ' + S + ' ' + c,
            ok: 'x ' + flipS(S) + ' −' + m,
            wrong: [
              { t: 'x ' + S + ' −' + m, d: 'Dividing by the NEGATIVE −' + a + ' requires a FLIP: ' + S + ' becomes ' + flipS(S) + '.' },
              { t: 'x ' + flipS(S) + ' ' + m, d: 'Divide ' + c + ' ÷ (−' + a + ') = −' + m + ' — the negative sign stays with the number.' },
              { t: 'x ' + S + ' ' + m, d: 'Divide ' + c + ' ÷ (−' + a + ') = −' + m + ' AND flip ' + S + ' → ' + flipS(S) + '.' }
            ],
            steps: [
              'Divide both sides by −' + a,
              'Negative divisor → FLIP: ' + S + ' becomes ' + flipS(S),
              'x ' + flipS(S) + ' ' + c + ' ÷ (−' + a + ') = −' + m
            ]
          };
        }
        if (mode === 2) {
          var S2 = pick(SYMS), d2 = ri(2, 6), k2 = ri(2, 9), big2 = d2 * k2;
          return {
            q: 'Solve: −x/' + d2 + ' ' + S2 + ' ' + k2,
            ok: 'x ' + flipS(S2) + ' −' + big2,
            wrong: [
              { t: 'x ' + S2 + ' −' + big2, d: 'Multiplying by the NEGATIVE −' + d2 + ' requires a FLIP: ' + S2 + ' becomes ' + flipS(S2) + '.' },
              { t: 'x ' + flipS(S2) + ' ' + big2, d: 'Multiply ' + k2 + ' × ' + d2 + ' = ' + big2 + ' — the negative stays: −' + big2 + '.' },
              { t: 'x ' + flipS(S2) + ' −' + k2, d: 'Multiply BOTH sides by ' + d2 + ': ' + k2 + ' × ' + d2 + ' = ' + big2 + ', and flip ' + S2 + ' → ' + flipS(S2) + '.' }
            ],
            steps: [
              'Multiply both sides by −' + d2,
              'Negative multiplier → FLIP: ' + S2 + ' becomes ' + flipS(S2),
              'x ' + flipS(S2) + ' −(' + k2 + ' × ' + d2 + ') = −' + big2
            ]
          };
        }
        if (mode === 3) {
          var a3 = ri(2, 5), m3 = ri(2, 9), c3 = a3 * m3;
          var name3 = pick(['Karim', 'Nour', 'Omar', 'Dina', 'Salma']);
          return {
            q: name3 + ' solved −' + a3 + 'x > ' + c3 + ' and wrote "x > −' + m3 + '".<br>What is the correct solution?',
            ok: 'x < −' + m3,
            wrong: [
              { t: 'x > −' + m3, d: 'That is ' + name3 + '\'s answer — dividing by the negative −' + a3 + ' REQUIRES a flip: > becomes <.' },
              { t: 'x < ' + m3, d: 'The division is right (' + c3 + ' ÷ (−' + a3 + ') = −' + m3 + ') — only the sign must flip to <.' },
              { t: 'x > ' + m3, d: 'Divide ' + c3 + ' ÷ (−' + a3 + ') = −' + m3 + ' and flip > to <: x < −' + m3 + '.' }
            ],
            steps: [
              'Divide both sides by −' + a3 + ': ' + c3 + ' ÷ (−' + a3 + ') = −' + m3,
              'Negative divisor → FLIP > to <',
              'x < −' + m3 + ' · Check x = −' + (m3 + 1) + ': −' + a3 + '(−' + (m3 + 1) + ') = ' + (a3 * (m3 + 1)) + ' > ' + c3 + ' ✓'
            ]
          };
        }
        var W = shuffle([
          (function () {
            var p = ri(2, 6) * 5, n = ri(3, 9), M = p * n;
            return {
              q: 'Each ticket costs EGP ' + p + '. Mona has EGP ' + M + '. How many tickets t can she buy?',
              ok: 't ≤ ' + n,
              ws: [
                { t: 't ≥ ' + n, d: '"Can buy" sets a maximum → ≤ (fewer is fine, more is not affordable).' },
                { t: 't < ' + n, d: 'Buying exactly ' + n + ' tickets costs exactly EGP ' + M + ' — that is allowed → ≤.' },
                { t: 't ≤ ' + (n + 1), d: 'Divide: ' + M + ' ÷ ' + p + ' = ' + n + ' — not one ticket more.' }
              ],
              st: [p + 't ≤ ' + M, 'Divide by ' + p + ' (positive → sign stays): t ≤ ' + M + ' ÷ ' + p, 't ≤ ' + n + ' tickets']
            };
          })(),
          (function () {
            var w = pick([0.5, 1.5, 2.5]), n = ri(3, 8), cap = w * n;
            var wtxt = (w === 0.5 ? '0.5' : (w === 1.5 ? '1.5' : '2.5'));
            var capTxt = (w === 0.5 ? n / 2 : (w === 1.5 ? n * 1.5 : n * 2.5));
            return {
              q: 'A bag can hold at most ' + capTxt + ' kg. Each book weighs ' + wtxt + ' kg. How many books b fit?',
              ok: 'b ≤ ' + n,
              ws: [
                { t: 'b ≥ ' + n, d: '"At most" sets a maximum → ≤.' },
                { t: 'b < ' + n, d: 'Exactly ' + n + ' books weigh exactly ' + capTxt + ' kg — allowed → ≤.' },
                { t: 'b ≤ ' + (n + 1), d: 'Divide: ' + capTxt + ' ÷ ' + wtxt + ' = ' + n + ' — check: ' + (n + 1) + ' × ' + wtxt + ' = ' + ((n + 1) * w) + ' kg > ' + capTxt + ' kg.' }
              ],
              st: [wtxt + 'b ≤ ' + capTxt, 'Divide by ' + wtxt + ': b ≤ ' + capTxt + ' ÷ ' + wtxt, 'b ≤ ' + n + ' books']
            };
          })(),
          (function () {
            var a = ri(2, 4), m = ri(4, 9), depth = a * m;
            return {
              q: 'A diver\'s depth after m minutes is −' + a + 'm meters. The diver is at least ' + depth + ' m deep when −' + a + 'm ≤ −' + depth + '. Solve.',
              ok: 'm ≥ ' + m,
              ws: [
                { t: 'm ≤ ' + m, d: 'Dividing by the NEGATIVE −' + a + ' flips ≤ to ≥.' },
                { t: 'm ≥ ' + (-m), d: 'Divide −' + depth + ' ÷ (−' + a + ') = +' + m + ' — the double negative gives a positive.' },
                { t: 'm ≤ ' + (-m), d: 'Divide −' + depth + ' ÷ (−' + a + ') = ' + m + ' and FLIP ≤ to ≥: m ≥ ' + m + '.' }
              ],
              st: ['−' + a + 'm ≤ −' + depth, 'Divide by −' + a + ' → FLIP: m ≥ ' + depth + ' ÷ ' + a, 'm ≥ ' + m + ' minutes (deeper takes longer)']
            };
          })(),
          (function () {
            var f = ri(3, 6), E = ri(2, 6) * 5, tot = f * E;
            return {
              q: f + ' friends share the cost c of a trip equally. Each pays at most EGP ' + E + ': c/' + f + ' ≤ ' + E + '. What is the maximum cost of the trip?',
              ok: 'c ≤ ' + tot,
              ws: [
                { t: 'c ≤ ' + (E + f), d: 'Multiply: ' + E + ' × ' + f + ' = ' + tot + ' — the whole cost is shared.' },
                { t: 'c ≥ ' + tot, d: '"At most" gives a ceiling → ≤.' },
                { t: 'c < ' + tot, d: 'A trip costing exactly EGP ' + tot + ' splits into ' + f + ' × ' + E + ' — allowed → ≤.' }
              ],
              st: ['c/' + f + ' ≤ ' + E, 'Multiply both sides by ' + f + ' (positive → sign stays)', 'c ≤ ' + tot + ' EGP']
            };
          })()
        ])[0];
        return { q: W.q, ok: W.ok, wrong: W.ws, steps: W.st };
      }
    }
  });

  /* ═══════════ 5-6 Solve Two-Step Inequalities ═══════════ */
  T5.lessons.push({
    id: 't5l6', code: '5-6', title: 'Solve Two-Step Inequalities',
    sub: 'Undo + / − first, then × / ÷',
    calc: false,
    hintA: '🧭 Solve it exactly like a two-step EQUATION: undo + or − first, then × or ÷ — but if you divide or multiply by a negative, FLIP the sign.',
    hintB: '👣 < or > → open circle ○ · ≤ or ≥ → closed circle ●. Test one value from your solution to check which way the shading goes.',
    guide: {
      key: 'A two-step inequality is solved just like a two-step equation: undo + or − first, then × or ÷. Flip the sign if you multiply or divide by a negative number.',
      rules: [
        { h: 'STEP ORDER', b: '2x + 3 > 11 → 2x > 8 → x > 4' },
        { h: 'FLIP RULE', b: '−4x + 5 < 21 → −4x < 16 → x > −4' },
        { h: 'OPEN / CLOSED', b: '< or > → open circle ○ · ≤ or ≥ → closed circle ●' },
        { h: 'CHECK', b: 'test one value from the shaded part' }
      ],
      steps: ['Undo + or −: add or subtract on both sides', 'Undo × or ÷: flip the sign if the number is negative', 'Graph: choose open or closed circle, then shade', 'Check with one value from the solution'],
      ex: [
        { t: '2x + 3 > 11', s: ['Subtract 3: 2x > 8', 'Divide by 2: x > 4', 'Open circle at 4, shade right'] },
        { t: '−4x + 5 < 21', s: ['Subtract 5: −4x < 16', 'Divide by −4 and FLIP: x > −4', 'Open circle at −4, shade right'] }
      ],
      try: ['3x − 2 ≥ 10', 'y/2 + 4 < 7', '−2n + 3 ≤ 9'],
      tryAns: ['x ≥ 4', 'y < 6', 'n ≥ −3']
    },
    gen: {
      easy: function () {
        var mode = ri(1, 2);
        if (mode === 1) {
          var S = pick(SYMS), a = ri(2, 6), x = ri(2, 9), b = ri(2, 9), c = a * x + b;
          return {
            q: 'Solve: ' + a + 'x + ' + b + ' ' + S + ' ' + c,
            ok: 'x ' + S + ' ' + x,
            wrong: fill3('x ' + S + ' ' + x, ineqWs(x, S, x + 1,
              'Dividing by the POSITIVE ' + a + ' keeps the sign ' + S + ' — no flip.',
              'Undo +' + b + ' first: ' + c + ' − ' + b + ' = ' + (a * x) + ', then divide by ' + a + ' → ' + x + '.'),
              function () { return { t: 'x ' + S + ' ' + (x - 1), d: 'Check x = ' + (x - 1) + ': ' + a + '(' + (x - 1) + ') + ' + b + ' = ' + (a * (x - 1) + b) + ' — is it ' + S + ' ' + c + '? Use the steps: subtract ' + b + ', divide by ' + a + '.' }; }),
            steps: [
              'Subtract ' + b + ': ' + a + 'x ' + S + ' ' + (a * x),
              'Divide by ' + a + ' (positive → the sign stays ' + S + ')',
              'x ' + S + ' ' + x
            ]
          };
        }
        var S2 = pick(SYMS), d2 = ri(2, 5), k2 = ri(2, 9), b2 = ri(2, 9), c2 = k2 + b2, x2 = d2 * k2;
        return {
          q: 'Solve: x/' + d2 + ' + ' + b2 + ' ' + S2 + ' ' + c2,
          ok: 'x ' + S2 + ' ' + x2,
          wrong: fill3('x ' + S2 + ' ' + x2, [
            { t: 'x ' + S2 + ' ' + k2, d: 'After x/' + d2 + ' = ' + k2 + ', MULTIPLY by ' + d2 + ': x = ' + x2 + '.' },
            { t: 'x ' + flipS(S2) + ' ' + x2, d: 'Multiplying by the POSITIVE ' + d2 + ' keeps the sign ' + S2 + '.' },
            { t: 'x ' + flipS(S2) + ' ' + k2, d: 'Undo +' + b2 + ' → x/' + d2 + ' = ' + k2 + ', then × ' + d2 + ' = ' + x2 + ', sign stays ' + S2 + '.' }
          ], function () { return { t: 'x ' + S2 + ' ' + (x2 + d2), d: 'Check x = ' + (x2 + d2) + ': (' + (x2 + d2) + ')/' + d2 + ' + ' + b2 + ' = ' + (k2 + 1 + b2) + ' ' + S2 + ' ' + c2 + '? Redo: subtract ' + b2 + ', multiply by ' + d2 + '.' }; }),
          steps: [
            'Subtract ' + b2 + ': x/' + d2 + ' ' + S2 + ' ' + k2,
            'Multiply by ' + d2 + ' (positive → the sign stays ' + S2 + ')',
            'x ' + S2 + ' ' + x2
          ]
        };
      },
      medium: function () {
        var mode = ri(1, 4);
        if (mode === 1) {
          var S = pick(SYMS), a = ri(2, 5), X = -ri(2, 9), b = ri(2, 9), c = b - a * X;
          return {
            q: 'Solve: −' + a + 'x + ' + b + ' ' + S + ' ' + c,
            ok: 'x ' + flipS(S) + ' ' + n2s(X),
            wrong: [
              { t: 'x ' + S + ' ' + n2s(X), d: 'Dividing by the NEGATIVE −' + a + ' requires a FLIP: ' + S + ' becomes ' + flipS(S) + '.' },
              { t: 'x ' + flipS(S) + ' ' + n2s(-X), d: 'Undo +' + b + ': −' + a + 'x ' + S + ' ' + (c - b) + '. Then ' + (c - b) + ' ÷ (−' + a + ') = ' + n2s(X) + '.' },
              { t: 'x ' + S + ' ' + n2s(-X), d: 'Undo +' + b + ' → ' + (c - b) + ' ÷ (−' + a + ') = ' + n2s(X) + ' AND flip ' + S + ' → ' + flipS(S) + '.' }
            ],
            steps: [
              'Subtract ' + b + ': −' + a + 'x ' + S + ' ' + (c - b),
              'Divide by −' + a + ' → FLIP: ' + S + ' becomes ' + flipS(S),
              'x ' + flipS(S) + ' ' + n2s(X)
            ]
          };
        }
        if (mode === 2) {
          var a2 = ri(3, 7), b2 = ri(2, 9), x2 = ri(2, 9), c2 = a2 * x2 + b2;
          return {
            q: 'Complete the steps: ' + a2 + 'x + ' + b2 + ' ≥ ' + c2 + ' → ' + a2 + 'x ≥ ____ → x ≥ ____',
            ok: (c2 - b2) + ' , ' + x2,
            wrong: fill3((c2 - b2) + ' , ' + x2, [
              { t: (c2 + b2) + ' , ' + (x2 + 2), d: 'Subtract ' + b2 + ' (not add): ' + c2 + ' − ' + b2 + ' = ' + (c2 - b2) + ' — then ÷ ' + a2 + '.' },
              { t: (c2 - b2) + ' , ' + (x2 + 1), d: 'Divide ' + (c2 - b2) + ' ÷ ' + a2 + ' = ' + x2 + '.' },
              { t: c2 + ' , ' + x2, d: 'The +' + b2 + ' moves FIRST: ' + a2 + 'x ≥ ' + c2 + ' − ' + b2 + ' = ' + (c2 - b2) + '.' }
            ], function () { return { t: (c2 - b2) + ' , ' + (x2 + 2), d: 'Subtract ' + b2 + ' first, then divide by ' + a2 + '.' }; }),
            steps: [
              'Subtract ' + b2 + ': ' + a2 + 'x ≥ ' + c2 + ' − ' + b2 + ' = ' + (c2 - b2),
              'Divide by ' + a2 + ': x ≥ ' + (c2 - b2) + ' ÷ ' + a2,
              'x ≥ ' + x2
            ]
          };
        }
        if (mode === 3) {
          var a3 = ri(3, 6), x3 = ri(2, 9), b3 = ri(2, 9), c3 = a3 * x3 + b3;
          return {
            q: 'Describe the graph of the solution of ' + a3 + 'x + ' + b3 + ' > ' + c3 + '.',
            ok: 'Open circle at ' + x3 + ', shade right',
            wrong: [
              { t: 'Closed circle at ' + x3 + ', shade right', d: 'The solution is x > ' + x3 + ' — a STRICT inequality gets an OPEN circle ○.' },
              { t: 'Open circle at ' + x3 + ', shade left', d: 'The solutions are GREATER than ' + x3 + ' → shade to the RIGHT.' },
              { t: 'Closed circle at ' + c3 + ', shade right', d: 'The circle goes at the solution boundary x = ' + x3 + ' (after solving) — not at the ' + c3 + ' from the question.' }
            ],
            steps: [
              'Solve: ' + a3 + 'x > ' + (c3 - b3) + ' → x > ' + x3,
              '> is strict → OPEN circle at ' + x3,
              'Solutions greater than ' + x3 + ' → shade right'
            ]
          };
        }
        var W = shuffle([
          (function () {
            var B = ri(2, 5) * 2, R = ri(2, 5), k = ri(3, 9), T = B + R * k;
            return {
              q: 'A taxi charges EGP ' + B + ' plus EGP ' + R + ' per km. Mona has EGP ' + T + ' for the trip.<br>How far can she travel? (k = km)',
              ok: 'k ≤ ' + k,
              ws: [
                { t: 'k ≥ ' + k, d: '"Can afford" sets a maximum distance → ≤.' },
                { t: 'k < ' + k, d: 'A trip of exactly ' + k + ' km costs exactly EGP ' + T + ' — allowed → ≤.' },
                { t: 'k ≤ ' + (k + 1), d: 'Solve: ' + T + ' − ' + B + ' = ' + (T - B) + ', then ÷ ' + R + ' = ' + k + ' km — one km more would cost EGP ' + (T + R) + '.' }
              ],
              st: [B + ' + ' + R + 'k ≤ ' + T, 'Subtract ' + B + ': ' + R + 'k ≤ ' + (T - B), 'Divide by ' + R + ': k ≤ ' + k + ' km']
            };
          })(),
          (function () {
            var H = ri(6, 10) * 10, Bg = ri(2, 4) * 10, R = ri(2, 7), p = ri(3, 8), T = Bg + R * p;
            var money = (Bg + R * p <= H) ? H : Bg + R * p;
            var left = money - Bg, pens = Math.floor(left / R);
            return {
              q: 'Layla has EGP ' + money + '. She buys a bag for EGP ' + Bg + ' and pens at EGP ' + R + ' each.<br>How many pens p can she buy?',
              ok: 'p ≤ ' + pens,
              ws: [
                { t: 'p ≥ ' + pens, d: '"Can buy" sets a maximum → ≤.' },
                { t: 'p ≤ ' + (pens + 1), d: 'Solve: ' + money + ' − ' + Bg + ' = ' + left + ', then ÷ ' + R + ' = ' + pens + ' — check: ' + (pens + 1) + ' pens cost EGP ' + (R * (pens + 1)) + ' > ' + left + '.' },
                { t: 'p < ' + pens, d: 'Exactly ' + pens + ' pens cost EGP ' + (R * pens) + ' ≤ ' + left + ' — allowed → ≤.' }
              ],
              st: [Bg + ' + ' + R + 'p ≤ ' + money, 'Subtract ' + Bg + ': ' + R + 'p ≤ ' + left, 'Divide by ' + R + ': p ≤ ' + pens]
            };
          })(),
          (function () {
            var V = ri(8, 12) * 50, R = ri(2, 5) * 10;
            var n = Math.floor((V - 50) / R);
            if (n > 12) n = 12;
            if (n < 2) n = 2;
            var W = V - R * n;
            return {
              q: 'A pool holds ' + V + ' L and drains ' + R + ' L every minute. After t minutes it holds less than ' + W + ' L:<br>' + V + ' − ' + R + 't < ' + W + '. Solve for t.',
              ok: 't > ' + n,
              ws: [
                { t: 't < ' + n, d: 'Moving the numbers gives −' + R + 't < ' + n2s(W - V) + ' — dividing by the negative −' + R + ' FLIPS the sign.' },
                { t: 't > ' + (V - W), d: 'Subtract and divide: ' + V + ' − ' + W + ' = ' + (V - W) + ', then ÷ ' + R + ' = ' + n + '.' },
                { t: 't < ' + (V - W), d: 'Compute ' + (V - W) + ' ÷ ' + R + ' = ' + n + ' and remember the FLIP (dividing by −' + R + '): t > ' + n + '.' }
              ],
              st: [V + ' − ' + R + 't < ' + W, 'Subtract ' + V + ': −' + R + 't < ' + n2s(W - V), 'Divide by −' + R + ' → FLIP: t > ' + n + ' minutes']
            };
          })()
        ])[0];
        return { q: W.q, ok: W.ok, wrong: W.ws, steps: W.st };
      }
    }
  });

  /* ═══════════ 5-7 Solve Multi-Step Inequalities ═══════════ */
  T5.lessons.push({
    id: 't5l7', code: '5-7', title: 'Solve Multi-Step Inequalities',
    sub: 'Distribute · Combine like terms · Solve',
    calc: false,
    hintA: '🧭 Simplify FIRST: distribute to remove parentheses and combine like terms. Then solve like a two-step inequality — flip the sign if you divide by a negative.',
    hintB: '👣 Order: 1 Distribute → 2 Combine like terms → 3 Undo + / − → 4 Undo × / ÷ (flip if negative). Check with a value from your solution.',
    guide: {
      key: 'A multi-step inequality may need the distributive property and combining like terms before you solve. Then use inverse operations, and flip the sign when dividing or multiplying by a negative.',
      rules: [
        { h: 'SIMPLIFY EACH SIDE', b: '3(x + 2) > 18 → 3x + 6 > 18' },
        { h: 'COMBINE LIKE TERMS', b: '2x + 5 + x ≤ 20 → 3x + 5 ≤ 20' },
        { h: 'THEN SOLVE', b: '3x + 6 > 18 → 3x > 12 → x > 4' },
        { h: 'FLIP IF NEGATIVE', b: '−2x < 2 → x > −1' }
      ],
      steps: ['Distribute to remove the parentheses', 'Combine like terms on each side', 'Undo + or −, then × or ÷ (flip if negative)', 'Graph and check with one value from the solution'],
      ex: [
        { t: '3(x + 2) > 18', s: ['Distribute: 3x + 6 > 18', 'Subtract 6: 3x > 12', 'Divide by 3: x > 4'] },
        { t: '−2(x − 3) + 4 < 12', s: ['Distribute: −2x + 6 + 4 < 12', 'Combine: −2x + 10 < 12', '−2x < 2 → divide by −2 and FLIP: x > −1'] }
      ],
      try: ['2(x + 4) < 14', '4x − 1 + x ≥ 19', '−3(x − 1) > 12'],
      tryAns: ['x < 3', 'x ≥ 4', 'x < −3']
    },
    gen: {
      easy: function () {
        var mode = ri(1, 3);
        if (mode === 1) {
          var S = pick(SYMS), a = ri(2, 6), b = ri(1, 6), x = ri(2, 9), c = a * (x + b);
          return {
            q: 'Solve: ' + a + '(x + ' + b + ') ' + S + ' ' + c,
            ok: 'x ' + S + ' ' + x,
            wrong: fill3('x ' + S + ' ' + x, [
              { t: 'x ' + flipS(S) + ' ' + x, d: 'Dividing by the POSITIVE ' + a + ' keeps the sign ' + S + '.' },
              { t: 'x ' + S + ' ' + (x + 2 * b), d: 'After dividing: x + ' + b + ' ' + S + ' ' + (x + b) + ' → SUBTRACT ' + b + ': x = ' + x + '.' },
              (c - b) % a === 0 ? { t: 'x ' + S + ' ' + ((c - b) / a), d: 'The ' + a + ' multiplies BOTH numbers inside: ' + a + '(x + ' + b + ') = ' + a + 'x + ' + (a * b) + ' — not ' + a + 'x + ' + b + '.' } : null
            ], function () { return { t: 'x ' + S + ' ' + (x + 1), d: 'Distribute ' + a + ' to both terms, subtract ' + (a * b) + ', divide by ' + a + ' → x ' + S + ' ' + x + '.' }; }),
            steps: [
              'Distribute: ' + a + 'x + ' + (a * b) + ' ' + S + ' ' + c,
              'Subtract ' + (a * b) + ': ' + a + 'x ' + S + ' ' + (a * x),
              'Divide by ' + a + ' (positive → sign stays): x ' + S + ' ' + x
            ]
          };
        }
        if (mode === 2) {
          var S2 = pick(SYMS), A = ri(2, 5), B = ri(2, 5), x2 = ri(2, 9), cc = ri(2, 9);
          var T2 = A + B, rhs = T2 * x2 + cc;
          return {
            q: 'Solve: ' + A + 'x + ' + B + 'x + ' + cc + ' ' + S2 + ' ' + rhs,
            ok: 'x ' + S2 + ' ' + x2,
            wrong: fill3('x ' + S2 + ' ' + x2, [
              { t: 'x ' + flipS(S2) + ' ' + x2, d: 'Dividing by the POSITIVE ' + T2 + ' keeps the sign ' + S2 + '.' },
              (rhs % A === 0) ? { t: 'x ' + S2 + ' ' + (rhs / A), d: 'Combine the x-terms FIRST: ' + A + 'x + ' + B + 'x = ' + T2 + 'x, then solve.' } : null,
              { t: 'x ' + S2 + ' ' + (x2 + 1), d: 'Check x = ' + (x2 + 1) + ': ' + A + '(' + (x2 + 1) + ') + ' + B + '(' + (x2 + 1) + ') + ' + cc + ' = ' + (rhs + T2) + ' ' + S2 + ' ' + rhs + '? Combine first: ' + T2 + 'x = ' + (rhs - cc) + '.' }
            ], function () { return { t: 'x ' + S2 + ' ' + (x2 - 1), d: 'Combine like terms: ' + T2 + 'x + ' + cc + ' ' + S2 + ' ' + rhs + ' → ' + T2 + 'x ' + S2 + ' ' + (rhs - cc) + ' → x ' + S2 + ' ' + x2 + '.' }; }),
            steps: [
              'Combine like terms: ' + T2 + 'x + ' + cc + ' ' + S2 + ' ' + rhs,
              'Subtract ' + cc + ': ' + T2 + 'x ' + S2 + ' ' + (rhs - cc),
              'Divide by ' + T2 + ': x ' + S2 + ' ' + x2
            ]
          };
        }
        var S3 = pick(SYMS), a3 = ri(2, 4), b3 = ri(1, 5), X3 = -ri(2, 9), c3 = a3 * (b3 - X3);
        return {
          q: 'Solve: −' + a3 + '(x − ' + b3 + ') ' + S3 + ' ' + c3,
          ok: 'x ' + flipS(S3) + ' ' + n2s(X3),
          wrong: [
            { t: 'x ' + S3 + ' ' + n2s(X3), d: 'Dividing by the NEGATIVE −' + a3 + ' requires a FLIP: ' + S3 + ' becomes ' + flipS(S3) + '.' },
            { t: 'x ' + flipS(S3) + ' ' + n2s(-X3), d: 'Distribute: −' + a3 + 'x + ' + (a3 * b3) + ' ' + S3 + ' ' + c3 + ' → −' + a3 + 'x ' + S3 + ' ' + (c3 - a3 * b3) + ' → ' + (c3 - a3 * b3) + ' ÷ (−' + a3 + ') = ' + n2s(X3) + '.' },
            { t: 'x ' + S3 + ' ' + n2s(-X3), d: 'Distribute fully, then divide by −' + a3 + ' (gives ' + n2s(X3) + ') and FLIP ' + S3 + ' → ' + flipS(S3) + '.' }
          ],
          steps: [
            'Distribute −' + a3 + ': −' + a3 + 'x + ' + (a3 * b3) + ' ' + S3 + ' ' + c3,
            'Subtract ' + (a3 * b3) + ': −' + a3 + 'x ' + S3 + ' ' + (c3 - a3 * b3),
            'Divide by −' + a3 + ' → FLIP: x ' + flipS(S3) + ' ' + n2s(X3)
          ]
        };
      },
      medium: function () {
        var mode = ri(1, 4);
        if (mode === 1) {
          var S = pick(SYMS), a = ri(2, 5), b = ri(1, 6), x = ri(2, 9), c = ri(1, 9), d = a * (x + b) - c;
          return {
            q: 'Solve: ' + a + '(x + ' + b + ') − ' + c + ' ' + S + ' ' + d,
            ok: 'x ' + S + ' ' + x,
            wrong: fill3('x ' + S + ' ' + x, [
              (d - a * b) % a === 0 ? { t: 'x ' + S + ' ' + ((d - a * b) / a), d: 'Undo the −' + c + ' FIRST (add ' + c + ' to both sides), then handle the parentheses.' } : null,
              (d - b + c) % a === 0 ? { t: 'x ' + S + ' ' + ((d - b + c) / a), d: 'The ' + a + ' multiplies BOTH numbers inside: ' + a + '(x + ' + b + ') = ' + a + 'x + ' + (a * b) + ' — not ' + a + 'x + ' + b + '.' } : null,
              { t: 'x ' + flipS(S) + ' ' + x, d: 'Dividing by the POSITIVE ' + a + ' keeps the sign ' + S + '.' }
            ], function () { return { t: 'x ' + S + ' ' + (x + 1), d: 'Check x = ' + (x + 1) + ': ' + a + '(' + (x + 1) + ' + ' + b + ') − ' + c + ' = ' + (a * (x + 1 + b) - c) + ' ' + S + ' ' + d + '?' }; }),
            steps: [
              'Distribute: ' + a + 'x + ' + (a * b) + ' − ' + c + ' ' + S + ' ' + d,
              'Combine: ' + a + 'x + ' + (a * b - c) + ' ' + S + ' ' + d,
              'Subtract ' + (a * b - c) + ' → ' + a + 'x ' + S + ' ' + (a * x) + ' → divide by ' + a + ': x ' + S + ' ' + x
            ]
          };
        }
        if (mode === 2) {
          var S2 = pick(SYMS), a2 = ri(2, 4), b2 = ri(1, 5), X2 = -ri(3, 9), c2 = a2 * (-X2 - b2);
          return {
            q: 'Solve: −' + a2 + '(x + ' + b2 + ') ' + S2 + ' ' + c2,
            ok: 'x ' + flipS(S2) + ' ' + n2s(X2),
            wrong: [
              { t: 'x ' + S2 + ' ' + n2s(X2), d: 'Dividing by the NEGATIVE −' + a2 + ' requires a FLIP: ' + S2 + ' becomes ' + flipS(S2) + '.' },
              { t: 'x ' + flipS(S2) + ' ' + n2s(-X2), d: 'Distribute: −' + a2 + 'x − ' + (a2 * b2) + ' ' + S2 + ' ' + c2 + ' → −' + a2 + 'x ' + S2 + ' ' + (c2 + a2 * b2) + ' → ' + (c2 + a2 * b2) + ' ÷ (−' + a2 + ') = ' + n2s(X2) + '.' },
              { t: 'x ' + S2 + ' ' + n2s(-X2), d: 'Distribute fully, divide by −' + a2 + ' (gives ' + n2s(X2) + ') and FLIP ' + S2 + ' → ' + flipS(S2) + '.' }
            ],
            steps: [
              'Distribute −' + a2 + ': −' + a2 + 'x − ' + (a2 * b2) + ' ' + S2 + ' ' + c2,
              'Add ' + (a2 * b2) + ': −' + a2 + 'x ' + S2 + ' ' + (c2 + a2 * b2),
              'Divide by −' + a2 + ' → FLIP: x ' + flipS(S2) + ' ' + n2s(X2)
            ]
          };
        }
        if (mode === 3) {
          var a3 = ri(2, 4), b3 = ri(2, 5), x3 = 0, d3 = 0;
          while (d3 < 2) { x3 = b3 + ri(1, 7); d3 = a3 * (x3 - b3); }
          var herX = (d3 + b3) / a3;
          var herVal = d3 + b3 - a3 * b3;
          var herTxt = Number.isInteger(herX) ? String(herX) : herX.toFixed(1);
          var name = pick(['Nour', 'Salma', 'Karim', 'Dina', 'Omar']);
          return {
            q: name + ' solved ' + a3 + '(x − ' + b3 + ') > ' + d3 + ' like this:<br>' + a3 + 'x − ' + b3 + ' > ' + d3 + ' , ' + a3 + 'x > ' + (d3 + b3) + ' , x > ' + herTxt + '<br>What was the mistake?',
            ok: 'She forgot to distribute the ' + a3 + ' to the −' + b3,
            wrong: [
              { t: 'She should have flipped the sign at the end', d: 'No negative division happens here — the error is earlier: ' + a3 + ' × (−' + b3 + ') = −' + (a3 * b3) + ' was never done.' },
              { t: 'She added ' + b3 + ' on the wrong side', d: 'The real issue is the distribution. Correct line: ' + a3 + 'x − ' + (a3 * b3) + ' > ' + d3 + ' → ' + a3 + 'x > ' + (d3 + a3 * b3) + ' → x > ' + x3 + '.' },
              { t: 'Nothing — her solution is correct', d: 'Test her boundary: ' + a3 + '(' + herTxt + ' − ' + b3 + ') = ' + herVal + ' which is NOT > ' + d3 + ' — her answer fails the original inequality.' }
            ],
            steps: [
              'Distribute to BOTH terms: ' + a3 + '(x − ' + b3 + ') = ' + a3 + 'x − ' + (a3 * b3),
              'Solve: ' + a3 + 'x > ' + d3 + ' + ' + (a3 * b3) + ' = ' + (d3 + a3 * b3),
              'Divide by ' + a3 + ': x > ' + x3
            ]
          };
        }
        var W = shuffle([
          (function () {
            var F = ri(2, 6), x = ri(3, 9), T = 4 * (x + F);
            return {
              q: 'Four friends each pay (x + ' + F + ') EGP for a meal: the dish price x plus a EGP ' + F + ' service charge. Together they can spend at most EGP ' + T + '.<br>Solve for x.',
              ok: 'x ≤ ' + x,
              ws: [
                { t: 'x ≥ ' + x, d: '"At most" sets a ceiling → ≤.' },
                { t: 'x ≤ ' + (x + F), d: 'Divide by 4 FIRST: x + ' + F + ' ≤ ' + (x + F) + ' — then subtract ' + F + ' to isolate x.' },
                { t: 'x < ' + x, d: 'A bill of exactly EGP ' + T + ' is allowed (it is the maximum) → ≤.' }
              ],
              st: ['4(x + ' + F + ') ≤ ' + T, 'Divide by 4: x + ' + F + ' ≤ ' + (x + F), 'Subtract ' + F + ': x ≤ ' + x]
            };
          })(),
          (function () {
            var w = ri(3, 6), x = ri(2, 8), F = ri(2, 5), A = w * (x + F);
            return {
              q: 'A rectangle has width ' + w + ' cm and length (x + ' + F + ') cm. Its area must be less than ' + A + ' cm².<br>Solve for x.',
              ok: 'x < ' + x,
              ws: [
                { t: 'x ≤ ' + x, d: '"LESS than" is strict — an area of exactly ' + A + ' cm² is not allowed → <.' },
                { t: 'x < ' + (x + F), d: 'Divide by ' + w + ' FIRST: x + ' + F + ' < ' + (x + F) + ' — then subtract ' + F + '.' },
                { t: 'x > ' + x, d: 'The area shrinks as x shrinks → x must be SMALLER than ' + x + '.' }
              ],
              st: [w + '(x + ' + F + ') < ' + A, 'Divide by ' + w + ': x + ' + F + ' < ' + (x + F), 'Subtract ' + F + ': x < ' + x]
            };
          })(),
          (function () {
            var B = ri(2, 6), a = ri(2, 4), s = ri(2, 5), m = ri(3, 9), T = B + a * (m + s);
            return {
              q: 'A phone plan costs EGP ' + B + ' plus ' + a + ' times (m + ' + s + ') EGP, and Mona wants to pay at most EGP ' + T + ':<br>' + B + ' + ' + a + '(m + ' + s + ') ≤ ' + T + '. Solve for m.',
              ok: 'm ≤ ' + m,
              ws: [
                { t: 'm ≥ ' + m, d: '"At most" sets a ceiling → ≤.' },
                { t: 'm ≤ ' + (m + s), d: 'Subtract ' + B + ' and divide by ' + a + ' FIRST: m + ' + s + ' ≤ ' + (m + s) + ' — then subtract ' + s + '.' },
                { t: 'm < ' + m, d: 'Paying exactly EGP ' + T + ' is allowed (it is the maximum) → ≤.' }
              ],
              st: ['Subtract ' + B + ': ' + a + '(m + ' + s + ') ≤ ' + (T - B), 'Divide by ' + a + ': m + ' + s + ' ≤ ' + (m + s), 'Subtract ' + s + ': m ≤ ' + m]
            };
          })()
        ])[0];
        return { q: W.q, ok: W.ok, wrong: W.ws, steps: W.st };
      }
    }
  });

  /* __MORE_LESSONS__ */

  function hook() {
    if (!window.G7 || !G7.registerTopic) { setTimeout(hook, 100); return; }
    G7.registerTopic(T5);
  }

  hook();
})();
