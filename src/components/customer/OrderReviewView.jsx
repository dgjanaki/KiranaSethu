import React from 'react';
import { KIRANA_PRODUCTS } from '../../data/products';
import { DEMO_DELIVERY_LOCATION } from '../../data/shops';
import { MapPin, Store, Star, ArrowLeft, ArrowRight, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

export default function OrderReviewView({ shop, cart, onProceedToDelivery, onBackToShopDetail }) {
  if (!shop) return null;

  const cartEntries = Object.entries(cart)
    .map(([id, qty]) => {
      const product = KIRANA_PRODUCTS.find(p => p.id === id);
      const isUnavailable = shop.unavailableProductIds.includes(id);
      return product && qty > 0 ? { product, qty, isUnavailable } : null;
    })
    .filter(Boolean);

  const availableEntries = cartEntries.filter(item => !item.isUnavailable);
  const unavailableEntries = cartEntries.filter(item => item.isUnavailable);

  const subtotal = availableEntries.reduce((sum, item) => sum + (item.product.price * item.qty), 0);

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
          Verify your delivery address, selected shop items, and order breakdown.
        </p>
      </div>

      <div className="review-layout-grid">
        <div className="review-main-col">
          {/* Delivery Location Section */}
          <div className="review-card">
            <div className="card-section-title">
              <MapPin size={18} color="var(--primary)" />
              <h3>Delivery Location</h3>
            </div>
            <div className="location-box-inner">
              <strong>{DEMO_DELIVERY_LOCATION.label}</strong>
              <p>{DEMO_DELIVERY_LOCATION.address}, {DEMO_DELIVERY_LOCATION.city}</p>
            </div>
          </div>

          {/* Selected Shop Section */}
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
                  <p><Star size={12} fill="#f59e0b" color="#f59e0b" style={{ display: 'inline' }} /> {shop.rating} • {shop.distance} • Owner: {shop.ownerName}</p>
                </div>
              </div>
              <span className="badge badge-primary">
                <ShieldCheck size={12} /> {shop.trustBadge}
              </span>
            </div>
          </div>

          {/* Order Items List */}
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
                        <span className="qty-pill">x{qty}</span>
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

        {/* Pricing Summary Side Column */}
        <div className="review-side-col">
          <div className="summary-card">
            <h3>Price Details</h3>

            <div className="summary-row">
              <span>Items Subtotal ({availableEntries.length} items)</span>
              <strong>₹{subtotal}</strong>
            </div>

            {unavailableEntries.length > 0 && (
              <div className="summary-row text-muted" style={{ fontSize: '0.825rem' }}>
                <span>{unavailableEntries.length} Unavailable Item(s)</span>
                <span>Exclusion Applied</span>
              </div>
            )}

            <div className="summary-row">
              <span>Est. Delivery Fee</span>
              <span>Calculated at next step</span>
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
