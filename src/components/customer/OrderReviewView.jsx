import React from 'react';
import { KIRANA_PRODUCTS } from '../../data/products';
import { MapPin, Store, Star, ArrowLeft, ArrowRight, XCircle, ShieldCheck, Navigation } from 'lucide-react';

export default function OrderReviewView({ shop, cart, customerLocation, onProceedToDelivery, onBackToShopDetail }) {
  if (!shop) return null;

  // Guard: real shops from Places API always have this as [], but be safe
  const unavailableIds = Array.isArray(shop.unavailableProductIds) ? shop.unavailableProductIds : [];

  const cartEntries = Object.entries(cart)
    .map(([id, qty]) => {
      const product = KIRANA_PRODUCTS.find(p => p.id === id);
      const isUnavailable = unavailableIds.includes(id);
      return product && qty > 0 ? { product, qty, isUnavailable } : null;
    })
    .filter(Boolean);

  const availableEntries = cartEntries.filter(item => !item.isUnavailable);
  const unavailableEntries = cartEntries.filter(item => item.isUnavailable);
  const subtotal = availableEntries.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  // Build GPS-based delivery label — no hardcoded city
  const hasLocation = Boolean(customerLocation?.lat && customerLocation?.lng);
  const coordString = hasLocation
    ? `${customerLocation.lat.toFixed(5)}°N, ${customerLocation.lng.toFixed(5)}°E`
    : null;
  const accuracyString = hasLocation && customerLocation.accuracy
    ? ` · ±${Math.round(customerLocation.accuracy)} m accuracy`
    : '';

  return (
    <div className="flow-container">
      <div className="flow-top-bar">
        <button className="btn-back" onClick={onBackToShopDetail}>
          <ArrowLeft size={16} /> Back to Shop Details
        </button>
      </div>

      <div className="flow-header text-left" style={{ marginBottom: '1.5rem' }}>
        <h2>Review Your Order</h2>
        <p className="subtitle" style={{ margin: 0 }}>
          Verify your delivery location, selected shop, and order items before placing.
        </p>
      </div>

      <div className="review-layout-grid">
        <div className="review-main-col">

          {/* ── Delivery Location ─────────────────────────────── */}
          <div className="review-card">
            <div className="card-section-title">
              <MapPin size={18} color="var(--primary)" />
              <h3>Delivery Location</h3>
            </div>
            <div className="location-box-inner">
              {hasLocation ? (
                <>
                  <div className="location-gps-note">
                    <Navigation size={14} color="var(--primary)" />
                    <strong>📍 Your detected GPS location</strong>
                  </div>
                  <p className="gps-coord-display">
                    {coordString}{accuracyString}
                  </p>
                  <p className="gps-note-sub">
                    The shop will deliver to your current GPS coordinates.
                  </p>
                </>
              ) : (
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  No location detected. Please go back and allow location access.
                </p>
              )}
            </div>
          </div>

          {/* ── Selected Shop ─────────────────────────────────── */}
          <div className="review-card">
            <div className="card-section-title">
              <Store size={18} color="var(--primary)" />
              <h3>Selected Kirana Shop</h3>
            </div>
            <div className="shop-box-inner">
              <div className="shop-inner-left">
                <div className="shop-avatar-sm">
                  <Store size={22} color="var(--primary)" />
                </div>
                <div>
                  <h4>{shop.name}</h4>
                  <p>
                    {shop.rating && shop.rating !== '—' && (
                      <Star size={12} fill="#f59e0b" color="#f59e0b" style={{ display: 'inline', marginRight: 3 }} />
                    )}
                    {shop.rating !== '—' ? `${shop.rating} · ` : ''}
                    {shop.distance}
                    {shop.ownerName ? ` · ${shop.ownerName}` : ''}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '2px' }}>
                    {shop.address}
                  </p>
                </div>
              </div>
              {shop.trustBadge && (
                <span className="badge badge-primary">
                  <ShieldCheck size={12} /> {shop.trustBadge}
                </span>
              )}
            </div>
          </div>

          {/* ── Order Items ───────────────────────────────────── */}
          <div className="review-card">
            <div className="card-section-title">
              <h3>Order Items ({availableEntries.length} available)</h3>
            </div>
            <div className="review-items-list">
              {cartEntries.map(({ product, qty, isUnavailable }) => (
                <div key={product.id} className={`review-item-row ${isUnavailable ? 'item-out-of-stock' : ''}`}>
                  <div className="review-item-name">
                    <span>{product.imageIcon}</span>
                    <div>
                      <strong>{product.name}</strong>
                      <span className="unit-sub">{product.unitSize}</span>
                    </div>
                  </div>
                  <div className="review-item-status">
                    {!isUnavailable ? (
                      <>
                        <span className="qty-pill">×{qty}</span>
                        <strong className="item-subtotal">₹{product.price * qty}</strong>
                      </>
                    ) : (
                      <span className="status-badge-wrap status-unavailable" style={{ padding: '0.2rem 0.5rem' }}>
                        <XCircle size={14} /> Unavailable
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Price Summary ─────────────────────────────────────── */}
        <div className="review-side-col">
          <div className="summary-card">
            <h3>Price Details</h3>
            <div className="summary-row">
              <span>Items Subtotal ({availableEntries.length} items)</span>
              <strong>₹{subtotal}</strong>
            </div>
            {unavailableEntries.length > 0 && (
              <div className="summary-row" style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                <span>{unavailableEntries.length} item(s) unavailable</span>
                <span>Not included</span>
              </div>
            )}
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span style={{ color: 'var(--text-light)' }}>Calculated next</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-row total-row">
              <span>Est. Subtotal</span>
              <span className="total-amount">₹{subtotal}</span>
            </div>
            <button
              className="btn btn-primary btn-lg btn-full mt-4"
              onClick={onProceedToDelivery}
            >
              Choose Delivery
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
