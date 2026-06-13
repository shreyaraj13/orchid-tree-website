/* ============================================================================
   Orchid Tree — Phone OTP (MOCK)
   ----------------------------------------------------------------------------
   A tiny, self-contained phone-verification engine for the self-serve booking
   flow. Right now it is a CLIENT-SIDE MOCK: it makes up a 6-digit code, keeps it
   in memory, and verifies against it. No SMS is sent, nothing leaves the browser,
   and it costs nothing.

   WHY it exists: the team verifies the guest's number before generating a quote
   so a mistyped number can't slip through and casual fake bookings are filtered
   out (you can't proceed without receiving the code).

   ──────────────────────────────────────────────────────────────────────────
   GOING LIVE (real SMS): flip MOCK to false and replace the ONE line inside
   send() marked "MOCK SEND" with a call to your provider, e.g.

       await fetch('/api/send-otp', { method:'POST',
         headers:{'content-type':'application/json'},
         body: JSON.stringify({ phone: e164 }) });

   In production the provider (or your serverless endpoint) generates + stores
   the code and verify() should POST the code to '/api/verify-otp' instead of
   comparing locally. The UI contract (send → verify → {ok, reason}) does not
   change, so book-packages.html needs no edits.
   ========================================================================== */
(function () {
  var MOCK = true;             // ← set false when a real SMS backend is wired
  var CODE_TTL_MS = 5 * 60 * 1000;   // a code is valid for 5 minutes
  var MAX_ATTEMPTS = 5;              // wrong tries before the code is burned

  // in-memory pending challenge (one at a time is all the flow needs)
  var pending = null;          // { phone, code, expiresAt, attempts }

  function randomCode() {
    // 6 digits, 100000–999999
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  // Normalise to a comparable key so "9876543210" and "+91 98765 43210" match.
  function keyOf(phone) {
    return String(phone == null ? "" : phone).replace(/\D/g, "").slice(-10);
  }

  /**
   * Begin verification for a phone number.
   * @returns {{ok:boolean, demoCode?:string, error?:string}}
   *   In MOCK mode `demoCode` is returned so the UI can show a test hint.
   *   A real backend returns only { ok:true } (no code ever reaches the client).
   */
  function send(phone) {
    var k = keyOf(phone);
    if (k.length !== 10) return { ok: false, error: "bad_phone" };
    var code = randomCode();
    pending = { phone: k, code: code, expiresAt: Date.now() + CODE_TTL_MS, attempts: 0 };

    // ---- MOCK SEND ----------------------------------------------------------
    // Replace this block with a real provider call (see header). The mock just
    // hands the code back so the demo is testable without SMS.
    if (MOCK) return { ok: true, demoCode: code };
    // -------------------------------------------------------------------------
    return { ok: true };
  }

  /**
   * Check a code the guest typed.
   * @returns {{ok:boolean, reason?:('not_sent'|'expired'|'too_many'|'mismatch')}}
   */
  function verify(phone, code) {
    var k = keyOf(phone);
    if (!pending || pending.phone !== k) return { ok: false, reason: "not_sent" };
    if (Date.now() > pending.expiresAt) { pending = null; return { ok: false, reason: "expired" }; }
    if (pending.attempts >= MAX_ATTEMPTS) { pending = null; return { ok: false, reason: "too_many" }; }
    if (String(code).trim() !== pending.code) {
      pending.attempts += 1;
      if (pending.attempts >= MAX_ATTEMPTS) { pending = null; return { ok: false, reason: "too_many" }; }
      return { ok: false, reason: "mismatch" };
    }
    pending = null;            // consumed
    return { ok: true };
  }

  /** True while a code is outstanding for this phone (UI can show the verify step). */
  function isPending(phone) {
    return !!(pending && pending.phone === keyOf(phone) && Date.now() <= pending.expiresAt);
  }

  function reset() { pending = null; }

  window.OrchidOtp = {
    MOCK: MOCK,
    send: send,
    verify: verify,
    isPending: isPending,
    reset: reset,
    normalize: keyOf,
  };
})();
