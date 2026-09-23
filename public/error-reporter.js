/*
 * Rapporteur d'erreurs client, charge AVANT le code applicatif.
 *
 * Volontairement ecrit en ES5 : ce fichier doit s'executer sur les navigateurs
 * les plus anciens, precisement ceux qui echouent a lire les bundles modernes.
 * Une erreur de syntaxe dans un chunk (par exemple une syntaxe ES2021 sur un
 * vieil iOS) est remontee ici par window.onerror avec l'URL du fichier fautif,
 * ce qu'aucun error boundary React ne peut voir puisque React n'a pas demarre.
 */
(function () {
  if (typeof window === 'undefined') return;
  var ENDPOINT = '/api/client-error';
  var MAX_REPORTS = 5;
  var sent = 0;
  var seen = {};

  function serialize(payload) {
    try { return JSON.stringify(payload); } catch (e) { return '{"message":"unserializable"}'; }
  }

  function send(payload) {
    if (sent >= MAX_REPORTS) return;
    var key = (payload.message || '') + '|' + (payload.source || '');
    if (seen[key]) return;
    seen[key] = true;
    sent++;
    var body = serialize(payload);
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }));
        return;
      }
    } catch (e) { /* on retombe sur XHR */ }
    try {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', ENDPOINT, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(body);
    } catch (e) { /* rien a faire : ne jamais casser la page pour un rapport */ }
  }

  function base() {
    return {
      url: String(window.location && window.location.href),
      ua: String(navigator.userAgent),
      at: new Date().toISOString()
    };
  }

  window.addEventListener('error', function (event) {
    var err = event && event.error;
    var p = base();
    p.kind = 'error';
    p.message = String((err && err.message) || (event && event.message) || 'unknown');
    p.source = String((event && event.filename) || '');
    p.line = event && event.lineno;
    p.col = event && event.colno;
    p.stack = err && err.stack ? String(err.stack).slice(0, 2000) : undefined;
    send(p);
  }, true);

  window.addEventListener('unhandledrejection', function (event) {
    var reason = event && event.reason;
    var p = base();
    p.kind = 'unhandledrejection';
    p.message = String((reason && reason.message) || reason || 'unknown');
    p.stack = reason && reason.stack ? String(reason.stack).slice(0, 2000) : undefined;
    send(p);
  });

  window.__eduproReportError = function (error, extra) {
    var p = base();
    p.kind = 'boundary';
    p.message = String((error && error.message) || error || 'unknown');
    p.stack = error && error.stack ? String(error.stack).slice(0, 2000) : undefined;
    p.extra = extra;
    send(p);
  };
})();
