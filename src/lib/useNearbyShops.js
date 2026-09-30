/**
 * useNearbyShops — custom React hook
 *
 * Uses the Places API (New) — specifically the Nearby Search (New) REST endpoint:
 *   POST https://places.googleapis.com/v1/places:searchNearby
 *
 * This is NOT the legacy PlacesService / nearbySearch().
 * The new endpoint requires the "Places API (New)" to be enabled in Google Cloud Console.
 *
 * API key is read exclusively from import.meta.env.VITE_GOOGLE_MAPS_API_KEY.
 * The key is never logged or rendered into the DOM.
 *
 * No Google Maps JS SDK is needed for the search itself — it is a plain fetch().
 * The Maps JS SDK is still loaded separately in GoogleMap.jsx for rendering.
 */

import { useState, useEffect } from 'react';
import { haversineDistance } from '../data/shops';

// ── Field mask: only request what we need (reduces response size & cost) ──
const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.shortFormattedAddress',
  'places.location',
  'places.rating',
  'places.userRatingCount',
  'places.currentOpeningHours',
  'places.regularOpeningHours',
  'places.businessStatus',
  'places.primaryTypeDisplayName',
  'places.types',
].join(',');

// ── Adapter: Places API (New) place → KiranaSetu shop object ──────────────
function adaptPlace(place, customerLat, customerLng) {
  const lat = place.location?.latitude ?? 0;
  const lng = place.location?.longitude ?? 0;

  const distanceKm = haversineDistance(customerLat, customerLng, lat, lng);
  const distanceLabel =
    distanceKm < 1
      ? `${Math.round(distanceKm * 1000)} m away`
      : `${distanceKm.toFixed(1)} km away`;

  const rating = typeof place.rating === 'number' ? place.rating : null;
  const reviewCount = place.userRatingCount ?? 0;

  // currentOpeningHours is the new field (replaces opening_hours.isOpen())
  const openNow = place.currentOpeningHours?.openNow ?? null; // true | false | null
  const isOpen = openNow !== false; // treat unknown as open so card is selectable

  const staffFee  = distanceKm < 0.5 ? 15 : distanceKm < 1 ? 20 : 25;
  const partnerFee = staffFee + 10;
  const estTime   = distanceKm < 0.5 ? '15–25 mins' : distanceKm < 1 ? '20–35 mins' : '30–50 mins';

  const trustReasons = [];
  if (rating && rating >= 4.5) trustReasons.push('Highly rated');
  if (rating)                   trustReasons.push(`${rating} ★`);
  trustReasons.push(distanceLabel);
  if (openNow === true)         trustReasons.push('Open now');

  const address =
    place.shortFormattedAddress ??
    place.formattedAddress ??
    '';

  const name = place.displayName?.text ?? place.displayName ?? 'Kirana Shop';

  return {
    id:        place.id,
    placeId:   place.id,
    name,
    address,
    lat,
    lng,

    distanceKm,
    distance:  distanceLabel,
    rating:    rating ?? '—',
    reviewCount,
    isOpen,

    openHours: openNow === true ? 'Open now' : openNow === false ? 'Closed now' : 'Hours unknown',

    trustBadge:    rating && rating >= 4.5 ? 'Highly rated' : 'Nearby shop',
    trustSubtitle: reviewCount > 0 ? `${reviewCount} Google reviews` : 'Google verified',
    trustReasons,
    badgeType:     rating && rating >= 4.5 ? 'verified' : 'neutral',

    hasPreviousRelationship: false,
    shopImageEmoji:  '🏪',
    mapMarkerColor:  '#104e35',
    locality:        address,

    unavailableProductIds: [],
    staffDeliveryFee:  staffFee,
    partnerDeliveryFee: partnerFee,
    estDeliveryTime:   estTime,
    totalCatalogCount: '—',
    ownerName:         '',
    description:       address,
    isRealShop:        true,
  };
}

// ─── Hook ────────────────────────────────────────────────────────────────
/**
 * @param {{ lat: number, lng: number } | null} customerLocation
 * @param {number} [radiusMeters=2000]
 * @returns {{ shops: Array, loading: boolean, error: string|null }}
 */
export function useNearbyShops(customerLocation, radiusMeters = 2000) {
  const [shops,   setShops]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!customerLocation?.lat || !customerLocation?.lng) return;

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setError('Google Maps API key is not configured (VITE_GOOGLE_MAPS_API_KEY missing).');
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setShops([]);

    // ── Places API (New) — Nearby Search ────────────────────────────────
    // Docs: https://developers.google.com/maps/documentation/places/web-service/nearby-search
    const body = {
      includedTypes: [
        'grocery_store',
        'supermarket',
        'convenience_store',
        'food_store',
      ],
      maxResultCount: 10,
      locationRestriction: {
        circle: {
          center: {
            latitude:  customerLocation.lat,
            longitude: customerLocation.lng,
          },
          radius: radiusMeters,
        },
      },
      // Rank by distance so closest shops appear first
      rankPreference: 'DISTANCE',
      // Keyword search for kirana/grocery
      textQuery: undefined, // not used in nearbySearch; keyword filtering done via includedTypes
    };

    fetch('https://places.googleapis.com/v1/places:searchNearby', {
      method:  'POST',
      headers: {
        'Content-Type':     'application/json',
        'X-Goog-Api-Key':   apiKey,
        'X-Goog-FieldMask': FIELD_MASK,
      },
      body: JSON.stringify(body),
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => {
            throw new Error(
              err?.error?.message ??
              `Places API (New) error ${res.status}: ${res.statusText}`
            );
          });
        }
        return res.json();
      })
      .then(data => {
        if (cancelled) return;

        const places = data?.places ?? [];

        if (places.length === 0) {
          setShops([]);
          setError('No Kirana or grocery shops found within 2 km of your location.');
          setLoading(false);
          return;
        }

        const adapted = places
          .map(p => adaptPlace(p, customerLocation.lat, customerLocation.lng))
          .sort((a, b) => a.distanceKm - b.distanceKm);

        setShops(adapted);
        setLoading(false);
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message ?? 'Failed to fetch nearby shops. Please try again.');
          setLoading(false);
        }
      });

    return () => { cancelled = true; };

  }, [customerLocation?.lat, customerLocation?.lng, radiusMeters]);

  return { shops, loading, error };
}
