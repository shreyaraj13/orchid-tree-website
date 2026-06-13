/* ============================================================================
   Orchid Tree — Package Engine (self-serve booking flow)
   ----------------------------------------------------------------------------
   Pure, side-effect-free logic that composes ready-made room bundles for a
   guest's group. Read by book-packages.html. No DOM, no storage, no network —
   so a real backend can drop in later by replacing this single file.

   It reads room facts (capacity, pet policy, inventory) from window.OrchidCatalog
   and layers two things the catalog does not carry: a per-night PRICE and an
   ADULT cap per type. Both live in clearly-labelled constants below.

   Exposes window.OrchidPackages:
     ROOM_PRICES                     editable per-type nightly price
     TYPE_META                       derived {capacity, adultCap, petFriendly, count, roomIds, price}
     fitsSingleRoom(group)           true when one room holds the whole group
     generateSingleRooms(group)      room-type options that fit in one room (the fork)
     generatePackages(group)         up to 3 distinct multi-room bundles
     allocate(group, roomList)       who-sleeps-where breakdown
     priceOf(roomList, nights)       Σ per-night price × nights (pre-tax)

   group = { adults:Number, children:Number, pets:Number, nights:Number }
   ========================================================================== */
(function () {
  var Catalog = window.OrchidCatalog;

  // --- EDITABLE: per-night price by room type (INR, pre-tax) ----------------
  // Only the Couple Garden Cottage has a real published price (13000). The other
  // three are placeholders — correct them here and the whole flow updates.
  var ROOM_PRICES = {
    "Couple Room by the Pool": 10000,
    "Family Room by the Pool": 13000,
    "Couple Garden Cottage": 13000, // the one real published price
    "Family Garden Cottage": 22000,
  };

  // --- EDITABLE: max adults per room type -----------------------------------
  // Couple-type rooms sleep "2 adults + 1 child" → 2 adults max. Family rooms
  // hold any mix up to capacity. Children (8 and under) fill remaining capacity.
  var ADULT_CAP = {
    "Couple Room by the Pool": 2,
    "Couple Garden Cottage": 2,
    "Family Room by the Pool": 4,
    "Family Garden Cottage": 6,
  };

  // --- TYPE_META: capacity / pet policy / inventory / room ids from catalog --
  // Built once from the catalog so inventory and capacity stay a single source
  // of truth. roomIds keep catalog order; we hand them out first-come per type.
  var TYPE_META = {};
  (function buildMeta() {
    var rooms = (Catalog && Catalog.rooms) || [];
    rooms.forEach(function (r) {
      var t = r.category;
      if (!TYPE_META[t]) {
        TYPE_META[t] = {
          type: t,
          capacity: r.capacity,
          adultCap: ADULT_CAP[t] != null ? ADULT_CAP[t] : r.capacity,
          petFriendly: !!r.petFriendly,
          price: ROOM_PRICES[t] != null ? ROOM_PRICES[t] : 0,
          count: 0,
          roomIds: [],
          tagline: r.tagline,
          occupancyShort: r.occupancyShort,
        };
      }
      TYPE_META[t].count += 1;
      TYPE_META[t].roomIds.push(r.id);
    });
  })();

  // Type orderings (capacity desc → asc) used to express the three strategies.
  var ORDER_TOGETHER = ["Family Garden Cottage", "Family Room by the Pool", "Couple Room by the Pool", "Couple Garden Cottage"];
  var ORDER_BALANCED = ["Family Room by the Pool", "Couple Garden Cottage", "Couple Room by the Pool", "Family Garden Cottage"];
  var ORDER_SPREAD = ["Couple Room by the Pool", "Couple Garden Cottage", "Family Room by the Pool", "Family Garden Cottage"];

  var STRATEGIES = [
    { key: "together", name: "Together", feel: "One big base, everyone under the same roof", order: ORDER_TOGETHER },
    { key: "couples-kids", name: "Couples & Kids", feel: "Families and couples, each with their own room", order: ORDER_BALANCED },
    { key: "spread-out", name: "Spread Out", feel: "Maximum privacy, a room for every couple", order: ORDER_SPREAD },
  ];

  function num(v, d) { var n = Number(v); return isFinite(n) ? n : (d || 0); }

  function normGroup(g) {
    g = g || {};
    return {
      adults: Math.max(0, Math.round(num(g.adults, 0))),
      children: Math.max(0, Math.round(num(g.children, 0))),
      pets: Math.max(0, Math.round(num(g.pets, 0))),
      nights: Math.max(1, Math.round(num(g.nights, 1))),
    };
  }

  function groupTotal(g) { return g.adults + g.children; }

  // A type is usable by this group if it is pet-safe (when pets present) and has
  // at least one room in inventory.
  function typeAllowed(meta, g) {
    if (!meta || meta.count <= 0) return false;
    if (g.pets > 0 && !meta.petFriendly) return false;
    return true;
  }

  // ---- single room: does any one room hold the whole group? ----------------
  function fitsSingleRoom(group) {
    var g = normGroup(group);
    return Object.keys(TYPE_META).some(function (t) {
      var m = TYPE_META[t];
      return typeAllowed(m, g) && m.capacity >= groupTotal(g) && m.adultCap >= g.adults;
    });
  }

  // ---- the fork: room-TYPE options that each fit the group in one room ------
  function generateSingleRooms(group) {
    var g = normGroup(group);
    var opts = Object.keys(TYPE_META)
      .map(function (t) { return TYPE_META[t]; })
      .filter(function (m) {
        return typeAllowed(m, g) && m.capacity >= groupTotal(g) && m.adultCap >= g.adults;
      })
      // snuggest fit first, then cheapest
      .sort(function (a, b) { return (a.capacity - b.capacity) || (a.price - b.price); });

    return opts.map(function (m) {
      var id = m.roomIds[0];
      var room = Catalog.get(id);
      return {
        type: m.type,
        roomId: id,
        roomIds: [id],
        name: m.type,             // single-room cards lead with the room-type name
        feel: m.tagline || "",
        image: (room && room.imageUrls && room.imageUrls[0]) || null,
        petFriendly: m.petFriendly,
        capacity: m.capacity,
        capacityLabel: room ? room.occupancyShort : (m.occupancyShort || ("Sleeps " + m.capacity)),
        groupSize: groupTotal(g),
        nights: g.nights,
        subtotal: m.price * g.nights,
        perNight: m.price,
        breakdown: allocate(g, [{ type: m.type, id: id, capacity: m.capacity }]),
      };
    });
  }

  // ---- greedy packer: seat the group using a given type priority order -----
  // Returns an array of assigned rooms [{type,id,adults,children,capacity}] or
  // null if this order cannot seat everyone within inventory + pet rules.
  function packByOrder(group, order) {
    var g = normGroup(group);
    var remA = g.adults, remC = g.children;
    var used = {};
    var rooms = [];

    for (var i = 0; i < order.length && (remA > 0 || remC > 0); i++) {
      var meta = TYPE_META[order[i]];
      if (!typeAllowed(meta, g)) continue;
      var avail = meta.count;
      while ((remA > 0 || remC > 0) && avail > 0) {
        // Every room must be anchored by at least one adult — children (8 and
        // under) can never sleep in a room without a grown-up. If only children
        // remain, we cannot open another room, so this layout can't seat them.
        if (remA === 0) return null;
        var a = 1; remA -= 1;                                       // anchor adult
        var c = Math.min(remC, meta.capacity - a); remC -= c;        // fill with children
        var extraA = Math.min(remA, meta.adultCap - a, meta.capacity - a - c);
        a += extraA; remA -= extraA;                                 // top up adults
        var idx = used[meta.type] || 0;
        rooms.push({ type: meta.type, id: meta.roomIds[idx], adults: a, children: c, capacity: meta.capacity });
        used[meta.type] = idx + 1; avail--;
      }
    }
    if (remA > 0 || remC > 0) return null; // could not seat everyone
    return rooms;
  }

  // Build the per-room display breakdown straight from a packed room list, so
  // the breakdown shows the SAME assignment the packer chose (with adults in
  // every child-bearing room). roomList items carry adults/children already.
  function describeRooms(rooms) {
    return rooms.map(function (r) {
      var room = Catalog.get(r.id);
      var bits = [];
      if (r.adults)   bits.push(r.adults + (r.adults === 1 ? " adult" : " adults"));
      if (r.children) bits.push(r.children + (r.children === 1 ? " child" : " children"));
      if (!bits.length) bits.push("open");
      return {
        id: r.id,
        name: room ? room.name : r.id,
        type: r.type,
        image: (room && room.imageUrls && room.imageUrls[0]) || null,
        adults: r.adults,
        children: r.children,
        capacity: r.capacity,
        label: bits.join(" + "),
      };
    });
  }

  // Signature of a room multiset, for de-duplicating strategies that land on the
  // same set of rooms (e.g. a group whose only valid layout is one Chandana).
  function signature(rooms) {
    var counts = {};
    rooms.forEach(function (r) { counts[r.type] = (counts[r.type] || 0) + 1; });
    return Object.keys(counts).sort().map(function (t) { return t + ":" + counts[t]; }).join("|");
  }

  // ---- allocate: distribute the group across a chosen room list ------------
  // roomList = [{type, id, capacity}]. Returns per-room {id,name,type,adults,
  // children,capacity,label}. Adults seated first (capped per type), then kids.
  function allocate(group, roomList) {
    var g = normGroup(group);
    var remA = g.adults, remC = g.children;
    return roomList.map(function (r) {
      var meta = TYPE_META[r.type] || { adultCap: r.capacity, capacity: r.capacity };
      var aIn = Math.min(meta.adultCap, remA);
      var cIn = Math.min(remC, (r.capacity || meta.capacity) - aIn);
      remA -= aIn; remC -= cIn;
      var room = Catalog.get(r.id);
      var bits = [];
      if (aIn) bits.push(aIn + (aIn === 1 ? " adult" : " adults"));
      if (cIn) bits.push(cIn + (cIn === 1 ? " child" : " children"));
      if (!bits.length) bits.push("open");
      return {
        id: r.id,
        name: room ? room.name : r.id,
        type: r.type,
        image: (room && room.imageUrls && room.imageUrls[0]) || null,
        adults: aIn,
        children: cIn,
        capacity: r.capacity || meta.capacity,
        label: bits.join(" + "),
      };
    });
  }

  function priceOf(roomList, nights) {
    var n = Math.max(1, num(nights, 1));
    return roomList.reduce(function (sum, r) {
      return sum + (ROOM_PRICES[r.type] != null ? ROOM_PRICES[r.type] : 0);
    }, 0) * n;
  }

  // ---- generatePackages: up to three distinct multi-room bundles -----------
  function generatePackages(group) {
    var g = normGroup(group);
    var seen = {};
    var out = [];

    STRATEGIES.forEach(function (strat) {
      var rooms = packByOrder(g, strat.order);
      if (!rooms || rooms.length <= 1) return;     // packages are for 2+ rooms
      var sig = signature(rooms);
      if (seen[sig]) return;                        // drop duplicate layouts
      seen[sig] = true;

      var roomList = rooms.map(function (r) { return { type: r.type, id: r.id, capacity: r.capacity }; });
      var breakdown = describeRooms(rooms);   // use the packer's own assignment (adults anchor every room)
      var totalCapacity = rooms.reduce(function (s, r) { return s + r.capacity; }, 0);
      var subtotal = priceOf(roomList, g.nights);
      var cover = breakdown[0] && breakdown[0].image;

      out.push({
        key: strat.key,
        name: strat.name,
        feel: strat.feel,
        rooms: breakdown,                 // enriched per-room {name,type,image,label,...}
        roomIds: roomList.map(function (r) { return r.id; }),
        roomCount: rooms.length,
        totalCapacity: totalCapacity,
        groupSize: groupTotal(g),
        capacityLine: "Sleeps " + totalCapacity + ", fits your group of " + groupTotal(g),
        petFriendly: g.pets > 0,
        petNote: g.pets > 0
          ? "Every room in this package welcomes your " + (g.pets === 1 ? "pet" : "pets") + "."
          : "Pets can be added — just ask us.",
        nights: g.nights,
        subtotal: subtotal,               // pre-tax; guest.html adds 18%
        perNightTotal: subtotal / g.nights,
        cover: cover,
      });
    });

    // Order shown to the guest: fewest rooms first (most communal) → most rooms.
    out.sort(function (a, b) { return a.roomCount - b.roomCount; });
    return out;
  }

  window.OrchidPackages = {
    ROOM_PRICES: ROOM_PRICES,
    TYPE_META: TYPE_META,
    fitsSingleRoom: fitsSingleRoom,
    generateSingleRooms: generateSingleRooms,
    generatePackages: generatePackages,
    allocate: allocate,
    priceOf: priceOf,
    groupTotal: function (g) { return groupTotal(normGroup(g)); },
  };
})();
