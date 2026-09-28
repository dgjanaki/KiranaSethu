import React, { useState } from 'react';
import { NEARBY_KIRANA_SHOPS, DEMO_DELIVERY_LOCATION } from '../../data/shops';
import { KIRANA_PRODUCTS } from '../../data/products';
import { MapPin, Star, ShieldCheck, Store, ArrowLeft, Info, CheckCircle2, ChevronRight, Eye } from 'lucide-react';

export default function ShopSelectionView({ cart, onViewShopDetail, onChooseShop, onBackToCart }) {
  const [sortBy, setSortBy] = useState('recommended');

  const cartProductIds = Object.keys(cart);
  const totalRequestedItemsCount = Object.values(cart).reduce((sum, q) => sum + q, 0);

  // Calculate shop metrics dynamically against actual customer cart items
  const shopsWithDynamicMetrics = NEARBY_KIRANA_SHOPS.map(shop => {
    let availableCartItems = 0;
    let availableSubtotal = 0;

    cartProductIds.forEach(id => {
      const isUnavailable = shop.unavailableProductIds.includes(id);
      const qty = cart[id];
      const product = KIRANA_PRODUCTS.find(p => p.id === id);
      if (!isUnavailable && product) {
        availableCartItems += qty;
        availableSubtotal += product.price * qty;
      }
    });

    const availabilityPercent = cartProductIds.length > 0 
      ? Math.round(((cartProductIds.length - shop.unavailableProductIds.filter(id => cartProductIds.includes(id)).length) / cartProductIds.length) * 100)
      : 100;

    return {
      ...shop,
      availableCartItems,
      availableSubtotal,
      availabilityPercent
    };
  });

  const sortedShops = [...shopsWithDynamicMetrics].sort((a, b) => {
    if (sortBy === 'availability') return b.availabilityPercent - a.availabilityPercent;
    if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="flow-container">
      {/* Top Header Navigation */}
      <div className="flow-top-bar">
        <button className="btn-back" onClick={onBackToCart}>
          <ArrowLeft size={16} /> Edit Cart ({totalRequestedItemsCount} items)
        </button>
      </div>

      {/* Page Title & Subtitle as specified */}
      <div className="flow-header text-left" style={{ marginBottom: '1.5rem' }}>
        <h2>Find a Kirana you trust</h2>
        <p className="subtitle" style={{ margin: 0 }}>
          Choose a nearby shop based on availability, distance, ratings and trust.
        </p>
      </div>

      {/* Delivery Location Indicator Bar */}
      <div className="location-indicator-bar">
        <div className="location-info">
          <MapPin size={18} color="var(--primary)" />
          <div>
            <span className="location-label">Your Delivery Location</span>
            <strong>{DEMO_DELIVERY_LOCATION.address}, {DEMO_DELIVERY_LOCATION.city}</strong>
          </div>
        </div>
        <span className="location-tag">Demo Location</span>
      </div>

      {/* Trust Prototype Explanation Banner */}
      <div className="alert-box alert-info mb-4">
        <Info size={16} color="var(--primary)" />
        <span>
          <strong>Prototype Note:</strong> Trust badges represent existing customer shop relationships & verified local community feedback.
        </span>
      </div>

      {/* Sort Filter Pills */}
      <div className="shop-filter-bar mb-4">
        <span className="filter-label">Sort By:</span>
        <div className="sort-buttons-group">
          <button 
            className={`sort-btn ${sortBy === 'recommended' ? 'active' : ''}`}
            onClick={() => setSortBy('recommended')}
          >
            Recommended
          </button>
          <button 
            className={`sort-btn ${sortBy === 'availability' ? 'active' : ''}`}
            onClick={() => setSortBy('availability')}
          >
            Highest Availability
          </button>
          <button 
            className={`sort-btn ${sortBy === 'distance' ? 'active' : ''}`}
            onClick={() => setSortBy('distance')}
          >
            Nearest Distance
          </button>
          <button 
            className={`sort-btn ${sortBy === 'rating' ? 'active' : ''}`}
            onClick={() => setSortBy('rating')}
          >
            Top Rated
          </button>
        </div>
      </div>

      {/* Shops List */}
      <div className="shop-cards-list">
        {sortedShops.map(shop => (
          <div key={shop.id} className="shop-card-item">
            <div className="shop-card-top">
              <div className="shop-identity">
                <div className="shop-logo-box">
                  <Store size={26} color="var(--primary)" />
                </div>
                <div>
                  <div className="shop-title-row">
                    <h3>{shop.name}</h3>
                    {shop.trustBadge && (
                      <span className={`badge ${shop.badgeType === 'trusted' ? 'badge-primary' : 'badge-accent'}`}>
                        <ShieldCheck size={12} /> {shop.trustBadge}
                      </span>
                    )}
                  </div>
                  <p className="shop-owner-sub">Owner: {shop.ownerName} • {shop.address}</p>
                </div>
              </div>

              <div className="shop-rating-box">
                <div className="rating-pill">
                  <Star size={14} fill="#f59e0b" color="#f59e0b" />
                  <span>{shop.rating}</span>
                </div>
                <span className="review-count">{shop.distance}</span>
              </div>
            </div>

            <div className="shop-details-grid">
              {/* Product availability indicator */}
              <div className="shop-detail-col">
                <span className="detail-label">Cart Availability</span>
                <span className="detail-value text-primary-dark">
                  <strong>{shop.availableCartItems}/{totalRequestedItemsCount}</strong> items in stock
                </span>
                <div className="mini-progress-track">
                  <div 
                    className="mini-progress-fill" 
                    style={{ width: `${shop.availabilityPercent}%` }} 
                  />
                </div>
              </div>

              {/* Estimated Order Total */}
              <div className="shop-detail-col">
                <span className="detail-label">Est. Order Subtotal</span>
                <span className="detail-value">
                  ₹{shop.availableSubtotal}
                </span>
                <span className="detail-sub text-muted">For available items</span>
              </div>

              {/* Trust Relationship */}
              <div className="shop-detail-col">
                <span className="detail-label">Trust Relationship</span>
                <span className="detail-value text-primary">
                  <ShieldCheck size={14} /> {shop.trustBadge}
                </span>
                <span className="detail-sub text-muted">{shop.trustSubtitle}</span>
              </div>
            </div>

            <div className="shop-card-footer">
              <p className="shop-desc">{shop.description}</p>
              
              <div className="shop-action-buttons">
                <button 
                  className="btn btn-outline"
                  onClick={() => onViewShopDetail(shop)}
                >
                  <Eye size={16} />
                  View Shop
                </button>

                <button 
                  className="btn btn-primary"
                  onClick={() => onChooseShop(shop)}
                >
                  Choose This Shop
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
