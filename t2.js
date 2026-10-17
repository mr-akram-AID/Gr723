/* ============================================================
   AID Mathematics Academy · Grade 7 — t2.js
   Topic 2 · Analyze & Use Proportional Relationships
   Lessons 2-1 to 2-5 (matches the uploaded workbook)
   ============================================================ */
(function () {
  'use strict';

  function hook() {
    if (!window.G7 || !G7.registerTopic) { setTimeout(hook, 100); return; }
    G7.registerTopic(T2);
  }

  /* ─── helpers ─── */
  function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a || 1; }

  /* simplified fraction / mixed number string */
  function fstr(n, d) {
    var s = n < 0 ? '−' : '';
    n = Math.abs(n); d = Math.abs(d);
    var g = gcd(n, d); n /= g; d /= g;
    if (d === 1) return s + n;
    if (n > d) return s + Math.floor(n / d) + ' ' + (n % d) + '/' + d;
    return s + n + '/' + d;
  }
  function money(n) { return 'EGP ' + n; }

  /* 3 distinct wrong choices, never equal to ok */
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

  var T2 = {
    id: 't2', num: 2, icon: '📊', color: '#0891b2',
    title: 'Analyze & Use Proportional Relationships',
    sub: 'Ratios, rates, unit rates, proportions and their graphs',
    lessons: []
  };

  /* ═══════════ 2-1 Connect Ratios, Rates, and Unit Rates ═══════════ */
  T2.lessons.push({
    id: 't2l1', code: '2-1', title: 'Connect Ratios, Rates, and Unit Rates',
    sub: 'Ratios · Rates · Unit rates · Better buys',
    calc: true,
    hintA: '🧭 A unit rate tells you the value of ONE unit — divide the top by the bottom.',
    hintB: '👣 Write the rate matching the order of the question, then divide. "per" means "for each one".',
    guide: {
      key: 'A ratio compares two quantities. A rate is a ratio with different units. A unit rate is a rate with a denominator of 1 — it lets you compare prices, speeds and offers fairly.',
      rules: [
        { h: 'RATIO', b: 'Compares two quantities: 3 boys to 2 girls → 3 : 2 = 3/2' },
        { h: 'RATE', b: 'Different units: 150 km in 3 h → 150 km / 3 h' },
        { h: 'UNIT RATE', b: 'Denominator 1. Divide: 150 ÷ 3 = 50 km per hour' },
        { h: '"PER" = FOR EACH ONE', b: 'EGP 12 per kg = EGP 12 for each 1 kg. Smaller cost per unit wins.' }
      ],
      steps: ['Write the rate: first quantity over the second — match the order of the question', 'Divide: numerator ÷ denominator', 'Label the unit: "per" + the unit of the bottom quantity (EGP/kg, km/h)'],
      ex: [
        { t: 'EGP 96 for 6 notebooks', s: ['Write the rate: EGP 96 / 6 notebooks', 'Divide: 96 ÷ 6 = 16', 'Label: EGP 16 per notebook. Check: 16 × 6 = 96'] },
        { t: 'A car travels 234 km in 4 hours. Find the speed.', s: ['Write the rate: 234 km / 4 h', 'Divide: 234 ÷ 4 = 58.5', 'Label: 58.5 km per hour'] },
        { t: 'Better buy: 3 kg of rice for EGP 84, or 5 kg for EGP 130?', s: ['3-kg bag: 84 ÷ 3 = EGP 28 per kg', '5-kg bag: 130 ÷ 5 = EGP 26 per kg', '26 < 28 → the 5-kg bag is the better buy'] }
      ],
      try: ['EGP 120 for 4 tickets — find the unit rate.', 'A bike travels 96 km in 3 hours — find the speed.', 'Better buy: 2 L of juice for EGP 36, or 3 L for EGP 51?'],
      tryAns: ['EGP 30 per ticket', '32 km per hour', '3 L for EGP 51 (EGP 17 per L)']
    },
    gen: {
      easy: function () {
        var r = Math.random();
        if (r < 0.55) {
          /* price unit rate */
          var items = pick([['notebook', 'notebooks'], ['pen', 'pens'], ['ticket', 'tickets'], ['marker', 'markers'], ['book', 'books'], ['cake', 'cakes']]);
          var n = ri(3, 9), u = ri(6, 30), total = n * u;
          var ok = 'EGP ' + u + ' per ' + items[0];
          return {
            q: money(total) + ' for ' + n + ' ' + items[1] + '. What is the price of ONE ' + items[0] + '?',
            ok: ok,
            wrong: fill3(ok, [
              { t: 'EGP ' + n + ' per ' + items[0], d: 'That is the count, not the price. Divide: ' + total + ' ÷ ' + n + ' = ' + u + '.' },
              { t: 'EGP ' + (total - n) + ' per ' + items[0], d: 'Subtracting does not make a unit rate — divide: ' + total + ' ÷ ' + n + ' = ' + u + '.' },
              { t: 'EGP ' + (u + ri(1, 4)) + ' per ' + items[0], d: 'Check backwards: ' + u + ' × ' + n + ' = ' + total + ' exactly.' }
            ], function () { return { t: 'EGP ' + (u + ri(5, 12)) + ' per ' + items[0], d: 'Check backwards: ' + u + ' × ' + n + ' = ' + total + ' exactly.' }; }),
            steps: ['Write the rate: ' + money(total) + ' / ' + n + ' ' + items[1], 'Divide: ' + total + ' ÷ ' + n + ' = ' + u, 'Label: ' + money(u) + ' per ' + items[0]]
          };
        }
        /* speed unit rate */
        var h = ri(2, 8), s = ri(15, 90), d = h * s;
        var okS = s + ' km per hour';
        return {
          q: 'A car travels ' + d + ' km in ' + h + ' hours. What is its speed?',
          ok: okS,
          wrong: fill3(okS, [
            { t: h + ' km per hour', d: 'You wrote the time. Divide distance by time: ' + d + ' ÷ ' + h + ' = ' + s + '.' },
            { t: (d - h) + ' km per hour', d: 'Subtracting does not make a unit rate — divide: ' + d + ' ÷ ' + h + ' = ' + s + '.' },
            { t: (s + ri(1, 5)) + ' km per hour', d: 'Check backwards: ' + s + ' × ' + h + ' = ' + d + ' exactly.' }
          ], function () { return { t: (s + ri(6, 15)) + ' km per hour', d: 'Check backwards: ' + s + ' × ' + h + ' = ' + d + ' exactly.' }; }),
          steps: ['Write the rate: ' + d + ' km / ' + h + ' h', 'Divide: ' + d + ' ÷ ' + h + ' = ' + s, 'Label: ' + s + ' km per hour']
        };
      },
      medium: function () {
        var r = Math.random();
        if (r < 0.4) {
          /* better buy */
          var w1 = ri(2, 5), u1 = ri(20, 34), w2 = w1 + ri(1, 4), u2 = u1 - ri(3, 8);
          if (u2 < 8) { u2 = u1 - 3; }
          var p1 = w1 * u1, p2 = w2 * u2;
          var ok = 'The ' + w2 + '-kg bag — ' + money(u2) + ' per kg';
          return {
            q: 'Which is the better buy: ' + w1 + ' kg of rice for ' + money(p1) + ', or ' + w2 + ' kg for ' + money(p2) + '?',
            ok: ok,
            wrong: fill3(ok, [
              { t: 'The ' + w1 + '-kg bag — ' + money(u1) + ' per kg', d: 'Compare per kg: ' + p1 + ' ÷ ' + w1 + ' = ' + u1 + ', but ' + p2 + ' ÷ ' + w2 + ' = ' + u2 + ' — the smaller unit price wins.' },
              { t: 'They cost the same per kg', d: 'EGP ' + u1 + '/kg is not EGP ' + u2 + '/kg — compute both unit rates first.' },
              { t: 'The ' + w1 + '-kg bag — it costs less in total', d: 'The better buy is about the price PER kg, not the total price.' }
            ], function () { return { t: 'The ' + w2 + '-kg bag — ' + money(u1) + ' per kg', d: 'Recompute: ' + p2 + ' ÷ ' + w2 + ' = ' + u2 + ' per kg.' }; }),
            steps: [w1 + '-kg bag: ' + p1 + ' ÷ ' + w1 + ' = ' + money(u1) + ' per kg', w2 + '-kg bag: ' + p2 + ' ÷ ' + w2 + ' = ' + money(u2) + ' per kg', u2 + ' < ' + u1 + ' → the ' + w2 + '-kg bag is the better buy']
          };
        }
        if (r < 0.72) {
          /* multi-step apply */
          var m = ri(2, 5), rate = ri(12, 40), np = m * rate, k = ri(6, 15);
          var okA = (rate * k) + ' pages';
          return {
            q: 'A printer prints ' + np + ' pages in ' + m + ' minutes. At this rate, how many pages does it print in ' + k + ' minutes?',
            ok: okA,
            wrong: fill3(okA, [
              { t: (np + k) + ' pages', d: 'Adding does not use the rate. First find pages per minute: ' + np + ' ÷ ' + m + ' = ' + rate + '.' },
              { t: rate + ' pages', d: 'That is the rate for ONE minute. Multiply by ' + k + ': ' + rate + ' × ' + k + '.' },
              { t: (rate * k + m) + ' pages', d: 'Close — but check: ' + rate + ' × ' + k + ' = ' + (rate * k) + ' with nothing added.' }
            ], function () { return { t: (rate * k + ri(5, 20)) + ' pages', d: 'Rate: ' + np + ' ÷ ' + m + ' = ' + rate + ' per minute, then × ' + k + '.' }; }),
            steps: ['Unit rate: ' + np + ' ÷ ' + m + ' = ' + rate + ' pages per minute', 'Multiply: ' + rate + ' × ' + k + ' = ' + (rate * k), 'Answer: ' + (rate * k) + ' pages']
          };
        }
        /* find the mistake */
        var n2 = ri(4, 9), u2b = ri(9, 25), a2 = n2 * u2b;
        var herVal = n2 + ' ÷ ' + a2; /* reversed division result rounded */
        var herRate = Math.round(n2 * 100 / a2) / 100;
        var okM = 'EGP ' + u2b + ' per kg';
        return {
          q: 'FIND THE MISTAKE — Sara says the unit rate of "EGP ' + a2 + ' for ' + n2 + ' kg" is about EGP ' + herRate + ' per kg, because she divided ' + n2 + ' by ' + a2 + '. What is the correct unit rate?',
          ok: okM,
          wrong: fill3(okM, [
            { t: 'EGP ' + herRate + ' per kg — Sara is right', d: 'She flipped the division: the price goes on top. ' + a2 + ' ÷ ' + n2 + ' = ' + u2b + '.' },
            { t: 'EGP ' + (a2 - n2) + ' per kg', d: 'Subtracting does not make a unit rate — divide ' + a2 + ' ÷ ' + n2 + '.' },
            { t: 'EGP ' + (u2b * 2) + ' per kg', d: 'Check backwards: ' + u2b + ' × ' + n2 + ' = ' + a2 + ' exactly.' }
          ], function () { return { t: 'EGP ' + (u2b + ri(3, 9)) + ' per kg', d: 'Divide ' + a2 + ' ÷ ' + n2 + ' = ' + u2b + '.' }; }),
          steps: ['Write the rate with the price on top: ' + money(a2) + ' / ' + n2 + ' kg', 'Divide: ' + a2 + ' ÷ ' + n2 + ' = ' + u2b, 'Label: ' + money(u2b) + ' per kg (Sara divided the other way round)']
        };
      }
    }
  });

  /* ═══════════ 2-2 Identify Unit Rates from Ratios of Fractions ═══════════ */
  T2.lessons.push({
    id: 't2l2', code: '2-2', title: 'Identify Unit Rates from Ratios of Fractions',
    sub: 'Complex fractions · Keep–Change–Flip · Reciprocals',
    calc: false,
    hintA: '🧭 The fraction bar means DIVISION. A complex fraction stacked on a fraction is just top ÷ bottom.',
    hintB: '👣 Keep the first fraction, change ÷ to ×, flip the SECOND fraction — then cancel before multiplying.',
    guide: {
      key: 'When both quantities are fractions the rate becomes a complex fraction — a fraction stacked on a fraction. The middle bar means division, so finding the unit rate means dividing fractions: Keep – Change – Flip.',
      rules: [
        { h: 'COMPLEX FRACTION', b: '(1/2)/(1/4) means 1/2 ÷ 1/4 — the middle bar is a division sign' },
        { h: 'KEEP–CHANGE–FLIP', b: '1/2 ÷ 1/4 = 1/2 × 4/1 = 2' },
        { h: 'RECIPROCAL', b: 'Swap top and bottom: 3/8 → 8/3. A number × its reciprocal = 1' },
        { h: 'CHECK', b: 'unit rate × second quantity = first quantity — multiply back to test' }
      ],
      steps: ['Stack it: write the first quantity over the second as a complex fraction', 'Keep – Change – Flip: ÷ becomes × and the second fraction flips', 'Multiply, simplify, and label with "per" + the unit'],
      ex: [
        { t: 'Find the unit rate: (1/2) ÷ (1/4)', s: ['Keep–Change–Flip: 1/2 × 4/1', 'Multiply: 4/2 = 2', 'Check: 2 × 1/4 = 1/2'] },
        { t: 'A snail crawls 2/3 km in 1/4 hour. Find the speed in km per hour.', s: ['Write the rate: (2/3) ÷ (1/4)', 'Keep–Change–Flip: 2/3 × 4/1 = 8/3', 'Simplify: 8/3 = 2 2/3 km per hour'] },
        { t: 'A recipe uses 1/4 cup of oil for every 3/4 cup of vinegar. How much oil per 1 cup of vinegar?', s: ['Write the rate: (1/4) ÷ (3/4)', 'Keep–Change–Flip: 1/4 × 4/3 = 4/12', 'Simplify: 1/3 cup of oil per cup of vinegar'] }
      ],
      try: ['(2/3) ÷ (1/9) = ?', 'A turtle walks 1/2 km in 1/4 hour. Find the speed in km per hour.', 'Flour 2/3 cup per sugar 1/6 cup — how much flour per 1 cup of sugar?'],
      tryAns: ['6', '2 km per hour', '4 cups']
    },
    gen: {
      easy: function () {
        /* (n1/d1) ÷ (n2/d2): construct so the quotient is a nice number */
        var d1 = ri(2, 9), n1 = ri(1, 7);
        var g0 = gcd(n1, d1);
        n1 /= g0; d1 /= g0;
        var Q = pick([2, 3, 4, 5, 6, 8, 9, 12]);
        /* second fraction = first / Q = n1 / (d1*Q) */
        var n2 = n1, d2 = d1 * Q;
        var g2 = gcd(n2, d2); n2 /= g2; d2 /= g2;
        var ok = String(Q);
        return {
          q: n1 + '/' + d1 + ' ÷ ' + n2 + '/' + d2 + ' = ?',
          ok: ok,
          wrong: fill3(ok, [
            { t: fstr(n1 * n2, d1 * d2), d: 'You multiplied instead of dividing. Flip the SECOND fraction first: ' + n1 + '/' + d1 + ' × ' + d2 + '/' + n2 + '.' },
            { t: fstr(d1 * d2, n1 * n2), d: 'You flipped the FIRST fraction. Keep the first, flip the second.' },
            { t: String(Q + pick([1, 2])), d: 'Multiply tops and bottoms carefully: ' + (n1 * d2) + '/' + (d1 * n2) + ' = ' + Q + '.' }
          ], function () { return { t: String(Q + ri(3, 6)), d: 'Keep–Change–Flip: ' + n1 + '/' + d1 + ' × ' + d2 + '/' + n2 + ' = ' + Q + '.' }; }),
          steps: ['Keep – Change – Flip: ' + n1 + '/' + d1 + ' × ' + d2 + '/' + n2, 'Multiply: ' + (n1 * d2) + '/' + (d1 * n2), 'Simplify: ' + Q]
        };
      },
      medium: function () {
        var r = Math.random();
        if (r < 0.38) {
          /* speed from fraction distance + fraction time */
          var t = pick([2, 3, 4, 5, 6, 8]);
          var b = pick([2, 3, 4, 5, 6]);
          var a = ri(1, b - 1);
          var gg = gcd(a, b); a /= gg; b /= gg;
          if (a >= b) { a = 1; }
          /* speed = (a/b) ÷ (1/t) = a*t/b */
          var okS = fstr(a * t, b) + ' km per hour';
          return {
            q: 'A snail crawls ' + a + '/' + b + ' km in 1/' + t + ' hour. Find its speed in km per hour.',
            ok: okS,
            wrong: fill3(okS, [
              { t: fstr(a, b * t) + ' km per hour', d: 'You multiplied by 1/' + t + ' instead of dividing by it. Flip it: × ' + t + '/1.' },
              { t: fstr(a * t, b) + ' km per 2 hours', d: 'The speed is ' + fstr(a * t, b) + ' km in ONE hour — not two.' },
              { t: fstr(b, a * t) + ' km per hour', d: 'You flipped the wrong fraction — keep the distance, flip the time.' }
            ], function () { return { t: fstr(a * t + 1, b) + ' km per hour', d: 'Keep–Change–Flip: ' + a + '/' + b + ' × ' + t + '/1 = ' + fstr(a * t, b) + '.' }; }),
            steps: ['Write the rate: (' + a + '/' + b + ') ÷ (1/' + t + ')', 'Keep – Change – Flip: ' + a + '/' + b + ' × ' + t + '/1', 'Multiply: ' + (a * t) + '/' + b + ' = ' + fstr(a * t, b) + ' km per hour']
          };
        }
        if (r < 0.7) {
          /* recipe: oil per one cup of vinegar = Rn/Rd */
          var Rn = pick([1, 2, 3]), Rd = pick([2, 3, 4]);
          var vn = pick([1, 2, 3]), vd = pick([2, 3, 4, 6]);
          var oilUnit = pick(['oil', 'flour', 'honey', 'syrup']);
          var vinUnit = pick(['vinegar', 'milk', 'lemon juice']);
          var on = Rn * vn, od = Rd * vd;
          var gq = gcd(on, od); on /= gq; od /= gq;
          var okR = fstr(Rn, Rd) + ' cup of ' + oilUnit + ' per cup of ' + vinUnit;
          return {
            q: 'A recipe uses ' + fstr(on, od) + ' cup of ' + oilUnit + ' for every ' + fstr(vn, vd) + ' cup of ' + vinUnit + '. How much ' + oilUnit + ' per 1 cup of ' + vinUnit + '?',
            ok: okR,
            wrong: fill3(okR, [
              { t: fstr(Rd, Rn) + ' cup of ' + oilUnit + ' per cup of ' + vinUnit, d: 'You flipped the answer. Check: ' + fstr(Rn, Rd) + ' × ' + fstr(vn, vd) + ' = ' + fstr(on, od) + '.' },
              { t: fstr(Rn * vn * vn, Rd * vd * vd) + ' cup of ' + oilUnit + ' per cup of ' + vinUnit, d: 'You multiplied by the second fraction. Keep–Change–Flip means divide by it: × ' + fstr(vd, vn) + '.' },
              { t: fstr(Rn * vd, Rd * vn) + ' cup of ' + oilUnit + ' per cup of ' + vinUnit, d: 'You flipped the FIRST fraction. Keep the ' + oilUnit + ', flip the ' + vinUnit + '.' }
            ], function () { return { t: fstr(Rn + 1, Rd) + ' cup of ' + oilUnit + ' per cup of ' + vinUnit, d: 'Keep – Change – Flip: ' + fstr(on, od) + ' × ' + fstr(vd, vn) + ' = ' + fstr(Rn, Rd) + '.' }; }),
            steps: ['Write the rate: (' + fstr(on, od) + ') ÷ (' + fstr(vn, vd) + ')', 'Keep – Change – Flip: ' + fstr(on, od) + ' × ' + fstr(vd, vn), 'Multiply and simplify: ' + fstr(Rn, Rd) + ' cup of ' + oilUnit + ' per cup of ' + vinUnit]
          };
        }
        /* missing dividend */
        var t2 = pick([2, 3, 4, 5, 6]);
        var Q2 = ri(2, 6);
        /* ___ ÷ (1/t2) = Q2  →  answer = Q2 / t2 */
        var okX = fstr(Q2, t2);
        return {
          q: 'Find the missing number:  ____ ÷ 1/' + t2 + ' = ' + Q2,
          ok: okX,
          wrong: fill3(okX, [
            { t: fstr(Q2 * t2, 1), d: 'Dividing by 1/' + t2 + ' makes the number ' + t2 + ' times BIGGER, not smaller: ' + Q2 + ' ÷ ' + fstr(1, t2) + ' = ' + okX + '.' },
            { t: fstr(t2, Q2), d: 'That is the reciprocal of the answer. Check: ' + fstr(Q2, t2) + ' × ' + t2 + ' = ' + Q2 + '.' },
            { t: fstr(Q2 + t2, 1), d: 'Try: what times 1/' + t2 + ' gives ' + Q2 + '? It is ' + okX + '.' }
          ], function () { return { t: fstr(Q2, t2 + 1), d: 'Check: ' + fstr(Q2, t2) + ' ÷ 1/' + t2 + ' = ' + fstr(Q2, t2) + ' × ' + t2 + ' = ' + Q2 + '.' }; }),
          steps: ['Dividing by 1/' + t2 + ' is the same as multiplying by ' + t2, 'So: answer × ' + t2 + ' = ' + Q2, 'Answer: ' + Q2 + ' ÷ ' + t2 + ' = ' + fstr(Q2, t2)]
        };
      }
    }
  });

  /* ═══════════ 2-3 Understand Proportional Relationships ═══════════ */
  T2.lessons.push({
    id: 't2l3', code: '2-3', title: 'Understand Proportional Relationships',
    sub: 'Equivalent ratios · Proportions · Cross products',
    calc: true,
    hintA: '🧭 Equivalent ratios: multiply or divide BOTH quantities by the same number.',
    hintB: '👣 Test with cross products: a/b = c/d is true exactly when a × d = b × c.',
    guide: {
      key: 'Two ratios are equivalent if you can get from one to the other by multiplying or dividing both quantities by the same number. Equivalent ratios form a proportional relationship. A proportion is an equation stating two ratios are equal.',
      rules: [
        { h: 'EQUIVALENT RATIOS', b: 'Multiply or divide both numbers by the same amount: 2 : 3 = 4 : 6 = 6 : 9' },
        { h: 'PROPORTION', b: 'An equation of two equal ratios: a/b = c/d' },
        { h: 'CROSS PRODUCTS', b: 'a/b = c/d is true exactly when a × d = b × c — the diagonals match' },
        { h: 'CAUTION', b: 'ADDING the same number does NOT keep ratios equivalent: 2 : 3 ≠ 4 : 5' }
      ],
      steps: ['Simplify each ratio (divide both parts by their GCF)', 'Compare: same simplest form? Or test cross products a × d = b × c', 'Conclude: equal → equivalent (proportional), not equal → not equivalent'],
      ex: [
        { t: 'Are 6 : 9 and 10 : 15 equivalent?', s: ['Simplify: 6 : 9 = 2 : 3 and 10 : 15 = 2 : 3', 'Same simplest form', 'Equivalent — check: 6 × 15 = 90 and 9 × 10 = 90'] },
        { t: 'Are 4/7 and 12/20 equivalent?', s: ['Cross products: 4 × 20 = 80 and 7 × 12 = 84', '80 ≠ 84', 'Not equivalent'] },
        { t: 'Solve the proportion 3/4 = x/20', s: ['Cross products: 3 × 20 = 60 and 4 × x = 4x', 'Set equal: 4x = 60', 'x = 60 ÷ 4 = 15. Check: 15/20 = 3/4'] }
      ],
      try: ['Are 5 : 6 and 20 : 24 equivalent?', 'Solve 2/5 = x/45', 'Are 9/12 and 15/20 equivalent?'],
      tryAns: ['Yes — both simplify to 5 : 6', 'x = 18', 'Yes — both simplify to 3/4']
    },
    gen: {
      easy: function () {
        var r = Math.random();
        if (r < 0.4) {
          /* complete the equivalent ratio */
          var a = ri(2, 9), b = ri(2, 9);
          if (gcd(a, b) !== 1) { var g = gcd(a, b); a /= g; b /= g; }
          var m = ri(2, 9);
          var ok = b * m;
          return {
            q: a + ' : ' + b + ' = ' + (a * m) + ' : ____',
            ok: String(ok),
            wrong: fill3(String(ok), [
              { t: String(b + m), d: 'Multiply both parts — do not add: ' + b + ' × ' + m + ' = ' + ok + '.' },
              { t: String(a * m), d: 'That is the first part. The blank is the second part: ' + b + ' × ' + m + '.' },
              { t: String(ok + m), d: 'Check with cross products: ' + a + ' × ' + (ok + m) + ' ≠ ' + b + ' × ' + (a * m) + '.' }
            ], function () { return { t: String(ok + ri(2, 9)), d: 'Both parts were multiplied by ' + m + ': ' + b + ' × ' + m + ' = ' + ok + '.' }; }),
            steps: ['Find the multiplier on the first part: ' + (a * m) + ' ÷ ' + a + ' = ' + m, 'Multiply the second part by the same number: ' + b + ' × ' + m + ' = ' + ok, 'Check: ' + a + ' × ' + ok + ' = ' + b + ' × ' + (a * m)]
          };
        }
        if (r < 0.75) {
          /* solve the proportion x */
          var a2 = ri(2, 9), b2 = ri(2, 9);
          var g2 = gcd(a2, b2); a2 /= g2; b2 /= g2;
          var m2 = ri(2, 9);
          var D = b2 * m2, x = a2 * m2;
          var ok = String(x);
          return {
            q: 'Solve: ' + a2 + '/' + b2 + ' = x/' + D + '.  What is x?',
            ok: ok,
            wrong: fill3(String(x), [
              { t: String(D), d: 'x is not the bottom. Cross products: x = ' + a2 + ' × ' + D + ' ÷ ' + b2 + '.' },
              { t: String(x + m2), d: 'Check by substituting: ' + (x + m2) + '/' + D + ' does not simplify to ' + a2 + '/' + b2 + '.' },
              { t: String(a2 + D), d: 'Use cross products: ' + b2 + ' × x = ' + a2 + ' × ' + D + ' = ' + (a2 * D) + '.' }
            ], function () { return { t: String(x + ri(3, 12)), d: 'Cross products: ' + b2 + 'x = ' + (a2 * D) + ' → x = ' + x + '.' }; }),
            steps: ['Cross products: ' + b2 + ' × x = ' + a2 + ' × ' + D, 'So ' + b2 + 'x = ' + (a2 * D), 'x = ' + (a2 * D) + ' ÷ ' + b2 + ' = ' + x]
          };
        }
        /* are they equivalent? */
        var a3 = ri(2, 9), b3 = ri(2, 9);
        var g3 = gcd(a3, b3); a3 /= g3; b3 /= g3;
        var m3 = ri(2, 7);
        var yes = Math.random() < 0.5;
        var c3 = a3 * m3, d3 = b3 * m3;
        if (!yes) { c3 = a3 * m3 + ri(1, 3); }
        var okY = yes ? 'Yes — both simplify to ' + a3 + ' : ' + b3 : 'No — ' + a3 + ' × ' + d3 + ' ≠ ' + b3 + ' × ' + c3;
        return {
          q: 'Are ' + a3 + ' : ' + b3 + ' and ' + c3 + ' : ' + d3 + ' equivalent ratios?',
          ok: okY,
          wrong: fill3(okY, [
            { t: yes ? 'No — the numbers are different' : 'Yes — they look close', d: 'Looks are not math. Test the cross products: ' + a3 + ' × ' + d3 + ' = ' + (a3 * d3) + ' and ' + b3 + ' × ' + c3 + ' = ' + (b3 * c3) + '.' },
            { t: 'No — ratios are never equivalent', d: 'Ratios ARE equivalent when both parts are multiplied by the same number — test the cross products.' },
            { t: 'Yes — you can add the same number', d: 'Adding does NOT keep equivalence — only multiplying or dividing both parts does.' }
          ], function () { return yes ? { t: 'No — cross products never match', d: 'Check: ' + a3 + ' × ' + d3 + ' = ' + (a3 * d3) + ' = ' + b3 + ' × ' + c3 + '.' } : { t: 'Yes — cross products match', d: 'Check: ' + a3 + ' × ' + d3 + ' = ' + (a3 * d3) + ' vs ' + b3 + ' × ' + c3 + ' = ' + (b3 * c3) + '.' }; }),
          steps: ['Cross products: ' + a3 + ' × ' + d3 + ' = ' + (a3 * d3) + ' and ' + b3 + ' × ' + c3 + ' = ' + (b3 * c3), (a3 * d3 === b3 * c3 ? 'The diagonals match' : 'The diagonals do NOT match'), (yes ? 'Equivalent' : 'Not equivalent')]
        };
      },
      medium: function () {
        var r = Math.random();
        if (r < 0.3) {
          /* map scale */
          var s = ri(2, 5), k = ri(3, 9), t = ri(2, 12);
          var cm = s * t, km = k * t;
          var ok = km + ' km';
          return {
            q: 'On a map, ' + s + ' cm represents ' + k + ' km. Two cities are ' + cm + ' cm apart on the map. What is the actual distance between them?',
            ok: ok,
            wrong: fill3(ok, [
              { t: t + ' km', d: 'That is the multiplier only. Scale: ' + cm + ' ÷ ' + s + ' = ' + t + ', then ' + t + ' × ' + k + ' = ' + km + '.' },
              { t: (cm + k) + ' km', d: 'Set up a proportion: ' + s + '/' + k + ' = ' + cm + '/x and cross multiply.' },
              { t: (km + s) + ' km', d: 'Proportion: ' + s + ' : ' + k + ' = ' + cm + ' : x → x = ' + km + '.' }
            ], function () { return { t: (km + ri(4, 15)) + ' km', d: 'x = ' + k + ' × ' + cm + ' ÷ ' + s + ' = ' + km + '.' }; }),
            steps: ['Proportion: ' + s + ' / ' + k + ' = ' + cm + ' / x', 'Cross multiply: ' + s + ' × x = ' + k + ' × ' + cm, 'x = ' + (k * cm) + ' ÷ ' + s + ' = ' + km + ' km']
          };
        }
        if (r < 0.55) {
          /* ratio with total */
          var a4 = ri(2, 5), b4 = a4 + ri(1, 4), m4 = ri(2, 7);
          var total = (a4 + b4) * m4, boys = a4 * m4;
          var ok = boys + ' boys';
          return {
            q: 'The ratio of boys to girls in a class is ' + a4 + ' : ' + b4 + '. There are ' + total + ' students in all. How many boys are there?',
            ok: ok,
            wrong: fill3(ok, [
              { t: (a4 * m4 + m4) + ' boys', d: 'Total parts: ' + a4 + ' + ' + b4 + ' = ' + (a4 + b4) + '. One part = ' + total + ' ÷ ' + (a4 + b4) + ' = ' + m4 + '.' },
              { t: (b4 * m4) + ' boys', d: 'That is the GIRLS count (' + b4 + ' parts × ' + m4 + '). Boys: ' + a4 + ' × ' + m4 + '.' },
              { t: (total - a4) + ' boys', d: 'Do not subtract from the total — divide the total by the number of parts first.' }
            ], function () { return { t: (boys + ri(2, 8)) + ' boys', d: 'One part = ' + total + ' ÷ ' + (a4 + b4) + ' = ' + m4 + ', boys = ' + a4 + ' × ' + m4 + '.' }; }),
            steps: ['Total parts: ' + a4 + ' + ' + b4 + ' = ' + (a4 + b4), 'One part: ' + total + ' ÷ ' + (a4 + b4) + ' = ' + m4, 'Boys: ' + a4 + ' × ' + m4 + ' = ' + boys]
          };
        }
        if (r < 0.8) {
          /* rate application */
          var m5 = pick([3, 4, 6]), rate5 = ri(5, 15), n5 = m5 * rate5, M5 = pick([10, 12, 20, 24]);
          var ok5 = (rate5 * M5) + ' bolts';
          return {
            q: 'A machine makes ' + n5 + ' bolts in ' + m5 + ' minutes. At this rate, how many bolts does it make in ' + M5 + ' minutes?',
            ok: ok5,
            wrong: fill3(ok5, [
              { t: rate5 + ' bolts', d: 'That is the rate for ONE minute — multiply by ' + M5 + '.' },
              { t: (n5 + M5) + ' bolts', d: 'Find the unit rate first: ' + n5 + ' ÷ ' + m5 + ' = ' + rate5 + ' per minute.' },
              { t: (rate5 * M5 + m5) + ' bolts', d: 'Check: ' + rate5 + ' × ' + M5 + ' = ' + (rate5 * M5) + ' with nothing added.' }
            ], function () { return { t: (rate5 * M5 + ri(5, 25)) + ' bolts', d: 'Unit rate ' + rate5 + ' × ' + M5 + ' minutes.' }; }),
            steps: ['Unit rate: ' + n5 + ' ÷ ' + m5 + ' = ' + rate5 + ' bolts per minute', 'Multiply: ' + rate5 + ' × ' + M5 + ' = ' + (rate5 * M5), 'Answer: ' + (rate5 * M5) + ' bolts']
          };
        }
        /* find the mistake on solving x */
        var a6 = ri(2, 9), b6 = ri(2, 9);
        var g6 = gcd(a6, b6); a6 /= g6; b6 /= g6;
        var m6 = ri(2, 8), D6 = b6 * m6, x6 = a6 * m6;
        var wrongX = D6 / b6; /* "20 ÷ 4 = 5" style mistake */
        var ok6 = String(x6);
        return {
          q: 'FIND THE MISTAKE — Nada solved ' + a6 + '/' + b6 + ' = x/' + D6 + ' like this: "' + D6 + ' ÷ ' + b6 + ' = ' + wrongX + ', so x = ' + wrongX + '." What is the correct value of x?',
          ok: ok6,
          wrong: fill3(ok6, [
            { t: String(wrongX), d: 'She divided the denominators. Cross products give ' + b6 + ' × x = ' + a6 + ' × ' + D6 + '.' },
            { t: String(x6 + 1), d: 'So close — recompute ' + (a6 * D6) + ' ÷ ' + b6 + '.' },
            { t: String(D6), d: 'x is not the denominator. Solve ' + b6 + 'x = ' + (a6 * D6) + '.' }
          ], function () { return { t: String(x6 + ri(2, 9)), d: 'Cross products: ' + b6 + 'x = ' + (a6 * D6) + ' → x = ' + x6 + '.' }; }),
          steps: ['Cross products: ' + b6 + ' × x = ' + a6 + ' × ' + D6, b6 + 'x = ' + (a6 * D6), 'x = ' + (a6 * D6) + ' ÷ ' + b6 + ' = ' + x6]
        };
      }
    }
  });

  /* ═══════════ 2-4 Describe Proportional Relationships ═══════════ */
  T2.lessons.push({
    id: 't2l4', code: '2-4', title: 'Describe Proportional Relationships',
    sub: 'Constant of proportionality · The equation y = kx · Tables',
    calc: true,
    hintA: '🧭 In a proportional relationship y = kx — pick any row and divide y ÷ x to find k.',
    hintB: '👣 Test one more row: every row must give the SAME k. If it changes, the table is not proportional.',
    guide: {
      key: 'A proportional relationship can always be written as the equation y = kx, where k is the constant of proportionality — the unit rate of y to x. Divide any pair y ÷ x and you always get the same number k.',
      rules: [
        { h: 'THE EQUATION', b: 'y = kx — as x changes, y changes k times as fast: k = 3 → (1,3), (2,6), (5,15)' },
        { h: 'FIND k', b: 'k = y ÷ x. Pick any row of the table — they all give the same k' },
        { h: 'TABLE TEST', b: 'Proportional means y ÷ x is the same in every row: 12 ÷ 3 = 4 and 20 ÷ 5 = 4' },
        { h: 'ORIGIN RULE', b: 'Proportional means x = 0 forces y = 0. Otherwise it is y = kx + b — not proportional' }
      ],
      steps: ['Pick a pair (x, y) with easy numbers', 'Divide: k = y ÷ x — test one more row, it must give the same k', 'Write the equation y = kx and use it to find any missing value'],
      ex: [
        { t: 'x: 2, 5, 9 · y: 6, 15, 27 — find k and write the equation.', s: ['Pick (2, 6): k = 6 ÷ 2 = 3', 'Check (5, 15): 15 ÷ 5 = 3 same k', 'Equation: y = 3x — test x = 9: 3 × 9 = 27'] },
        { t: 'x (hours): 3, 7 · y (EGP): 40.5, 94.5 — find k. What does k mean?', s: ['k = 40.5 ÷ 3 = 13.5', 'Check: 13.5 × 7 = 94.5', 'Equation y = 13.5x — k means EGP 13.50 per hour'] },
        { t: 'x: 0, 4, 8 · y: 5, 9, 13 — proportional?', s: ['9 ÷ 4 = 2.25 but 13 ÷ 8 = 1.625 — k changes', 'Also x = 0 gives y = 5, not 0', 'NOT proportional — y grows by adding, not multiplying'] }
      ],
      try: ['x: 4, 10 · y: 6, 15 — find k and write the equation.', 'x: 5, 8 · y: 12, 18 — proportional or not?', 'y = 7.5x — find y when x = 6.'],
      tryAns: ['k = 1.5 · y = 1.5x', 'Not proportional (12÷5 ≠ 18÷8)', 'y = 45']
    },
    gen: {
      easy: function () {
        var r = Math.random();
        if (r < 0.6) {
          /* k from a pair */
          var X = ri(2, 12), k = ri(2, 12), Y = X * k;
          var ok = String(k);
          return {
            q: 'y = ' + Y + ' when x = ' + X + '.  Find the constant of proportionality k (y = kx).',
            ok: ok,
            wrong: fill3(ok, [
              { t: String(X), d: 'You gave x. Divide y by x: ' + Y + ' ÷ ' + X + ' = ' + k + '.' },
              { t: fstr(X, Y), d: 'You divided x ÷ y. It is y ÷ x: ' + Y + ' ÷ ' + X + ' = ' + k + '.' },
              { t: String(Y - X), d: 'Subtracting does not find k — divide y ÷ x = ' + k + '.' }
            ], function () { return { t: String(k + ri(1, 5)), d: 'Check: ' + k + ' × ' + X + ' = ' + Y + ' exactly.' }; }),
            steps: ['Use k = y ÷ x', 'k = ' + Y + ' ÷ ' + X + ' = ' + k, 'Check: ' + k + ' × ' + X + ' = ' + Y]
          };
        }
        /* k from a table */
        var k2 = ri(2, 9);
        var x1 = ri(2, 6), x2 = x1 + ri(2, 6), x3 = x2 + ri(2, 8);
        var ok2 = String(k2);
        return {
          q: 'x: ' + x1 + ', ' + x2 + ', ' + x3 + ' · y: ' + (x1 * k2) + ', ' + (x2 * k2) + ', ' + (x3 * k2) + '  —  find k.',
          ok: ok2,
          wrong: fill3(ok2, [
            { t: String(k2 + 1), d: 'Check any row: ' + (x1 * k2) + ' ÷ ' + x1 + ' = ' + k2 + '.' },
            { t: fstr(x1, x1 * k2), d: 'k = y ÷ x, not x ÷ y: ' + (x1 * k2) + ' ÷ ' + x1 + ' = ' + k2 + '.' },
            { t: String(x2 - x1), d: 'That is the step size of x. k = y ÷ x from any row = ' + k2 + '.' }
          ], function () { return { t: String(k2 + ri(2, 6)), d: 'Every row: ' + (x2 * k2) + ' ÷ ' + x2 + ' = ' + k2 + ' too.' }; }),
          steps: ['Row (' + x1 + ', ' + (x1 * k2) + '): k = ' + (x1 * k2) + ' ÷ ' + x1 + ' = ' + k2, 'Check row (' + x2 + ', ' + (x2 * k2) + '): ' + (x2 * k2) + ' ÷ ' + x2 + ' = ' + k2 + ' same', 'k = ' + k2]
        };
      },
      medium: function () {
        var r = Math.random();
        if (r < 0.3) {
          /* find k and write the equation (decimal k possible) */
          var X = pick([2, 4, 5, 8, 10, 6]), k10 = pick([15, 25, 35, 45, 75]);
          var k = k10 / 10, Y = (X * k10) / 10;
          var ok = 'y = ' + k + 'x';
          return {
            q: 'x: ' + X + ' · y: ' + Y + '  —  find k and write the equation.',
            ok: ok,
            wrong: fill3(ok, [
              { t: 'y = x + ' + k, d: 'Proportional means MULTIPLY by k, not add: y = ' + k + ' × x.' },
              { t: 'y = ' + Y + 'x', d: 'That is the y-value, not k. Divide: ' + Y + ' ÷ ' + X + ' = ' + k + '.' },
              { t: 'y = x ÷ ' + k, d: 'k = y ÷ x = ' + k + ', so y = ' + k + ' × x.' }
            ], function () { return { t: 'y = ' + (k + 1) + 'x', d: 'Check with the pair: ' + (k + 1) + ' × ' + X + ' = ' + ((k + 1) * X) + ' ≠ ' + Y + '.' }; }),
            steps: ['k = y ÷ x = ' + Y + ' ÷ ' + X + ' = ' + k, 'Write the equation: y = ' + k + 'x', 'Check: ' + k + ' × ' + X + ' = ' + Y]
          };
        }
        if (r < 0.55) {
          /* use the equation: find y or find x */
          var X2 = pick([4, 6, 8, 10, 12, 14]), k2b = pick([25, 5, 15, 75]) / 10;
          var Y2 = (X2 * k2b * 10) / 10;
          if (Math.random() < 0.5) {
            var okY = String(Y2);
            return {
              q: 'Use the equation y = ' + k2b + 'x to find y when x = ' + X2 + '.',
              ok: okY,
              wrong: fill3(okY, [
                { t: String(X2 + k2b), d: 'Multiply, do not add: ' + k2b + ' × ' + X2 + ' = ' + Y2 + '.' },
                { t: String(X2 / k2b), d: 'y = k × x — multiply: ' + k2b + ' × ' + X2 + ' = ' + Y2 + '.' },
                { t: String(Y2 + X2), d: 'Just multiply: ' + k2b + ' × ' + X2 + ' = ' + Y2 + '.' }
              ], function () { return { t: String(Y2 + ri(5, 15)), d: 'y = ' + k2b + ' × ' + X2 + ' = ' + Y2 + '.' }; }),
              steps: ['Substitute x = ' + X2, 'y = ' + k2b + ' × ' + X2, 'y = ' + Y2]
            };
          }
          var okX = String(X2);
          return {
            q: 'Use the equation y = ' + k2b + 'x to find x when y = ' + Y2 + '.',
            ok: okX,
            wrong: fill3(okX, [
              { t: String(Y2 * k2b), d: 'To undo the multiply, DIVIDE: x = ' + Y2 + ' ÷ ' + k2b + '.' },
              { t: String(Y2 - k2b), d: 'Divide, do not subtract: x = ' + Y2 + ' ÷ ' + k2b + ' = ' + X2 + '.' },
              { t: String(Y2 + k2b), d: 'Divide: x = ' + Y2 + ' ÷ ' + k2b + ' = ' + X2 + '.' }
            ], function () { return { t: String(X2 + ri(2, 8)), d: 'Check: ' + k2b + ' × ' + (X2 + 2) + ' ≠ ' + Y2 + '.' }; }),
            steps: ['Substitute y = ' + Y2, k2b + 'x = ' + Y2 + '  →  x = ' + Y2 + ' ÷ ' + k2b, 'x = ' + X2]
          };
        }
        if (r < 0.8) {
          /* proportional or not? */
          var prop = Math.random() < 0.5;
          var b3 = prop ? 0 : ri(2, 6);
          var kk = ri(2, 7);
          var xa = ri(2, 6), xb = xa + ri(1, 5), xc = xb + ri(1, 5);
          var ya = xa * kk + b3, yb = xb * kk + b3, yc = xc * kk + b3;
          var okP = prop ? 'Proportional — y ÷ x is the same in every row' : 'Not proportional — y ÷ x changes and x = 0 does not give y = 0';
          return {
            q: 'Is this relationship proportional?  x: ' + xa + ', ' + xb + ', ' + xc + ' · y: ' + ya + ', ' + yb + ', ' + yc,
            ok: okP,
            wrong: fill3(okP, [
              { t: prop ? 'Not proportional — y is always bigger than x' : 'Proportional — y grows when x grows', d: 'Growing together is not enough — y ÷ x must be the SAME in every row: ' + ya + ' ÷ ' + xa + ' = ' + (Math.round(ya / xa * 100) / 100) + ' but ' + yb + ' ÷ ' + xb + ' = ' + (Math.round(yb / xb * 100) / 100) + '.' },
              { t: 'Proportional — every table is proportional', d: 'Only tables where y ÷ x never changes are proportional.' },
              { t: 'Not proportional — x and y cannot be in a table', d: 'Test the rows: divide y ÷ x in every row and compare.' }
            ], function () { return prop ? { t: 'Not proportional', d: 'All rows give k = ' + kk + ' — that is the definition of proportional.' } : { t: 'Proportional', d: ya + ' ÷ ' + xa + ' ≠ ' + yb + ' ÷ ' + xb + ' — k changes.' }; }),
            steps: ['Row (' + xa + ', ' + ya + '): ' + ya + ' ÷ ' + xa + ' = ' + (Math.round(ya / xa * 100) / 100), 'Row (' + xb + ', ' + yb + '): ' + yb + ' ÷ ' + xb + ' = ' + (Math.round(yb / xb * 100) / 100), (prop ? 'Same k every row → proportional (y = ' + kk + 'x)' : 'k changes → not proportional')]
          };
        }
        /* word problem: write the equation */
        var rate = ri(6, 25);
        var okW = 'y = ' + rate + 'x';
        return {
          q: 'Water flows into a pool at ' + rate + ' liters per minute. Write the equation for the total liters y after x minutes.',
          ok: okW,
          wrong: fill3(okW, [
            { t: 'y = x + ' + rate, d: 'Each minute ADDS ' + rate + ' liters — that is multiplying x by ' + rate + ': y = ' + rate + 'x.' },
            { t: 'y = ' + rate + ' + x', d: 'The rate multiplies x: y = ' + rate + ' × x.' },
            { t: 'y = x ÷ ' + rate, d: 'More minutes → more water, so x is multiplied: y = ' + rate + 'x.' }
          ], function () { return { t: 'y = ' + (rate + 1) + 'x', d: 'The rate is ' + rate + ' L per minute → y = ' + rate + 'x.' }; }),
          steps: ['k is the unit rate: ' + rate + ' liters per minute', 'y (total liters) = k × x (minutes)', 'y = ' + rate + 'x']
        };
      }
    }
  });

  /* ═══════════ 2-5 Graph Proportional Relationships ═══════════ */
  T2.lessons.push({
    id: 't2l5', code: '2-5', title: 'Graph Proportional Relationships',
    sub: 'Straight lines through the origin · Slope · Comparing graphs',
    calc: true,
    hintA: '🧭 The graph of y = kx is a straight line through the origin (0, 0) — k is the slope.',
    hintB: '👣 From (0, 0) to (x, y): k = y ÷ x. A bigger k makes a steeper line.',
    guide: {
      key: 'The graph of y = kx is a straight line through the origin (0, 0). The constant of proportionality k is the slope of the line — how far y climbs for each 1 step of x. A bigger k makes a steeper line.',
      rules: [
        { h: 'STRAIGHT LINE', b: 'Every point (x, kx) lines up perfectly — draw it with a ruler: y = 2x → (0,0), (1,2), (2,4), (3,6)' },
        { h: 'THROUGH THE ORIGIN', b: '(0, 0) is always on the line, because k × 0 = 0' },
        { h: 'SLOPE = k', b: 'From (0, 0) to (1, k) the line climbs k units in 1 step across: k = 3 → up 3 for each 1 across' },
        { h: 'NOT PROPORTIONAL', b: 'A straight line NOT passing through (0, 0) is y = kx + b with b ≠ 0' }
      ],
      steps: ['Make a table: x = 0, 1, 2, 3 and compute y = kx', 'Plot the points starting with the origin (0, 0)', 'Connect with a ruler — the line must pass through (0, 0)'],
      ex: [
        { t: 'Graph y = 2x.', s: ['Table: x = 0, 1, 2, 3 → y = 0, 2, 4, 6', 'Plot (0,0), (1,2), (2,4), (3,6)', 'A straight line through the origin'] },
        { t: 'Which line is steeper: y = 2x or y = ½x?', s: ['Both pass through (0, 0)', 'At x = 4: y = 2x gives 8, y = ½x gives 2', 'k = 2 > ½ → y = 2x is steeper'] },
        { t: 'A line passes through (0, 0) and (4, 12). Is it proportional? Write its equation.', s: ['Origin test: (0, 0) is on the line', 'k = 12 ÷ 4 = 3', 'y = 3x — proportional. Check: 3 × 4 = 12'] }
      ],
      try: ['Complete the table for y = 3x: x = 0, 1, 2 → y = ?', 'A line passes through (0, 0) and (5, 10). Find k.', 'Which is steeper: y = 4x or y = ¼x?'],
      tryAns: ['y = 0, 3, 6', 'k = 2', 'y = 4x']
    },
    gen: {
      easy: function () {
        var r = Math.random();
        if (r < 0.4) {
          /* y = kx: find y */
          var k = ri(2, 9), X = ri(2, 12), Y = k * X;
          var ok = String(Y);
          return {
            q: 'The graph of y = ' + k + 'x is a straight line through the origin. What is y when x = ' + X + '?',
            ok: ok,
            wrong: fill3(ok, [
              { t: String(k + X), d: 'Multiply, do not add: ' + k + ' × ' + X + ' = ' + Y + '.' },
              { t: String(X), d: 'That is x. Multiply by k: ' + k + ' × ' + X + ' = ' + Y + '.' },
              { t: String(Y + k), d: 'Check: ' + k + ' × ' + X + ' = ' + Y + ' exactly.' }
            ], function () { return { t: String(Y + ri(3, 12)), d: 'y = ' + k + ' × ' + X + ' = ' + Y + '.' }; }),
            steps: ['Substitute x = ' + X, 'y = ' + k + ' × ' + X, 'y = ' + Y]
          };
        }
        if (r < 0.7) {
          /* is the point on the line? */
          var k2 = ri(2, 9), X2 = ri(1, 10), Y2 = k2 * X2;
          var on = Math.random() < 0.55;
          var shownY = on ? Y2 : Y2 + ri(1, 5);
          var ok2 = on ? 'Yes — ' + k2 + ' × ' + X2 + ' = ' + shownY : 'No — ' + k2 + ' × ' + X2 + ' = ' + Y2 + ', not ' + shownY;
          return {
            q: 'Is the point (' + X2 + ', ' + shownY + ') on the line y = ' + k2 + 'x?',
            ok: ok2,
            wrong: fill3(ok2, [
              { t: on ? 'No — the point is above the line' : 'Yes — it is close to the line', d: 'Substitute x = ' + X2 + ': y = ' + k2 + ' × ' + X2 + ' = ' + Y2 + '. ' + (on ? 'It matches.' : 'It does not match.') },
              { t: 'Yes — every point is on every line', d: 'Substitute x = ' + X2 + ' and compare: y must equal ' + Y2 + '.' },
              { t: 'No — lines contain no points', d: 'Substitute x = ' + X2 + ': y = ' + k2 + ' × ' + X2 + ' = ' + Y2 + '.' }
            ], function () { return on ? { t: 'No — ' + k2 + ' × ' + X2 + ' ≠ ' + shownY, d: k2 + ' × ' + X2 + ' = ' + Y2 + ' which matches the point.' } : { t: 'Yes — ' + k2 + ' × ' + X2 + ' = ' + shownY, d: 'Actually ' + k2 + ' × ' + X2 + ' = ' + Y2 + '.' }; }),
            steps: ['Substitute x = ' + X2 + ' into y = ' + k2 + 'x', 'y = ' + k2 + ' × ' + X2 + ' = ' + Y2, (on ? 'The point matches → it is on the line' : 'The line gives y = ' + Y2 + ' ≠ ' + shownY + ' → not on the line')]
          };
        }
        /* k from two points */
        var X3 = pick([1, 2, 4, 5, 8, 10]), k3 = ri(2, 9), Y3 = k3 * X3;
        var ok3 = String(k3);
        return {
          q: 'A line passes through (0, 0) and (' + X3 + ', ' + Y3 + '). Find the slope k.',
          ok: ok3,
          wrong: fill3(ok3, [
            { t: String(X3), d: 'k = y ÷ x = ' + Y3 + ' ÷ ' + X3 + ' = ' + k3 + '.' },
            { t: String(Y3), d: 'That is the y-coordinate. Divide: ' + Y3 + ' ÷ ' + X3 + ' = ' + k3 + '.' },
            { t: String(Y3 - X3), d: 'Slope = rise ÷ run = ' + Y3 + ' ÷ ' + X3 + ' = ' + k3 + '.' }
          ], function () { return { t: String(k3 + ri(1, 4)), d: 'Check: ' + (k3 + 1) + ' × ' + X3 + ' = ' + ((k3 + 1) * X3) + ' ≠ ' + Y3 + '.' }; }),
          steps: ['Slope from the origin: k = y ÷ x', 'k = ' + Y3 + ' ÷ ' + X3 + ' = ' + k3, 'The line is y = ' + k3 + 'x']
        };
      },
      medium: function () {
        var r = Math.random();
        if (r < 0.3) {
          /* find k and write the equation (decimals possible) */
          var X = pick([2, 3, 4, 5, 6, 8]), k10 = pick([15, 25, 5, 35, 45, 75]);
          var k = k10 / 10, Y = (X * k10) / 10;
          var ok = 'y = ' + k + 'x';
          return {
            q: 'A proportional line passes through (0, 0) and (' + X + ', ' + Y + '). Find k and write the equation.',
            ok: ok,
            wrong: fill3(ok, [
              { t: 'y = ' + Y + 'x', d: 'That uses the y-value. k = ' + Y + ' ÷ ' + X + ' = ' + k + '.' },
              { t: 'y = x + ' + k, d: 'A proportional line multiplies: y = ' + k + ' × x.' },
              { t: 'y = ' + fstr(X, Y) + 'x', d: 'k = y ÷ x = ' + k + ' — divide, do not flip.' }
            ], function () { return { t: 'y = ' + (k + 1) + 'x', d: (k + 1) + ' × ' + X + ' = ' + ((k + 1) * X) + ' ≠ ' + Y + '.' }; }),
            steps: ['Origin test: (0, 0) is on the line', 'k = ' + Y + ' ÷ ' + X + ' = ' + k, 'Equation: y = ' + k + 'x']
          };
        }
        if (r < 0.55) {
          /* steeper comparison */
          var k1 = ri(2, 6), k2 = k1 + ri(2, 6);
          var hi = Math.max(k1, k2), lo = Math.min(k1, k2);
          var okS = 'y = ' + hi + 'x — bigger k climbs faster';
          return {
            q: 'Which line is steeper: y = ' + k1 + 'x or y = ' + k2 + 'x?',
            ok: okS,
            wrong: fill3(okS, [
              { t: 'y = ' + lo + 'x — smaller k is steeper', d: 'Smaller k climbs LESS for each step across — the bigger k wins.' },
              { t: 'They are equally steep', d: 'At x = 1 the lines are at y = ' + k1 + ' and y = ' + k2 + ' — different heights.' },
              { t: 'Cannot tell without a graph', d: 'You can: k IS the slope. ' + hi + ' > ' + lo + '.' }
            ], function () { return { t: 'y = ' + (hi + 1) + 'x — bigger k climbs faster', d: 'Compare the two k values: ' + k1 + ' vs ' + k2 + '.' }; }),
            steps: ['Both lines pass through (0, 0)', 'Slopes: k = ' + k1 + ' and k = ' + k2, 'Bigger k = ' + hi + ' → steeper line']
          };
        }
        if (r < 0.8) {
          /* cyclist word problem */
          var k3 = pick([8, 10, 12, 14, 16, 18]);
          var askTime = Math.random() < 0.5;
          if (askTime) {
            var dist = k3 * ri(2, 6);
            var okT = (dist / k3) + ' hours';
            return {
              q: 'A cyclist rides y = ' + k3 + 'x km after x hours. How long does she need to travel ' + dist + ' km?',
              ok: okT,
              wrong: fill3(okT, [
                { t: (dist * k3) + ' hours', d: 'Undo the multiply by DIVIDING: ' + dist + ' ÷ ' + k3 + '.' },
                { t: (dist + k3) + ' hours', d: 'Divide: ' + dist + ' ÷ ' + k3 + ' = ' + (dist / k3) + '.' },
                { t: (dist - k3) + ' hours', d: 'Divide: ' + dist + ' ÷ ' + k3 + ' = ' + (dist / k3) + '.' }
              ], function () { return { t: (dist / k3 + 1) + ' hours', d: 'Check: ' + k3 + ' × ' + (dist / k3) + ' = ' + dist + '.' }; }),
              steps: [k3 + 'x = ' + dist, 'x = ' + dist + ' ÷ ' + k3, 'x = ' + (dist / k3) + ' hours']
            };
          }
          var t = pick([2, 3, 4, 5, 6, 7]);
          var okD = (k3 * t) + ' km';
          return {
            q: 'A cyclist rides y = ' + k3 + 'x km after x hours. How far does she ride in ' + t + ' hours?',
            ok: okD,
            wrong: fill3(okD, [
              { t: (k3 + t) + ' km', d: 'Multiply: ' + k3 + ' × ' + t + ' = ' + (k3 * t) + '.' },
              { t: (t) + ' km', d: 'That is the time. y = ' + k3 + ' × ' + t + '.' },
              { t: (k3 * t + k3) + ' km', d: 'Check: ' + k3 + ' × ' + t + ' = ' + (k3 * t) + ' exactly.' }
            ], function () { return { t: (k3 * t + ri(4, 15)) + ' km', d: 'y = ' + k3 + ' × ' + t + ' = ' + (k3 * t) + '.' }; }),
            steps: ['Substitute x = ' + t, 'y = ' + k3 + ' × ' + t, 'y = ' + (k3 * t) + ' km']
          };
        }
        /* point on y=kx then check another */
        var X4 = ri(2, 9), k4 = ri(2, 8), Y4 = k4 * X4;
        var ok4 = String(k4);
        return {
          q: 'The point (' + X4 + ', ' + Y4 + ') is on the line y = kx. Find k, then check whether (' + (X4 * 2) + ', ' + (Y4 * 2) + ') is also on the line.',
          ok: ok4,
          wrong: fill3(ok4, [
            { t: String(X4), d: 'k = y ÷ x = ' + Y4 + ' ÷ ' + X4 + ' = ' + k4 + '.' },
            { t: String(Y4), d: 'That is the y-value. Divide: ' + Y4 + ' ÷ ' + X4 + ' = ' + k4 + '.' },
            { t: String(k4 * 2), d: 'That is the k of the DOUBLED point — the original k is ' + k4 + '.' }
          ], function () { return { t: String(k4 + ri(1, 5)), d: 'k = ' + Y4 + ' ÷ ' + X4 + ' = ' + k4 + '.' }; }),
          steps: ['k = ' + Y4 + ' ÷ ' + X4 + ' = ' + k4, 'Line: y = ' + k4 + 'x', 'Test (' + (X4 * 2) + ', ' + (Y4 * 2) + '): ' + k4 + ' × ' + (X4 * 2) + ' = ' + (Y4 * 2) + ' ✓ on the line']
        };
      }
    }
  });

  hook();
})();
