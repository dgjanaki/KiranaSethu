import React, { useState, useEffect } from 'react';
import { KIRANA_PRODUCTS } from '../../data/products';
import {
  MapPin, Star, ShieldCheck, ArrowLeft,
  Eye, Truck, Clock, Package, ChevronRight, Navigation,
  Loader, AlertCircle, RefreshCw
} from 'lucide-react';
import GoogleMap from './GoogleMap';
import LocationFinder from './LocationFinder';
import { useNearbyShops } from '../../lib/useNearbyShops';

export default function ShopSelectionView({
  cart,
  onViewShopDetail,
  onChooseShop,
  onBackToCart,
  customerLocation: propCustomerLocation,
  onLocationObtained,
}) {
  const [sortBy, setSortBy] = useState('recommended');
  const [customerLocation, setCustomerLocation] = useState(propCustomerLocation || null);
  const [highlightedShopId, setHighlightedShopId] = useState(null);
  const [locationObtained, setLocationObtained] = useState(!!propCustomerLocation);

  // Sync if CustomerFlow already has a location (back navigation)
  useEffect(() => {
    if (propCustomerLocation) {
      setCustomerLocation(propCustomerLocation);
      setLocationObtained(true);
    }
  }, [propCustomerLocation]);

  const handleLocationObtained = (loc) => {
    setCustomerLocation(loc);
    setLocationObtained(true);
    if (onLocationObtained) onLocationObtained(loc);
  };

  // ── Real nearby shop data from Google Places API ─────────────────────
  const { shops: realShops, loading: shopsLoading, error: shopsError } =
    useNearbyShops(locationObtained ? customerLocation : null);

  // ── Cart metrics ──────────────────────────────────────────────────────
  const cartProductIds = Object.keys(cart);
  const totalRequestedItemsCount = Object.values(cart).reduce((s, q) => s + q, 0);

  const shopsWithMetrics = realShops.map(shop => {
    let availableCartItems = 0;
    let availableSubtotal = 0;

    cartProductIds.forEach(id => {
      const isUnavailable = (shop.unavailableProductIds || []).includes(id);
      const qty = cart[id];
      const product = KIRANA_PRODUCTS.find(p => p.id === id);
      if (!isUnavailable && product) {
        availableCartItems += qty;
        availableSubtotal += product.price * qty;
      }
    });

    const availabilityPercent =
      cartProductIds.length > 0
        ? Math.round(
            ((cartProductIds.length -
              (shop.unavailableProductIds || []).filter(id => cartProductIds.includes(id)).length) /
              cartProductIds.length) *
              100
          )
        : 100;

    return { ...shop, availableCartItems, availableSubtotal, availabilityPercent };
  });

  const sortedShops = [...shopsWithMetrics].sort((a, b) => {
    if (sortBy === 'availability') return b.availabilityPercent - a.availabilityPercent;
    if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
    if (sortBy === 'rating') {
      const ra = typeof a.rating === 'number' ? a.rating : 0;
      const rb = typeof b.rating === 'number' ? b.rating : 0;
      return rb - ra;
    }
    // recommended: open first, then rating desc
    const score = s =>
      (s.isOpen ? 10 : 0) +
      (typeof s.rating === 'number' ? s.rating : 0);
    return score(b) - score(a);
  });

  const coordLabel = customerLocation
    ? `${customerLocation.lat.toFixed(4)}°N, ${customerLocation.lng.toFixed(4)}°E`
    : '';
  const accuracyLabel =
    customerLocation?.accuracy ? ` · ±${Math.round(customerLocation.accuracy)} m` : '';

  return (
    <div className="flow-container">
      <div className="flow-top-bar">
        <button className="btn-back" onClick={onBackToCart}>
          <ArrowLeft size={16} /> Edit Cart ({totalRequestedItemsCount} items)
        </button>
      </div>

      <div className="flow-header text-left" style={{ marginBottom: '1.25rem' }}>
        <h2>Find a Kirana near you</h2>
        <p className="subtitle" style={{ margin: 0 }}>
          Real nearby shops from Google Maps, sorted by distance from your location.
        </p>
      </div>

      {/* ── Step 1: Get location ────────────────────────────────────────── */}
      {!locationObtained && (
        <LocationFinder onLocationObtained={handleLocationObtained} />
      )}

      {/* ── Step 2: Location confirmed → load shops ─────────────────────── */}
      {locationObtained && customerLocation && (
        <>
          {/* Location bar */}
          <div className="location-confirmed-bar">
            <div className="location-confirmed-left">
              <div className="location-confirmed-dot" />
              <MapPin size={16} color="var(--primary)" />
              <div>
                <span className="location-confirmed-label">📍 Your current location (GPS)</span>
                <strong className="location-confirmed-value">
                  {coordLabel}{accuracyLabel}
                </strong>
              </div>
            </div>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                setLocationObtained(false);
                setCustomerLocation(null);
                if (onLocationObtained) onLocationObtained(null);
              }}
            >
              Change
            </button>
          </div>

          {/* ── Loading state ─────────────────────────────────────────── */}
          {shopsLoading && (
            <div className="shops-loading-state">
              <Loader size={28} className="location-spin-icon" color="var(--primary)" />
              <div>
                <strong>Finding nearby Kirana shops…</strong>
                <p>Searching Google Maps within 2 km of your location</p>
              </div>
            </div>
          )}

          {/* ── API / permission error ────────────────────────────────── */}
          {shopsError && !shopsLoading && (
            <div className="shops-error-state">
              <div className="location-error-card">
                <div className="error-icon-wrap">
                  <AlertCircle size={20} color="#d97706" />
                </div>
                <div className="error-message-content">
                  <h4>Could not load nearby shops</h4>
                  <p>{shopsError}</p>
                </div>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setLocationObtained(false);
                  setCustomerLocation(null);
                  if (onLocationObtained) onLocationObtained(null);
                }}
              >
                <RefreshCw size={15} /> Try Again
              </button>
            </div>
          )}

          {/* ── Results ──────────────────────────────────────────────── */}
          {!shopsLoading && !shopsError && (
            <div className="shops-discovery-layout">
              {/* LEFT: Google Map */}
              <div className="map-panel">
                <GoogleMap
                  shops={sortedShops}
                  customerLocation={customerLocation}
                  selectedShopId={highlightedShopId}
                  onShopMarkerClick={(shop) => {
                    setHighlightedShopId(shop.id);
                    const el = document.getElementById(`shop-card-${shop.id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                />
              </div>

              {/* RIGHT: Shop list */}
              <div className="shops-list-panel">
                {/* Sort bar */}
                <div className="shop-filter-bar">
                  <span className="filter-label">Sort:</span>
                  <div className="sort-buttons-group">
                    {[
                      { key: 'recommended', label: 'Recommended' },
                      { key: 'distance',    label: 'Nearest' },
                      { key: 'rating',      label: 'Top Rated' },
                      { key: 'availability',label: 'Availability' },
                    ].map(opt => (
                      <button
                        key={opt.key}
                        className={`sort-btn ${sortBy === opt.key ? 'active' : ''}`}
                        onClick={() => setSortBy(opt.key)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Result count */}
                {sortedShops.length > 0 && (
                  <p className="shops-result-count">
                    {sortedShops.length} shop{sortedShops.length !== 1 ? 's' : ''} found near you
                  </p>
                )}

                {/* Zero results */}
                {sortedShops.length === 0 && !shopsLoading && (
                  <div className="no-shops-state">
                    <span style={{ fontSize: '2.5rem' }}>🏪</span>
                    <h3>No shops found nearby</h3>
                    <p>No Kirana or grocery stores were found within 2 km of your location.</p>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>
                      Try moving to a different area or check back later.
                    </p>
                  </div>
                )}

                {/* Shop cards */}
                <div className="shop-cards-list">
                  {sortedShops.map(shop => (
                    <div
                      key={shop.id}
                      id={`shop-card-${shop.id}`}
                      className={[
                        'shop-card-item',
                        highlightedShopId === shop.id ? 'shop-card-highlighted' : '',
                        !shop.isOpen ? 'shop-card-closed' : '',
                      ].join(' ')}
                      onMouseEnter={() => setHighlightedShopId(shop.id)}
                      onMouseLeave={() => setHighlightedShopId(null)}
                    >
                      {/* Header */}
                      <div className="shop-card-top">
                        <div className="shop-identity">
                          <div className="shop-logo-box">
                            <span style={{ fontSize: '1.5rem' }}>{shop.shopImageEmoji || '🏪'}</span>
                          </div>
                          <div className="shop-identity-info">
                            <div className="shop-title-row">
                              <h3>{shop.name}</h3>
                            </div>
                            <p className="shop-owner-sub">{shop.address}</p>
                            <div className="shop-quick-meta">
                              <span className={`open-status-pill ${shop.isOpen ? 'open' : 'closed'}`}>
                                {shop.isOpen ? '🟢 Open' : '🔴 Closed'}
                              </span>
                              {shop.openHours && shop.openHours !== 'Open now' && shop.openHours !== 'Closed now' && (
                                <>
                                  <span className="meta-sep">·</span>
                                  <Clock size={12} color="var(--text-light)" />
                                  <span className="meta-text">{shop.openHours}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="shop-rating-distance">
                          {shop.rating !== '—' && (
                            <div className="rating-pill">
                              <Star size={13} fill="#f59e0b" color="#f59e0b" />
                              <span>{shop.rating}</span>
                              {shop.reviewCount > 0 && (
                                <span className="review-count-small">({shop.reviewCount})</span>
                              )}
                            </div>
                          )}
                          <span className="distance-pill">
                            <Navigation size={12} color="var(--primary)" />
                            {shop.distance}
                          </span>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="shop-metrics-row">
                        {cartProductIds.length > 0 && (
                          <div className="shop-metric-item">
                            <Package size={14} color="var(--text-light)" />
                            <div>
                              <span className="metric-value-sm">
                                {shop.availableCartItems}/{totalRequestedItemsCount} items
                              </span>
                              <div className="mini-avail-bar">
                                <div
                                  className="mini-avail-fill"
                                  style={{ width: `${shop.availabilityPercent}%` }}
                                />
                              </div>
                              <span className="metric-sub-label">{shop.availabilityPercent}% available</span>
                            </div>
                          </div>
                        )}
                        <div className="shop-metric-item">
                          <Truck size={14} color="var(--text-light)" />
                          <div>
                            <span className="metric-value-sm">₹{shop.staffDeliveryFee} delivery</span>
                            <span className="metric-sub-label">{shop.estDeliveryTime}</span>
                          </div>
                        </div>
                      </div>

                      {/* Trust reasons */}
                      {shop.trustReasons?.length > 0 && (
                        <div className="why-this-shop-row">
                          <span className="why-label">Why?</span>
                          <div className="trust-reason-tags">
                            {shop.trustReasons.slice(0, 3).map((r, i) => (
                              <span key={i} className="trust-reason-tag">{r}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Source badge */}
                      <div className="shop-source-badge">
                        <span>📍 Real shop · Google Maps verified</span>
                      </div>

                      {/* Actions */}
                      <div className="shop-card-footer">
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => onViewShopDetail(shop)}
                        >
                          <Eye size={15} /> View Shop
                        </button>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => onChooseShop(shop)}
                          disabled={!shop.isOpen}
                        >
                          {shop.isOpen ? 'Select This Shop' : 'Currently Closed'}
                          {shop.isOpen && <ChevronRight size={15} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
