/* ============================================================================
   Orchid Tree — MENU (single source of truth for all dining surfaces)
   ----------------------------------------------------------------------------
   ONE database powers: the Restaurant page, the Plan-Your-Dining pre-order flow,
   and the staff dashboard. The team edits here (or, in production, via the
   dashboard writing to a backend) and every surface updates.

   Read in the browser as `window.OrchidMenu`.

   PHOTOGRAPHY: dish/category photos are TEMPORARY free-licensed Unsplash
   placeholders (plus the estate's own barbecue photo), to be replaced with real
   Orchid Tree food photography. Prices are placeholders (priceFrom style) and
   should be confirmed by the team.
   ========================================================================== */
(function () {
  var U = "https://images.unsplash.com/photo-";
  var P = "?w=900&q=80&auto=format&fit=crop";
  var IMG = {
    estateBarbecue: "https://orchidtree.in/uploads/Copy_of_Barbeque_03_cf30f0f667.jpg",
    estateFarm: "https://orchidtree.in/uploads/Experience_section_jpg_afb1c77479.webp",
    indian:    U + "1585937421612-70a008356fbe" + P,
    thali:     U + "1567337710282-00832b415979" + P,
    curry:     U + "1565557623262-b51c2513a641" + P,
    western:   U + "1504674900247-0877df9cc836" + P,
    nepali:    U + "1626776876729-bab4369a5a5a" + P,   // momos
    kerala:    U + "1630383249896-424e482df921" + P,   // idli / vada / sambar
    farm:      U + "1512621776951-a57141f2eefd" + P,   // farm salad
    salad:     U + "1540420773420-3366772f4999" + P,
    chef:      U + "1577219491135-ce391730fb2c" + P,   // chef plating
    cooler:    U + "1551024709-8f23befc6f87" + P,       // bright drinks
    dessert:   U + "1551024601-bec78aea704b" + P,
    breakfast: U + "1525351484163-7529414344d8" + P,
    coffee:    U + "1495474472287-4d71bcdd2085" + P
  };

  /* ── menu categories (the visual cards on the Restaurant page) ───────────── */
  var categories = [
    { id: "indian",      name: "Indian",             blurb: "Slow gravies, fresh breads, the food of home.",            image: IMG.thali },
    { id: "western",     name: "Western",            blurb: "Clean plates, grills and greens.",                          image: IMG.western },
    { id: "nepali",      name: "Nepali",             blurb: "Momos and kitchen comfort, the Nepali way.",                image: IMG.nepali },
    { id: "kerala",      name: "Kerala",             blurb: "Coast and coconut, soft and fragrant.",                     image: IMG.kerala },
    { id: "farm",        name: "Farm Specials",      blurb: "Picked this morning, on the plate by night.",               image: IMG.farm },
    { id: "chef",        name: "Chef's Specials",    blurb: "Whatever the kitchen is most proud of today.",              image: IMG.chef },
    { id: "mocktails",   name: "Mocktails",          blurb: "Cold, bright and house-made.",                              image: IMG.cooler },
    { id: "desserts",    name: "Desserts",           blurb: "A sweet, slow finish.",                                     image: IMG.dessert },
    { id: "celebration", name: "Celebration Add-Ons",blurb: "Cakes, set-ups and the little surprises.",                  image: IMG.dessert }
  ];

  /* ── dishes (everyday menu; each tagged to a category) ───────────────────── */
  // diet: 'veg' | 'nonveg' | 'vegan'   ·   available: true/false   ·   price in INR (placeholder)
  var dishes = [
    // Indian
    d("dal-makhani",   "Dal Makhani",            "Black lentils, slow-cooked overnight, finished with cream.", 320, "indian", "veg",   IMG.thali,  ["farm"]),
    d("butter-paneer", "Butter Paneer",          "Cottage cheese in a mild, rich tomato gravy.",               360, "indian", "veg",   IMG.indian, []),
    d("butter-chicken","Butter Chicken",         "The classic, with house naan off the griddle.",              420, "indian", "nonveg",IMG.curry,  ["chef"]),
    d("veg-thali",     "Estate Veg Thali",       "The everyday plate, made with the day's vegetables.",        390, "indian", "veg",   IMG.thali,  ["farm"]),
    // Western
    d("grilled-veg",   "Char-Grilled Vegetables","Estate vegetables over a herb dressing.",                    340, "western","vegan", IMG.salad,  ["farm"]),
    d("herb-cheese",   "Herb Cottage Cheese",    "Grilled paneer, garden herbs, lemon.",                       330, "western","veg",   IMG.western, []),
    d("grilled-chic",  "Grilled Country Chicken","Free-range chicken, charred and simple.",                    460, "western","nonveg",IMG.western, ["chef"]),
    // Nepali
    d("veg-momo",      "Vegetable Momos",        "Steamed dumplings, tomato achar on the side.",               280, "nepali", "veg",   IMG.nepali, []),
    d("chicken-momo",  "Chicken Momos",          "Steamed the Nepali way, over coals if you like.",            320, "nepali", "nonveg",IMG.nepali, ["chef"]),
    d("dal-bhat",      "Dal Bhat with Tarkari",  "Rice, lentils and the day's seasonal vegetable.",            360, "nepali", "veg",   IMG.thali,  ["farm"]),
    // Kerala
    d("idli-sambar",   "Idli & Sambar",          "Steamed rice cakes, lentil broth, three chutneys.",          240, "kerala", "vegan", IMG.kerala, []),
    d("appam-stew",    "Appam & Vegetable Stew", "Lacy rice hoppers, coconut stew.",                           300, "kerala", "vegan", IMG.kerala, []),
    d("fish-moilee",   "Fish Moilee",            "Catch of the day in a gentle coconut curry.",                480, "kerala", "nonveg",IMG.curry,  ["chef"]),
    // Farm specials
    d("farm-salad",    "Farm Salad",             "Whatever was picked this morning, kept simple.",             260, "farm",   "vegan", IMG.farm,   ["farm"]),
    d("saag-pakoda",   "Saag Pakoda",            "Garden greens, fried to order, served hot.",                 220, "farm",   "veg",   IMG.farm,   ["farm"]),
    // Desserts
    d("kheer",         "Estate Kheer",           "Slow-cooked rice pudding.",                                  180, "desserts","veg",  IMG.dessert,[]),
    d("seasonal-dess", "Seasonal Dessert",       "Made with whatever fruit the season is giving.",             200, "desserts","veg",  IMG.dessert,["chef"]),
    d("ice-cream",     "Farm Ice Cream",         "Churned in small batches.",                                  160, "desserts","veg",  IMG.dessert,[])
  ];

  function d(id, name, desc, price, category, diet, image, badges) {
    return { id: id, name: name, desc: desc, price: price, category: category, diet: diet, image: image, badges: badges || [], available: true };
  }

  /* ── TODAY'S SPECIALS (dynamic; edited daily by the team) ────────────────── */
  var todaysSpecials = [
    feat("Farm Harvest of the Day", "The best of this morning's pick, cooked simply.",       IMG.farm,   "veg"),
    feat("Chef's Recommendation",   "What the kitchen is most proud of today.",              IMG.chef,   "nonveg"),
    feat("Catch of the Day",        "Fresh fish in a Kerala-style coconut curry.",           IMG.curry,  "nonveg"),
    feat("Banur Lamb Special",      "Slow-cooked lamb on the bone, until it gives.",          IMG.curry,  "nonveg"),
    feat("Country Chicken Special", "Free-range chicken, the way it is made at home.",        IMG.indian, "nonveg"),
    feat("Seasonal Dessert",        "A sweet finish from the season's fruit.",                IMG.dessert,"veg")
  ];

  /* ── SEASONAL SPECIALS (dynamic themes) ──────────────────────────────────── */
  var seasonal = [
    theme("Mango Season",     "When the orchard turns, mango finds its way into everything.", IMG.dessert),
    theme("Monsoon Specials", "Hot pakodas, ginger chai, food for grey skies.",               IMG.farm),
    theme("Winter Menu",      "Slower gravies, warmer spices, longer dinners.",                IMG.curry),
    theme("Festival Specials","Sweets and feasts for the days that ask for them.",             IMG.thali),
    theme("Harvest Specials", "A table built around the season's harvest.",                    IMG.farm)
  ];

  /* ── ALWAYS AVAILABLE (for guests who do not pre-order) ──────────────────── */
  var alwaysAvailable = [
    "Tea & Coffee", "Fruit Bowl", "Farm Salad", "Egg Dishes", "French Fries",
    "Saag Pakoda", "Herb Cottage Cheese", "Desserts", "Ice Cream", "Basic Snacks"
  ];

  /* ── SIGNATURE BEVERAGES (a dedicated category) ──────────────────────────── */
  var signatureBeverages = [
    bev("Jamun Cooler",         "Black plum, cooled and lightly spiced."),
    bev("Raw Mango Refresher",  "Sharp, green and sweet at once."),
    bev("Tamarind Spritzer",    "Tamarind, soda and a little jaggery."),
    bev("Pomegranate Cooler",   "Pressed fresh, deep and tart."),
    bev("Kombucha",             "House-fermented, lightly fizzy."),
    bev("Seasonal Specials",    "Whatever the season is pouring.")
  ];

  /* ── CELEBRATION ADD-ONS ─────────────────────────────────────────────────── */
  var celebrationAddOns = [
    "Birthday Cake", "Anniversary Cake", "Celebration Dessert",
    "Private Dining Setup", "Custom Message", "Other Requests"
  ];

  /* ── dining preference options (the interests screen) ────────────────────── */
  var preferences = [
    "Indian Cuisine", "Western Cuisine", "Nepali Cuisine", "Kerala Cuisine",
    "Farm Specials", "Chef's Recommendations", "Vegetarian", "Non-Vegetarian", "Seafood", "Vegan"
  ];

  function feat(name, desc, image, diet) { return { name: name, desc: desc, image: image, diet: diet, available: true }; }
  function theme(name, desc, image) { return { name: name, desc: desc, image: image }; }
  function bev(name, desc) { return { name: name, desc: desc, diet: "vegan", available: true }; }

  var byId = {};
  dishes.forEach(function (x) { byId[x.id] = x; });

  window.OrchidMenu = {
    images: IMG,
    categories: categories,
    dishes: dishes,
    todaysSpecials: todaysSpecials,
    seasonal: seasonal,
    alwaysAvailable: alwaysAvailable,
    signatureBeverages: signatureBeverages,
    celebrationAddOns: celebrationAddOns,
    preferences: preferences,
    get: function (id) { return byId[id]; },
    forCategory: function (catId) { return dishes.filter(function (x) { return x.category === catId; }); }
  };
})();
