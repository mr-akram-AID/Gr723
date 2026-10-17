/* ============================================================
   AID Mathematics Academy · Grade 7 — config.js
   Teacher settings + the floating WhatsApp button.

   The WhatsApp number below is FIXED. Every student who taps the
   green button opens Mr. Akram's chat directly. It cannot be
   changed from inside the platform.
   ============================================================ */
window.G7CONFIG = {
  teacher: 'Mr. Akram',
  whatsapp: '201279441379'   /* Mr. Akram's number — fixed, digits only */
};

/* ─── Floating WhatsApp button — always opens Mr. Akram's chat ─── */
(function () {
  'use strict';

  var NUMBER = '201279441379'; /* fixed — students cannot edit it */
  var MSG = 'Hello Mr. Akram! I am using the AID Mathematics Academy (Grade 7) platform and I need some help, please.';

  function openChat() {
    window.open('https://wa.me/' + NUMBER + '?text=' + encodeURIComponent(MSG), '_blank');
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
    a.innerHTML = waSvg(30);
    a.onclick = openChat;
    document.body.appendChild(a);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else { build(); }
})();
