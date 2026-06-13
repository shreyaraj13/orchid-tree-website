/* ============================================================================
   Orchid Tree — Editable page content (storytelling layer)
   ----------------------------------------------------------------------------
   All guest-page copy, policies, image fields and reviews live here so the team
   can refresh them without touching markup. guest.html renders from this object.

   Voice: dry, calm, unhurried, confident. Short sentences. No exclamation marks,
   no em dashes, no Hinglish. Do not invent facts beyond the source of truth.

   Images: every imageUrl is null = falls back to the textured placeholder.
   Drop a real path or URL in to use a photo. Do not pull random images.
   ========================================================================== */
(function () {
  window.OrchidContent = {
    // the rating links here. This is the same target the property's own site uses.
    googleReviewsUrl: "https://www.google.com/search?q=Orchid+Tree+Nature+Stays+reviews",

    // terms and conditions. If termsUrl is set, the link opens it; otherwise the
    // built-in terms modal below is shown (sourced from the property's policy page).
    termsUrl: "", // optional external page; leave blank to use the modal
    terms: {
      sections: [
        { title: "Booking and cancellation", items: [
          "Your booking is confirmed once the full amount is paid on this page.",
          "Full refund on cancellations up to 48 hours before check-in.",
          "No refund for cancellations after that.",
        ] },
        { title: "Dining", items: [
          "Orchid Tree serves curated Nepali and North Indian cuisine.",
          "Outside food deliveries are not permitted.",
          "Glassware is not allowed near the water.",
        ] },
        { title: "Smoking", items: [
          "All rooms are strictly non-smoking.",
          "Smoking is allowed only in the designated outdoor zones.",
        ] },
        { title: "At the property", items: [
          "A government photo ID is required at check-in.",
          "Quiet hours are observed after 10:30 PM.",
          "Unregistered visitors are not permitted.",
          "Pets are welcome except in the Couple Rooms by the Pool. A valid vaccination certificate is required at check-in.",
        ] },
      ],
    },

    // credibility band under the hero — rendered as highlighted pillars, not plain text
    credibility: {
      pillars: [
        { k: "Award-winning architect", v: "A private nature estate" },
        { k: "Calm over crowds", v: "Only eleven rooms" },
      ],
      rating: { score: "4.4", stars: 4, text: "615+ Google reviews" },
    },

    // wellness band — massage is an optional add-on, pre-booked like meals.
    // NOTE: the site has no massage/spa photo, so this uses a calm estate shot.
    wellnessBand: {
      eyebrow: "Add it to your stay",
      title: "A massage, whenever you want one",
      body: "A full-body massage in your room, and a fifteen-minute Kansa plate foot massage. Pre-book it for any evening of your stay.",
      imageUrl: "https://orchidtree.in/uploads/Experience_section_jpg_afb1c77479.webp",
      cta: { label: "Add a massage", whatsappUrl: null },
    },

    // all-inclusive carousel, reframed
    allInclusive: {
      eyebrow: "Included with every stay",
      title: "What your stay holds",
      // images mapped to the property's own experience-section photos.
      // Millet has no matching photo on the site, so it stays on the placeholder.
      // short = revealed on hover. moreUrl = where the "More" link goes
      // (null = PLACEHOLDER, renders a disabled-looking link until you set a page).
      // meals are NOT here — they are pre-booked separately (see foodSection)
      items: [
        { label: "Breakfast, every morning",
          short: "A plated breakfast to start each day, included with your stay.",
          moreUrl: null, // PLACEHOLDER
          imageUrl: "https://orchidtree.in/uploads/Copy_of_Barbeque_03_cf30f0f667.jpg" },
        { label: "Ozone-treated pool",
          short: "A clean, ozone-treated pool.",
          moreUrl: null, // PLACEHOLDER
          imageUrl: "https://orchidtree.in/uploads/Copy_of_Pool_37_958d54313f.jpg" },
        { label: "Steam room and open-sky showers",
          short: "Steam, and showers open to the sky.",
          moreUrl: null, // PLACEHOLDER
          imageUrl: "https://orchidtree.in/uploads/Image8_scaled_jpg_ec00384f49.webp" },
        { label: "Millet snack station",
          short: "Millet snacks, tea, coffee, and water, on the house.",
          moreUrl: null, // PLACEHOLDER
          imageUrl: null }, // no matching photo on site
        { label: "Indoor games and open-air gym",
          short: "Chess, carrom, table tennis, billiards, a gym.",
          moreUrl: null, // PLACEHOLDER
          imageUrl: "https://orchidtree.in/uploads/Copy_of_2_a5beee287f.jpg" },
        { label: "BYOB lounge",
          short: "Bring your own bottle to the outdoor lounge.",
          moreUrl: null, // PLACEHOLDER
          imageUrl: "https://orchidtree.in/uploads/Image_6_1024x1536_bk_923d98c089.jpg" },
      ],
    },

    // things to do — estate-wide, framed as optional (calm over crowds)
    experiences: {
      eyebrow: "If you feel like it",
      title: "Nothing you must do, plenty you can",
      note: "No fixed itinerary. These are simply here, for whenever the mood finds you.",
      // each item has an icon key (see ICONS map in guest.html)
      groups: [
        { label: "On the estate", items: [
          { label: "Table tennis", icon: "paddle" },
          { label: "Carrom", icon: "board" },
          { label: "Board games", icon: "dice" },
          { label: "Trampoline", icon: "trampoline" },
          { label: "Karaoke", icon: "mic" },
          { label: "Music corner", icon: "music" },
          { label: "Movies in the multipurpose hall", icon: "film" },
          { label: "Bonfire", icon: "fire" },
          { label: "Stargazing", icon: "star" },
        ] },
        { label: "Around the estate", items: [
          { label: "Farm visit, about 1 km away", icon: "leaf" },
          { label: "Buggy ride to the farm", icon: "car" },
          { label: "Birdwatching", icon: "binoculars" },
          { label: "Adventure trails and SUV-friendly routes nearby", icon: "trail" },
        ] },
      ],
    },

    // food and table
    foodSection: {
      eyebrow: "At the table",
      title: "Plated, farm to table",
      body: "Nepali and North Indian home cooking, fresh and seasonal. Breakfast is included with your stay; lunch and dinner are pre-booked. Plated, never a buffet. No outside food. Proudly BYOB in the outdoor lounge.",
      creditLine: "Your food credit is a gift toward the table. Spend it on whatever you like.",
      imageUrl: "https://orchidtree.in/uploads/Copy_of_Barbeque_03_cf30f0f667.jpg",
      // meals are ordered/pre-booked, not bundled. CTA will auto-generate a
      // WhatsApp Business message later; for now it links to whatsappUrl (or "#").
      cta: {
        label: "Pre-book your meals",
        note: "Tell us what you would like ahead of time, and it will be ready when you arrive.",
        whatsappUrl: null, // PLACEHOLDER
      },
    },

    // architect and estate band — the section that makes the rate make sense
    architectBand: {
      eyebrow: "The architect of stillness",
      title: "Designed to bend around the forest",
      body: "Orchid Tree was created by Pradeep Kuppa Swamy, the landscape architect behind Infosys Mysore, Biocon, and Britannia, and a winner of the World Architecture Award. Here the buildings give way to the trees, not the other way around. Cottages were raised around living trunks. Solar power, recycled water, and eco-toiletries run throughout. It began as a pandemic-era idea about living more lightly.",
      imageUrl: "https://orchidtree.in/uploads/pradip_aboutus_a82dd2aa16.jpg",
    },

    // where you will be (closing band). Distance is public; exact address is post-booking.
    location: {
      eyebrow: "Where you will be",
      body: "About 45 minutes from Whitefield, Bengaluru, and quiet the moment you turn in. The estate is yours while you are here. We share the exact location once your stay is confirmed, for privacy.",
    },

    // what the rate covers (booking card) — two variants by whether a food credit is set
    rateCovers: {
      label: "What your rate covers",
      withCredit: "Your rate covers the room, breakfast each morning, and the run of the estate: pool, steam room, snacks, games, and fresh linens. Lunch, dinner, and a massage can be pre-booked separately, and your food credit goes toward your meals.",
      withoutCredit: "Your rate covers the room, breakfast each morning, and the run of the estate: pool, steam room, snacks, games, and fresh linens. Lunch, dinner, and a massage can be pre-booked separately.",
    },

    // how booking works (facts sourced from orchidtree.in policy/home pages)
    howItWorks: {
      eyebrow: "How your booking works",
      steps: [
        "Pay the full amount shown here to confirm your booking. Nothing is due on arrival.",
        "Check in from 2 PM, check out by 11 AM.",
        "Carry a government photo ID. Free parking is on site.",
      ],
    },

    // contact details from the property's own site
    contact: {
      whatsapp: "918088251913",     // +91 80882 51913, listed as WhatsApp on the contact page
      phoneDisplay: "+91 80882 51913",
      email: "orchidtree.blr@gmail.com",
    },

    // policies, plain and calm, shown in the booking card
    policies: [
      "Your booking is confirmed once the full amount is paid on this page.",
      "Full refund if cancelled 48 hours or more before check-in. No refund after that.",
      "Plated meals only. No outside food. No glassware near the water.",
      "BYOB in the outdoor lounge.",
      "Non-smoking rooms. Smoking in the designated outdoor zones.",
      "Pets are welcome, except in the Couple Rooms by the Pool.",
    ],

    // all five real reviews held here; three are placed on the page (see below)
    reviews: [
      { id: "aditi",   name: "Aditi Verma",        rating: 5, verified: true, text: "A calm staycation close to the city. Mary was a wonderful host to the kids and to us. A relaxing massage, and homely food made with heart." },
      { id: "ketty",   name: "Ketty Bouder",       rating: 5, verified: true, text: "A wonderful stay. Mary was kind and helpful, and the Indian food had good ingredients and real variety." },
      { id: "srikant", name: "Srikant Srivastava", rating: 5, verified: true, text: "An amazing experience. Mary went above and beyond to make our stay special." },
      { id: "krishna", name: "Krishna Prasad",     rating: 5, verified: true, text: "Very good hospitality and very nice food." },
      { id: "madhu",   name: "Madhu Nadiger",      rating: 4, verified: true, text: "A pleasant stay. The property is well kept, comfortable, and easy to reach. Good food." },
    ],

    // heading for the dedicated reviews band
    reviewsTitle: "4.4 from 615+ guests",

    // which review shows where (by id). Inline placements are single ids;
    // `section` is an array shown together in the "What guests say" band.
    reviewPlacements: {
      rooms: "aditi",       // near the rooms and invoice (deciding moment)
      food: "ketty",        // near the food and table section
      wellness: "srikant",  // near the wellness band and host mention
      section: ["krishna", "madhu"], // the dedicated reviews band
    },

    /** Helper: look up a review by id. */
    getReview: function (id) {
      for (var i = 0; i < this.reviews.length; i++) { if (this.reviews[i].id === id) return this.reviews[i]; }
      return null;
    },
  };
})();
