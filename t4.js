/* ============================================================
   AID Mathematics Academy · Grade 7 — t4.js
   Topic 4 · Generate Equivalent Expressions
   الدروس 4-1 → 4-8 (متطابقة مع كتاب الشغل المرفوع)
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
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a || 1; }
  /* يضمن 3 اختيارات غلط مختلفة عن الصحيح — ولها حد أقصى ضد أي تكرار لا نهائي */
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
  function near(ok, d) {
    ok = String(ok);
    var m = ok.match(/^(.*?)([0-9]+)(\s*)$/);
    if (m) { return { t: m[1] + (parseInt(m[2], 10) + 1), d: d }; }
    return { t: ok.replace(/([0-9]+)(?=[^0-9]*$)/, function (n) { return String(parseInt(n, 10) + 1); }), d: d };
  }

  var T4 = {
    id: 't4', num: 4, icon: '🧩', color: '#7c3aed',
    title: 'Generate Equivalent Expressions',
    sub: 'كتابة وتبسيط وتوسيع وتحليل التعبيرات الجبرية',
    lessons: []
  };

  /* ═══════════ 4-1 Write and Evaluate Algebraic Expressions ═══════════ */
  T4.lessons.push({
    id: 't4l1', code: '4-1', title: 'Write and Evaluate Algebraic Expressions',
    sub: 'Words to expressions · Substituting values',
    calc: false,
    hintA: '🧭 Translate the words into math symbols step by step, or substitute the value and follow the order of operations.',
    hintB: '👣 Multiply before you add or subtract: first × and ÷, then + and −. And remember x means 1x.',
    guide: {
      key: 'An algebraic expression is a mix of numbers, variables and operations. To write one, translate the words. To evaluate one, substitute the value and follow the order of operations.',
      rules: [
        { h: 'COEFFICIENT', b: '3x + 5 → the number multiplying the variable' },
        { h: 'VARIABLE', b: '3x + 5 → the letter for an unknown number' },
        { h: 'CONSTANT', b: '3x + 5 → the number alone (never changes)' },
        { h: 'WATCH OUT', b: '"5 less than x" means x − 5 (NOT 5 − x)' }
      ],
      steps: ['Substitute: replace each variable with its value', 'Order of operations: ( ), then × ÷, then + −', 'Write the final value'],
      ex: [
        { t: '5 more than twice n', s: ['"Twice n" = 2 × n = 2n', '"5 more than" = add 5', 'Expression: 2n + 5'] },
        { t: '3x + 4 when x = 5', s: ['Substitute: 3(5) + 4', 'Multiply first: 15 + 4', '= 19'] }
      ],
      try: ['Write: 4 less than 3 times n', 'Evaluate 5x − 2 when x = 6', 'Evaluate 2(a − 3) + b when a = 7, b = 4'],
      tryAns: ['3n − 4', '28', '12']
    },
    gen: {
      easy: function () {
        if (Math.random() < 0.55) {
          var b = ri(2, 9), c = ri(2, 9), x = ri(2, 9);
          var ans = b * x + c;
          return {
            q: 'Evaluate ' + b + 'x + ' + c + ' when x = ' + x + '.',
            ok: String(ans),
            wrong: fill3(String(ans), [
              { t: String(b * (x + c)), d: 'You multiplied ' + b + ' by (' + x + ' + ' + c + ') — the ' + c + ' is NOT inside parentheses. Multiply ' + b + ' × ' + x + ' first, then add ' + c + '.' },
              { t: String((b + c) * x), d: 'You added ' + b + ' + ' + c + ' first — order of operations says × before +, so ' + b + 'x + ' + c + ' = ' + (b * x) + ' + ' + c + '.' },
              { t: String(b + x + c), d: b + 'x means ' + b + ' × x, not ' + b + ' + x. So the value is (' + b + ' × ' + x + ') + ' + c + '.' }
            ], function () { return near(ans, 'Multiply first: ' + b + ' × ' + x + ' = ' + (b * x) + ', then add ' + c + '.'); }),
            steps: [
              'Substitute: ' + b + '(' + x + ') + ' + c,
              'Multiply first: ' + (b * x) + ' + ' + c,
              'Add: = ' + ans
            ]
          };
        }
        var a = ri(2, 9), b = ri(2, 9);
        while (b === a) { b = ri(2, 9); }
        var mode = ri(1, 3);
        if (mode === 1) {
          return {
            q: 'Write an expression for: "' + a + ' more than ' + b + ' times n".',
            ok: b + 'n + ' + a,
            wrong: [
              { t: a + 'n + ' + b, d: '"' + b + ' times n" = ' + b + 'n and then "' + a + ' MORE THAN" adds ' + a + ' → ' + b + 'n + ' + a + '.' },
              { t: b + '(n + ' + a + ')', d: 'Only the n is multiplied by ' + b + ' — "' + a + ' more than" comes after: ' + b + 'n + ' + a + '.' },
              { t: b + 'n − ' + a, d: '"more than" means ADD ' + a + ': ' + b + 'n + ' + a + '.' }
            ],
            steps: ['"times n" → ' + b + 'n', '"' + a + ' more than" → + ' + a, 'Expression: ' + b + 'n + ' + a]
          };
        }
        if (mode === 2) {
          return {
            q: 'Write an expression for: "' + a + ' less than ' + b + ' times n".',
            ok: b + 'n − ' + a,
            wrong: [
              { t: a + ' − ' + b + 'n', d: '"' + a + ' less than..." comes FROM the other amount: ' + b + 'n − ' + a + ', not ' + a + ' − ' + b + 'n.' },
              { t: b + '(n − ' + a + ')', d: 'The ' + a + ' is subtracted from the whole result, not from inside: ' + b + 'n − ' + a + '.' },
              { t: b + 'n + ' + a, d: '"LESS than" means subtract: ' + b + 'n − ' + a + '.' }
            ],
            steps: ['"times n" → ' + b + 'n', '"' + a + ' less than" → − ' + a, 'Expression: ' + b + 'n − ' + a]
          };
        }
        return {
          q: 'Write an expression for: "' + a + ' times the sum of n and ' + b + '".',
          ok: a + '(n + ' + b + ')',
          wrong: [
            { t: a + 'n + ' + b, d: '"the SUM of n and ' + b + '" is grouped: the ' + a + ' multiplies BOTH → ' + a + '(n + ' + b + ').' },
            { t: a + ' + ' + b + 'n', d: 'The ' + a + ' MULTIPLIES the whole sum: ' + a + '(n + ' + b + ').' },
            { t: a + 'n − ' + b, d: 'A sum means +: ' + a + '(n + ' + b + ').' }
          ],
          steps: ['"the sum of n and ' + b + '" → (n + ' + b + ')', '"' + a + ' times" the sum → ' + a + '(n + ' + b + ')', 'Expression: ' + a + '(n + ' + b + ')']
        };
      },
      medium: function () {
        var mode = ri(1, 3);
        if (mode === 1) {
          var a = ri(2, 6), b = ri(2, 6), x = ri(2, 6), y = ri(2, 6);
          var ans = a * x + b * y;
          return {
            q: 'Evaluate ' + a + 'a + ' + b + 'b when a = ' + x + ' and b = ' + y + '.',
            ok: String(ans),
            wrong: fill3(String(ans), [
              { t: String(a * x + b + y), d: b + 'b means ' + b + ' × b = ' + b + ' × ' + y + ' = ' + (b * y) + ' — not ' + b + ' + ' + y + '.' },
              { t: String((a + b) * (x + y)), d: 'Multiply each term separately: (' + a + ' × ' + x + ') + (' + b + ' × ' + y + ') = ' + (a * x) + ' + ' + (b * y) + '.' },
              { t: String(a * b * x * y), d: 'The + sign separates the terms — multiply each term, then ADD: ' + (a * x) + ' + ' + (b * y) + '.' }
            ], function () { return near(ans, 'Multiply each term first, then add.'); }),
            steps: [
              'Substitute: ' + a + '(' + x + ') + ' + b + '(' + y + ')',
              'Multiply: ' + (a * x) + ' + ' + (b * y),
              'Add: = ' + ans
            ]
          };
        }
        if (mode === 2) {
          var x2 = ri(3, 9);
          var ans2 = x2 * x2 + ri(2, 9);
          var c2 = ans2 - x2 * x2;
          return {
            q: 'Evaluate x<sup>2</sup> + ' + c2 + ' when x = ' + x2 + '.',
            ok: String(ans2),
            wrong: [
              { t: String(2 * x2 + c2), d: 'x<sup>2</sup> is not 2x: ' + x2 + '<sup>2</sup> = ' + x2 + ' × ' + x2 + ' = ' + (x2 * x2) + '.' },
              { t: String(x2 + c2), d: 'x<sup>2</sup> means x × x = ' + (x2 * x2) + ' — not just x.' },
              { t: String(x2 * x2 * c2), d: 'The ' + c2 + ' is ADDED after squaring: ' + (x2 * x2) + ' + ' + c2 + '.' }
            ],
            steps: [
              'Square first: ' + x2 + '<sup>2</sup> = ' + (x2 * x2),
              'Add: ' + (x2 * x2) + ' + ' + c2,
              '= ' + ans2
            ]
          };
        }
        var b3 = ri(2, 6), inn = ri(2, 6), c3 = ri(2, 6), x3 = inn + ri(1, 4);
        var ans3 = b3 * (x3 + c3) + inn;
        return {
          q: 'Evaluate ' + b3 + '(x + ' + c3 + ') + ' + inn + ' when x = ' + x3 + '.',
          ok: String(ans3),
          wrong: fill3(String(ans3), [
            { t: String(b3 * x3 + c3 + inn), d: 'The ' + b3 + ' multiplies BOTH numbers inside: ' + b3 + ' × ' + c3 + ' = ' + (b3 * c3) + ', then add ' + inn + '.' },
            { t: String(b3 * (x3 + c3 + inn)), d: 'The +' + inn + ' is OUTSIDE the parentheses — it is added at the end.' },
            { t: String((b3 + inn) * (x3 + c3)), d: 'Compute ' + b3 + '(' + x3 + ' + ' + c3 + ') = ' + (b3 * (x3 + c3)) + ' first, THEN add ' + inn + '.' }
          ], function () { return near(ans3, 'Parentheses first, then multiply, then add the outside number.'); }),
          steps: [
            'Substitute: ' + b3 + '(' + x3 + ' + ' + c3 + ') + ' + inn,
            'Parentheses: ' + x3 + ' + ' + c3 + ' = ' + (x3 + c3) + ', then × ' + b3 + ' = ' + (b3 * (x3 + c3)),
            'Add ' + inn + ': = ' + ans3
          ]
        };
      }
    }
  });

  /* ═══════════ 4-2 Generate Equivalent Expressions ═══════════ */
  T4.lessons.push({
    id: 't4l2', code: '4-2', title: 'Generate Equivalent Expressions',
    sub: 'Properties of operations · Testing equivalence',
    calc: false,
    hintA: '🧭 Two expressions are equivalent if they have the SAME value for EVERY value of the variable.',
    hintB: '👣 Commutative = swap order · Associative = move parentheses · Identity = +0 or ×1 · Distributive = multiply every term inside.',
    guide: {
      key: 'Equivalent expressions have the same value for every value of the variable. We can generate them with the properties of operations.',
      rules: [
        { h: 'COMMUTATIVE', b: 'a + b = b + a · a × b = b × a (order)' },
        { h: 'ASSOCIATIVE', b: '(a + b) + c = a + (b + c) (grouping)' },
        { h: 'IDENTITY', b: 'a + 0 = a · a × 1 = a' },
        { h: 'DISTRIBUTIVE', b: 'a(b + c) = ab + ac' }
      ],
      steps: ['Choose a property (commutative, associative, identity, distributive)', 'Rewrite the expression using it', 'Check by substituting a number into both'],
      ex: [
        { t: '3(x + 2) and 3x + 6', s: ['Distribute: 3·x + 3·2', '= 3x + 6', 'Check x = 1: both give 9 ✓'] },
        { t: '2x + 3 and 5x', s: ['Test x = 1: 5 and 5 — match', 'Test x = 2: 7 and 10 — differ', 'Not equivalent ✗'] }
      ],
      try: ['Use the distributive property to rewrite 4(x + 5)', 'Use the commutative property to rewrite 7 + 3y', 'Are 2x + 2 and 2(x + 1) equivalent?'],
      tryAns: ['4x + 20', '3y + 7', 'Yes']
    },
    gen: {
      easy: function () {
        var mode = ri(1, 4);
        if (mode === 1) {
          var n = ri(2, 12);
          return {
            q: 'Use the COMMUTATIVE property to rewrite: x + ' + n,
            ok: n + ' + x',
            wrong: [
              { t: 'x + ' + n, d: 'That is the SAME expression — swap the ORDER: ' + n + ' + x.' },
              { t: n + ' − x', d: 'Commutative swaps the order but keeps the OPERATION: ' + n + ' + x.' },
              { t: n + 'x', d: 'Keep the + sign — commutative only swaps the order: ' + n + ' + x.' }
            ],
            steps: ['Commutative property of addition: a + b = b + a', 'x + ' + n + ' = ' + n + ' + x']
          };
        }
        if (mode === 2) {
          var a = ri(2, 9), b = ri(2, 9);
          return {
            q: 'Use the DISTRIBUTIVE property to rewrite: ' + a + '(x + ' + b + ')',
            ok: a + 'x + ' + (a * b),
            wrong: fill3(a + 'x + ' + (a * b), [
              { t: a + 'x + ' + b, d: 'Multiply EVERY term inside: ' + a + ' × ' + b + ' = ' + (a * b) + '.' },
              { t: (a * b) + 'x', d: a + ' × x = ' + a + 'x and ' + a + ' × ' + b + ' = ' + (a * b) + ' — don\'t multiply them together.' },
              { t: a + 'x + ' + (a + b), d: a + ' × ' + b + ' = ' + (a * b) + ' — multiply, don\'t add.' }
            ], function () { return near(a + 'x + ' + (a * b), 'Distribute ' + a + ' to both terms.'); }),
            steps: [
              'Distribute: ' + a + ' × x = ' + a + 'x',
              a + ' × ' + b + ' = ' + (a * b),
              a + '(x + ' + b + ') = ' + a + 'x + ' + (a * b)
            ]
          };
        }
        if (mode === 3) {
          var g = ri(2, 9), m = ri(2, 9), innr = ri(2, 9);
          while (innr === g) { innr = ri(2, 9); }
          return {
            q: 'Complete: ' + g + '(x + ___) = ' + g + 'x + ' + (g * innr),
            ok: String(innr),
            wrong: [
              { t: String(g * innr), d: 'Divide: ' + (g * innr) + ' ÷ ' + g + ' = ' + innr + ' — the inside number gives the product when multiplied by ' + g + '.' },
              { t: String(g), d: 'Check by multiplying: ' + g + ' × ' + g + ' = ' + (g * g) + ' ≠ ' + (g * innr) + '.' },
              { t: String(innr + g), d: 'Test it: ' + g + ' × ' + (innr + g) + ' = ' + (g * (innr + g)) + ' ≠ ' + (g * innr) + '.' }
            ],
            steps: [
              'Ask: ' + g + ' × ? = ' + (g * innr),
              (g * innr) + ' ÷ ' + g + ' = ' + innr,
              'So ' + g + '(x + ' + innr + ') = ' + g + 'x + ' + (g * innr)
            ]
          };
        }
        var props = shuffle([
          { q: '6 + x = x + 6', ok: 'Commutative', d: 'Associative MOVES parentheses: (a + b) + c = a + (b + c). This one swaps the order of the terms.' },
          { q: '3(x + 4) = 3x + 12', ok: 'Distributive', d: 'The outside number multiplies EVERY term inside — that is the distributive property.' },
          { q: '(a + 2) + 3 = a + (2 + 3)', ok: 'Associative', d: 'The numbers are the same and in the same order — only the parentheses moved. That is associative.' },
          { q: 'y × 1 = y', ok: 'Identity', d: 'Multiplying by 1 keeps the value — that is the identity property.' }
        ]);
        var P = props[0];
        var others = ['Commutative', 'Associative', 'Distributive', 'Identity'].filter(function (p) { return p !== P.ok; });
        return {
          q: 'Which property does this show?<br><b>' + P.q + '</b>',
          ok: P.ok,
          wrong: [
            { t: others[0], d: P.d },
            { t: others[1], d: P.d },
            { t: others[2], d: P.d }
          ],
          steps: [
            'Commutative: swap order · Associative: move parentheses',
            'Identity: +0 or ×1 · Distributive: a(b + c) = ab + ac',
            'This shows the ' + P.ok.toUpperCase() + ' property'
          ]
        };
      },
      medium: function () {
        var mode = ri(1, 2);
        if (mode === 1) {
          var a = ri(2, 5), b = ri(2, 5), c = ri(2, 9);
          var ok = (a * b) + 'x + ' + (a * c);
          return {
            q: 'Use the DISTRIBUTIVE property to rewrite: ' + a + '(' + b + 'x + ' + c + ')',
            ok: ok,
            wrong: fill3(ok, [
              { t: (a * b) + 'x + ' + c, d: 'Multiply the second term too: ' + a + ' × ' + c + ' = ' + (a * c) + '.' },
              { t: (a + b) + 'x + ' + (a + c), d: 'MULTIPLY, don\'t add: ' + a + ' × ' + b + 'x = ' + (a * b) + 'x and ' + a + ' × ' + c + ' = ' + (a * c) + '.' },
              { t: (a * b) + 'x + ' + (c * a + a), d: a + ' × ' + c + ' = ' + (a * c) + ' — recheck the multiplication.' }
            ], function () { return near(ok, 'Distribute ' + a + ' to BOTH terms.'); }),
            steps: [
              a + ' × ' + b + 'x = ' + (a * b) + 'x',
              a + ' × ' + c + ' = ' + (a * c),
              'So ' + a + '(' + b + 'x + ' + c + ') = ' + ok
            ]
          };
        }
        var t = shuffle([
          {
            q: 'Are 4x + 8 and 4(x + 2) equivalent? Test x = 2.',
            ok: 'Yes — 4(2) + 8 = 16 and 4(2 + 2) = 16',
            ws: [
              { t: 'No — 4(x + 2) = 4x + 2', d: 'Distribute fully: 4 × 2 = 8, so 4(x + 2) = 4x + 8 ✓' },
              { t: 'No — you cannot distribute 4', d: 'You can always distribute: 4(x + 2) = 4x + 8 ✓' },
              { t: 'Only when x = 2', d: 'Expand: 4(x + 2) = 4x + 8 — same form, so they match for EVERY x.' }
            ],
            steps: ['Test x = 2: 4(2) + 8 = 16', '4(2 + 2) = 4 × 4 = 16', 'Same values ✓ (and expanding gives 4x + 8) — equivalent']
          },
          {
            q: 'Are 3x + 6 and 9x equivalent? Test x = 1 AND x = 2.',
            ok: 'No — at x = 2: 3(2) + 6 = 12 but 9(2) = 18',
            ws: [
              { t: 'Yes — they match at x = 1', d: 'Matching at ONE value proves nothing! Test x = 2: 12 vs 18 → NOT equivalent.' },
              { t: 'Yes — 3 + 6 = 9', d: 'You cannot add the constant to the coefficient: 3x + 6 = 3x + 6, not 9x.' },
              { t: 'No — they never match', d: 'They DO match at x = 1 (both 9). But x = 2 gives 12 vs 18 → not equivalent.' }
            ],
            steps: ['x = 1: 3(1) + 6 = 9 and 9(1) = 9 — match', 'x = 2: 3(2) + 6 = 12 but 9(2) = 18 — differ', 'Different at x = 2 → NOT equivalent']
          }
        ])[0];
        return { q: t.q, ok: t.ok, wrong: t.ws, steps: t.steps };
      }
    }
  });

  /* ═══════════ 4-3 Simplify Expressions ═══════════ */
  T4.lessons.push({
    id: 't4l3', code: '4-3', title: 'Simplify Expressions',
    sub: 'Like terms · Combining coefficients',
    calc: false,
    hintA: '🧭 Only LIKE TERMS combine: same variable part with same variable, or both constants.',
    hintB: '👣 Group the x-terms together and the constants together, then add/subtract the coefficients only. The variable stays the same!',
    guide: {
      key: 'To simplify an expression, combine like terms: terms with the same variable part. Constants are also like terms. Add or subtract only the coefficients.',
      rules: [
        { h: 'LIKE TERMS', b: '4x and 9x · 6 and 15' },
        { h: 'UNLIKE TERMS', b: '4x and 4y · 3x and 3 — cannot combine' },
        { h: 'COEFFICIENT 1', b: 'x = 1x · −x = −1x' },
        { h: 'VARIABLE STAYS', b: '3x + 2x = 5x (never 5x²)' }
      ],
      steps: ['Find the like terms (same variable part)', 'Group them together, keeping their signs', 'Add or subtract the coefficients only'],
      ex: [
        { t: '4x + 3 + 2x + 5', s: ['Group: (4x + 2x) + (3 + 5)', '4 + 2 = 6 and 3 + 5 = 8', '= 6x + 8'] },
        { t: '5x − x + 2', s: ['x means 1x: 5x − 1x', '5 − 1 = 4', '= 4x + 2'] }
      ],
      try: ['6y + 2 + 3y + 5', '9x − 4 − 5x + 1', '8a + 3b − 2a + b'],
      tryAns: ['9y + 7', '4x − 3', '6a + 4b']
    },
    gen: {
      easy: function () {
        var a = ri(2, 9), b = ri(1, 9), c = ri(2, 9), d = ri(1, 9);
        var q = a + 'x + ' + b + ' + ' + c + 'x + ' + d;
        var ok = (a + c) + 'x + ' + (b + d);
        return {
          q: 'Simplify: ' + q,
          ok: ok,
          wrong: fill3(ok, [
            { t: (a + c) + 'x + ' + (b + d + 2), d: 'The constants: ' + b + ' + ' + d + ' = ' + (b + d) + '.' },
            { t: (a + c + b + d) + 'x', d: 'The numbers ' + b + ' and ' + d + ' are CONSTANTS — they cannot join the x-terms. Combine separately: ' + (a + c) + 'x + ' + (b + d) + '.' },
            { t: (a + c) + 'x + ' + Math.abs(b - d), d: 'The constants are ADDED: ' + b + ' + ' + d + ' = ' + (b + d) + ' (all terms are positive here).' }
          ], function () { return near(ok, 'Combine x-terms: ' + a + ' + ' + c + ' = ' + (a + c) + ' and constants: ' + b + ' + ' + d + ' = ' + (b + d) + '.'); }),
          steps: [
            'Group like terms: (' + a + 'x + ' + c + 'x) + (' + b + ' + ' + d + ')',
            'Add the coefficients: ' + a + ' + ' + c + ' = ' + (a + c),
            'Add the constants: ' + b + ' + ' + d + ' = ' + (b + d) + ' → ' + ok
          ]
        };
      },
      medium: function () {
        var mode = ri(1, 3);
        if (mode === 1) {
          var a = ri(5, 12), b = ri(2, 8), c = ri(2, 5), d = ri(2, 9);
          var constV = d - b;   /* −b + d */
          var ok = (a - c) + 'x ' + (constV < 0 ? '− ' + Math.abs(constV) : '+ ' + constV);
          var cTxt = (constV < 0 ? '−' + Math.abs(constV) : '+' + constV);
          return {
            q: 'Simplify: ' + a + 'x − ' + b + ' − ' + c + 'x + ' + d,
            ok: ok,
            wrong: fill3(ok, [
              { t: (a - c) + 'x ' + (b - d < 0 ? '− ' + Math.abs(b - d) : '+ ' + (b - d)), d: 'Watch the minus in front of ' + b + ': −' + b + ' + ' + d + ' = ' + cTxt + '.' },
              { t: (a + c) + 'x ' + (constV < 0 ? '− ' + Math.abs(constV) : '+ ' + constV), d: 'The x-terms: ' + a + 'x − ' + c + 'x = ' + (a - c) + 'x — you ADDED the coefficients.' },
              { t: (a - c) + 'x − ' + Math.abs(b + d), d: '−' + b + ' + ' + d + ' = ' + cTxt + ' — the +' + d + ' lifts it up.' }
            ], function () { return near(ok, 'Group: (' + a + 'x − ' + c + 'x) + (−' + b + ' + ' + d + ').'); }),
            steps: [
              'Group: (' + a + 'x − ' + c + 'x) + (−' + b + ' + ' + d + ')',
              'x-terms: ' + a + ' − ' + c + ' = ' + (a - c),
              'Constants: −' + b + ' + ' + d + ' = ' + cTxt + ' → ' + ok
            ]
          };
        }
        if (mode === 2) {
          var a2 = ri(4, 9);
          var ok2 = (a2 - 1) + 'x + 2';
          return {
            q: 'Simplify: ' + a2 + 'x − x + 2',
            ok: ok2,
            wrong: [
              { t: a2 + 'x + 2', d: 'x means 1x — so ' + a2 + 'x − 1x = ' + (a2 - 1) + 'x.' },
              { t: (a2 - 1) + 'x − 2', d: 'The +2 stays +2: ' + (a2 - 1) + 'x + 2.' },
              { t: (a2 + 1) + 'x + 2', d: 'Subtract the x: ' + a2 + 'x − 1x = ' + (a2 - 1) + 'x.' }
            ],
            steps: [
              'x = 1x, so ' + a2 + 'x − 1x',
              (a2 + ' − 1 = ' + (a2 - 1)),
              '= ' + ok2
            ]
          };
        }
        var a3 = ri(4, 9), b3 = ri(2, 6), c3 = ri(2, a3 - 1), d3 = ri(1, 4);
        var okA = a3 - c3, okB = b3 + d3;
        var oks = okA + 'a + ' + okB + 'b';
        return {
          q: 'Simplify: ' + a3 + 'a + ' + b3 + 'b − ' + c3 + 'a + ' + d3 + 'b',
          ok: oks,
          wrong: fill3(oks, [
            { t: (a3 + c3) + 'a + ' + (b3 + d3) + 'b', d: 'The a-terms are SUBTRACTED: ' + a3 + 'a − ' + c3 + 'a = ' + okA + 'a.' },
            { t: okA + 'a + ' + Math.abs(b3 - d3) + 'b', d: 'The b-terms are added: ' + b3 + 'b + ' + d3 + 'b = ' + okB + 'b.' },
            { t: (okA + okB) + 'ab', d: 'a-terms and b-terms are UNLIKE — they combine separately: ' + okA + 'a + ' + okB + 'b.' }
          ], function () { return near(oks, 'a-terms: ' + a3 + ' − ' + c3 + ' · b-terms: ' + b3 + ' + ' + d3 + '.'); }),
          steps: [
            'Group: (' + a3 + 'a − ' + c3 + 'a) + (' + b3 + 'b + ' + d3 + 'b)',
            'a: ' + a3 + ' − ' + c3 + ' = ' + okA + ' · b: ' + b3 + ' + ' + d3 + ' = ' + okB,
            '= ' + oks
          ]
        };
      }
    }
  });

  /* ═══════════ 4-4 Expand Expressions ═══════════ */
  T4.lessons.push({
    id: 't4l4', code: '4-4', title: 'Expand Expressions',
    sub: 'The distributive property',
    calc: false,
    hintA: '🧭 Multiply the number outside by EVERY term inside the parentheses.',
    hintB: '👣 Outside × first term, then outside × second term. Keep each sign — a negative outside flips both terms!',
    guide: {
      key: 'To expand an expression, use the distributive property to remove the parentheses: multiply the number outside by every term inside.',
      rules: [
        { h: 'DISTRIBUTE', b: 'a(b + c) = ab + ac' },
        { h: 'WITH SUBTRACTION', b: '3(x − 2) = 3x − 6' },
        { h: 'NEGATIVE OUTSIDE', b: '−2(x + 3) = −2x − 6 (both flip)' },
        { h: 'MULTIPLY ALL', b: 'every single term inside' }
      ],
      steps: ['Multiply the outside number by the first term', 'Multiply it by the second term (keep the sign)', 'Join the results'],
      ex: [
        { t: '5(2y − 3)', s: ['5 × 2y = 10y', '5 × 3 = 15, keep the minus', '= 10y − 15'] },
        { t: '−2(x + 6)', s: ['(−2) × x = −2x', '(−2) × 6 = −12', '= −2x − 12'] }
      ],
      try: ['4(x + 7)', '6(3a − 2)', '−3(y + 5)'],
      tryAns: ['4x + 28', '18a − 12', '−3y − 15']
    },
    gen: {
      easy: function () {
        var a = ri(2, 9), b = ri(2, 9), sub = Math.random() < 0.5;
        var q = a + '(x ' + (sub ? '− ' : '+ ') + b + ')';
        var ok = a + 'x ' + (sub ? '− ' : '+ ') + (a * b);
        return {
          q: 'Expand: ' + q,
          ok: ok,
          wrong: fill3(ok, [
            { t: a + 'x ' + (sub ? '− ' : '+ ') + b, d: 'Multiply the second term too: ' + a + ' × ' + b + ' = ' + (a * b) + '.' },
            { t: a + 'x ' + (sub ? '+ ' : '− ') + (a * b), d: (sub ? 'The minus stays: ' + a + '(x − ' + b + ') = ' + a + 'x − ' + (a * b) + '.' : 'Keep the plus: ' + a + '(x + ' + b + ') = ' + a + 'x + ' + (a * b) + '.') },
            { t: 'x + ' + (a * b), d: a + ' × x = ' + a + 'x — multiply the x-term as well.' }
          ], function () { return near(ok, 'Distribute ' + a + ' to BOTH terms.'); }),
          steps: [
            a + ' × x = ' + a + 'x',
            a + ' × ' + b + ' = ' + (a * b),
            q + ' = ' + ok
          ]
        };
      },
      medium: function () {
        var mode = ri(1, 2);
        if (mode === 1) {
          var a = ri(2, 6), b = ri(2, 6), c = ri(2, 9);
          var ok = (a * b) + 'y − ' + (a * c);
          return {
            q: 'Expand: ' + a + '(' + b + 'y − ' + c + ')',
            ok: ok,
            wrong: fill3(ok, [
              { t: (a * b) + 'y − ' + c, d: 'Multiply the second term: ' + a + ' × ' + c + ' = ' + (a * c) + '.' },
              { t: (a + b) + 'y − ' + (a + c), d: 'Multiply, don\'t add: ' + a + ' × ' + b + 'y = ' + (a * b) + 'y.' },
              { t: (a * b) + 'y + ' + (a * c), d: 'Keep the minus: ' + a + '(' + b + 'y − ' + c + ') = ' + ok + '.' }
            ], function () { return near(ok, a + ' × ' + b + ' = ' + (a * b) + ' and ' + a + ' × ' + c + ' = ' + (a * c) + '.'); }),
            steps: [
              a + ' × ' + b + 'y = ' + (a * b) + 'y',
              a + ' × ' + c + ' = ' + (a * c) + ', keep the minus',
              '= ' + ok
            ]
          };
        }
        var a2 = ri(2, 6), b2 = ri(2, 9);
        var ok2 = '−' + a2 + 'x − ' + (a2 * b2);
        return {
          q: 'Expand: −' + a2 + '(x + ' + b2 + ')',
          ok: ok2,
          wrong: [
            { t: '−' + a2 + 'x + ' + (a2 * b2), d: 'A negative outside flips BOTH signs: (−' + a2 + ') × ' + b2 + ' = −' + (a2 * b2) + '.' },
            { t: a2 + 'x − ' + (a2 * b2), d: '(−' + a2 + ') × x = −' + a2 + 'x — the x-term flips too.' },
            { t: '−' + a2 + 'x − ' + b2, d: '(−' + a2 + ') × ' + b2 + ' = −' + (a2 * b2) + ' — multiply the second term.' }
          ],
          steps: [
            '(−' + a2 + ') × x = −' + a2 + 'x',
            '(−' + a2 + ') × ' + b2 + ' = −' + (a2 * b2),
            '−' + a2 + '(x + ' + b2 + ') = ' + ok2
          ]
        };
      }
    }
  });

  /* ═══════════ 4-5 Factor Expressions ═══════════ */
  T4.lessons.push({
    id: 't4l5', code: '4-5', title: 'Factor Expressions',
    sub: 'Greatest common factor · Reverse of expanding',
    calc: false,
    hintA: '🧭 Factoring is expanding in reverse: find the GCF of all the terms and take it outside the parentheses.',
    hintB: '👣 Find the GCF, divide EACH term by it, write GCF(outside)(results inside). Check by expanding back!',
    guide: {
      key: 'Factoring rewrites a sum as a product. Find the greatest common factor (GCF) of all the terms, then write it outside the parentheses.',
      rules: [
        { h: 'FIND THE GCF', b: 'GCF of 12 and 18 = 6' },
        { h: 'FACTOR RULE', b: 'ab + ac = a(b + c)' },
        { h: 'CHECK', b: 'expand your answer — you must get the original' },
        { h: 'REVERSE', b: 'Expanding: 3(x + 4) → 3x + 12 · Factoring: 3x + 12 → 3(x + 4)' }
      ],
      steps: ['Find the GCF of every term', 'Divide each term by the GCF', 'Write the product: GCF(results) — check by expanding'],
      ex: [
        { t: '6x + 12', s: ['GCF of 6 and 12 is 6', '6x ÷ 6 = x and 12 ÷ 6 = 2', '= 6(x + 2)'] },
        { t: '15y − 20', s: ['GCF of 15 and 20 is 5', '15y ÷ 5 = 3y and 20 ÷ 5 = 4', '= 5(3y − 4)'] }
      ],
      try: ['4x + 20', '9y − 6', '10a + 15b'],
      tryAns: ['4(x + 5)', '3(3y − 2)', '5(2a + 3b)']
    },
    gen: {
      easy: function () {
        if (Math.random() < 0.4) {
          var pairs = [[12, 18, 6], [8, 12, 4], [16, 24, 8], [9, 12, 3], [15, 20, 5], [10, 25, 5], [14, 21, 7], [18, 27, 9], [12, 20, 4], [16, 28, 4], [24, 36, 12], [18, 30, 6]];
          var P = pairs[ri(0, pairs.length - 1)];
          var small = P[2] === P[0] ? 5 : (P[0] % P[2] === 0 ? P[2] / gcd(P[2], P[2]) : 2);
          var lcm = P[0] * P[1] / gcd(P[0], P[1]);
          return {
            q: 'What is the GCF of ' + P[0] + ' and ' + P[1] + ' ?',
            ok: String(P[2]),
            wrong: [
              { t: String(P[2] > small ? small : 1), d: 'Yes it divides both — but look for the GREATEST number that divides both ' + P[0] + ' and ' + P[1] + '.' },
              { t: String(lcm), d: 'That is a common MULTIPLE, not a factor — the GCF must DIVIDE both numbers.' },
              { t: String(P[2] * 2), d: 'Does ' + (P[2] * 2) + ' divide ' + P[0] + '? The GCF is the biggest number that divides BOTH.' }
            ],
            steps: [
              'Factors of ' + P[0] + ': ... ' + P[2] + ' divides it',
              'Factors of ' + P[1] + ': ... ' + P[2] + ' divides it too',
              'The greatest common factor = ' + P[2]
            ]
          };
        }
        var g = ri(2, 6), a = ri(2, 8), b = ri(2, 9);
        var expr = (g * a) + 'x + ' + (g * b);
        var ok = g + '(' + a + 'x + ' + b + ')';
        return {
          q: 'Factor completely: ' + expr,
          ok: ok,
          wrong: [
            { t: g + '(' + a + 'x + ' + (g * b) + ')', d: 'Divide BOTH terms by ' + g + ': ' + (g * b) + ' ÷ ' + g + ' = ' + b + '.' },
            { t: g + '(' + (a + 1) + 'x + ' + b + ')', d: 'Check by expanding: ' + g + ' × ' + (a + 1) + 'x = ' + (g * (a + 1)) + 'x, not ' + (g * a) + 'x.' },
            { t: g + '(' + a + 'x + ' + (b + 1) + ')', d: 'Check by expanding: ' + g + ' × ' + (b + 1) + ' = ' + (g * (b + 1)) + ', not ' + (g * b) + '.' }
          ],
          steps: [
            'GCF of ' + (g * a) + ' and ' + (g * b) + ' is ' + g,
            'Divide: ' + (g * a) + 'x ÷ ' + g + ' = ' + a + 'x · ' + (g * b) + ' ÷ ' + g + ' = ' + b,
            expr + ' = ' + ok
          ]
        };
      },
      medium: function () {
        var g = ri(3, 7), a = ri(2, 7), b = ri(2, 8);
        var expr = (g * a) + 'm + ' + (g * b) + 'n';
        var ok = g + '(' + a + 'm + ' + b + 'n)';
        return {
          q: 'Factor completely: ' + expr,
          ok: ok,
          wrong: fill3(ok, [
            { t: g + '(' + a + 'm + ' + (g * b) + 'n)', d: 'Divide the second term too: ' + (g * b) + 'n ÷ ' + g + ' = ' + b + 'n.' },
            { t: g + '(' + (a + 1) + 'm + ' + b + 'n)', d: 'Check by expanding: ' + g + ' × ' + (a + 1) + 'm = ' + (g * (a + 1)) + 'm, not ' + (g * a) + 'm.' },
            { t: g + '(' + a + 'm + ' + (b + 1) + 'n)', d: 'Check by expanding: ' + g + ' × ' + (b + 1) + 'n = ' + (g * (b + 1)) + 'n, not ' + (g * b) + 'n.' }
          ], function () { return near(ok, 'The GCF of the coefficients ' + (g * a) + ' and ' + (g * b) + ' is ' + g + '.'); }),
          steps: [
            'GCF of ' + (g * a) + ' and ' + (g * b) + ' is ' + g,
            'Divide: ' + (g * a) + 'm ÷ ' + g + ' = ' + a + 'm · ' + (g * b) + 'n ÷ ' + g + ' = ' + b + 'n',
            expr + ' = ' + ok
          ]
        };
      }
    }
  });

  /* ═══════════ 4-6 Add Expressions ═══════════ */
  T4.lessons.push({
    id: 't4l6', code: '4-6', title: 'Add Expressions',
    sub: 'Group like terms · Signs stay the same',
    calc: false,
    hintA: '🧭 Adding expressions: just drop the parentheses — no sign changes.',
    hintB: '👣 Drop the parentheses, group the x-terms and the numbers, then combine. Adding never flips a sign!',
    guide: {
      key: 'To add expressions, combine their like terms. Because you are adding, the signs do not change when you remove the parentheses.',
      rules: [
        { h: 'DROP ( )', b: '(3x + 5) + (2x + 4) = 3x + 5 + 2x + 4' },
        { h: 'SIGNS STAY', b: 'adding changes nothing' },
        { h: 'GROUP', b: '(3x + 2x) + (5 + 4)' },
        { h: 'COMBINE', b: '= 5x + 9' }
      ],
      steps: ['Remove the parentheses (signs stay the same)', 'Group like terms next to each other', 'Combine the coefficients and the constants'],
      ex: [
        { t: '(3x + 5) + (2x + 4)', s: ['Drop parentheses: 3x + 5 + 2x + 4', 'Group: (3x + 2x) + (5 + 4)', '= 5x + 9'] },
        { t: '(4y − 3) + (2y + 7)', s: ['Drop parentheses: 4y − 3 + 2y + 7', 'Group: (4y + 2y) + (−3 + 7)', '= 6y + 4'] }
      ],
      try: ['(2x + 3) + (4x + 5)', '(6y − 2) + (3y + 8)', '(7a + b) + (−2a + 4b)'],
      tryAns: ['6x + 8', '9y + 6', '5a + 5b']
    },
    gen: {
      easy: function () {
        var a = ri(2, 8), b = ri(2, 9), c = ri(2, 6), d = ri(2, 9);
        var q = '(' + a + 'x + ' + b + ') + (' + c + 'x + ' + d + ')';
        var ok = (a + c) + 'x + ' + (b + d);
        return {
          q: 'Add: ' + q,
          ok: ok,
          wrong: fill3(ok, [
            { t: (a + c) + 'x + ' + Math.abs(b - d), d: 'Adding keeps every sign: ' + b + ' + ' + d + ' = ' + (b + d) + '.' },
            { t: (a * c) + 'x + ' + (b + d), d: 'ADD the coefficients: ' + a + ' + ' + c + ' = ' + (a + c) + '.' },
            { t: (a + c) + 'x<sup>2</sup> + ' + (b + d), d: 'The variable stays x, never x<sup>2</sup>: ' + a + 'x + ' + c + 'x = ' + (a + c) + 'x.' }
          ], function () { return near(ok, 'x-terms: ' + a + ' + ' + c + ' = ' + (a + c) + ' · constants: ' + b + ' + ' + d + ' = ' + (b + d) + '.'); }),
          steps: [
            'Drop the parentheses: ' + a + 'x + ' + b + ' + ' + c + 'x + ' + d,
            'Group: (' + a + 'x + ' + c + 'x) + (' + b + ' + ' + d + ')',
            '= ' + ok
          ]
        };
      },
      medium: function () {
        var mode = ri(1, 2);
        if (mode === 1) {
          var a = ri(3, 9), b = ri(2, 9), c = ri(2, 6), d = ri(2, 9);
          var q = '(' + a + 'y − ' + b + ') + (' + c + 'y + ' + d + ')';
          var constSum = d - b;
          var ok = (a + c) + 'y ' + (constSum < 0 ? '− ' + Math.abs(constSum) : '+ ' + constSum);
          return {
            q: 'Add: ' + q,
            ok: ok,
            wrong: fill3(ok, [
              { t: (a + c) + 'y + ' + (b + d), d: 'The −' + b + ' keeps its sign: −' + b + ' + ' + d + ' = ' + (constSum < 0 ? '−' + Math.abs(constSum) : constSum) + '.' },
              { t: (a - c) + 'y ' + (constSum < 0 ? '− ' + Math.abs(constSum) : '+ ' + constSum), d: 'Adding: ' + a + 'y + ' + c + 'y = ' + (a + c) + 'y.' },
              { t: (a + c) + 'y − ' + Math.abs(b + d), d: '−' + b + ' + ' + d + ' = ' + (constSum < 0 ? '−' + Math.abs(constSum) : '+' + constSum) + ' — the +' + d + ' lifts it.' }
            ], function () { return near(ok, 'Group: (' + a + 'y + ' + c + 'y) + (−' + b + ' + ' + d + ').'); }),
            steps: [
              'Drop the parentheses: ' + a + 'y − ' + b + ' + ' + c + 'y + ' + d,
              'Group: (' + a + 'y + ' + c + 'y) + (−' + b + ' + ' + d + ')',
              '= ' + ok
            ]
          };
        }
        var a2 = ri(4, 9), b2 = ri(2, 6), c2 = ri(3, 8), d2 = ri(2, 6), c3 = ri(1, 9);
        var q2 = '(' + a2 + 'a + ' + b2 + 'b + ' + c3 + ') + (−' + c2 + 'a + ' + d2 + 'b)';
        var okA = a2 - c2, okB = b2 + d2;
        var ok = okA + 'a + ' + okB + 'b + ' + c3;
        return {
          q: 'Add: ' + q2,
          ok: ok,
          wrong: fill3(ok, [
            { t: (a2 + c2) + 'a + ' + okB + 'b + ' + c3, d: 'The −' + c2 + 'a is added as a NEGATIVE: ' + a2 + 'a − ' + c2 + 'a = ' + okA + 'a.' },
            { t: okA + 'a + ' + Math.abs(b2 - d2) + 'b + ' + c3, d: 'The b-terms: ' + b2 + 'b + ' + d2 + 'b = ' + okB + 'b.' },
            { t: okA + 'a + ' + okB + 'b + ' + (c3 + 1), d: 'The constant ' + c3 + ' has no partner — it stays ' + c3 + '.' }
          ], function () { return near(ok, 'a-terms: ' + a2 + ' − ' + c2 + ' · b-terms: ' + b2 + ' + ' + d2 + '.'); }),
          steps: [
            'Drop the parentheses: ' + a2 + 'a + ' + b2 + 'b + ' + c3 + ' − ' + c2 + 'a + ' + d2 + 'b',
            'Group: (' + a2 + 'a − ' + c2 + 'a) + (' + b2 + 'b + ' + d2 + 'b) + ' + c3,
            '= ' + ok
          ]
        };
      }
    }
  });

  /* ═══════════ 4-7 Subtract Expressions ═══════════ */
  T4.lessons.push({
    id: 't4l7', code: '4-7', title: 'Subtract Expressions',
    sub: 'Add the opposite · Change every sign',
    calc: false,
    hintA: '🧭 Subtracting = adding the opposite: change the sign of EVERY term in the second expression.',
    hintB: '👣 Distribute the minus: −(x + 3) = −x − 3 and −(x − 3) = −x + 3. Then combine like terms.',
    guide: {
      key: 'To subtract expressions, add the opposite: change the sign of every term in the second expression, then combine like terms.',
      rules: [
        { h: 'A − B = A + (−B)', b: 'subtracting is adding the opposite' },
        { h: 'CHANGE EVERY SIGN', b: '−(x + 3) = −x − 3 · −(x − 3) = −x + 3' },
        { h: 'COMMON ERROR', b: '8 − (2x + 3) = 8 − 2x − 3 (NOT + 3)' },
        { h: 'THEN COMBINE', b: 'group like terms and simplify' }
      ],
      steps: ['Write the subtraction with parentheses', 'Change EVERY sign of the 2nd expression', 'Combine like terms'],
      ex: [
        { t: '(5x + 8) − (2x + 3)', s: ['Change every sign: 5x + 8 − 2x − 3', 'Group: (5x − 2x) + (8 − 3)', '= 3x + 5'] },
        { t: '(7y + 2) − (3y − 4)', s: ['Change every sign: 7y + 2 − 3y + 4', '−(−4) = +4 !', '= 4y + 6'] }
      ],
      try: ['(6x + 9) − (2x + 4)', '(8y − 3) − (3y − 7)', '(5a + 2b) − (a − 3b)'],
      tryAns: ['4x + 5', '5y + 4', '4a + 5b']
    },
    gen: {
      easy: function () {
        var a = ri(5, 9), c = ri(2, 4), b = ri(5, 9), d = ri(2, 4);
        var q = '(' + a + 'x + ' + b + ') − (' + c + 'x + ' + d + ')';
        var ok = (a - c) + 'x + ' + (b - d);
        return {
          q: 'Subtract: ' + q,
          ok: ok,
          wrong: fill3(ok, [
            { t: (a - c) + 'x + ' + (b + d), d: 'Change EVERY sign: −(' + c + 'x + ' + d + ') = −' + c + 'x − ' + d + ', so ' + b + ' − ' + d + ' = ' + (b - d) + '.' },
            { t: (a + c) + 'x + ' + (b - d), d: 'Subtract the x-terms: ' + a + 'x − ' + c + 'x = ' + (a - c) + 'x.' },
            { t: (a - c) + 'x − ' + (b - d), d: 'The constants: ' + b + ' − ' + d + ' = +' + (b - d) + '.' }
          ], function () { return near(ok, 'Change every sign of the 2nd parentheses, then combine.'); }),
          steps: [
            'Change every sign: ' + a + 'x + ' + b + ' − ' + c + 'x − ' + d,
            'Group: (' + a + 'x − ' + c + 'x) + (' + b + ' − ' + d + ')',
            '= ' + ok
          ]
        };
      },
      medium: function () {
        var mode = ri(1, 2);
        if (mode === 1) {
          var a = ri(6, 12), c = ri(2, 5), b = ri(2, 8), d = ri(2, 9);
          var q = '(' + a + 'y + ' + b + ') − (' + c + 'y − ' + d + ')';
          var ok = (a - c) + 'y + ' + (b + d);
          return {
            q: 'Subtract: ' + q,
            ok: ok,
            wrong: fill3(ok, [
              { t: (a - c) + 'y + ' + (b - d), d: '−(−' + d + ') = +' + d + '! Then ' + b + ' + ' + d + ' = ' + (b + d) + '.' },
              { t: (a - c) + 'y − ' + (b + d), d: 'Change every sign: −(' + c + 'y − ' + d + ') = −' + c + 'y + ' + d + '.' },
              { t: (a + c) + 'y + ' + (b + d), d: 'You ADDED the y-terms — subtract: ' + a + 'y − ' + c + 'y = ' + (a - c) + 'y.' }
            ], function () { return near(ok, 'Distribute the minus to BOTH terms.'); }),
            steps: [
              'Change every sign: ' + a + 'y + ' + b + ' − ' + c + 'y + ' + d,
              'Group: (' + a + 'y − ' + c + 'y) + (' + b + ' + ' + d + ')',
              '= ' + ok
            ]
          };
        }
        var b2 = ri(6, 12), c2 = ri(2, 4), d2 = ri(2, 4);
        var q2 = b2 + ' − (' + c2 + 'x + ' + d2 + ')';
        var ok2 = '−' + c2 + 'x + ' + (b2 - d2);
        return {
          q: 'Subtract: ' + q2,
          ok: ok2,
          wrong: fill3(ok2, [
            { t: c2 + 'x + ' + (b2 - d2), d: 'The ' + c2 + 'x flips sign: ' + b2 + ' − ' + c2 + 'x − ' + d2 + ' = −' + c2 + 'x + ' + (b2 - d2) + '.' },
            { t: '−' + c2 + 'x + ' + (b2 + d2), d: b2 + ' − ' + d2 + ' = ' + (b2 - d2) + ' — subtract, don\'t add.' },
            { t: c2 + 'x + ' + (b2 + d2), d: 'Change every sign: −(' + c2 + 'x + ' + d2 + ') = −' + c2 + 'x − ' + d2 + ', so ' + b2 + ' − ' + d2 + ' = ' + (b2 - d2) + '.' }
          ], function () { return near(ok2, 'Distribute the minus to both terms inside.'); }),
          steps: [
            'Change every sign: ' + b2 + ' − ' + c2 + 'x − ' + d2,
            'Group: ' + b2 + ' − ' + d2 + ' = ' + (b2 - d2),
            '= ' + ok2
          ]
        };
      }
    }
  });

  /* ═══════════ 4-8 Analyze Equivalent Expressions ═══════════ */
  T4.lessons.push({
    id: 't4l8', code: '4-8', title: 'Analyze Equivalent Expressions',
    sub: 'Simplify · Test values · Compare forms',
    calc: false,
    hintA: '🧭 Same value for EVERY x → equivalent. Different for ANY x → not equivalent.',
    hintB: '👣 Method 1: simplify both. Method 2: test x = 1 AND x = 2. One mismatch kills it!',
    guide: {
      key: 'Two expressions are equivalent if they have the same value for every value of the variable. Rewrite them in the same form or test values.',
      rules: [
        { h: 'Simplify', b: 'expand and combine, then compare' },
        { h: 'TEST VALUES', b: 'one mismatch → NOT equivalent' },
        { h: 'MATCHING ONCE', b: 'proves nothing! test again' },
        { h: 'SAME FORM', b: '4(x + 2) = 4x + 8' }
      ],
      steps: ['Rewrite: expand, factor or combine like terms', 'Compare: do both look the same?', 'Confirm with one or two test values'],
      ex: [
        { t: '2(x + 3) + x and 3x + 6', s: ['Expand: 2x + 6 + x', 'Combine: 3x + 6', 'Same → equivalent ✓'] },
        { t: '4x + 8 and 4(x + 8)', s: ['Expand: 4(x + 8) = 4x + 32', '4x + 8 ≠ 4x + 32', 'Test x = 1: 12 vs 36 → NOT equivalent'] }
      ],
      try: ['Are 5(x + 2) and 5x + 10 equivalent?', 'Are 3x + 2x and 6x equivalent? Test x = 2', 'Are 2(x + 4) − 3 and 2x + 5 equivalent?'],
      tryAns: ['Yes', 'No (10 vs 12)', 'Yes (2x + 5)']
    },
    gen: {
      easy: function () {
        if (Math.random() < 0.55) {
          var g = ri(2, 5), a = ri(2, 6), c = ri(2, 9);
          var expr = (g * a) + 'x + ' + (g * c);
          var ok = g + '(' + a + 'x + ' + c + ')';
          return {
            q: 'Which expression is equivalent to ' + expr + ' ?',
            ok: ok,
            wrong: fill3(ok, [
              { t: g + '(' + a + 'x + ' + (g * c) + ')', d: 'Divide each term by ' + g + ': ' + (g * c) + ' ÷ ' + g + ' = ' + c + '.' },
              { t: (g * a) + '(x + ' + c + ')', d: 'Expand to check: ' + (g * a) + '(x + ' + c + ') = ' + (g * a) + 'x + ' + (g * a * c) + ' — not the same.' },
              { t: g + '(' + (a + 1) + 'x + ' + c + ')', d: 'Expand to check: ' + g + ' × ' + (a + 1) + 'x = ' + (g * (a + 1)) + 'x, not ' + (g * a) + 'x.' }
            ], function () { return near(ok, 'Take the GCF ' + g + ' outside.'); }),
            steps: [
              'GCF of ' + (g * a) + ' and ' + (g * c) + ' is ' + g,
              expr + ' = ' + g + '(' + a + 'x + ' + c + ')',
              'Check by expanding: ' + g + ' × ' + a + 'x = ' + (g * a) + 'x and ' + g + ' × ' + c + ' = ' + (g * c) + ' ✓'
            ]
          };
        }
        var a = ri(2, 4), b = ri(2, 8), c = ri(2, 5);
        var ok = (a + c) + 'x + ' + (a * b);
        return {
          q: 'Which expression is equivalent to ' + a + '(x + ' + b + ') + ' + c + 'x ?',
          ok: ok,
          wrong: fill3(ok, [
            { t: (a + c) + 'x + ' + b, d: 'Distribute ' + a + ' to both terms: ' + a + ' × ' + b + ' = ' + (a * b) + '.' },
            { t: (a * c) + 'x + ' + (a * b), d: 'Add the x-terms: ' + a + 'x + ' + c + 'x = ' + (a + c) + 'x.' },
            { t: a + 'x + ' + (a * b) + ' + ' + c, d: 'The last term is ' + c + 'x — an x-TERM! It joins the others: ' + a + 'x + ' + c + 'x = ' + (a + c) + 'x.' }
          ], function () { return near(ok, 'Expand ' + a + '(x + ' + b + ') first, then add ' + c + 'x.'); }),
          steps: [
            'Expand: ' + a + '(x + ' + b + ') = ' + a + 'x + ' + (a * b),
            'Add the x-terms: ' + a + 'x + ' + c + 'x = ' + (a + c) + 'x',
            '= ' + ok
          ]
        };
      },
      medium: function () {
        var t = shuffle([
          {
            q: 'Are 4x + 8 and 4(x + 8) equivalent? Test x = 1.',
            ok: 'No — 4(1) + 8 = 12 but 4(1 + 8) = 36',
            ws: [
              { t: 'Yes — 4(x + 8) = 4x + 8', d: '4(x + 8) = 4x + 32 — multiply BOTH terms inside.' },
              { t: 'Yes — they match at x = 0', d: 'At x = 0: 8 vs 32 — they do NOT match. They never match.' },
              { t: 'Cannot tell without expanding', d: 'Test x = 1: 4 + 8 = 12 but 4(9) = 36 → different → NOT equivalent.' }
            ],
            steps: ['Test x = 1: 4(1) + 8 = 12', '4(1 + 8) = 4 × 9 = 36', '12 ≠ 36 → NOT equivalent']
          },
          {
            q: 'Are 3x + 2x and 6x equivalent? Test x = 2.',
            ok: 'No — 3x + 2x = 5x, and 5(2) = 10 ≠ 12',
            ws: [
              { t: 'Yes — 3 + 3 = 6', d: 'Add the real coefficients: 3 + 2 = 5, so 3x + 2x = 5x.' },
              { t: 'Yes — they match at x = 1', d: 'At x = 1: 5 and 6 — they do NOT even match at x = 1.' },
              { t: 'No — they never match', d: 'They DO match at x = 0 (both 0). But 5x ≠ 6x for x = 2 → not equivalent.' }
            ],
            steps: ['Combine: 3x + 2x = 5x', '5x vs 6x — different forms', 'Test x = 2: 10 vs 12 → NOT equivalent']
          },
          {
            q: 'Are 2(x + 4) − 3 and 2x + 5 equivalent? Test x = 3.',
            ok: 'Yes — 2(7) − 3 = 11 and 2(3) + 5 = 11',
            ws: [
              { t: 'No — 2(x + 4) − 3 = 2x + 1', d: 'Distribute: 2x + 8 − 3 = 2x + 5 — the 8 and 3 combine.' },
              { t: 'Yes — but only when x = 3', d: 'Simplify: 2x + 8 − 3 = 2x + 5 — the SAME form, so equivalent for EVERY x.' },
              { t: 'No — you cannot subtract 3', d: 'You can: 2x + 8 − 3 = 2x + 5 ✓' }
            ],
            steps: ['Expand: 2(x + 4) = 2x + 8', '2x + 8 − 3 = 2x + 5', 'Same form → equivalent (check x = 3: both 11 ✓)']
          }
        ])[0];
        return { q: t.q, ok: t.ok, wrong: t.ws, steps: t.steps };
      }
    }
  });

  function hook() {
    if (!window.G7 || !G7.registerTopic) { setTimeout(hook, 100); return; }
    G7.registerTopic(T4);
  }

  hook();
})();
