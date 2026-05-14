// Menu data shared between routes
// `image` URLs are stable Unsplash photo IDs
// `options` are customization groups: { name, choices, multi, default }
const IMG = (id) => `https://images.unsplash.com/photo-${id}?w=800&q=80&auto=format&fit=crop`;

const SPICE = {
  name: "Spice Level",
  choices: ["Mild", "Medium", "Hot", "Extra Hot"],
  default: "Medium",
  multi: false,
};
const DONENESS = {
  name: "Doneness",
  choices: ["Rare", "Medium-Rare", "Medium", "Medium-Well", "Well Done"],
  default: "Medium",
  multi: false,
};
const SIZE = {
  name: "Size",
  choices: ["Regular", "Large"],
  default: "Regular",
  multi: false,
};
const ICE = {
  name: "Ice",
  choices: ["Light", "Regular", "No ice"],
  default: "Regular",
  multi: false,
};
const SWEETNESS = {
  name: "Sweetness",
  choices: ["Unsweetened", "Light", "Regular", "Extra"],
  default: "Regular",
  multi: false,
};

const MENU = [
  // Starters
  {
    id: "s1",
    name: "Truffle Arancini",
    category: "starters",
    price: 12.0,
    description: "Crispy risotto balls with black truffle, parmesan, and herb aioli",
    tags: ["vegetarian", "popular"],
    emoji: "🧆",
    image: IMG("1633436374961-09b00f6f7d1f"),
    options: [],
  },
  {
    id: "s2",
    name: "Burrata & Heirloom Tomato",
    category: "starters",
    price: 14.0,
    description: "Fresh burrata, heirloom tomatoes, basil oil, aged balsamic",
    tags: ["vegetarian", "gluten-free"],
    emoji: "🫙",
    image: IMG("1542444459-db63c91add0c"),
    options: [],
  },
  {
    id: "s3",
    name: "Crispy Calamari",
    category: "starters",
    price: 13.0,
    description: "Lightly fried calamari with lemon zest, smoked paprika aioli",
    tags: ["seafood"],
    emoji: "🦑",
    image: IMG("1599487488170-d11ec9c172f0"),
    options: [
      {
        name: "Sauce",
        choices: ["Lemon Aioli", "Spicy Paprika", "Sweet Chili"],
        default: "Lemon Aioli",
        multi: false,
      },
    ],
  },

  // Mains
  {
    id: "m1",
    name: "Spicy Chicken Sandwich",
    category: "mains",
    price: 18.0,
    description: "Crispy fried chicken, gochujang glaze, slaw, brioche bun",
    tags: ["spicy", "popular"],
    emoji: "🍔",
    image: IMG("1606755962773-d324e0a13086"),
    options: [
      SPICE,
      {
        name: "Add-ons",
        choices: ["Extra Cheese", "Bacon", "Avocado", "Fried Egg"],
        multi: true,
      },
    ],
  },
  {
    id: "m2",
    name: "Wagyu Smash Burger",
    category: "mains",
    price: 24.0,
    description: "Double wagyu patty, aged cheddar, caramelized onions, special sauce",
    tags: ["popular", "beef"],
    emoji: "🍔",
    image: IMG("1568901346375-23c9450c58cd"),
    options: [
      DONENESS,
      {
        name: "Add-ons",
        choices: ["Extra Cheese", "Bacon", "Avocado", "Fried Egg", "Mushrooms"],
        multi: true,
      },
    ],
  },
  {
    id: "m3",
    name: "Pan-Seared Salmon",
    category: "mains",
    price: 28.0,
    description: "Atlantic salmon, lemon caper butter, roasted asparagus, baby potatoes",
    tags: ["seafood", "gluten-free"],
    emoji: "🐟",
    image: IMG("1485963631004-f2f00b1d6606"),
    options: [
      {
        name: "Doneness",
        choices: ["Medium", "Medium-Well", "Well Done"],
        default: "Medium",
        multi: false,
      },
    ],
  },
  {
    id: "m4",
    name: "Wild Mushroom Risotto",
    category: "mains",
    price: 22.0,
    description: "Arborio rice, porcini, shiitake, truffle oil, pecorino",
    tags: ["vegetarian", "gluten-free"],
    emoji: "🍚",
    image: IMG("1476124369491-e7addf5db371"),
    options: [
      {
        name: "Add-ons",
        choices: ["Extra Truffle", "Soft Poached Egg"],
        multi: true,
      },
    ],
  },
  {
    id: "m5",
    name: "Bistro Steak Frites",
    category: "mains",
    price: 34.0,
    description: "8oz bavette steak, herb butter, crispy frites, house salad",
    tags: ["beef", "popular"],
    emoji: "🥩",
    image: IMG("1546964124-0cce460f38ef"),
    options: [
      DONENESS,
      {
        name: "Sauce",
        choices: ["Herb Butter", "Béarnaise", "Peppercorn", "Chimichurri"],
        default: "Herb Butter",
        multi: false,
      },
    ],
  },

  // Sides
  {
    id: "sd1",
    name: "Truffle Fries",
    category: "sides",
    price: 9.0,
    description: "Hand-cut fries, truffle oil, parmesan, chives",
    tags: ["vegetarian", "popular"],
    emoji: "🍟",
    image: IMG("1573080496219-bb080dd4f877"),
    options: [],
  },
  {
    id: "sd2",
    name: "House Salad",
    category: "sides",
    price: 8.0,
    description: "Mixed greens, cucumber, cherry tomato, lemon vinaigrette",
    tags: ["vegetarian", "vegan", "gluten-free"],
    emoji: "🥗",
    image: IMG("1512621776951-a57141f2eefd"),
    options: [
      {
        name: "Dressing",
        choices: ["Lemon Vinaigrette", "Balsamic", "Caesar", "Ranch"],
        default: "Lemon Vinaigrette",
        multi: false,
      },
    ],
  },
  {
    id: "sd3",
    name: "Roasted Broccolini",
    category: "sides",
    price: 7.0,
    description: "Charred broccolini, garlic, chili flakes, lemon",
    tags: ["vegetarian", "vegan", "gluten-free"],
    emoji: "🥦",
    image: IMG("1583663848692-d2d4c5e62b69"),
    options: [],
  },

  // Drinks
  {
    id: "d1",
    name: "Still Water",
    category: "drinks",
    price: 3.0,
    description: "500ml still mineral water",
    tags: ["non-alcoholic"],
    emoji: "💧",
    image: IMG("1548839140-29a749e1cf4d"),
    options: [SIZE],
  },
  {
    id: "d2",
    name: "Sparkling Water",
    category: "drinks",
    price: 3.5,
    description: "500ml sparkling mineral water",
    tags: ["non-alcoholic"],
    emoji: "🫧",
    image: IMG("1592151450569-eba1a90b56a4"),
    options: [SIZE],
  },
  {
    id: "d3",
    name: "Fresh Lemonade",
    category: "drinks",
    price: 5.0,
    description: "House-squeezed lemonade with mint",
    tags: ["non-alcoholic", "popular"],
    emoji: "🍋",
    image: IMG("1497534446932-c925b458314e"),
    options: [SWEETNESS, ICE],
  },
  {
    id: "d4",
    name: "Craft Iced Tea",
    category: "drinks",
    price: 5.0,
    description: "Cold-brewed black tea, honey, lemon",
    tags: ["non-alcoholic"],
    emoji: "🧋",
    image: IMG("1556679343-c7306c1976bc"),
    options: [SWEETNESS, ICE],
  },
  {
    id: "d5",
    name: "House Red Wine",
    category: "drinks",
    price: 12.0,
    description: "Glass of our curated house red blend",
    tags: ["alcoholic"],
    emoji: "🍷",
    image: IMG("1474722883778-792e7990302f"),
    options: [],
  },
  {
    id: "d6",
    name: "House White Wine",
    category: "drinks",
    price: 12.0,
    description: "Glass of our crisp house white blend",
    tags: ["alcoholic"],
    emoji: "🥂",
    image: IMG("1510630934346-c47cf1c4faae"),
    options: [],
  },

  // Desserts
  {
    id: "ds1",
    name: "Chocolate Lava Cake",
    category: "desserts",
    price: 11.0,
    description: "Warm dark chocolate cake, molten center, vanilla bean ice cream",
    tags: ["vegetarian", "popular"],
    emoji: "🎂",
    image: IMG("1551024506-0bccd828d307"),
    options: [
      {
        name: "Ice Cream",
        choices: ["Vanilla Bean", "Salted Caramel", "Pistachio", "No Ice Cream"],
        default: "Vanilla Bean",
        multi: false,
      },
    ],
  },
  {
    id: "ds2",
    name: "Crème Brûlée",
    category: "desserts",
    price: 10.0,
    description: "Classic vanilla custard, caramelized sugar crust, fresh berries",
    tags: ["vegetarian", "gluten-free"],
    emoji: "🍮",
    image: IMG("1551404973-761c83cd8339"),
    options: [],
  },
  {
    id: "ds3",
    name: "Tiramisu",
    category: "desserts",
    price: 10.0,
    description: "Espresso-soaked ladyfingers, mascarpone cream, cocoa",
    tags: ["vegetarian"],
    emoji: "🍰",
    image: IMG("1571877227200-a0d98ea607e9"),
    options: [],
  },
];

module.exports = { MENU };
