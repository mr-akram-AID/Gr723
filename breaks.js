/* ============================================================
   AID Mathematics Academy · Grade 7 — breaks.js
   Arcade brain-breaks, embedded inside the lesson:
   after every 5 questions (80% chance) an overlay appears with
   a random 30-second arcade game, then the student returns to
   the quiz automatically. No separate Games Zone.
   Games ported from the Grade 8 arcade engine, re-themed:
   Gold Dash · Balloon Blitz · Fruit Slash · Mole Whack ·
   Meteor Dodge · Brick Breaker
   Standalone file: delete it and the quiz just runs without breaks.
   ============================================================ */
(function () {
  'use strict';

  var RUN = false;          /* guard against two overlapping breaks */
  var DUR = 30;             /* seconds */

  function $(id) { return document.getElementById(id); }
  function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  var Snd = (function () {
    var dummy = { ok: function () {}, bad: function () {}, hint: function () {}, coin: function () {}, win: function () {} };
    return function () { return (window.G7 && G7.sfx) ? G7.sfx : dummy; };
  })();

  var GOLD = '#d2a44d', GOLDHI = '#ecc87e', INK = '#efe6d2', MUT = '#a6997e', BAD = '#cf7f65';

  /* ═══════════ the arcade menu ═══════════ */
  var ARCADE = [
    { id: 'dash',    title: 'Gold Dash',     how: 'Catch the falling gold · dodge the grey stones — drag or arrow keys.' },
    { id: 'balloon', title: 'Balloon Blitz', how: 'Tap the rising balloons — never the black bombs.' },
    { id: 'fruit',   title: 'Fruit Slash',   how: 'Tap the fruits mid-air before they hit the ground.' },
    { id: 'mole',    title: 'Mole Whack',    how: 'Tap every mole the moment it pops up — bombs cost a heart.' },
    { id: 'meteor',  title: 'Meteor Dodge',  how: 'Steer the golden ship — every second survived is a point.' },
    { id: 'brick',   title: 'Brick Breaker', how: 'Move the paddle — clear the golden wall to climb levels.' }
  ];

  /* ═══════════ launch a break ═══════════ */
  function go(cb) {
    if (RUN) { if (cb) cb(0); return; }
    RUN = true;

    var g = pick(ARCADE);

    var ov = document.createElement('div');
    ov.id = 'br-ov';
    ov.innerHTML =
      '<div class="br-panel">' +
        '<div class="br-head"><span class="br-title">🎮 ' + g.title + '</span><span class="br-chip" id="br-score">★ 0</span></div>' +
        '<div class="br-timer"><div id="br-bar"></div></div>' +
        '<div class="br-stage">' +
          '<canvas id="br-cv" width="960" height="540"></canvas>' +
          '<div id="br-end" class="hidden"><div class="be1">🎉</div><div class="be2" id="be2"></div><div class="be3" id="be3"></div></div>' +
        '</div>' +
        '<div class="br-foot">' + g.how + ' · back to the questions automatically</div>' +
      '</div>';
    document.body.appendChild(ov);

    var cv = $('br-cv'), cx = cv.getContext('2d');
    var state = { score: 0, t: DUR, ended: false, live: true };
    var ST = null, KY = { l: false, r: false }, raf = 0, tick = 0, L = [];
    var lastTs = 0;

    function listen(target, type, fn) { target.addEventListener(type, fn); L.push({ t: target, ty: type, fn: fn }); }
    function addScore(n) {
      if (state.ended) return;
      state.score += n;
      var s = $('br-score'); if (s) s.textContent = '★ ' + state.score;
    }

    /* countdown */
    tick = setInterval(function () {
      if (state.ended) return;
      state.t -= 0.1;
      if (state.t <= 0) { state.t = 0; endGame(); return; }
      var bar = $('br-bar'); if (bar) bar.style.width = (state.t / DUR * 100) + '%';
    }, 100);

    function endGame() {
      if (state.ended) return;
      state.ended = true; state.live = false;
      cancelAnimationFrame(raf);
      clearInterval(tick);
      for (var i = 0; i < L.length; i++) { try { L[i].t.removeEventListener(L[i].ty, L[i].fn); } catch (e) {} }
      var coins = Math.min(15, Math.floor(state.score / 10));
      $('be2').textContent = state.score + ' points!';
      $('be3').textContent = coins > 0 ? '+ ' + coins + ' 🪙 — back to the questions…' : 'Back to the questions…';
      $('br-end').classList.remove('hidden');
      Snd().win();
      setTimeout(function () {
        if (ov.parentNode) ov.parentNode.removeChild(ov);
        RUN = false;
        if (cb) cb(coins);
      }, 2300);
    }

    /* ---------- shared helpers ---------- */
    function burst(x, y, col, n) { for (var i = 0; i < (n || 10); i++) ST.parts.push({ x: x, y: y, vx: (Math.random() - .5) * 5.5, vy: (Math.random() - .5) * 5.5 - 1.2, a: 1, col: col }); }
    function stepParts(f) { ST.parts = ST.parts.filter(function (p) { p.x += p.vx * f; p.y += p.vy * f; p.a -= .045 * f; return p.a > 0; }); }
    function drawParts() { ST.parts.forEach(function (p) { cx.globalAlpha = Math.max(0, p.a); cx.fillStyle = p.col; cx.beginPath(); cx.arc(p.x, p.y, 3.4, 0, 7); cx.fill(); }); cx.globalAlpha = 1; }
    function rr(x, y, w, h, r) { cx.beginPath(); cx.moveTo(x + r, y); cx.arcTo(x + w, y, x + w, y + h, r); cx.arcTo(x + w, y + h, x, y + h, r); cx.arcTo(x, y + h, x, y, r); cx.arcTo(x, y, x + w, y, r); cx.closePath(); }
    function pos(e) { var r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * 960 / r.width, y: (e.clientY - r.top) * 540 / r.height }; }
    function hearts() { return ST.lives != null ? '  ♥' + ST.lives : ''; }
    function hud() { $('br-score').textContent = '★ ' + state.score; }

    /* ---------- init per game ---------- */
    function init(id) {
      ST = { id: id, parts: [], acc: 0, sp: 0, flash: 0, last: 0 };
      KY.l = false; KY.r = false;
      if (id === 'dash') { ST.px = 480; ST.items = []; ST.lives = 3; }
      else if (id === 'balloon') { ST.lives = 3; ST.balls = []; ST.sp = 500; }
      else if (id === 'fruit') { ST.lives = 3; ST.fruits = []; ST.sp = 320; }
      else if (id === 'mole') { ST.lives = 3; ST.holes = []; ST.sp = 650; for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) ST.holes.push({ x: 240 + c * 240, y: 150 + r * 150, ent: null }); }
      else if (id === 'meteor') { ST.px = 480; ST.mets = []; ST.sec = 0; ST.stars = []; for (var i = 0; i < 70; i++) ST.stars.push({ x: ri(0, 960), y: ri(0, 540), r: Math.random() * 1.6 + .4, tw: ri(0, 999) }); }
      else if (id === 'brick') { ST.lives = 3; ST.lvl = 1; ST.pw = 130; ST.px = 430; newWall(); }
    }
    function newWall() {
      ST.bricks = [];
      var rows = 4 + Math.min(2, ST.lvl - 1);
      for (var r = 0; r < rows; r++) for (var c = 0; c < 10; c++) ST.bricks.push({ x: 36 + c * 89, y: 56 + r * 29, w: 81, h: 21 });
      ST.ball = { x: ST.px, y: 496, vx: 3, vy: -4.2, stuck: true }; ST.stT = 0;
    }

    /* ---------- step ---------- */
    function stepAll(dt) {
      var f = dt / 16.7, id = ST.id;
      if (ST.flash > 0) ST.flash -= dt;
      stepParts(f);
      if (id === 'dash') stepDash(dt, f);
      else if (id === 'balloon') stepBalloon(dt, f);
      else if (id === 'fruit') stepFruit(dt, f);
      else if (id === 'mole') stepMole(dt);
      else if (id === 'meteor') stepMeteor(dt, f);
      else if (id === 'brick') stepBrick(dt, f);
    }
    function stepDash(dt, f) {
      if (KY.l) ST.px -= .55 * dt; if (KY.r) ST.px += .55 * dt;
      ST.px = Math.max(40, Math.min(920, ST.px));
      ST.acc += dt;
      var rate = Math.max(260, 850 - state.score * 14);
      while (ST.acc >= rate) { ST.acc -= rate; ST.items.push({ x: ri(30, 930), y: -24, g: Math.random() < .72, v: 2 + Math.random() * 2 + state.score * .03 }); }
      ST.items = ST.items.filter(function (it) {
        it.y += it.v * f;
        if (it.y > 468 && it.y < 534 && Math.abs(it.x - ST.px) < 46) {
          if (it.g) { addScore(1); Snd().coin(); burst(it.x, it.y, GOLD); }
          else { ST.lives--; Snd().bad(); ST.flash = 280; burst(it.x, it.y, BAD); if (ST.lives <= 0) endGame(); }
          return false;
        }
        return it.y < 560;
      });
    }
    function stepBalloon(dt, f) {
      ST.sp -= dt;
      if (ST.sp <= 0) {
        ST.sp = Math.max(340, 900 - state.score * 10);
        ST.balls.push({ x: ri(50, 910), y: 575, r: ri(22, 31), v: .09 + Math.random() * .08 + state.score * .002, hue: ri(0, 359), bomb: Math.random() < .16, ph: ri(0, 100) });
      }
      ST.balls = ST.balls.filter(function (b) { b.y -= b.v * dt; b.x += Math.sin((b.y + b.ph) / 38) * .9 * f; return b.y > -60; });
    }
    function stepFruit(dt, f) {
      ST.sp -= dt;
      if (ST.sp <= 0) {
        ST.sp = Math.max(420, 1000 - state.score * 18);
        ST.fruits.push({ x: ri(90, 870), y: 560, vx: (Math.random() - .5) * 2.4, vy: -(11.5 + Math.random() * 3.5), e: pick(['🍉', '🍎', '🍊', '🍌', '🍇', '🍓']), rot: Math.random() * 6, vr: (Math.random() - .5) * .12 });
      }
      ST.fruits = ST.fruits.filter(function (fr) {
        fr.vy += .3 * f; fr.x += fr.vx * f; fr.y += fr.vy * f; fr.rot += fr.vr * f;
        if (fr.y > 620) { ST.lives--; Snd().bad(); burst(fr.x, 540, MUT, 8); if (ST.lives <= 0) endGame(); return false; }
        return fr.x > -60 && fr.x < 1020;
      });
    }
    function stepMole(dt) {
      ST.sp -= dt;
      if (ST.sp <= 0) {
        ST.sp = Math.max(420, 900 - state.score * 14);
        var empty = ST.holes.filter(function (h) { return !h.ent; });
        if (empty.length) {
          var h = pickOne(empty), life = Math.max(650, 1250 - state.score * 14);
          h.ent = { bomb: Math.random() < .18, life: life, max: life };
        }
      }
      ST.holes.forEach(function (h) { if (h.ent) { h.ent.life -= dt; if (h.ent.life <= 0) h.ent = null; } });
    }
    function pickOne(a) { return a[Math.floor(Math.random() * a.length)]; }
    function stepMeteor(dt, f) {
      if (KY.l) ST.px -= .62 * dt; if (KY.r) ST.px += .62 * dt;
      ST.px = Math.max(36, Math.min(924, ST.px));
      ST.sec += dt;
      if (ST.sec >= 1000) { ST.sec -= 1000; addScore(1); Snd().hint(); }
      ST.acc += dt;
      var rate = Math.max(280, 760 - state.score * 12);
      while (ST.acc >= rate) { ST.acc -= rate; ST.mets.push({ x: ri(20, 940), y: -40, r: ri(13, 26), v: 2.4 + Math.random() * 2.4 + state.score * .02, rot: Math.random() * 6 }); }
      ST.mets = ST.mets.filter(function (m) {
        m.y += m.v * f; m.rot += .03 * f;
        var dx = m.x - ST.px, dy = m.y - 492;
        if (dx * dx + dy * dy < (m.r + 16) * (m.r + 16)) { burst(m.x, m.y, BAD, 14); endGame(); return false; }
        return m.y < 620;
      });
    }
    function stepBrick(dt, f) {
      if (KY.l) ST.px -= .6 * dt; if (KY.r) ST.px += .6 * dt;
      ST.px = Math.max(75, Math.min(885, ST.px));
      var b = ST.ball;
      if (b.stuck) { b.x = ST.px; b.y = 496; ST.stT += dt; if (ST.stT > 800) { b.stuck = false; b.vx = (Math.random() < .5 ? -1 : 1) * 3; b.vy = -4.2; } return; }
      b.x += b.vx * f; b.y += b.vy * f;
      if (b.x < 12) { b.x = 12; b.vx = Math.abs(b.vx); Snd().hint(); }
      if (b.x > 948) { b.x = 948; b.vx = -Math.abs(b.vx); Snd().hint(); }
      if (b.y < 12) { b.y = 12; b.vy = Math.abs(b.vy); Snd().hint(); }
      if (b.vy > 0 && b.y > 484 && b.y < 506 && Math.abs(b.x - ST.px) < ST.pw / 2 + 10) {
        b.vy = -Math.abs(b.vy); b.vx = Math.max(-5.2, Math.min(5.2, ((b.x - ST.px) / (ST.pw / 2)) * 4.6)); Snd().hint();
      }
      for (var i = ST.bricks.length - 1; i >= 0; i--) {
        var br = ST.bricks[i];
        if (b.x > br.x - 9 && b.x < br.x + br.w + 9 && b.y > br.y - 9 && b.y < br.y + br.h + 9) {
          var ox = Math.min(b.x - (br.x - 9), (br.x + br.w + 9) - b.x);
          var oy = Math.min(b.y - (br.y - 9), (br.y + br.h + 9) - b.y);
          if (ox < oy) b.vx = -b.vx; else b.vy = -b.vy;
          ST.bricks.splice(i, 1); addScore(10); Snd().ok(); burst(b.x, b.y, GOLD);
          break;
        }
      }
      if (!ST.bricks.length) { ST.lvl++; addScore(50); Snd().win(); newWall(); return; }
      if (b.y > 560) { ST.lives--; Snd().bad(); if (ST.lives <= 0) { endGame(); return; } ST.ball = { x: ST.px, y: 496, vx: 3, vy: -4.2, stuck: true }; ST.stT = 0; }
    }

    /* ---------- draw ---------- */
    function drawAll() {
      var gr = cx.createLinearGradient(0, 0, 0, 540);
      if (ST.id === 'meteor') gr.addColorStop(0, '#0d0a14'); else gr.addColorStop(0, '#141009');
      gr.addColorStop(1, '#241c11');
      cx.fillStyle = gr; cx.fillRect(0, 0, 960, 540);
      var id = ST.id;
      if (id === 'dash') drawDash();
      else if (id === 'balloon') drawBalloon();
      else if (id === 'fruit') drawFruit();
      else if (id === 'mole') drawMole();
      else if (id === 'meteor') drawMeteor();
      else if (id === 'brick') drawBrick();
      drawParts();
      if (ST.flash > 0) { cx.fillStyle = 'rgba(207,127,101,' + (Math.min(1, ST.flash / 300) * .22) + ')'; cx.fillRect(0, 0, 960, 540); }
      /* hearts */
      if (ST.lives != null) {
        cx.font = '600 22px "Instrument Sans",sans-serif'; cx.textAlign = 'right'; cx.fillStyle = '#cf7f65';
        cx.fillText('♥'.repeat(Math.max(0, ST.lives)), 940, 34);
        cx.textAlign = 'left';
      }
      hud();
    }
    function drawDash() {
      cx.fillStyle = '#3b3225'; cx.fillRect(0, 522, 960, 18);
      ST.items.forEach(function (it) {
        if (it.g) {
          cx.save(); cx.shadowColor = GOLD; cx.shadowBlur = 14; cx.fillStyle = GOLD;
          cx.beginPath(); cx.arc(it.x, it.y, 11, 0, 7); cx.fill(); cx.restore();
          cx.fillStyle = '#8a6a2a'; cx.beginPath(); cx.arc(it.x - 3, it.y - 3, 3.5, 0, 7); cx.fill();
        } else {
          cx.fillStyle = '#6f6552'; cx.beginPath();
          cx.moveTo(it.x - 14, it.y + 10); cx.lineTo(it.x, it.y - 12); cx.lineTo(it.x + 14, it.y + 10); cx.closePath(); cx.fill();
        }
      });
      cx.fillStyle = GOLDHI; cx.beginPath();
      cx.moveTo(ST.px - 30, 514); cx.lineTo(ST.px + 30, 514); cx.lineTo(ST.px + 18, 482); cx.lineTo(ST.px - 18, 482); cx.closePath(); cx.fill();
      cx.fillStyle = GOLD; cx.fillRect(ST.px - 32, 514, 64, 8);
    }
    function drawBalloon() {
      ST.balls.forEach(function (b) {
        if (b.bomb) { cx.font = '34px serif'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText('💣', b.x, b.y); return; }
        var g = cx.createRadialGradient(b.x - 8, b.y - 10, 4, b.x, b.y, b.r);
        g.addColorStop(0, 'hsl(' + b.hue + ',85%,72%)'); g.addColorStop(1, 'hsl(' + b.hue + ',70%,45%)');
        cx.fillStyle = g; cx.beginPath(); cx.ellipse(b.x, b.y, b.r * .86, b.r, 0, 0, 7); cx.fill();
        cx.strokeStyle = 'rgba(166,153,126,.6)'; cx.lineWidth = 1.5;
        cx.beginPath(); cx.moveTo(b.x, b.y + b.r); cx.quadraticCurveTo(b.x + 6, b.y + b.r + 16, b.x - 2, b.y + b.r + 30); cx.stroke();
      });
      cx.textBaseline = 'alphabetic';
    }
    function drawFruit() {
      ST.fruits.forEach(function (fr) {
        cx.save(); cx.translate(fr.x, fr.y); cx.rotate(fr.rot);
        cx.font = '40px serif'; cx.textAlign = 'center'; cx.textBaseline = 'middle';
        cx.fillText(fr.e, 0, 0); cx.restore();
      });
      cx.textBaseline = 'alphabetic';
    }
    function drawMole() {
      ST.holes.forEach(function (h) {
        cx.fillStyle = '#0c0906'; cx.beginPath(); cx.ellipse(h.x, h.y + 18, 58, 20, 0, 0, 7); cx.fill();
        cx.strokeStyle = '#3b3225'; cx.lineWidth = 2; cx.beginPath(); cx.ellipse(h.x, h.y + 18, 58, 20, 0, 0, 7); cx.stroke();
        if (h.ent) {
          var tIn = Math.min(1, (h.ent.max - h.ent.life) / 180);
          var s = Math.max(0, Math.min(1, h.ent.life < 200 ? h.ent.life / 200 : tIn));
          cx.save(); cx.translate(h.x, h.y + 8); cx.scale(s, s);
          cx.font = '52px serif'; cx.textAlign = 'center'; cx.textBaseline = 'bottom';
          cx.fillText(h.ent.bomb ? '💣' : '🐹', 0, 4); cx.restore();
          if (h.ent.life < 420 && !h.ent.bomb) {
            cx.strokeStyle = 'rgba(236,200,126,.75)'; cx.lineWidth = 2.5;
            cx.beginPath(); cx.arc(h.x, h.y - 16, 34, 0, 7 * (h.ent.life / 420)); cx.stroke();
          }
        }
      });
      cx.textBaseline = 'alphabetic';
    }
    function drawMeteor() {
      var t = Date.now();
      ST.stars.forEach(function (s) {
        cx.globalAlpha = .25 + .6 * Math.abs(Math.sin((t + s.tw) / 640));
        cx.fillStyle = INK; cx.beginPath(); cx.arc(s.x, s.y, s.r, 0, 7); cx.fill();
      });
      cx.globalAlpha = 1;
      ST.mets.forEach(function (m) {
        var gr = cx.createRadialGradient(m.x, m.y, 2, m.x, m.y, m.r);
        gr.addColorStop(0, '#cf7f65'); gr.addColorStop(.55, '#8a5a44'); gr.addColorStop(1, '#4a3a30');
        cx.fillStyle = gr; cx.beginPath(); cx.arc(m.x, m.y, m.r, 0, 7); cx.fill();
        cx.fillStyle = 'rgba(30,22,16,.5)';
        cx.beginPath(); cx.arc(m.x - m.r * .3, m.y - m.r * .2, m.r * .22, 0, 7); cx.fill();
        cx.beginPath(); cx.arc(m.x + m.r * .25, m.y + m.r * .35, m.r * .15, 0, 7); cx.fill();
      });
      var px = ST.px, py = 492, fl = 6 + Math.sin(t / 55) * 4;
      cx.fillStyle = '#cf9a4d';
      cx.beginPath(); cx.moveTo(px - 9, py - 4); cx.lineTo(px - 11, py + fl); cx.lineTo(px - 3, py + 2); cx.closePath(); cx.fill();
      cx.beginPath(); cx.moveTo(px + 9, py - 4); cx.lineTo(px + 11, py + fl); cx.lineTo(px + 3, py + 2); cx.closePath(); cx.fill();
      cx.save(); cx.shadowColor = GOLDHI; cx.shadowBlur = 10; cx.fillStyle = GOLDHI;
      cx.beginPath(); cx.moveTo(px, py - 20); cx.lineTo(px + 16, py + 12); cx.lineTo(px - 16, py + 12); cx.closePath(); cx.fill();
      cx.fillStyle = '#1a1510'; cx.beginPath(); cx.arc(px, py - 2, 3.6, 0, 7); cx.fill();
      cx.restore();
    }
    function drawBrick() {
      ST.bricks.forEach(function (br) {
        var g2 = cx.createLinearGradient(0, br.y, 0, br.y + br.h);
        g2.addColorStop(0, GOLDHI); g2.addColorStop(1, '#a5843f');
        cx.fillStyle = g2; rr(br.x, br.y, br.w, br.h, 5); cx.fill();
      });
      var g3 = cx.createLinearGradient(ST.px - ST.pw / 2, 0, ST.px + ST.pw / 2, 0);
      g3.addColorStop(0, GOLD); g3.addColorStop(.5, GOLDHI); g3.addColorStop(1, GOLD);
      cx.fillStyle = g3; rr(ST.px - ST.pw / 2, 496, ST.pw, 14, 7); cx.fill();
      cx.save(); cx.shadowColor = GOLDHI; cx.shadowBlur = 16; cx.fillStyle = '#faf3e0';
      cx.beginPath(); cx.arc(ST.ball.x, ST.ball.y, 9, 0, 7); cx.fill(); cx.restore();
      if (ST.ball.stuck) { cx.fillStyle = 'rgba(166,153,126,.85)'; cx.font = '600 13px "Instrument Sans",sans-serif'; cx.textAlign = 'center'; cx.fillText('get ready…', ST.px, 470); }
    }

    /* ---------- input ---------- */
    listen(cv, 'pointerdown', function (e) {
      if (!state.live) return;
      e.preventDefault();
      var p = pos(e), id = ST.id;
      if (id === 'balloon') popAt(p);
      else if (id === 'fruit') sliceAt(p);
      else if (id === 'mole') whackAt(p);
      else if (id === 'dash' || id === 'meteor' || id === 'brick') { ST.px = p.x; }
    });
    listen(cv, 'pointermove', function (e) {
      if (!state.live) return;
      var id = ST.id;
      if (id === 'dash' || id === 'meteor' || ((id === 'brick') && ((e.buttons & 1) || e.pointerType === 'touch'))) {
        var p = pos(e);
        var lo = id === 'brick' ? 75 : 40, hi = id === 'brick' ? 885 : 920;
        ST.px = Math.max(lo, Math.min(hi, p.x));
      }
    });
    listen(window, 'keydown', function (e) {
      if (!state.live) return;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); }
      if (e.key === 'ArrowLeft') KY.l = true;
      if (e.key === 'ArrowRight') KY.r = true;
    });
    listen(window, 'keyup', function (e) {
      if (e.key === 'ArrowLeft') KY.l = false;
      if (e.key === 'ArrowRight') KY.r = false;
    });

    function popAt(p) {
      for (var i = ST.balls.length - 1; i >= 0; i--) {
        var b = ST.balls[i], dx = p.x - b.x, dy = p.y - b.y;
        if (dx * dx + dy * dy < (b.r + 9) * (b.r + 9)) {
          ST.balls.splice(i, 1);
          if (b.bomb) { ST.lives--; Snd().bad(); ST.flash = 260; burst(b.x, b.y, BAD); if (ST.lives <= 0) endGame(); }
          else { addScore(1); Snd().coin(); burst(b.x, b.y, 'hsl(' + b.hue + ',80%,60%)'); }
          return;
        }
      }
    }
    function sliceAt(p) {
      for (var i = ST.fruits.length - 1; i >= 0; i--) {
        var fr = ST.fruits[i], dx = p.x - fr.x, dy = p.y - fr.y;
        if (dx * dx + dy * dy < 48 * 48) { ST.fruits.splice(i, 1); addScore(1); Snd().ok(); burst(fr.x, fr.y, GOLDHI, 12); return; }
      }
    }
    function whackAt(p) {
      for (var i = 0; i < ST.holes.length; i++) {
        var h = ST.holes[i]; if (!h.ent) continue;
        var dx = p.x - h.x, dy = p.y - (h.y - 26);
        if (dx * dx + dy * dy < 55 * 55) {
          if (h.ent.bomb) { ST.lives--; Snd().bad(); ST.flash = 260; burst(h.x, h.y - 26, BAD, 12); if (ST.lives <= 0) endGame(); }
          else { addScore(1); Snd().coin(); burst(h.x, h.y - 26, GOLDHI, 10); }
          h.ent = null; return;
        }
      }
    }

    /* ---------- main loop ---------- */
    function loop(ts) {
      if (state.ended) return;
      var dt = Math.min(50, ts - (lastTs || ts)); lastTs = ts;
      if (state.live) stepAll(dt);
      if (ST) drawAll();
      if (!state.ended) raf = requestAnimationFrame(loop);
    }

    init(g.id);
    state.live = true;
    raf = requestAnimationFrame(loop);
  }

  /* export */
  window.Breaks = { go: go };
})();
