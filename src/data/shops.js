// Enhanced Demo Nearby Kirana Shops data matching Step 3 requirements
export const DEMO_DELIVERY_LOCATION = {
  address: "Sector 4, Block C, Main Road",
  city: "New Delhi - 110001",
  label: "Home (Demo Delivery Location)"
};

export const NEARBY_KIRANA_SHOPS = [
  {
    id: 'shop_1',
    name: 'SHARMA KIRANA',
    ownerName: 'Ramesh Sharma',
    distance: '0.5 km away',
    distanceKm: 0.5,
    rating: 4.7,
    reviewCount: 142,
    totalCatalogCount: 50,
    // Trust relationship connection for Step 4
    hasPreviousRelationship: true,
    trustBadge: 'Your trusted local shop',
    trustSubtitle: "You've ordered 6 times from this shop",
    badgeType: 'trusted',
    address: 'Shop No. 12, Main Market, Sector 4',
    // Demo unavailable product IDs (e.g. Sugar is unavailable here to demonstrate item availability check)
    unavailableProductIds: ['prod_5'], 
    staffDeliveryFee: 15,
    partnerDeliveryFee: 25,
    estDeliveryTime: '20–30 mins',
    description: 'Serving neighborhood families for 18 years. Verified inventory & quick shop-staff delivery.'
  },
  {
    id: 'shop_2',
    name: 'SRI LAKSHMI STORES',
    ownerName: 'Venkatesh Rao',
    distance: '0.8 km away',
    distanceKm: 0.8,
    rating: 4.6,
    reviewCount: 98,
    totalCatalogCount: 50,
    hasPreviousRelationship: false,
    trustBadge: 'Nearby trusted-rated shop',
    trustSubtitle: 'Top 5% customer satisfaction in locality',
    badgeType: 'verified',
    address: 'Block C, Near Community Centre, Sector 4',
    unavailableProductIds: ['prod_7', 'prod_13'], // Coffee & Shampoo unavailable
    staffDeliveryFee: 20,
    partnerDeliveryFee: 30,
    estDeliveryTime: '25–35 mins',
    description: 'High stock availability for daily staples and popular branded personal care items.'
  },
  {
    id: 'shop_3',
    name: 'GANESH KIRANA',
    ownerName: 'Ganesh Patel',
    distance: '1.2 km away',
    distanceKm: 1.2,
    rating: 4.8,
    reviewCount: 215,
    totalCatalogCount: 50,
    hasPreviousRelationship: false,
    trustBadge: 'Highly rated',
    trustSubtitle: '100% item availability record',
    badgeType: 'full_stock',
    address: 'Shop 4 & 5, Sector 5 Crossing',
    unavailableProductIds: [], // 100% available
    staffDeliveryFee: 25,
    partnerDeliveryFee: 35,
    estDeliveryTime: '30–45 mins',
    description: 'Full catalog availability with premium packaging and fast neighborhood fulfillment.'
  }
];
