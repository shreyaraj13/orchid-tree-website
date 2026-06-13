/* ============================================================================
   Orchid Tree — Room Catalog (static reference data + editable room copy)
   ----------------------------------------------------------------------------
   Single source of truth for the rooms. Both admin.html and guest.html read
   from window.OrchidCatalog.

   Copy lives per TYPE (tagline, story, amenities, tier, pet policy, price) and
   each room inherits its type. Edit a type once and every room of that type
   updates. Per-room photos go in `imageUrl` (null = textured placeholder).

   Eleven rooms across four types. Source of truth, do not invent beyond it.
   PRICE: only the Couple Garden Cottage has a published price. The other three
   carry priceFrom:null (// PLACEHOLDER) and render no price line until set.
   ========================================================================== */
(function () {
  // --- the four types, in display order, with their editable copy ------------
  const TYPES = {
    "Couple Room by the Pool": {
      tagline: "Your Sun-Lit Sanctuary",
      highlights: ["Pool view", "Skylight bath"],
      occupancyShort: "2 adults + 1 child",
      tier: "Standard",
      petFriendly: false,
      capacity: 3,
      sleepsLabel: "2 adults + 1 child under 8",
      signature: "Pool view",
      story: "Light comes in from above. A skylight sits over the bath, and the pool is just past the window. This is the one category we keep pet-free, so it stays clear for guests with allergies.",
      description: "Designed for intimate getaways and deep rest, our Couple Rooms keep you closely connected to the calm of the estate. Wake up to refreshing views of the pool and enjoy the luxury of a stunning, sun-drenched skylight bathroom. Fully air conditioned and cosy, this is your space to sleep in and let the day wait. To keep a strictly allergy-free environment for guests who need it, these are our only non-pet rooms.",
      amenities: ["Air conditioned rooms", "Lounge chair and table", "Hot water kettle", "Instant tea and coffee", "Accessible plug points", "Copper water jug", "Eco-friendly sun-lit bathrooms", "Millet-based snacks", "Fresh linen", "Indoor games", "Open air-gym", "Common steam room and shower", "Billiards and pool table", "Swimming pool access"],
      facts: [
        { label: "Sleeps", value: "2 adults + 1 child under 8" },
        { label: "Bed", value: "One king bed" },
        { label: "Setting", value: "Pool view" },
        { label: "Bathroom", value: "Sun-lit skylight bath" },
        { label: "Steam", value: "Common steam room" },
        { label: "Climate", value: "Fully air conditioned" },
        { label: "Pets", value: "Not pet friendly" },
      ],
      priceFrom: null, // PLACEHOLDER — no published price
    },
    "Couple Garden Cottage": {
      tagline: "Our Signature Immersive Escape",
      highlights: ["Open-to-sky bath", "Private steam"],
      occupancyShort: "2 adults + 1 child",
      tier: "Premium",
      petFriendly: true,
      capacity: 3,
      sleepsLabel: "2 adults + 1 child under 8",
      signature: "Open-to-sky bath",
      story: "The cottage was built around a living tree. The bath opens to the sky, and a private patio sits among the leaves. You have your own steam room. The forest is the fourth wall.",
      description: "Step into a space where architecture meets nature. Our signature Couple Cottages are built around majestic live trees, blending indoors and outdoors. Unwind on your private sit-out patio, detox in your own private steam room, and enjoy the luxury of an open-to-sky bath. It is the ultimate romantic reset, and your pet is welcome to join.",
      amenities: ["Air conditioned rooms", "Lounge chair and table", "Hot water kettle", "Instant tea and coffee", "Sit-out patio", "Accessible plug points", "Copper water jug", "Eco-friendly sun-lit bathrooms", "Millet-based snacks", "Indoor games", "Fresh linen", "Open air-gym", "Private steam room and shower", "Billiards and pool table", "Pet friendly", "Swimming pool access"],
      facts: [
        { label: "Sleeps", value: "2 adults + 1 child under 8" },
        { label: "Bed", value: "One king bed" },
        { label: "Setting", value: "Built around a living tree" },
        { label: "Bathroom", value: "Open-to-sky bath" },
        { label: "Steam", value: "Private steam room" },
        { label: "Outdoors", value: "Private sit-out patio" },
        { label: "Climate", value: "Fully air conditioned" },
        { label: "Pets", value: "Pet friendly" },
      ],
      priceFrom: 13000, // the only published price; room and massage
    },
    "Family Room by the Pool": {
      tagline: "Spacious Comfort by the Pool",
      highlights: ["Pool view", "Skylight bath"],
      occupancyShort: "Up to 4 guests",
      tier: "Standard",
      petFriendly: true,
      capacity: 4,
      sleepsLabel: "up to 4 guests",
      signature: "Pool view",
      story: "Room for four, with the pool in view. Pull-out bedding for the children, a skylight over the bath, and the steam room a short walk away.",
      description: "Whether you are travelling with the kids or with close friends, our Family Rooms give everyone the space to relax. A flexible pull-out bedding setup, beautiful pool views, and the natural light of our signature skylight bathrooms. The perfect home base for your group's estate adventures.",
      amenities: ["Air conditioned rooms", "Lounge chair and table", "Hot water kettle", "Instant tea and coffee", "Accessible plug points", "Copper water jug", "Eco-friendly sun-lit bathrooms", "Millet-based snacks", "Indoor games", "Fresh linen", "Open air-gym", "Common steam room and shower", "Billiards and pool table", "Pet friendly", "Swimming pool access"],
      facts: [
        { label: "Sleeps", value: "Up to 4 guests" },
        { label: "Bedding", value: "King bed with pull-out bedding" },
        { label: "Setting", value: "Pool view" },
        { label: "Bathroom", value: "Skylight bath" },
        { label: "Steam", value: "Common steam room" },
        { label: "Climate", value: "Fully air conditioned" },
        { label: "Pets", value: "Pet friendly" },
      ],
      priceFrom: null, // PLACEHOLDER — no published price
    },
    "Family Garden Cottage": {
      tagline: "The Ultimate Group Retreat",
      highlights: ["Open-to-sky bath", "Private steam"],
      occupancyShort: "Up to 6 guests",
      tier: "Premium",
      petFriendly: true,
      capacity: 6,
      sleepsLabel: "up to 6 guests",
      signature: "Open-to-sky bath",
      story: "The largest space on the estate, and the only one of its kind. Built around living trees, with a private patio, a private steam room, and a bath open to the sky. Sleeps six.",
      description: "When you want the whole family together but still crave premium luxury, Chandana is your answer. This signature family cottage offers expansive space to connect, with a private sit-out patio for evening conversations. Treat your group to a private steam room and a breathtaking open-to-sky bath. A private vacation-home experience, tucked into the estate.",
      amenities: ["Air conditioned rooms", "Lounge chair and table", "Hot water kettle", "Instant tea and coffee", "Sit-out patio", "Accessible plug points", "Copper water jug", "Eco-friendly sun-lit bathrooms", "Millet-based snacks", "Indoor games", "Fresh linen", "Open air-gym", "Private steam room and shower", "Billiards and pool table", "Pet friendly", "Swimming pool access"],
      facts: [
        { label: "Sleeps", value: "Up to 6 guests" },
        { label: "Setting", value: "Built around living trees" },
        { label: "Bathroom", value: "Open-to-sky bath" },
        { label: "Steam", value: "Private steam room" },
        { label: "Outdoors", value: "Private sit-out patio" },
        { label: "Living", value: "Spacious living area" },
        { label: "Climate", value: "Fully air conditioned" },
        { label: "Pets", value: "Pet friendly" },
      ],
      priceFrom: null, // PLACEHOLDER — no published price
    },
  };

  const CATEGORIES = Object.keys(TYPES);

  // --- the eleven rooms (id, name, type, optional per-room photo) ------------
  // imageUrls: official photo galleries from orchidtree.in/uploads (the property's
  // own site), first image is the cover. Rooms with 2+ images auto-advance on hover.
  // Hattimara and Ashoka have no photos on the site, so they carry a single
  // type-appropriate stand-in (garden / pool) and do not cycle.
  const U = "https://orchidtree.in/uploads/";
  const ROOM_DEFS = [
    { id: "bael", name: "Bael", type: "Couple Room by the Pool", imageUrls: [
      U+"bael_1_2b4731913c.png", U+"bael_2_34db147abc.png", U+"bael_3_4e0302376b.png", U+"bael_4_e746f77d06.png", U+"bael_5_2cf5bfec43.png", U+"bael_6_6996e2a4d6.png", U+"bael_7_02044cddd4.webp" ] },
    { id: "bilva", name: "Bilva", type: "Couple Room by the Pool", imageUrls: [
      U+"bilva_1_5b0e867d51.png", U+"Bilva_00_9706e2bfa9.jpeg", U+"bilva_2_eb52482173.jpg", U+"bilva_3_2de5696750.png", U+"bilva_4_1_d31c0584cd.png", U+"bilva_5_8c01f73874.png" ] },
    { id: "datura", name: "Datura", type: "Couple Room by the Pool", imageUrls: [
      U+"datura_1_a0ba781d1b.png", U+"datura_3_4c4aa247e4.png", U+"datura_4_e6ff4d6b02.png", U+"datura_5_4150694fbe.png", U+"datura_6_1b8f473263.png" ] },
    { id: "tulsi", name: "Tulsi", type: "Couple Room by the Pool", imageUrls: [
      U+"tulsi_1_9846f07961.png", U+"tulsi_2_6493c282d6.png", U+"tulsi_3_359d2d8e79.png", U+"tulsi_4_e4ec36d832.png", U+"tulsi_5_a3d0b31218.png", U+"tulsi_6_361694af30.png", U+"tulsi_7_ac3ef47191.png" ] },
    { id: "hattimara", name: "Hattimara", type: "Couple Garden Cottage", imageUrls: [
      U+"Image8_scaled_jpg_ec00384f49.webp", U+"Bodhi_Tree_03_1_35a5ef31e4.webp", U+"Experience_section_jpg_afb1c77479.webp" ] }, // estate/cottage stand-ins — no own photos on site
    { id: "bodhi-tree", name: "Bodhi Tree", type: "Couple Garden Cottage", imageUrls: [
      U+"bodhi_tree_5c9ce0f7ce.webp", U+"Bodhi_Tree_03_1_35a5ef31e4.webp", U+"bodhi_tree_3_png_eedb89acdf.webp" ] },
    { id: "ashoka", name: "Ashoka", type: "Family Room by the Pool", imageUrls: [
      U+"Copy_of_Pool_37_958d54313f.jpg", U+"Experience_section_jpg_afb1c77479.webp" ] }, // pool/estate stand-ins — no own photos on site
    { id: "mallige", name: "Mallige", type: "Family Room by the Pool", imageUrls: [
      U+"mallige_1_2da2180d1a.png", U+"mallige_3_1254d42ba6.png", U+"mallige_4_bb8549daf9.png", U+"mallige_6_358e210ba6.png" ] },
    { id: "parijata", name: "Parijata", type: "Family Room by the Pool", imageUrls: [
      U+"parijatha_1_ca96415792.png", U+"parijatha_2_5a97e01f6f.png", U+"parijatha_3_7346625d99.png", U+"parijatha_4_1aeda753b8.png", U+"parijatha_5_1b08d889b7.png", U+"parijatha_6_5abc4d4c23.png", U+"parijatha_7_3562757b52.png" ] },
    { id: "spatika", name: "Spatika", type: "Family Room by the Pool", imageUrls: [
      U+"spatika_1_5f0d445b7b.png", U+"spatika_2_5ba5aac23d.png", U+"spatika_3_0bf521ec9f.png", U+"spatika_4_bba4ebec9c.png", U+"spatika_6_2a126a86b9.png", U+"spatika_7_e568d57b5e.png" ] },
    { id: "chandana", name: "Chandana", type: "Family Garden Cottage", imageUrls: [
      U+"chandana_1_07f1342c80.png", U+"chandana_2_00966a14a0.png", U+"chandana_3_b67610e6cf.png", U+"chandana_4_dc8cceeac9.png", U+"chandana_5_8743acf819.png", U+"chandan8_5d6a0adb82.jpg" ] },
  ];

  // expand each room with its type's fields (flat object for existing consumers)
  const ROOMS = ROOM_DEFS.map(function (r) {
    const t = TYPES[r.type];
    return {
      id: r.id,
      name: r.name,
      category: r.type,        // type name, also used to group in the admin
      tagline: t.tagline,
      tier: t.tier,
      petFriendly: t.petFriendly,
      capacity: t.capacity,
      sleepsLabel: t.sleepsLabel,
      occupancyShort: t.occupancyShort,
      signature: t.signature,
      highlights: (t.highlights || []).slice(),
      story: t.story,
      description: t.description,
      amenities: t.amenities.slice(),
      facts: t.facts.slice(),
      priceFrom: t.priceFrom,
      imageUrls: (r.imageUrls || []).slice(),          // full gallery (cover first)
      imageUrl: (r.imageUrls && r.imageUrls[0]) || null, // cover photo / placeholder
    };
  });

  const byId = {};
  ROOMS.forEach(function (r) { byId[r.id] = r; });

  window.OrchidCatalog = {
    categories: CATEGORIES,
    types: TYPES,
    rooms: ROOMS,
    /** Look up a room record by id (undefined if unknown). */
    get: function (id) { return byId[id]; },
  };
})();
