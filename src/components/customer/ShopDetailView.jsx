import React, { useState } from 'react';
import { KIRANA_PRODUCTS } from '../../data/products';
import {
  Star, MapPin, ShieldCheck, CheckCircle2, XCircle, ArrowLeft, Store,
  Info, ArrowRight, Clock, Truck, Package,
  Navigation, Plus, Minus, ShoppingBag
} from 'lucide-react';

const PRODUCT_CATEGORIES = ['All', ...new Set(KIRANA_PRODUCTS.map(p => p.category))];

export default function ShopDetailView({ shop, cart, onChooseShop, onBackToShopList, onUpdateCart }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview | catalog
  const [selectedCategory, setSelectedCategory] = useState('All');

  if (!shop) return null;

  // Guard against missing fields from real Places API shops
  const unavailableIds = Array.isArray(shop.unavailableProductIds) ? shop.unavailableProductIds : [];
  const markerColor = shop.mapMarkerColor || '#104e35';

  const cartEntries = Object.entries(cart)
    .map(([id, qty]) => {
      const product = KIRANA_PRODUCTS.find(p => p.id === id);
      const isUnavailable = unavailableIds.includes(id);
      return product && qty > 0 ? { product, qty, isUnavailable } : null;
    })
    .filter(Boolean);

  const availableEntries = cartEntries.filter(item => !item.isUnavailable);
  const unavailableEntries = cartEntries.filter(item => item.isUnavailable);
  const availableCount = availableEntries.reduce((sum, item) => sum + item.qty, 0);
  const totalCount = cartEntries.reduce((sum, item) => sum + item.qty, 0);
  const estimatedSubtotal = availableEntries.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const totalCartItems = Object.values(cart).reduce((sum, q) => sum + q, 0);

  // Shop catalog: all products with availability
  const shopCatalog = KIRANA_PRODUCTS
    .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
    .map(product => ({
      product,
      inStock: !unavailableIds.includes(product.id),
      qtyInCart: cart[product.id] || 0
    }));

  return (
    <div className="flow-container">
      {/* Back button */}
      <div className="flow-top-bar">
        <button className="btn-back" onClick={onBackToShopList}>
          <ArrowLeft size={16} /> Back to Nearby Shops
        </button>
        {totalCartItems > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={() => onChooseShop(shop)}>
            <ShoppingBag size={15} /> Cart ({totalCartItems}) · Checkout
          </button>
        )}
      </div>

      {/* Shop Profile Header Card */}
      <div className="shop-profile-card">
        <div className="shop-profile-left">
          <div className="shop-avatar-xl" style={{ background: `${markerColor}18`, borderColor: `${markerColor}40` }}>
            <span style={{ fontSize: '2.5rem' }}>{shop.shopImageEmoji || '🏪'}</span>
          </div>
          <div className="shop-profile-info">
            <div className="shop-title-badge-row">
              <h2>{shop.name}</h2>
              <span className={`badge ${shop.badgeType === 'trusted' ? 'badge-primary' : shop.badgeType === 'full_stock' ? 'badge-success' : 'badge-accent'}`}>
                <ShieldCheck size={13} /> {shop.trustBadge || 'Nearby shop'}
              </span>
            </div>
            <div className="shop-profile-meta-row">
              <span className="meta-chip">
                <Star size={13} fill="#f59e0b" color="#f59e0b" />
                <strong>{shop.rating}</strong>
                <span className="meta-chip-sub">({shop.reviewCount} reviews)</span>
              </span>
              <span className="meta-chip">
                <Navigation size={13} color="var(--primary)" />
                {shop.distance}
              </span>
              <span className={`meta-chip ${shop.isOpen ? 'meta-chip-open' : 'meta-chip-closed'}`}>
                {shop.isOpen ? '🟢 Open Now' : '🔴 Closed'}
              </span>
              <span className="meta-chip">
                <Clock size={13} color="var(--text-light)" />
                {shop.openHours}
              </span>
            </div>
            <p className="shop-address-line">
              <MapPin size={13} color="var(--text-light)" style={{ display: 'inline', marginRight: '4px' }} />
              {shop.address}
            </p>
          </div>
        </div>

        <div className="shop-profile-stats">
          <div className="profile-stat-item">
            <strong className="stat-num">{availableCount}</strong>
            <span className="stat-label">of {totalCount} items available</span>
          </div>
          <div className="profile-stat-divider" />
          <div className="profile-stat-item">
            <strong className="stat-num">₹{estimatedSubtotal}</strong>
            <span className="stat-label">est. subtotal</span>
          </div>
          <div className="profile-stat-divider" />
          <div className="profile-stat-item">
            <strong className="stat-num">{shop.estDeliveryTime || '30–50 mins'}</strong>
            <span className="stat-label">delivery time</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="shop-detail-tabs">
        <button
          className={`shop-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <ShieldCheck size={15} /> Cart Availability
        </button>
        <button
          className={`shop-tab-btn ${activeTab === 'catalog' ? 'active' : ''}`}
          onClick={() => setActiveTab('catalog')}
        >
          <Package size={15} /> Shop Catalog
        </button>
      </div>

      {/* Tab: Cart Item Availability */}
      {activeTab === 'overview' && (
        <div className="shop-overview-tab">
          {/* Trust Connection Banner */}
          <div className="trust-connection-banner">
            <div className="trust-banner-icon">
              <ShieldCheck size={22} color="var(--primary)" />
            </div>
            <div className="trust-banner-content">
              {shop.hasPreviousRelationship ? (
                <>
                  <h4>Your Trusted Local Shop</h4>
                  <p>You have ordered from {shop.name} before. This is a verified neighborhood store partner.</p>
                </>
              ) : (
                <>
                  <h4>{shop.trustBadge}</h4>
                  <p>{shop.trustSubtitle}</p>
                </>
              )}
              <div className="trust-reasons-inline">
                {shop.trustReasons?.map((reason, i) => (
                  <span key={i} className="trust-tag-inline">{reason}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery Options */}
          <div className="shop-delivery-info-card">
            <h4 className="delivery-info-title">Delivery Options from this Shop</h4>
            <div className="delivery-info-row">
              <div className="delivery-info-item">
                <div className="delivery-info-icon">👤</div>
                <div>
                  <strong>Shop Staff Delivery</strong>
                  <span>₹{shop.staffDeliveryFee} · {shop.estDeliveryTime}</span>
                </div>
              </div>
              <div className="delivery-info-item">
                <div className="delivery-info-icon"><Truck size={18} color="var(--primary)" /></div>
                <div>
                  <strong>Delivery Partner</strong>
                  <span>₹{shop.partnerDeliveryFee} · 30–45 mins</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Availability Check */}
          {cartEntries.length > 0 ? (
            <div className="item-availability-breakdown-card">
              <div className="breakdown-header">
                <h3>Your Cart Items — Stock Check</h3>
                <span className="badge badge-neutral">{availableEntries.length}/{cartEntries.length} available</span>
              </div>

              <div className="item-stock-list">
                {cartEntries.map(({ product, qty, isUnavailable }) => (
                  <div key={product.id} className={`stock-item-row ${isUnavailable ? 'item-out-of-stock' : 'item-in-stock'}`}>
                    <div className="stock-item-left">
                      <span className="stock-icon">{product.imageIcon}</span>
                      <div>
                        <strong>{product.name}</strong>
                        <span className="stock-brand">{product.brand} · {product.unitSize}</span>
                      </div>
                    </div>
                    <div className="stock-item-right">
                      <span className="qty-tag">×{qty}</span>
                      {!isUnavailable ? (
                        <div className="status-badge-wrap status-available">
                          <CheckCircle2 size={15} />
                          <span>Available</span>
                          <strong className="price-tag">₹{product.price * qty}</strong>
                        </div>
                      ) : (
                        <div className="status-badge-wrap status-unavailable">
                          <XCircle size={15} />
                          <span>Unavailable</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {unavailableEntries.length > 0 && (
                <div className="alert-box alert-warning mt-4">
                  <Info size={15} />
                  <span>
                    {unavailableEntries.length} item(s) are out of stock at this shop and won't be included in the order.
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-cart-note">
              <Package size={32} color="var(--text-light)" />
              <p>No items in your cart yet. Browse the shop catalog to add items.</p>
              <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('catalog')}>
                Browse Catalog
              </button>
            </div>
          )}

          {/* Reviews Snapshot */}
          <div className="shop-reviews-snapshot">
            <h4>Customer Ratings</h4>
            <div className="reviews-stars-row">
              {[5, 4, 3, 2, 1].map(star => {
                const pct = star === 5 ? 62 : star === 4 ? 24 : star === 3 ? 9 : star === 2 ? 3 : 2;
                return (
                  <div key={star} className="star-bar-row">
                    <span className="star-bar-label">{star}★</span>
                    <div className="star-bar-track">
                      <div className="star-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="star-bar-pct">{pct}%</span>
                  </div>
                );
              })}
            </div>
            <div className="review-quotes">
              <div className="review-quote-item">
                <div className="review-stars-row">{'★★★★★'}</div>
                <p>"Fresh stock always available, owner is very helpful."</p>
                <span className="reviewer-name">— Anjali M., Regular Customer</span>
              </div>
              <div className="review-quote-item">
                <div className="review-stars-row">{'★★★★★'}</div>
                <p>"Fast delivery and accurate orders every time."</p>
                <span className="reviewer-name">— Rajesh K., 8 orders</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Shop Product Catalog */}
      {activeTab === 'catalog' && (
        <div className="shop-catalog-tab">
          <div className="catalog-shopping-from-banner">
            <Store size={16} color="var(--primary)" />
            <span>Shopping from: <strong>{shop.name}</strong></span>
            {totalCartItems > 0 && (
              <span className="catalog-cart-count">{totalCartItems} in cart</span>
            )}
          </div>

          {/* Category Filter */}
          <div className="catalog-category-filters">
            {PRODUCT_CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="shop-catalog-grid">
            {shopCatalog.map(({ product, inStock, qtyInCart }) => (
              <div
                key={product.id}
                className={`shop-catalog-product-card ${qtyInCart > 0 ? 'in-cart' : ''} ${!inStock ? 'out-of-stock-card' : ''}`}
              >
                {!inStock && (
                  <div className="out-of-stock-overlay">
                    <span>Out of Stock</span>
                  </div>
                )}
                <div className="catalog-product-icon">{product.imageIcon}</div>
                <span className="catalog-product-cat">{product.category}</span>
                <h4 className="catalog-product-name">{product.name}</h4>
                <p className="catalog-product-brand">{product.brand}</p>
                <div className="catalog-product-bottom">
                  <div className="catalog-price-unit">
                    <strong>₹{product.price}</strong>
                    <span>{product.unitSize}</span>
                  </div>
                  {inStock ? (
                    qtyInCart === 0 ? (
                      <button
                        className="btn btn-primary btn-sm catalog-add-btn"
                        onClick={() => onUpdateCart && onUpdateCart(product.id, 1)}
                      >
                        <Plus size={14} /> Add
                      </button>
                    ) : (
                      <div className="qty-control-box">
                        <button
                          className="qty-btn"
                          onClick={() => onUpdateCart && onUpdateCart(product.id, qtyInCart - 1)}
                        >
                          <Minus size={13} />
                        </button>
                        <span className="qty-count">{qtyInCart}</span>
                        <button
                          className="qty-btn"
                          onClick={() => onUpdateCart && onUpdateCart(product.id, qtyInCart + 1)}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    )
                  ) : (
                    <span className="out-of-stock-label">Not available</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sticky Footer Action Bar */}
      <div className="shop-detail-footer-bar">
        <div className="footer-bar-summary">
          <span className="footer-bar-avail">
            {cartEntries.length > 0
              ? `${availableCount} of ${totalCount} cart items available`
              : `${shop.totalCatalogCount}+ products in catalog`}
          </span>
          {estimatedSubtotal > 0 && (
            <strong className="footer-bar-total">Est. ₹{estimatedSubtotal}</strong>
          )}
        </div>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => onChooseShop(shop)}
          disabled={!shop.isOpen}
        >
          {shop.isOpen ? 'Select This Shop' : 'Shop is Closed'}
          {shop.isOpen && <ArrowRight size={17} />}
        </button>
      </div>
    </div>
  );
}
