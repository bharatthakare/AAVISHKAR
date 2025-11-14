export type MarketPrice = {
  commodity: string;
  state: string;
  district: string;
  market: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  priceChange: number;
  lastUpdated: string;
};

export const marketPrices: MarketPrice[] = [
  {
    commodity: 'Wheat',
    state: 'Punjab',
    district: 'Amritsar',
    market: 'Amritsar',
    minPrice: 2000,
    maxPrice: 2150,
    modalPrice: 2075,
    priceChange: 1.2,
    lastUpdated: '10:30 AM',
  },
  {
    commodity: 'Soybean',
    state: 'Maharashtra',
    district: 'Latur',
    market: 'Latur',
    minPrice: 4500,
    maxPrice: 4800,
    modalPrice: 4650,
    priceChange: -0.5,
    lastUpdated: '11:00 AM',
  },
  {
    commodity: 'Cotton',
    state: 'Gujarat',
    district: 'Rajkot',
    market: 'Rajkot',
    minPrice: 7000,
    maxPrice: 7500,
    modalPrice: 7250,
    priceChange: 2.1,
    lastUpdated: '09:45 AM',
  },
  {
    commodity: 'Paddy',
    state: 'Andhra Pradesh',
    district: 'West Godavari',
    market: 'Tadepalligudem',
    minPrice: 1800,
    maxPrice: 1950,
    modalPrice: 1875,
    priceChange: 0.8,
    lastUpdated: '12:00 PM',
  },
  {
    commodity: 'Maize',
    state: 'Karnataka',
    district: 'Davanagere',
    market: 'Davanagere',
    minPrice: 1700,
    maxPrice: 1850,
    modalPrice: 1775,
    priceChange: -1.1,
    lastUpdated: '10:15 AM',
  },
  {
    commodity: 'Tomato',
    state: 'Madhya Pradesh',
    district: 'Indore',
    market: 'Indore',
    minPrice: 800,
    maxPrice: 1200,
    modalPrice: 1000,
    priceChange: 5.3,
    lastUpdated: '11:30 AM',
  },
];

export const priceTrends = {
  wheat: [
    { date: 'Mon', price: 2050 },
    { date: 'Tue', price: 2060 },
    { date: 'Wed', price: 2055 },
    { date: 'Thu', price: 2070 },
    { date: 'Fri', price: 2075 },
  ],
  soybean: [
    { date: 'Mon', price: 4700 },
    { date: 'Tue', price: 4680 },
    { date: 'Wed', price: 4675 },
    { date: 'Thu', price: 4660 },
    { date: 'Fri', price: 4650 },
  ],
};
