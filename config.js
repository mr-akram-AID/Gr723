/* ============================================================
   AID Mathematics Academy · Grade 7 — config.js
   Teacher settings + the floating WhatsApp button.

   ⚠️ MR. AKRAM — PUT YOUR WHATSAPP NUMBER HERE:
   Replace the number below with your own number, in international
   format: country code + number, digits only, no + and no spaces.
   Example for Egypt:  '201234567890'
   ============================================================ */
window.G7CONFIG = {
  teacher: 'Mr. Akram',
  whatsapp: ''   /* ← put your number between the quotes, e.g. '201234567890' */
};

/* ─── Floating WhatsApp button — works even if the number is not set ─── */
(function () {
  'use strict';

  function storedNumber() {
    try { return localStorage.getItem('G7WA') || ''; } catch (e) { return ''; }
  }
  function fileNumber() {
    return (window.G7CONFIG && window.G7CONFIG.whatsapp) || '';
  }
  function currentNumber() {
    var n = (storedNumber() || fileNumber()).replace(/[^0-9]/g, '');
    return n;
  }

  var MSG = 'Hello Mr. Akram! I am using the AID Mathematics Academy (Grade 7) platform and I need some help, please.';

  function openChat() {
    var n = currentNumber();
    if (!n) { askNumber(); return; }
    window.open('https://wa.me/' + n + '?text=' + encodeURIComponent(MSG), '_blank');
  }

  /* ask the teacher's number once — saved on this device */
  function askNumber() {
    var old = document.getElementById('wa-modal');
    if (old) { old.remove(); }
    var m = document.createElement('div');
    m.id = 'wa-modal';
    m.className = 'modal';
    m.innerHTML =
      '<div class="modal-box wa-box">' +
        '<div class="wa-ico">' + waSvg(34) + '</div>' +
        '<h2 style="margin:.6rem 0 .4rem">Chat with Mr. Akram</h2>' +
        '<p class="muted" style="font-size:.9rem;line-height:1.6">Type Mr. Akram\'s WhatsApp number (country code + number, digits only). It stays saved on this device.</p>' +
        '<input id="wa-num" class="big-input" inputmode="numeric" maxlength="15" placeholder="e.g. 201234567890" value="' + esc(storedNumber()) + '">' +
        '<div class="row center">' +
          '<button class="btn primary" id="wa-save">Open WhatsApp</button>' +
          '<button class="btn ghost" id="wa-cancel">Cancel</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(m);
    document.getElementById('wa-num').focus();
    document.getElementById('wa-cancel').onclick = function () { m.remove(); };
    document.getElementById('wa-save').onclick = function () {
      var v = document.getElementById('wa-num').value.replace(/[^0-9]/g, '');
      if (v.length < 8) {
        document.getElementById('wa-num').classList.add('shake');
        setTimeout(function () { document.getElementById('wa-num').classList.remove('shake'); }, 400);
        return;
      }
      try { localStorage.setItem('G7WA', v); } catch (e) {}
      m.remove();
      window.open('https://wa.me/' + v + '?text=' + encodeURIComponent(MSG), '_blank');
    };
    document.getElementById('wa-num').onkeydown = function (e) {
      if (e.key === 'Enter') document.getElementById('wa-save').click();
    };
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function waSvg(sz) {
    return '<svg viewBox="0 0 32 32" width="' + sz + '" height="' + sz + '" fill="currentColor" aria-hidden="true">' +
      '<path d="M16.04 4c-6.6 0-11.96 5.36-11.96 11.96 0 2.1.55 4.16 1.6 5.98L4 28l6.2-1.62a11.9 11.9 0 0 0 5.84 1.5h.01c6.6 0 11.95-5.36 11.95-11.96C28 9.36 22.64 4 16.04 4zm0 21.88h-.01c-1.83 0-3.63-.5-5.2-1.43l-.37-.22-3.85 1 1.03-3.75-.24-.39a9.87 9.87 0 0 1-1.51-5.26c0-5.5 4.47-9.97 9.97-9.97 5.5 0 9.96 4.47 9.96 9.97 0 5.5-4.47 9.96-9.96 9.96zm5.46-7.46c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.63-.92-2.23-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.09 3.2 5.07 4.48.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z"/></svg>';
  }

  /* build the floating button once the DOM is ready */
  function build() {
    if (document.getElementById('wa-float')) return;

    var a = document.createElement('button');
    a.id = 'wa-float';
    a.className = 'wa-float';
    a.type = 'button';
    a.setAttribute('aria-label', 'Chat with Mr. Akram on WhatsApp');
    a.title = 'Need help? Chat with Mr. Akram';
    a.innerHTML = waSvg(30) + '<span class="wa-dot">1</span>';
    a.onclick = openChat;
    document.body.appendChild(a);

    /* tiny pencil chip — lets the teacher change the saved number */
    var e = document.createElement('button');
    e.id = 'wa-edit';
    e.className = 'wa-edit';
    e.type = 'button';
    e.title = 'Set / change the WhatsApp number';
    e.setAttribute('aria-label', 'Set WhatsApp number');
    e.innerHTML = '✎';
    e.onclick = function (ev) { ev.stopPropagation(); askNumber(); };
    document.body.appendChild(e);

    /* hide the dot once the number is set */
    function upd() { a.classList.toggle('unset', !currentNumber()); }
    upd();
    setInterval(upd, 4000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else { build(); }
})();
