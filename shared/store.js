/* ============================================================================
   Orchid Tree — Booking Store + derived helpers (mock, no backend)
   ----------------------------------------------------------------------------
   Bookings live in localStorage under ORCHID_KEY, shared across admin.html and
   guest.html on the same origin. This module is the ONE place that:
     - creates / reads / updates / deletes bookings
     - mints unique link tokens
     - owns the status lifecycle
     - computes every DERIVED value the guest page renders (nights, totals,
       welcome line, group line, date label, ...)
   Both pages call these helpers, so admin-composed == guest-rendered by
   construction — no parallel formatting logic to drift.
   Depends on: shared/catalog.js (window.OrchidCatalog).
   ========================================================================== */
(function () {
  const ORCHID_KEY = "orchid_bookings";

  // Status lifecycle: draft -> sent -> viewed -> confirmed | declined.
  // `expired` is DERIVED (deadline passed, still unresolved) — never stored.
  const STATUS = {
    DRAFT: "draft",
    SENT: "sent",
    VIEWED: "viewed",
    CONFIRMED: "confirmed",
    DECLINED: "declined",
    EXPIRED: "expired",
  };
  // statuses considered "still waiting on the guest" (can expire)
  const OPEN_STATUSES = [STATUS.DRAFT, STATUS.SENT, STATUS.VIEWED];

  // ---- persistence ----------------------------------------------------------
  function readAll() {
    try {
      const raw = localStorage.getItem(ORCHID_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Orchid: could not read bookings", e);
      return [];
    }
  }
  function writeAll(list) {
    localStorage.setItem(ORCHID_KEY, JSON.stringify(list));
  }

  function nowISO() { return new Date().toISOString(); }

  function makeToken() {
    // short, URL-safe, collision-resistant enough for a mock
    const uuid = (crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.floor(Math.random() * 1e6);
    return uuid.replace(/-/g, "").slice(0, 10);
  }

  // ---- CRUD -----------------------------------------------------------------
  /** Create + persist a new booking. `draft` unless overridden. Returns it. */
  function create(data) {
    const list = readAll();
    const booking = {
      id: "bk_" + makeToken(),
      token: makeToken(),
      status: data.status || STATUS.DRAFT,
      guest: {
        name: data.guest && data.guest.name || "",
        whatsapp: data.guest && (data.guest.whatsapp || data.guest.phone) || "",
        email: data.guest && data.guest.email || "",
        phone: data.guest && data.guest.phone || "",
        phoneVerified: !!(data.guest && data.guest.phoneVerified),
      },
      stay: { checkIn: data.stay && data.stay.checkIn || "", checkOut: data.stay && data.stay.checkOut || "" },
      roomIds: (data.roomIds || []).slice(),
      guestMix: {
        adults: num(data.guestMix && data.guestMix.adults, 0),
        children: num(data.guestMix && data.guestMix.children, 0),
        pets: num(data.guestMix && data.guestMix.pets, 0),
      },
      pricing: {
        roomSubtotal: num(data.pricing && data.pricing.roomSubtotal, 0),    // what the guest is charged (pre-tax)
        listPrice: num(data.pricing && data.pricing.listPrice, 0),          // optional "usual" price; if higher, shows a discount
        taxRate: data.pricing && typeof data.pricing.taxRate === "number" ? data.pricing.taxRate : 0.18,
      },
      foodCredit: num(data.foodCredit, 0),
      // deadline is RELATIVE: "confirm within N hours of the link being sent".
      // The absolute moment is computed from the send time (see deadlineAt).
      deadlineHours: num(data.deadlineHours, 0),
      timestamps: { createdAt: nowISO(), sentAt: null, viewedAt: null, respondedAt: null },
    };
    list.push(booking);
    writeAll(list);
    return booking;
  }

  /** Merge `patch` into an existing booking by id. Returns updated booking. */
  function update(id, patch) {
    const list = readAll();
    const i = list.findIndex(function (b) { return b.id === id; });
    if (i === -1) return null;
    list[i] = deepMerge(list[i], patch);
    writeAll(list);
    return list[i];
  }

  function remove(id) {
    writeAll(readAll().filter(function (b) { return b.id !== id; }));
  }

  function getById(id) { return readAll().find(function (b) { return b.id === id; }) || null; }
  function getByToken(token) { return readAll().find(function (b) { return b.token === token; }) || null; }
  function list() { return readAll(); }

  // ---- status transitions ---------------------------------------------------
  function markSent(id) { return update(id, { status: STATUS.SENT, timestamps: { sentAt: nowISO() } }); }
  function markViewed(id) {
    const b = getById(id);
    if (!b) return null;
    // only advance to viewed from draft/sent — don't clobber confirmed/declined
    if (b.status === STATUS.DRAFT || b.status === STATUS.SENT) {
      return update(id, { status: STATUS.VIEWED, timestamps: { viewedAt: b.timestamps.viewedAt || nowISO() } });
    }
    return b;
  }
  function markConfirmed(id) { return update(id, { status: STATUS.CONFIRMED, timestamps: { respondedAt: nowISO() } }); }
  function markDeclined(id) { return update(id, { status: STATUS.DECLINED, timestamps: { respondedAt: nowISO() } }); }

  /**
   * Effective status for display: returns "expired" when an open booking's
   * deadline has passed, otherwise the stored status. Does not mutate storage.
   */
  function effectiveStatus(booking) {
    if (!booking) return null;
    if (OPEN_STATUSES.indexOf(booking.status) !== -1 && isPastDeadline(booking)) {
      return STATUS.EXPIRED;
    }
    return booking.status;
  }
  function isPastDeadline(booking) {
    const d = deadlineAt(booking);
    if (!d) return false;
    return d.getTime() < Date.now();
  }
  /**
   * Absolute deadline = (sentAt || createdAt) + deadlineHours. Returns a Date,
   * or null if no hours set / no base time yet. The clock starts when the link
   * is published (sent), so a draft with no sentAt falls back to createdAt.
   */
  function deadlineAt(booking) {
    const hrs = num(booking.deadlineHours, 0);
    if (!hrs) return null;
    const base = booking.timestamps && (booking.timestamps.sentAt || booking.timestamps.createdAt);
    if (!base) return null;
    return new Date(new Date(base).getTime() + hrs * 3600000);
  }

  // ---- derived values (the guest page reads these) --------------------------
  function nights(booking) {
    const a = booking.stay && booking.stay.checkIn, b = booking.stay && booking.stay.checkOut;
    if (!a || !b) return 0;
    const ms = new Date(b).getTime() - new Date(a).getTime();
    return Math.max(0, Math.round(ms / 86400000));
  }
  function guestCount(booking) {
    return num(booking.guestMix.adults, 0) + num(booking.guestMix.children, 0);
  }
  function rooms(booking) {
    return (booking.roomIds || []).map(function (id) { return window.OrchidCatalog.get(id); }).filter(Boolean);
  }
  function capacityTotal(booking) {
    return rooms(booking).reduce(function (sum, r) { return sum + (r.capacity || 0); }, 0);
  }
  function tax(booking) {
    return Math.round(num(booking.pricing.roomSubtotal, 0) * num(booking.pricing.taxRate, 0.18));
  }
  // discount: shown only when an optional listPrice is set above the charged subtotal
  function listPrice(booking) { return num(booking.pricing.listPrice, 0); }
  function discount(booking) {
    var lp = listPrice(booking), st = num(booking.pricing.roomSubtotal, 0);
    return lp > st ? lp - st : 0;
  }
  function discountPct(booking) {
    var lp = listPrice(booking), d = discount(booking);
    return lp > 0 && d > 0 ? Math.round(d / lp * 100) : 0;
  }
  function grandTotal(booking) {
    return num(booking.pricing.roomSubtotal, 0) + tax(booking);
  }

  // "Your stay for two" / "...for fifteen" / "...for 23"
  const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
    "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
  function numberWord(n) { return n >= 0 && n <= 20 ? WORDS[n] : String(n); }

  function welcomeLine(booking) {
    return "Your stay for " + numberWord(guestCount(booking));
  }
  function groupLine(booking) {
    const rc = (booking.roomIds || []).length;
    if (rc <= 1) return "Your private room for the stay";
    return "Sleeps " + capacityTotal(booking) + " across " + rc + " rooms, arranged for your group of " + guestCount(booking);
  }

  // "12 to 14 December, two nights"  (handles cross-month ranges too)
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  function dateRangeLabel(booking) {
    const ci = booking.stay && booking.stay.checkIn, co = booking.stay && booking.stay.checkOut;
    if (!ci || !co) return "";
    const a = new Date(ci), b = new Date(co);
    const n = nights(booking);
    const nightWord = numberWord(n) + (n === 1 ? " night" : " nights");
    if (a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()) {
      return a.getDate() + " to " + b.getDate() + " " + MONTHS[b.getMonth()] + ", " + nightWord;
    }
    return a.getDate() + " " + MONTHS[a.getMonth()] + " to " + b.getDate() + " " + MONTHS[b.getMonth()] + ", " + nightWord;
  }

  // Guest-facing absolute deadline, e.g. "Confirm by 14 Nov, 6 PM"
  const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function deadlineLabel(booking) {
    const d = deadlineAt(booking);
    if (!d) return "";
    let h = d.getHours();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12; if (h === 0) h = 12;
    const mins = d.getMinutes();
    const time = mins === 0 ? h + " " + ampm : h + ":" + String(mins).padStart(2, "0") + " " + ampm;
    return "Confirm by " + d.getDate() + " " + MONTHS_SHORT[d.getMonth()] + ", " + time;
  }

  // Relative phrasing for the admin preview (no send time yet):
  // "Confirm within 48 hours of receiving the link" / "...within 1 day..."
  function relativeDeadlineLabel(hours) {
    const h = num(hours, 0);
    if (!h) return "";
    if (h % 24 === 0) { const days = h / 24; return "Confirm within " + days + (days === 1 ? " day" : " days") + " of receiving the link"; }
    return "Confirm within " + h + (h === 1 ? " hour" : " hours") + " of receiving the link";
  }

  function rupees(n) { return "Rs " + num(n, 0).toLocaleString("en-IN"); }

  // ---- small utils ----------------------------------------------------------
  function num(v, fallback) { const n = Number(v); return isNaN(n) ? fallback : n; }
  function deepMerge(base, patch) {
    const out = Array.isArray(base) ? base.slice() : Object.assign({}, base);
    Object.keys(patch).forEach(function (k) {
      const pv = patch[k];
      if (pv && typeof pv === "object" && !Array.isArray(pv) && typeof out[k] === "object" && out[k] !== null) {
        out[k] = deepMerge(out[k], pv);
      } else {
        out[k] = pv;
      }
    });
    return out;
  }

  window.OrchidStore = {
    STATUS: STATUS,
    // CRUD
    create: create, update: update, remove: remove,
    getById: getById, getByToken: getByToken, list: list,
    // status
    markSent: markSent, markViewed: markViewed, markConfirmed: markConfirmed, markDeclined: markDeclined,
    effectiveStatus: effectiveStatus, isPastDeadline: isPastDeadline, deadlineAt: deadlineAt,
    // derived
    nights: nights, guestCount: guestCount, rooms: rooms, capacityTotal: capacityTotal,
    tax: tax, grandTotal: grandTotal,
    listPrice: listPrice, discount: discount, discountPct: discountPct,
    welcomeLine: welcomeLine, groupLine: groupLine,
    dateRangeLabel: dateRangeLabel, deadlineLabel: deadlineLabel, relativeDeadlineLabel: relativeDeadlineLabel,
    numberWord: numberWord, rupees: rupees,
  };
})();
