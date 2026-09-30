/**
 * GoogleMap — renders a real Google Map centred on the customer's GPS location.
 *
 * Fix history:
 *   - Moved loading overlay OUTSIDE the map container div so Google Maps
 *     never conflicts with React-managed DOM children (fixes removeChild crash).
 *   - Added proper useEffect cleanup: map ref is cleared on unmount so
 *     StrictMode's double-mount always creates a fresh map in the real DOM node.
 *   - Script loader now correctly guards against the race between the module-level
 *     promise and StrictMode's double-invoke.
 *   - All Google Maps objects (markers, infoWindows) are cleaned up in the
 *     effect's return function — not in a separate unmount effect — so there
 *     is never a window where a stale marker references a detached map.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Navigation, Loader, AlertCircle } from 'lucide-react';

// ── Shared Maps JS script loader ─────────────────────────────────────────
// Module-level so the <script> tag is only injected once per page load.
let _scriptPromise = null;

function loadMapsScript(apiKey) {
  // SDK already present (e.g. navigating back to this screen)
  if (window.google?.maps?.marker) return Promise.resolve();

  // Reuse an in-flight load
  if (_scriptPromise) return _scriptPromise;

  _scriptPromise = new Promise((resolve, reject) => {
    // StrictMode may call this twice; if the tag already exists just poll
    if (document.querySelector('script[data-kirana-maps]')) {
      const t = setInterval(() => {
        if (window.google?.maps?.marker) { clearInterval(t); resolve(); }
      }, 50);
      // Safety timeout — if it never arrives, reject
      setTimeout(() => { clearInterval(t); reject(new Error('Maps SDK load timed out.')); }, 15000);
      return;
    }

    const CB = '__kirana_maps_ready__';
    window[CB] = () => { delete window[CB]; resolve(); };

    const s = document.createElement('script');
    s.setAttribute('data-kirana-maps', '1');
    s.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=beta&libraries=marker&callback=${CB}`;
    s.async = true;
    s.defer = true;
    s.onerror = () => {
      _scriptPromise = null;
      reject(new Error('Failed to load Google Maps. Verify VITE_GOOGLE_MAPS_API_KEY.'));
    };
    document.head.appendChild(s);
  });

  return _scriptPromise;
}

// ── SVG pin factory helpers ───────────────────────────────────────────────
function makeCustomerPin() {
  const div = document.createElement('div');
  div.style.cursor = 'default';
  div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
    <path d="M18 0C10.27 0 4 6.27 4 14c0 10.5 14 30 14 30S32 24.5 32 14C32 6.27 25.73 0 18 0z"
          fill="#104e35" stroke="white" stroke-width="2.5"/>
    <circle cx="18" cy="14" r="6" fill="white"/>
    <circle cx="18" cy="14" r="3" fill="#104e35"/>
  </svg>`;
  return div;
}

function makeShopPin(color = '#d97706', selected = false) {
  const size = selected ? 36 : 30;
  const div = document.createElement('div');
  div.style.cursor = 'pointer';
  div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg"
      width="${size}" height="${Math.round(size * 1.3)}" viewBox="0 0 30 38">
    <path d="M15 0C8.37 0 3 5.37 3 12c0 9 12 26 12 26S27 21 27 12C27 5.37 21.63 0 15 0z"
          fill="${selected ? '#104e35' : color}" stroke="white" stroke-width="2"/>
    <text x="15" y="15" text-anchor="middle" font-size="10" font-family="sans-serif">🏪</text>
  </svg>`;
  return div;
}

// ─────────────────────────────────────────────────────────────────────────
export default function GoogleMap({ shops, customerLocation, selectedShopId, onShopMarkerClick }) {
  // containerRef points to the bare div that Google Maps owns entirely.
  // IMPORTANT: React must never render children inside this div —
  // doing so causes the removeChild crash when Maps touches the same nodes.
  const containerRef   = useRef(null);
  const mapRef         = useRef(null);   // google.maps.Map instance
  const customerMarker = useRef(null);   // customer AdvancedMarkerElement
  const shopMarkersRef = useRef([]);     // array of { marker, infoWindow }

  const [mapReady,  setMapReady]  = useState(false);
  const [mapError,  setMapError]  = useState(null);
  const [sdkReady,  setSdkReady]  = useState(!!window.google?.maps?.marker);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // ── Effect 1: load SDK ────────────────────────────────────────────────
  useEffect(() => {
    if (sdkReady) return;
    if (!apiKey) { setMapError('VITE_GOOGLE_MAPS_API_KEY is not configured.'); return; }

    let alive = true;
    loadMapsScript(apiKey)
      .then(() => { if (alive) setSdkReady(true); })
      .catch(err => { if (alive) setMapError(err.message); });

    return () => { alive = false; };
  }, [apiKey, sdkReady]);

  // ── Effect 2: initialise map after SDK + container are both ready ─────
  useEffect(() => {
    if (!sdkReady || !containerRef.current) return;

    // Tear down any previous map instance (StrictMode double-mount safe)
    if (mapRef.current) {
      customerMarker.current?.setMap?.(null);
      customerMarker.current = null;
      shopMarkersRef.current.forEach(({ marker, iw }) => {
        marker.map = null;
        iw?.close();
      });
      shopMarkersRef.current = [];
      // google.maps.Map has no public .destroy(); nulling the ref is enough
      mapRef.current = null;
      setMapReady(false);
    }

    if (!customerLocation?.lat || !customerLocation?.lng) return;

    const map = new window.google.maps.Map(containerRef.current, {
      center:            { lat: customerLocation.lat, lng: customerLocation.lng },
      zoom:              14,
      mapId:             'KIRANA_SETU_MAP', // required for AdvancedMarkerElement
      mapTypeControl:    false,
      streetViewControl: false,
      fullscreenControl: false,
      clickableIcons:    false,
    });

    customerMarker.current = new window.google.maps.marker.AdvancedMarkerElement({
      map,
      position: { lat: customerLocation.lat, lng: customerLocation.lng },
      title:    'Your location',
      content:  makeCustomerPin(),
      zIndex:   999,
    });

    mapRef.current = map;
    setMapReady(true);

    // Cleanup on unmount or re-run
    return () => {
      customerMarker.current?.setMap?.(null);
      customerMarker.current = null;
      shopMarkersRef.current.forEach(({ marker, iw }) => {
        marker.map = null;
        iw?.close();
      });
      shopMarkersRef.current = [];
      mapRef.current = null;
      setMapReady(false);
    };
  }, [sdkReady, customerLocation?.lat, customerLocation?.lng]);

  // ── Effect 3: add / refresh shop markers ─────────────────────────────
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;

    // Clear existing shop markers
    shopMarkersRef.current.forEach(({ marker, iw }) => {
      marker.map = null;
      iw?.close();
    });
    shopMarkersRef.current = [];

    if (!shops?.length) return;

    const liveInfoWindows = [];

    shops.forEach(shop => {
      if (!shop.lat || !shop.lng) return;

      const isSelected = shop.id === selectedShopId;
      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        map:      mapRef.current,
        position: { lat: shop.lat, lng: shop.lng },
        title:    shop.name,
        content:  makeShopPin(shop.mapMarkerColor || '#d97706', isSelected),
        zIndex:   isSelected ? 100 : 10,
      });

      const iw = new window.google.maps.InfoWindow({
        content: `
          <div style="font-family:system-ui,sans-serif;min-width:180px;padding:2px 0 4px">
            <strong style="font-size:13px;color:#0f172a">${shop.name}</strong>
            <p style="margin:4px 0 2px;font-size:11px;color:#475569;line-height:1.3">${shop.address}</p>
            <p style="margin:2px 0;font-size:11px;color:#64748b">
              ${shop.rating !== '—' ? `⭐ ${shop.rating}` : ''}
              ${shop.rating !== '—' && shop.reviewCount ? ` (${shop.reviewCount})` : ''}
              &nbsp;·&nbsp; 📍 ${shop.distance}
            </p>
            <p style="margin:4px 0 0;font-size:11px;font-weight:600;
                      color:${shop.isOpen ? '#16a34a' : '#dc2626'}">
              ${shop.isOpen ? '🟢 Open' : '🔴 Closed'}
            </p>
          </div>`,
      });

      marker.addListener('click', () => {
        liveInfoWindows.forEach(w => w.close());
        iw.open({ map: mapRef.current, anchor: marker });
        onShopMarkerClick?.(shop);
      });

      liveInfoWindows.push(iw);
      shopMarkersRef.current.push({ marker, iw });
    });

    // Fit bounds to customer + all shops
    if (customerLocation) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend({ lat: customerLocation.lat, lng: customerLocation.lng });
      shops.forEach(s => { if (s.lat && s.lng) bounds.extend({ lat: s.lat, lng: s.lng }); });
      mapRef.current.fitBounds(bounds, { top: 48, right: 24, bottom: 24, left: 24 });
    }

    return () => {
      shopMarkersRef.current.forEach(({ marker, iw }) => {
        marker.map = null;
        iw?.close();
      });
      shopMarkersRef.current = [];
    };
  }, [mapReady, shops, selectedShopId, customerLocation, onShopMarkerClick]);

  // ── Render ────────────────────────────────────────────────────────────
  if (!customerLocation?.lat) return null;

  if (mapError) {
    return (
      <div className="map-canvas-container">
        <div className="map-error-state">
          <AlertCircle size={20} color="#d97706" />
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{mapError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="map-canvas-container">
      {/* Legend — OUTSIDE the map container */}
      <div className="map-canvas-header">
        <div className="map-legend-row">
          <span className="map-legend-item">
            <span className="legend-dot legend-customer" /> You
          </span>
          <span className="map-legend-item">
            <span className="legend-dot" style={{ background: '#d97706' }} /> Shops
          </span>
          {selectedShopId && (
            <span className="map-legend-item">
              <span className="legend-dot" style={{ background: '#104e35' }} /> Selected
            </span>
          )}
        </div>
      </div>

      {/*
        ── THE FIX ──
        The loading overlay is now a SIBLING of the map div, not a child.
        Google Maps takes full ownership of containerRef's DOM node.
        React must never render anything inside it.
      */}
      {(!mapReady && !mapError) && (
        <div className="map-loading-overlay-sibling">
          <Loader size={26} className="location-spin-icon" color="var(--primary)" />
          <span>Loading map…</span>
        </div>
      )}

      {/* Google Maps owns this div entirely — React renders NO children inside */}
      <div
        ref={containerRef}
        className="map-svg-wrapper"
        style={{ minHeight: '320px', background: '#e8f0eb' }}
        aria-label="Map showing your location and nearby Kirana shops"
      />

      {/* Footer — OUTSIDE the map container */}
      <div className="map-footer-note">
        <Navigation size={11} color="var(--primary)" style={{ marginRight: 4, display: 'inline' }} />
        Tap a marker · Real shops · Google Maps
      </div>
    </div>
  );
}
