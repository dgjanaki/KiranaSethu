// KiranaSetu — Kirana Shop Data
// IMPORTANT: Shop lat/lng are stored as OFFSETS (in degrees) from the customer's
// detected GPS location. This means shops always appear near the real user,
// regardless of where in the world they are. Distances are calculated via
// Haversine formula from the customer's actual browser-reported coordinates.

// Haversine formula: accurate great-circle distance between two lat/lng points
export function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth radius in km
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

// Shop offset definitions — distances in degrees from the customer's location.
// 0.005° ≈ 550 m, 0.009° ≈ 1 km, 0.013° ≈ 1.4 km, 0.018° ≈ 2 km
// These keep demo shops realistic and close to the user wherever they are.
const SHOP_OFFSETS = [
  { latOffset:  0.0044, lngOffset:  0.0023 }, // shop_1 ~0.5 km NE
  { latOffset: -0.0065, lngOffset:  0.0038 }, // shop_2 ~0.8 km SE
  { latOffset:  0.0082, lngOffset:  0.0092 }, // shop_3 ~1.2 km NE
  { latOffset: -0.0038, lngOffset: -0.0082 }, // shop_4 ~1.5 km SW
];

// Shop template data — no lat/lng here; those are injected at runtime
const SHOP_TEMPLATES = [
  {
    id: 'shop_1',
    name: 'SHARMA KIRANA',
    ownerName: 'Ramesh Sharma',
    rating: 4.7,
    reviewCount: 142,
    totalCatalogCount: 50,
    isOpen: true,
    openHours: '7:00 AM – 10:00 PM',
    hasPreviousRelationship: true,
    trustBadge: 'Your trusted local shop',
    trustSubtitle: "You've ordered 6 times from this shop",
    trustReasons: ['Trusted by you', '6 previous orders', 'Most items available'],
    badgeType: 'trusted',
    address: 'Shop No. 12, Main Market',
    unavailableProductIds: ['prod_5'],
    staffDeliveryFee: 15,
    partnerDeliveryFee: 25,
    estDeliveryTime: '20–30 mins',
    description: 'Serving neighborhood families for 18 years. Verified inventory & quick shop-staff delivery.',
    mapMarkerColor: '#104e35',
    category: 'General Kirana',
    established: '2006',
    orderCount: 2847,
    shopImageEmoji: '🏪'
  },
  {
    id: 'shop_2',
    name: 'SRI LAKSHMI STORES',
    ownerName: 'Venkatesh Rao',
    rating: 4.6,
    reviewCount: 98,
    totalCatalogCount: 50,
    isOpen: true,
    openHours: '6:30 AM – 9:30 PM',
    hasPreviousRelationship: false,
    trustBadge: 'Highly rated nearby shop',
    trustSubtitle: 'Top 5% customer satisfaction in locality',
    trustReasons: ['Highly rated', '4.6 ★ stars', 'High availability'],
    badgeType: 'verified',
    address: 'Near Community Centre',
    unavailableProductIds: ['prod_7', 'prod_13'],
    staffDeliveryFee: 20,
    partnerDeliveryFee: 30,
    estDeliveryTime: '25–35 mins',
    description: 'High stock availability for daily staples and popular branded personal care items.',
    mapMarkerColor: '#d97706',
    category: 'General Kirana',
    established: '2010',
    orderCount: 1923,
    shopImageEmoji: '🏬'
  },
  {
    id: 'shop_3',
    name: 'GANESH KIRANA',
    ownerName: 'Ganesh Patel',
    rating: 4.8,
    reviewCount: 215,
    totalCatalogCount: 50,
    isOpen: true,
    openHours: '7:00 AM – 11:00 PM',
    hasPreviousRelationship: false,
    trustBadge: 'Highest rated',
    trustSubtitle: '100% item availability record',
    trustReasons: ['Highest rated', '4.8 ★ stars', '100% stock record'],
    badgeType: 'full_stock',
    address: 'Sector Crossing, Market',
    unavailableProductIds: [],
    staffDeliveryFee: 25,
    partnerDeliveryFee: 35,
    estDeliveryTime: '30–45 mins',
    description: 'Full catalog availability with premium packaging and fast neighborhood fulfillment.',
    mapMarkerColor: '#7c3aed',
    category: 'General Kirana',
    established: '2003',
    orderCount: 4102,
    shopImageEmoji: '🛒'
  },
  {
    id: 'shop_4',
    name: 'KRISHNA GENERAL STORE',
    ownerName: 'Krishna Murthy',
    rating: 4.4,
    reviewCount: 67,
    totalCatalogCount: 42,
    isOpen: false,
    openHours: '8:00 AM – 9:00 PM',
    hasPreviousRelationship: false,
    trustBadge: 'Verified shop',
    trustSubtitle: 'KiranaSetu verified partner',
    trustReasons: ['Verified shop', '4.4 ★ stars', 'Opens at 8 AM'],
    badgeType: 'verified',
    address: 'Local Market Area',
    unavailableProductIds: ['prod_7', 'prod_9', 'prod_13', 'prod_14'],
    staffDeliveryFee: 20,
    partnerDeliveryFee: 30,
    estDeliveryTime: '35–50 mins',
    description: 'Trusted neighborhood general store with wide daily essentials catalog.',
    mapMarkerColor: '#dc2626',
    category: 'General Store',
    established: '2014',
    orderCount: 892,
    shopImageEmoji: '🏗️'
  }
];

/**
 * Generate nearby demo shops positioned around the customer's real GPS location.
 * Each shop gets a lat/lng derived by adding a fixed offset to the customer coords.
 * This means shops always appear near the user — no matter where in the world they are.
 *
 * @param {number} customerLat - Customer's real latitude from browser GPS
 * @param {number} customerLng - Customer's real longitude from browser GPS
 * @returns {Array} Shop objects with real-world coordinates and computed distances
 */
export function getShopsNearLocation(customerLat, customerLng) {
  return SHOP_TEMPLATES.map((template, i) => {
    const offset = SHOP_OFFSETS[i] || SHOP_OFFSETS[0];
    const shopLat = customerLat + offset.latOffset;
    const shopLng = customerLng + offset.lngOffset;
    const distanceKm = haversineDistance(customerLat, customerLng, shopLat, shopLng);

    // Build dynamic trust reasons that include the real distance
    const distanceLabel = distanceKm < 1
      ? `${Math.round(distanceKm * 1000)} m away`
      : `${distanceKm.toFixed(1)} km away`;

    const trustReasons = [...template.trustReasons, distanceLabel];

    return {
      ...template,
      lat: shopLat,
      lng: shopLng,
      distanceKm,
      distance: distanceLabel,
      locality: `${distanceLabel} from your location`,
      trustReasons
    };
  }).sort((a, b) => a.distanceKm - b.distanceKm);
}

// Kept for backward compatibility — only used in OrderReviewView for the
// delivery address label when customer hasn't provided an address yet.
export const DEMO_DELIVERY_LOCATION = {
  address: "Your detected location",
  city: "",
  label: "Current Location"
};
