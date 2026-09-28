import React from 'react';
import { KIRANA_PRODUCTS } from '../../data/products';
import { Star, MapPin, ShieldCheck, CheckCircle2, XCircle, ArrowLeft, Store, Info, ArrowRight } from 'lucide-react';

export default function ShopDetailView({ shop, cart, onChooseShop, onBackToShopList }) {
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

  const availableCount = availableEntries.reduce((sum, item) => sum + item.qty, 0);
  const totalCount = cartEntries.reduce((sum, item) => sum + item.qty, 0);
  
  const estimatedSubtotal = availableEntries.reduce((sum, item) => sum + (item.product.price * item.qty), 0);

  return (
    <div className="flow-container">
      {/* Back button */}
      <div className="flow-top-bar">
        <button className="btn-back" onClick={onBackToShopList}>
          <ArrowLeft size={16} /> Back to Nearby Shops List
        </button>
      </div>

      {/* Shop Detail Card Header */}
      <div className="shop-detail-header-card">
        <div className="shop-header-left">
          <div className="shop-avatar-large">
            <Store size={32} color="var(--primary)" />
          </div>
          <div>
            <div className="shop-title-wrap-detail">
              <h2>{shop.name}</h2>
              <span className={`badge ${shop.badgeType === 'trusted' ? 'badge-primary' : 'badge-accent'}`}>
                <ShieldCheck size={14} /> {shop.trustBadge}
              </span>
            </div>
            <p className="shop-meta-line">
              <Star size={14} fill="#f59e0b" color="#f59e0b" style={{ display: 'inline', marginRight: '4px' }} />
              <strong>{shop.rating}</strong> ({shop.reviewCount} reviews) • 
              <MapPin size={14} style={{ display: 'inline', margin: '0 4px 0 8px' }} />
              {shop.distance} • Owner: {shop.ownerName}
            </p>
            <p className="shop-address-text">{shop.address}</p>
          </div>
        </div>

        <div className="shop-header-right">
          <div className="availability-summary-badge">
            <strong className="avail-number">{availableCount} of {totalCount}</strong>
            <span className="avail-label">Requested items available in stock</span>
          </div>
        </div>
      </div>

      {/* Step 4: Trust Connection Banner */}
      <div className="trust-connection-banner">
        <div className="trust-banner-icon">
          <ShieldCheck size={24} color="var(--primary)" />
        </div>
        <div className="trust-banner-content">
          {shop.hasPreviousRelationship ? (
            <>
              <h4>Your Trusted Local Shop</h4>
              <p>You have ordered 6 times from {shop.name}. Verified neighborhood store partner.</p>
            </>
          ) : (
            <>
              <h4>Nearby Trusted-Rated Shop</h4>
              <p>Top neighborhood shop rated {shop.rating} stars by verified local customers nearby.</p>
            </>
          )}
          <span className="trust-ui-note">
            KiranaSetu connects you with local shops you may already trust or evaluate through live inventory & ratings.
          </span>
        </div>
      </div>

      {/* Cart Items Availability Breakdown List */}
      <div className="item-availability-breakdown-card">
        <div className="breakdown-header">
          <h3>Your Requested Grocery Items Stock Check</h3>
          <span className="badge badge-neutral">Cart Inventory Audit</span>
        </div>

        <div className="item-stock-list">
          {cartEntries.map(({ product, qty, isUnavailable }) => (
            <div key={product.id} className={`stock-item-row ${isUnavailable ? 'item-out-of-stock' : 'item-in-stock'}`}>
              <div className="stock-item-left">
                <span className="stock-icon">{product.imageIcon}</span>
                <div>
                  <strong>{product.name}</strong>
                  <span className="stock-brand">{product.brand} • {product.unitSize}</span>
                </div>
              </div>

              <div className="stock-item-right">
                <span className="qty-tag">x{qty}</span>
                
                {!isUnavailable ? (
                  <div className="status-badge-wrap status-available">
                    <CheckCircle2 size={16} />
                    <span>Available</span>
                    <strong className="price-tag">₹{product.price * qty}</strong>
                  </div>
                ) : (
                  <div className="status-badge-wrap status-unavailable">
                    <XCircle size={16} />
                    <span>Unavailable</span>
                    <strong className="price-tag text-muted">₹0</strong>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Unavailable items note */}
        {unavailableEntries.length > 0 && (
          <div className="alert-box alert-warning mt-4">
            <Info size={16} />
            <span>
              {unavailableEntries.length} item(s) are currently unavailable at this store and will not be included in the order total.
            </span>
          </div>
        )}

        {/* Total & Action Bar */}
        <div className="shop-detail-footer-bar">
          <div className="total-calculation-box">
            <span>Estimated Total (For Available Items):</span>
            <strong className="total-price-large">₹{estimatedSubtotal}</strong>
          </div>

          <button 
            className="btn btn-primary btn-lg"
            onClick={() => onChooseShop(shop)}
          >
            Choose This Shop
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
