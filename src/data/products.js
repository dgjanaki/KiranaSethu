// Realistic Indian Kirana Products list as specified by user requirements
export const KIRANA_PRODUCTS = [
  {
    id: 'prod_1',
    name: 'Rice (Basmati / Daily)',
    brand: 'Fortune Biryani / Regular',
    category: 'Staples & Grains',
    unitSize: '5 kg pack',
    price: 380,
    imageIcon: '🍚',
    aiMatchName: 'Rice'
  },
  {
    id: 'prod_2',
    name: 'Atta (Whole Wheat)',
    brand: 'Aashirvaad Shuddh Chakki',
    category: 'Staples & Grains',
    unitSize: '5 kg pack',
    price: 265,
    imageIcon: '🌾',
    aiMatchName: 'Atta'
  },
  {
    id: 'prod_3',
    name: 'Toor Dal (Unpolished)',
    brand: 'Tata Sampann Toor Dal',
    category: 'Pulses & Dals',
    unitSize: '1 kg pack',
    price: 160,
    imageIcon: '🥣',
    aiMatchName: 'Toor Dal'
  },
  {
    id: 'prod_4',
    name: 'Cooking Oil',
    brand: 'Fortune Sun Lite Refined Sunflower',
    category: 'Oils & Ghee',
    unitSize: '1 Litre pouch',
    price: 145,
    imageIcon: '🛢️',
    aiMatchName: 'Cooking Oil'
  },
  {
    id: 'prod_5',
    name: 'Sugar (White Crystal)',
    brand: 'Madhur Pure Sugar',
    category: 'Staples & Grains',
    unitSize: '1 kg pack',
    price: 48,
    imageIcon: '🍬',
    aiMatchName: 'Sugar'
  },
  {
    id: 'prod_6',
    name: 'Tea (CTC Leaf)',
    brand: 'Tata Tea Premium',
    category: 'Beverages',
    unitSize: '500g pack',
    price: 290,
    imageIcon: '☕',
    aiMatchName: 'Tea'
  },
  {
    id: 'prod_7',
    name: 'Coffee (Instant)',
    brand: 'Nescafe Classic',
    category: 'Beverages',
    unitSize: '100g glass jar',
    price: 210,
    imageIcon: '☕',
    aiMatchName: 'Coffee'
  },
  {
    id: 'prod_8',
    name: 'Biscuits',
    brand: 'Parle-G Gold / Britannia Good Day',
    category: 'Snacks & Packaged',
    unitSize: 'Family Pack',
    price: 30,
    imageIcon: '🍪',
    aiMatchName: 'Biscuits'
  },
  {
    id: 'prod_9',
    name: 'Noodles (Instant)',
    brand: 'Maggi 2-Minute Masala Noodles',
    category: 'Snacks & Packaged',
    unitSize: 'Pack of 4 (280g)',
    price: 56,
    imageIcon: '🍜',
    aiMatchName: 'Noodles'
  },
  {
    id: 'prod_10',
    name: 'Salt (Iodized)',
    brand: 'Tata Salt Vacuum Evaporated',
    category: 'Spices & Seasoning',
    unitSize: '1 kg pack',
    price: 28,
    imageIcon: '🧂',
    aiMatchName: 'Salt'
  },
  {
    id: 'prod_11',
    name: 'Spices (Turmeric / Garam Masala)',
    brand: 'Everest Masala',
    category: 'Spices & Seasoning',
    unitSize: '100g pack',
    price: 65,
    imageIcon: '🌶️',
    aiMatchName: 'Spices'
  },
  {
    id: 'prod_12',
    name: 'Soap (Bathing)',
    brand: 'Dettol Original / Dove',
    category: 'Personal Care',
    unitSize: 'Pack of 3 (3x125g)',
    price: 120,
    imageIcon: '🧼',
    aiMatchName: 'Soap'
  },
  {
    id: 'prod_13',
    name: 'Shampoo',
    brand: 'Clinic Plus Strong & Long',
    category: 'Personal Care',
    unitSize: '340 ml bottle',
    price: 175,
    imageIcon: '🧴',
    aiMatchName: 'Shampoo'
  },
  {
    id: 'prod_14',
    name: 'Toothpaste',
    brand: 'Colgate Strong Teeth',
    category: 'Personal Care',
    unitSize: '200g tube',
    price: 110,
    imageIcon: '🪥',
    aiMatchName: 'Toothpaste'
  },
  {
    id: 'prod_15',
    name: 'Detergent Powder',
    brand: 'Surf Excel Easy Wash',
    category: 'Household Care',
    unitSize: '1 kg pack',
    price: 140,
    imageIcon: '🧺',
    aiMatchName: 'Detergent'
  }
];

// Simulated AI scan results matching prompt specifications
// (Rice, Atta, Toor Dal, Cooking Oil, Sugar, Tea, Biscuits, Soap, Detergent)
export const SIMULATED_AI_RECOGNITION = [
  'prod_1', // Rice
  'prod_2', // Atta
  'prod_3', // Toor Dal
  'prod_4', // Cooking Oil
  'prod_5', // Sugar
  'prod_6', // Tea
  'prod_8', // Biscuits
  'prod_12',// Soap
  'prod_15' // Detergent
];
