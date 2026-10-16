/* ============================================================
   AID Mathematics Academy · Grade 7 — t1.js
   Topic 1 · Integer and Rational Number Operations
   الدروس 1-6 → 1-10 (متطابقة مع كتاب الشغل المرفوع)
   ============================================================ */
(function () {
  'use strict';

  function hook() {
    if (!window.G7 || !G7.registerTopic) { setTimeout(hook, 100); return; }
    G7.registerTopic(T1);
  }

  /* ─── أدوات ─── */
  function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function n2s(n) { return n < 0 ? '−' + Math.abs(n) : String(n); }
  function sgn() { return Math.random() < 0.5 ? -1 : 1; }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a || 1; }
  function frac(n, d) {
    var s = n < 0 ? '−' : '';
    n = Math.abs(n); d = Math.abs(d);
    var g = gcd(n, d); n /= g; d /= g;
    if (d === 1) return s + n;
    return s + n + '/' + d;
  }
  function dec2(n) { return (n < 0 ? '−' : '') + Math.abs(n).toFixed(2).replace(/0$/, ''); }
  function dec1(n) { return (n < 0 ? '−' : '') + Math.abs(n).toFixed(1); }

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

  var T1 = {
    id: 't1', num: 1, icon: '🧮', color: '#0d9488',
    title: 'Integer and Rational Number Operations',
    sub: 'Multiplying and dividing integers and rational numbers',
    lessons: []
  };

  /* ═══════════ 1-6 Multiply Integers ═══════════ */
  T1.lessons.push({
    id: 't1l1', code: '1-6', title: 'Multiply Integers',
    sub: 'Sign rules · Multiplying positive and negative integers',
    calc: false,
    hintA: '🧭 Cover the signs with your finger and multiply the two numbers first.',
    hintB: '👣 Same signs → the answer is positive (+). Different signs → the answer is negative (−).',
    guide: {
      key: 'To multiply integers, multiply their absolute values first, then use the sign rule to decide if the product is positive or negative.',
      rules: [
        { h: 'SAME SIGNS → (+)', b: '3 × 4 = 12 · (−3) × (−4) = 12' },
        { h: 'DIFFERENT → (−)', b: '3 × (−4) = −12 · (−3) × 4 = −12' },
        { h: 'COUNT NEGATIVES', b: 'Even number of (−) → positive · Odd number of (−) → negative' },
        { h: 'SPECIAL RULES', b: 'n × 0 = 0 · n × 1 = n · n × (−1) = −n' }
      ],
      steps: ['Multiply the absolute values (ignore the signs)', 'Choose the sign: same → (+), different → (−)', 'Write the sign in front of the product'],
      ex: [
        { t: '(−6) × 4', s: ['Multiply: 6 × 4 = 24', 'Different signs → negative', '(−6) × 4 = −24'] },
        { t: '(−7) × (−5)', s: ['Multiply: 7 × 5 = 35', 'Same signs → positive', '(−7) × (−5) = 35'] }
      ],
      try: ['(−9) × 3', '(−8) × (−6)', '7 × (−5)'],
      tryAns: ['−27', '48', '−35']
    },
    gen: {
      easy: function () {
        var a = ri(3, 12), b = ri(3, 12), sa = sgn(), sb = sgn();
        var s = sa * sb, mag = a * b, n = s * mag;
        var wrongs = [
          { t: n2s(-n), d: 'You found ' + a + ' × ' + b + ' = ' + mag + ' correctly — but check the signs: same signs → (+), different signs → (−).' },
          { t: n2s(s * (mag + a)), d: 'Careful: ' + a + ' × ' + b + ' = ' + mag + '. Recheck the multiplication.' },
          { t: n2s(s * (mag - b)), d: 'Careful: ' + a + ' × ' + b + ' = ' + mag + '. Recheck the multiplication.' }
        ];
        return {
          q: '(' + n2s(sa * a) + ') × ' + (sb < 0 ? '(' + n2s(sb * b) + ')' : b) + ' = ?',
          ok: n2s(n),
          wrong: fill3(n2s(n), wrongs, function () { return { t: n2s(s * (mag + ri(2, 5))), d: 'Recheck: ' + a + ' × ' + b + ' = ' + mag + ' and watch the sign rule.' }; }),
          steps: [
            'Multiply the absolute values: ' + a + ' × ' + b + ' = ' + mag,
            s > 0 ? 'Same signs → positive' : 'Different signs → negative',
            'Answer: ' + n2s(n)
          ]
        };
      },
      medium: function () {
        if (Math.random() < 0.3) {
          var v = ri(2, 12);
          if (Math.random() < 0.5) {
            return {
              q: '(' + n2s(-v) + ') × (−1) = ?',
              ok: n2s(v),
              wrong: [
                { t: n2s(-v), d: 'Multiplying by (−1) flips the sign: (−' + v + ') × (−1) = +' + v + '.' },
                { t: '−1', d: 'The answer is the number itself with its sign flipped, not (−1).' },
                { t: '1', d: 'Multiplying by (−1) gives the opposite of the number: +' + v + '.' }
              ],
              steps: ['n × (−1) = −n, so (−' + v + ') × (−1) = ' + v, 'A negative times a negative is positive']
            };
          }
          return {
            q: v + ' × 0 = ?',
            ok: '0',
            wrong: [
              { t: n2s(v), d: 'Any number multiplied by 0 is 0.' },
              { t: '1', d: 'That rule is for × 1: n × 1 = n. For × 0 the answer is always 0.' },
              { t: n2s(-v), d: 'Any number multiplied by 0 is 0 — the sign never matters.' }
            ],
            steps: ['n × 0 = 0 for every number', 'Answer: 0']
          };
        }
        var a = ri(2, 6), b = ri(2, 6), c = ri(2, 6);
        var negs = ri(1, 3);
        var f = [sgn(), sgn(), sgn()];
        var negCount = (f[0] < 0) + (f[1] < 0) + (f[2] < 0);
        while (negCount !== negs) { f[ri(0, 2)] = -f[ri(0, 2)]; negCount = (f[0] < 0) + (f[1] < 0) + (f[2] < 0); }
        var s = f[0] * f[1] * f[2], mag = a * b * c, n = s * mag;
        var qs = '(' + n2s(f[0] * a) + ') × ' + (f[1] < 0 ? '(' + n2s(f[1] * b) + ')' : b) + ' × ' + (f[2] < 0 ? '(' + n2s(f[2] * c) + ')' : c);
        return {
          q: qs + ' = ?',
          ok: n2s(n),
          wrong: fill3(n2s(n), [
            { t: n2s(-n), d: 'Count the negative signs: ' + negs + (negs % 2 === 0 ? ' (even) → the answer is positive.' : ' (odd) → the answer is negative.') },
            { t: n2s(s * (mag + a)), d: 'Multiply two numbers first: ' + a + ' × ' + b + ' = ' + (a * b) + ', then × ' + c + ' = ' + mag + '.' },
            { t: n2s(s * (mag - c)), d: 'Recheck: ' + a + ' × ' + b + ' × ' + c + ' = ' + mag + '.' }
          ], function () { return { t: n2s(s * (mag + ri(2, 6))), d: 'Multiply step by step, then apply the sign rule (' + negs + ' negatives → ' + (negs % 2 === 0 ? '+' : '−') + ').' }; }),
          steps: [
            'First two: ' + n2s(f[0] * a) + ' × ' + n2s(f[1] * b) + ' = ' + n2s(f[0] * f[1] * a * b),
            'Then: ' + n2s(f[0] * f[1] * a * b) + ' × ' + n2s(f[2] * c) + ' = ' + n2s(n),
            negs + ' negative sign(s) → ' + (negs % 2 === 0 ? 'positive' : 'negative')
          ]
        };
      }
    }
  });

  /* ═══════════ 1-7 Multiply Rational Numbers ═══════════ */
  T1.lessons.push({
    id: 't1l2', code: '1-7', title: 'Multiply Rational Numbers',
    sub: 'Fractions, mixed numbers and decimals',
    calc: false,
    hintA: '🧭 Convert everything to fractions first, then multiply Top × Top and Bottom × Bottom.',
    hintB: '👣 Decide the sign (same → +, different → −), cancel common factors, then multiply tops and bottoms.',
    guide: {
      key: 'A rational number can be written as a fraction a/b. Multiply fractions with Top × Top and Bottom × Bottom, and use the integer sign rules.',
      rules: [
        { h: 'MULTIPLY FRACTIONS', b: 'a/b × c/d = (a×c) / (b×d)' },
        { h: 'SIGN RULE', b: 'Same signs → (+) · Different signs → (−)' },
        { h: 'CONVERT FIRST', b: '1½ = 3/2 · 0.4 = 2/5' },
        { h: 'SIMPLIFY', b: 'Divide top and bottom by the GCF' }
      ],
      steps: ['Convert mixed numbers and decimals to fractions', 'Decide the sign', 'Cancel common factors, then multiply top × top, bottom × bottom'],
      ex: [
        { t: '(−2/3) × 9/10', s: ['Different signs → negative', 'Cancel: 9 ÷ 3 = 3, 10 ÷ 2 = 5', '(−2×9)/(3×10) = −3/5'] },
        { t: '(−0.4) × 0.3', s: ['Multiply 4 × 3 = 12', 'Decimal places: 1 + 1 = 2', 'Different signs → −0.12'] }
      ],
      try: ['3/4 × (−8/9)', '(−1 1/2) × 4/5', '(−0.5) × (−0.6)'],
      tryAns: ['−2/3', '−6/5', '0.3']
    },
    gen: {
      easy: function () {
        if (Math.random() < 0.4) {
          var a = ri(2, 9), b = ri(2, 9);
          var s = sgn();
          var prod = s * a * b / 100;
          var strp = (s < 0 ? '−' : '') + '0.' + String(a * b < 10 ? '0' : '').replace('undefined', '') + String(a * b);
          strp = (s < 0 ? '−' : '') + (a * b < 10 ? '0.' + '0' + a * b : '0.' + a * b);
          return {
            q: '(' + (s < 0 ? '−' : '') + '0.' + a + ') × 0.' + b + ' = ?',
            ok: strp,
            wrong: fill3(strp, [
              { t: (s < 0 ? '' : '−') + (a * b < 10 ? '0.0' + a * b : '0.' + a * b), d: 'You multiplied ' + a + ' × ' + b + ' = ' + (a * b) + ' correctly, but check the sign rule.' },
              { t: (s < 0 ? '−' : '') + (a * b < 10 ? a * b : a * b) / 10, d: 'Count decimal places: 0.' + a + ' has 1 and 0.' + b + ' has 1 → the product needs 2 decimal digits.' },
              { t: (s < 0 ? '−' : '') + '0.' + (a + b < 10 ? '0' + (a + b) : a + b), d: 'You added the numbers instead of multiplying: ' + a + ' × ' + b + ' = ' + (a * b) + '.' }
            ], function () {
              var v = a * b + 1;
              return { t: (s < 0 ? '−' : '') + '0.' + (v < 10 ? '0' + v : v), d: 'Multiply ' + a + ' × ' + b + ' first, then place 2 decimal digits.' };
            }),
            steps: [
              'Signs: ' + (s < 0 ? 'different → (−)' : 'both positive → (+)'),
              'Multiply 4-digits: ' + a + ' × ' + b + ' = ' + (a * b),
              'Decimal places: 1 + 1 = 2 → ' + strp
            ]
          };
        }
        var b = ri(2, 9), d = ri(2, 9), a = ri(1, b - 1), c = ri(1, d - 1);
        var s = sgn();
        var num = s * a * c, den = b * d;
        var ans = frac(num, den);
        return {
          q: '(' + (s < 0 ? '−' : '') + a + '/' + b + ') × ' + c + '/' + d + ' = ?',
          ok: ans,
          wrong: fill3(ans, [
            { t: frac(-num, den), d: 'You multiplied correctly — but check the sign: ' + (s < 0 ? 'different signs → (−)' : 'same signs → (+)') + '.' },
            { t: frac(s * a * d, b * c), d: 'You multiplied top×bottom and bottom×top — that flips it. Multiply Top × Top and Bottom × Bottom.' },
            { t: frac(s * (a + c), b + d), d: 'You added the fractions instead of multiplying.' }
          ], function () { return { t: frac(num * 2, den), d: 'Multiply Top × Top and Bottom × Bottom, then simplify.' }; }),
          steps: [
            s < 0 ? 'Different signs → negative' : 'Same signs → positive',
            'Top × Top: ' + a + ' × ' + c + ' = ' + (a * c) + ' · Bottom × Bottom: ' + b + ' × ' + d + ' = ' + (b * d),
            'Simplify: ' + ans
          ]
        };
      },
      medium: function () {
        var w = ri(1, 3), n = ri(1, 3), dd = n + ri(1, 3);
        var p = ri(1, 5), q = p + ri(1, 5);
        var s = sgn();
        var num = s * (w * dd + n) * p, den = dd * q;
        var ans = frac(num, den);
        var mix = (s < 0 ? '−' : '') + w + ' ' + n + '/' + dd;
        return {
          q: '(' + mix + ') × ' + p + '/' + q + ' = ?',
          ok: ans,
          wrong: [
            { t: frac(-num, den), d: 'Check the sign rule: ' + (s < 0 ? 'different signs → the product is negative' : 'same signs → the product is positive') + '.' },
            { t: frac(s * w * p, q), d: 'You multiplied only the whole-number part. Convert the mixed number first: ' + mix + ' = ' + (s < 0 ? '−' : '') + (w * dd + n) + '/' + dd + '.' },
            { t: frac(s * ((w * dd + n) * q + dd * p), den), d: 'You added instead of multiplying.' }
          ],
          steps: [
            'Convert: ' + mix + ' = ' + (s < 0 ? '−' : '') + (w * dd + n) + '/' + dd,
            'Multiply: ' + (s < 0 ? '−' : '') + (w * dd + n) + ' × ' + p + ' = ' + Math.abs(num) + ' tops, ' + dd + ' × ' + q + ' = ' + den + ' bottoms',
            'Simplify: ' + ans
          ]
        };
      }
    }
  });

  /* ═══════════ 1-8 Divide Integers ═══════════ */
  T1.lessons.push({
    id: 't1l3', code: '1-8', title: 'Divide Integers',
    sub: 'Sign rules · Fact families · Division with zero',
    calc: false,
    hintA: '🧭 Division follows the SAME sign rules as multiplication.',
    hintB: '👣 Divide the absolute values, then choose the sign: same → (+), different → (−).',
    hintC: '🗺️ Zero divided by any number is 0 — but any number divided by zero is UNDEFINED.',
    guide: {
      key: 'Division is the opposite of multiplication, so the sign rules are exactly the same: divide the absolute values, then decide the sign.',
      rules: [
        { h: 'SAME SIGNS → (+)', b: '12 ÷ 4 = 3 · (−12) ÷ (−4) = 3' },
        { h: 'DIFFERENT → (−)', b: '12 ÷ (−4) = −3 · (−12) ÷ 4 = −3' },
        { h: 'ZERO ÷ n = 0', b: '0 ÷ (−5) = 0' },
        { h: 'n ÷ 0 = UNDEFINED', b: 'You can never divide by zero' }
      ],
      steps: ['Divide the absolute values', 'Choose the sign: same → (+), different → (−)', 'Check: quotient × divisor = dividend'],
      ex: [
        { t: '(−48) ÷ 6', s: ['Divide: 48 ÷ 6 = 8', 'Different signs → negative', '(−48) ÷ 6 = −8'] },
        { t: '(−36) ÷ (−9)', s: ['Divide: 36 ÷ 9 = 4', 'Same signs → positive', '(−36) ÷ (−9) = 4'] }
      ],
      try: ['(−35) ÷ 5', '(−63) ÷ (−7)', '40 ÷ (−8)'],
      tryAns: ['−7', '9', '−5']
    },
    gen: {
      easy: function () {
        var dvs = ri(3, 9), qt = ri(3, 12);
        while (qt === dvs) { qt = ri(3, 12); }
        var s = sgn();
        var dvd = s * dvs * qt;
        var useFam = Math.random() < 0.5;
        var q = useFam
          ? 'Since ' + n2s(s * qt) + ' × ' + dvs + ' = ' + n2s(dvd) + ', what is ' + n2s(dvd) + ' ÷ ' + dvs + ' = ?'
          : n2s(dvd) + ' ÷ ' + dvs + ' = ?';
        return {
          q: q,
          ok: n2s(s * qt),
          wrong: fill3(n2s(s * qt), [
            { t: n2s(-s * qt), d: 'Division follows the SAME sign rules as multiplication: ' + (s > 0 ? 'same signs → (+)' : 'different signs → (−)') + '.' },
            { t: n2s(s * dvs), d: 'You divided by the wrong number — the divisor is ' + dvs + ', so ' + Math.abs(dvd) + ' ÷ ' + dvs + ' = ' + qt + '.' },
            { t: n2s(s * (qt + 2)), d: 'Recheck: ' + Math.abs(dvd) + ' ÷ ' + dvs + ' = ' + qt + ' (because ' + qt + ' × ' + dvs + ' = ' + Math.abs(dvd) + ').' }
          ], function () { return { t: n2s(s * (qt + 1)), d: 'Check with the fact family: ' + qt + ' × ' + dvs + ' = ' + Math.abs(dvd) + '.' }; }),
          steps: [
            'Divide absolute values: ' + Math.abs(dvd) + ' ÷ ' + dvs + ' = ' + qt,
            s > 0 ? 'Same signs → positive' : 'Different signs → negative',
            'Answer: ' + n2s(s * qt)
          ]
        };
      },
      medium: function () {
        var r = Math.random();
        if (r < 0.35) {
          var a = ri(3, 12);
          if (Math.random() < 0.5) {
            return {
              q: '0 ÷ (' + n2s(-a) + ') = ?',
              ok: '0',
              wrong: [
                { t: n2s(-a), d: 'Zero divided by ANY non-zero number is 0.' },
                { t: 'Undefined', d: 'Undefined is when you divide BY zero. Here zero is the dividend, so the answer is 0.' },
                { t: '1', d: '0 ÷ n = 0 for every non-zero n — not 1.' }
              ],
              steps: ['Zero divided by any non-zero number is 0', 'Answer: 0']
            };
          }
          return {
            q: '(' + n2s(-a) + ') ÷ 0 = ?',
            ok: 'Undefined',
            wrong: [
              { t: '0', d: 'That rule is 0 ÷ n = 0. Here you are dividing BY zero — which is never allowed.' },
              { t: n2s(-a), d: 'You cannot divide by zero at all — the answer is Undefined.' },
              { t: '1', d: 'n ÷ 0 has no answer — it is Undefined.' }
            ],
            steps: ['Dividing by zero is never allowed', 'Answer: Undefined']
          };
        }
        var dvs = ri(6, 12), qt = ri(6, 15);
        while (qt === dvs) { qt = ri(6, 15); }
        var sd = sgn(), sv = sgn();          /* علامة المقاموع وعلامة القاسم مستقلين */
        var dvd = sd * dvs * qt;
        var div = sv * dvs;
        var same = sd * sv > 0;
        var ansV = sd * sv * qt;
        return {
          q: n2s(dvd) + ' ÷ ' + (sv < 0 ? '(' + n2s(div) + ')' : n2s(div)) + ' = ?',
          ok: n2s(ansV),
          wrong: fill3(n2s(ansV), [
            { t: n2s(-ansV), d: 'Check the signs: ' + (same ? 'same signs → the quotient is positive' : 'different signs → the quotient is negative') + '.' },
            { t: n2s(sd * dvs), d: 'Careful: ' + Math.abs(dvd) + ' ÷ ' + Math.abs(dvs) + ' = ' + qt + '.' },
            { t: n2s(sd * sv * (qt - 3)), d: 'Recheck the division: ' + qt + ' × ' + Math.abs(dvs) + ' = ' + Math.abs(dvd) + '.' }
          ], function () { return { t: n2s(sd * sv * (qt + 1)), d: 'Check: ' + qt + ' × ' + dvs + ' = ' + Math.abs(dvd) + '.' }; }),
          steps: [
            'Divide absolute values: ' + Math.abs(dvd) + ' ÷ ' + Math.abs(dvs) + ' = ' + qt,
            same ? 'Same signs → positive' : 'Different signs → negative',
            'Check: ' + n2s(ansV) + ' × ' + n2s(div) + ' = ' + n2s(dvd)
          ]
        };
      }
    }
  });

  /* ═══════════ 1-9 Divide Rational Numbers ═══════════ */
  T1.lessons.push({
    id: 't1l4', code: '1-9', title: 'Divide Rational Numbers',
    sub: 'Keep – Change – Flip · Reciprocals',
    calc: false,
    hintA: '🧭 Dividing by a fraction = multiplying by its reciprocal. Keep – Change – Flip!',
    hintB: '👣 Keep the first fraction, change ÷ to ×, flip the SECOND fraction, then multiply.',
    guide: {
      key: 'Dividing by a fraction is the same as multiplying by its reciprocal: Keep – Change – Flip, then follow the multiplication and sign rules.',
      rules: [
        { h: 'KEEP', b: 'the first fraction stays the same' },
        { h: 'CHANGE', b: '÷ becomes ×' },
        { h: 'FLIP', b: 'the second fraction (swap top and bottom)' },
        { h: 'RECIPROCAL', b: '3/4 ↔ 4/3 · the sign stays' }
      ],
      steps: ['Keep the first fraction', 'Change ÷ to × and Flip the divisor', 'Multiply and simplify'],
      ex: [
        { t: '3/4 ÷ (−9/8)', s: ['KCF: 3/4 × (−8/9)', 'Different signs → negative; cancel', '= −2/3'] },
        { t: '(−5/6) ÷ (−10/3)', s: ['KCF: (−5/6) × (−3/10)', 'Same signs → positive; cancel', '= 1/4'] }
      ],
      try: ['2/5 ÷ 4/15', '(−7/8) ÷ 7/2', '(−4) ÷ (−2/3)'],
      tryAns: ['3/2', '−1/4', '6']
    },
    gen: {
      easy: function () {
        if (Math.random() < 0.35) {
          var b = ri(2, 9), a = ri(1, b - 1), s = sgn();
          return {
            q: 'What is the reciprocal of ' + (s < 0 ? '−' : '') + a + '/' + b + ' ?',
            ok: (s < 0 ? '−' : '') + b + '/' + a,
            wrong: [
              { t: (s < 0 ? '−' : '') + a + '/' + b, d: 'That is the SAME fraction — the reciprocal swaps the top and the bottom.' },
              { t: (s < 0 ? '' : '−') + b + '/' + a, d: 'You swapped correctly, but the reciprocal keeps the same sign.' },
              { t: (s < 0 ? '' : '−') + a + '/' + b, d: 'You only changed the sign — the reciprocal means top and bottom swap places.' }
            ],
            steps: [
              'Reciprocal = swap the numerator and the denominator',
              (s < 0 ? '−' : '') + a + '/' + b + ' → ' + (s < 0 ? '−' : '') + b + '/' + a
            ]
          };
        }
        var b = ri(2, 9), d = ri(2, 9), a = ri(1, b - 1), c = ri(1, d - 1);
        while (a * d === b * c) { b = ri(3, 9); d = ri(3, 9); a = ri(1, b - 1); c = ri(1, d - 1); }   /* ممنوع كسرين متساويين */
        var s = sgn();
        var num = s * a * d, den = b * c;
        var ans = frac(num, den);
        return {
          q: '(' + (s < 0 ? '−' : '') + a + '/' + b + ') ÷ ' + c + '/' + d + ' = ?',
          ok: ans,
          wrong: [
            { t: frac(s * a * c, b * d), d: 'You multiplied instead of using Keep–Change–Flip: ÷ ' + c + '/' + d + ' means × ' + d + '/' + c + '.' },
            { t: frac(-num, den), d: 'Check the sign: ' + (s < 0 ? 'different signs → (−)' : 'same signs → (+)') + '.' },
            { t: frac(s * b * c, a * d), d: 'You flipped the FIRST fraction — Keep the first, Flip the second (the divisor).' }
          ],
          steps: [
            'Keep – Change – Flip: ' + (s < 0 ? '−' : '') + a + '/' + b + ' × ' + d + '/' + c,
            'Multiply: ' + (a * d) + '/' + (b * c) + (s < 0 ? ' with a (−) sign' : ''),
            'Simplify: ' + ans
          ]
        };
      },
      medium: function () {
        var r = Math.random();
        if (r < 0.5) {
          var w = ri(2, 9), p = ri(2, 7), q = p + ri(1, 5);
          var s = sgn();
          var num = s * w * q, den = p;
          var ans = frac(num, den);
          return {
            q: '(' + n2s(s * w) + ') ÷ ' + p + '/' + q + ' = ?',
            ok: ans,
            wrong: [
              { t: frac(s * w * p, q), d: 'You multiplied by the fraction — dividing by ' + p + '/' + q + ' means multiplying by its reciprocal ' + q + '/' + p + '.' },
              { t: frac(-num, den), d: 'Watch the sign: ' + (s < 0 ? 'different signs → (−)' : 'same signs → (+)') + '.' },
              { t: frac(s * p, w * q), d: 'The whole number stays as it is — only the DIVISOR flips: ' + n2s(s * w) + ' × ' + q + '/' + p + '.' }
            ],
            steps: [
              'Keep – Change – Flip: ' + n2s(s * w) + ' × ' + q + '/' + p,
              'Multiply: ' + Math.abs(w * q) + ' × 1 tops, 1 × ' + p + ' bottoms' + (s < 0 ? ', sign (−)' : ''),
              'Answer: ' + ans
            ]
          };
        }
        var b = ri(3, 9), a = ri(1, b - 1), w = ri(2, 7);
        var s = sgn();
        var num = s * a, den = b * w;
        var ans = frac(num, den);
        return {
          q: '(' + (s < 0 ? '−' : '') + a + '/' + b + ') ÷ ' + w + ' = ?',
          ok: ans,
          wrong: [
            { t: frac(s * a * w, b), d: 'You multiplied by the whole number — dividing by ' + w + ' means the bottom is multiplied by ' + w + '.' },
            { t: frac(-num, den), d: 'Check the sign rule before answering.' },
            { t: frac(s * b * w, a), d: 'You flipped the first fraction — the FIRST fraction stays; dividing by ' + w + ' multiplies the denominator.' }
          ],
          steps: [
            (s < 0 ? '−' : '') + a + '/' + b + ' ÷ ' + w + ' = ' + (s < 0 ? '−' : '') + a + '/' + (b * w),
            'Sign: ' + (s < 0 ? '(−)' : '(+)'),
            'Simplify: ' + ans
          ]
        };
      }
    }
  });

  /* ═══════════ 1-10 Solve Problems with Rational Numbers ═══════════ */
  T1.lessons.push({
    id: 't1l5', code: '1-10', title: 'Solve Problems Involving Rational Numbers',
    sub: 'Real-life word problems · Read, Plan, Solve, Check',
    calc: true,
    hintA: '🧭 Read the story and decide: is it multiplication or division? Words like "each ... for ..." mean multiply, "shared equally" means divide.',
    hintB: '👣 Write the plan as an expression with the right signs (drop = negative), then calculate and check if the answer makes sense.',
    guide: {
      key: 'Real-life problems use positive and negative rational numbers (money, temperature, elevation). Translate the story into an expression, then solve.',
      rules: [
        { h: '+ KEY WORDS', b: 'total · more than · gain · rise · deposit' },
        { h: '− KEY WORDS', b: 'less than · loss · fall · spend · debt · drop' },
        { h: '× KEY WORDS', b: 'each · per · of · groups · every' },
        { h: '÷ KEY WORDS', b: 'shared equally · split · each gets' }
      ],
      steps: ['READ: what is asked and what is given', 'PLAN: choose the operation and write an expression', 'SOLVE and CHECK: calculate, watch the signs, add units'],
      ex: [
        { t: 'Temperature drops 3.5°C every hour for 4 hours', s: ['Plan: (−3.5) × 4', 'Different signs → negative', '= −14°C'] },
        { t: 'A debt of EGP 135 shared among 5 friends', s: ['A debt is negative', 'Plan: (−135) ÷ 5', '= −EGP 27 each'] }
      ],
      try: ['A diver descends 2.5 m/min for 6 min — change in depth?', '3/4 L of juice split equally into 6 cups'],
      tryAns: ['−15 m', '1/8 L each']
    },
    gen: {
      easy: function () {
        var r = Math.random();
        if (r < 0.34) {
          var rate = ri(2, 9), hrs = ri(3, 8);
          return {
            q: 'The temperature drops ' + rate + '°C every hour. What is the total change after ' + hrs + ' hours?',
            ok: n2s(-rate * hrs) + '°C',
            wrong: [
              { t: rate * hrs + '°C', d: 'A DROP is negative — the change is (−' + rate + ') × ' + hrs + '.' },
              { t: n2s(-(rate + hrs)) + '°C', d: 'You added — "every hour for ' + hrs + ' hours" means multiply: ' + rate + ' × ' + hrs + '.' },
              { t: n2s(-rate) + '°C', d: 'That is the change in ONE hour — multiply by ' + hrs + ' hours.' }
            ],
            steps: ['A drop is negative: (−' + rate + ') × ' + hrs, 'Multiply: ' + rate + ' × ' + hrs + ' = ' + (rate * hrs), 'Total change = ' + n2s(-rate * hrs) + '°C']
          };
        }
        if (r < 0.67) {
          var fr = ri(3, 6), debt = fr * ri(9, 30);
          return {
            q: 'A debt of EGP ' + debt + ' is shared equally among ' + fr + ' friends. What is each friend\'s change in money?',
            ok: '−EGP ' + (debt / fr),
            wrong: [
              { t: 'EGP ' + (debt / fr), d: 'A debt is NEGATIVE money — so the answer is −' + (debt / fr) + '.' },
              { t: '−EGP ' + debt, d: 'Sharing equally means divide by ' + fr + ', not keep the whole debt.' },
              { t: '−EGP ' + (debt * fr), d: 'You multiplied — "shared equally among ' + fr + '" means ÷ ' + fr + '.' }
            ],
            steps: ['Debt is negative: (−' + debt + ') ÷ ' + fr, 'Different signs → negative', 'Each friend: −EGP ' + (debt / fr)]
          };
        }
        var cups = ri(4, 8), num = ri(1, 3), den = num + ri(1, 3);
        var g = gcd(num * 1, den * cups) || 1;
        var ans = frac(num, den * cups);
        return {
          q: 'Ali has ' + num + '/' + den + ' L of juice and pours it equally into ' + cups + ' cups. How much juice is in each cup?',
          ok: ans + ' L',
          wrong: fill3(ans + ' L', [
            { t: frac(num * cups, den) + ' L', d: 'You multiplied — "pours equally into ' + cups + ' cups" means divide by ' + cups + '.' },
            { t: '1/' + cups + ' L', d: 'That is the number of cups — divide the juice: ' + num + '/' + den + ' ÷ ' + cups + '.' },
            { t: frac(den, num * cups) + ' L', d: 'You flipped the first fraction — keep it, and divide by ' + cups + '.' }
          ], function () { return { t: frac(num, den * cups * 2) + ' L', d: 'Divide the juice: ' + num + '/' + den + ' ÷ ' + cups + '.' }; }),
          steps: [
            'Plan: ' + num + '/' + den + ' ÷ ' + cups + ' = ' + num + '/' + (den * cups),
            'Simplify: ' + ans,
            'Each cup: ' + ans + ' L'
          ]
        };
      },
      medium: function () {
        var r = Math.random();
        if (r < 0.3) {
          var rate = ri(15, 45) / 10, min = ri(4, 9);
          var val = -(Math.round(rate * min * 10) / 10);
          return {
            q: 'A diver descends ' + dec1(rate) + ' m every minute. What is the change in depth after ' + min + ' minutes?',
            ok: dec1(val) + ' m',
            wrong: fill3(dec1(val) + ' m', [
              { t: dec1(-val) + ' m', d: 'Descending means going DOWN — the change in depth is negative.' },
              { t: dec1(-(rate + min)) + ' m', d: 'You added — "every minute for ' + min + ' minutes" means multiply.' },
              { t: dec1(-Math.abs(val) - 1) + ' m', d: 'Recheck: ' + dec1(rate) + ' × ' + min + ' = ' + dec1(Math.abs(val)) + '.' }
            ], function () { return { t: dec1(-Math.abs(val) - 2) + ' m', d: 'Recheck: ' + dec1(rate) + ' × ' + min + ' = ' + dec1(Math.abs(val)) + '.' }; }),
            steps: ['Descend = negative: (−' + dec1(rate) + ') × ' + min, 'Multiply: ' + dec1(rate) + ' × ' + min + ' = ' + dec1(Math.abs(val)), 'Change = ' + dec1(val) + ' m']
          };
        }
        if (r < 0.6) {
          var rate2 = ri(12, 40), days = ri(5, 9);
          return {
            q: 'Omar spends EGP ' + rate2 + ' every day for ' + days + ' days. What is the net change in his money?',
            ok: '−EGP ' + (rate2 * days),
            wrong: [
              { t: 'EGP ' + (rate2 * days), d: 'SPENDING is negative — the net change is −' + (rate2 * days) + '.' },
              { t: '−EGP ' + (rate2 + days), d: 'You added — "every day for ' + days + ' days" means multiply.' },
              { t: '−EGP ' + (rate2 * days + rate2), d: 'That is ' + (days + 1) + ' days — the problem says ' + days + ' days only.' }
            ],
            steps: ['Spending is negative: (−' + rate2 + ') × ' + days, 'Multiply: ' + rate2 + ' × ' + days + ' = ' + (rate2 * days), 'Net change = −EGP ' + (rate2 * days)]
          };
        }
        var n = ri(1, 3), d = n + ri(1, 2);
        var w = ri(2, 3), hn = ri(1, 2), hd = hn + ri(1, 2);
        var num = n * (w * hd + hn), den = d * hd;
        var ans = frac(num, den);
        return {
          q: 'A recipe uses ' + n + '/' + d + ' cup of sugar. How much sugar is needed for ' + w + ' ' + hn + '/' + hd + ' batches?',
          ok: ans + ' cups',
          wrong: [
            { t: frac(n + w * hd + hn, d + hd) + ' cups', d: 'You added the amounts — "for ' + w + ' ' + hn + '/' + hd + ' batches" means MULTIPLY.' },
            { t: frac(n * (w * hd - hn), den) + ' cups', d: 'Convert the batches correctly: ' + w + ' ' + hn + '/' + hd + ' = ' + (w * hd + hn) + '/' + hd + '.' },
            { t: frac(n * hd, d * (w * hd + hn)) + ' cups', d: 'You divided — the sugar per batch times the number of batches means multiply.' }
          ],
          steps: [
            'Convert: ' + w + ' ' + hn + '/' + hd + ' = ' + (w * hd + hn) + '/' + hd,
            'Multiply: ' + n + '/' + d + ' × ' + (w * hd + hn) + '/' + hd + ' = ' + num + '/' + den,
            'Simplify: ' + ans + ' cups'
          ]
        };
      }
    }
  });

  hook();
})();
