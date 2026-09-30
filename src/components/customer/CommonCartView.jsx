import React from 'react';
import { KIRANA_PRODUCTS } from '../../data/products';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, Store, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';

export default function CommonCartView({ cart, selectedShop, onUpdateQuantity, onRemoveItem, onFindShops, onBackToMethods }) {
  // Map cart IDs to actual product objects with quantity
  const cartEntries = Object.entries(cart)
    .map(([id, qty]) => {
      const product = KIRANA_PRODUCTS.find(p => p.id === id);
      return product && qty > 0 ? { product, qty } : null;
    })
    .filter(Boolean);

  const totalItemsCount = cartEntries.reduce((sum, item) => sum + item.qty, 0);
  const estimatedSubtotal = cartEntries.reduce((sum, item) => sum + (item.product.price * item.qty), 0);

  return (
    <div className="flow-container">
      <div className="flow-top-bar">
        <button className="btn-back" onClick={onBackToMethods}>
          <ArrowLeft size={16} /> Back to Grocery List Options
        </button>
        <div className="flow-title-wrap">
          <h2>Your Unified Grocery Cart</h2>
          <p>Review items added from manual selection or AI photo scan.</p>
        </div>
      </div>

      {cartEntries.length === 0 ? (
        <div className="empty-cart-card text-center">
          <div className="empty-icon-circle">
            <ShoppingBag size={48} color="var(--text-light)" />
          </div>
          <h3>Your cart is empty</h3>
          <p>Add products manually or scan your paper grocery list to continue.</p>
          <button className="btn btn-primary mt-4" onClick={onBackToMethods}>
            Create Grocery List
          </button>
        </div>
      ) : (
        <div className="cart-layout-grid">
          {/* Cart Items List */}
          <div className="cart-items-section">
            <div className="cart-section-header">
              <h3>Cart Items ({totalItemsCount})</h3>
              <span className="badge badge-primary">Unified Cart</span>
            </div>

            <div className="cart-items-list">
              {cartEntries.map(({ product, qty }) => (
                <div key={product.id} className="cart-item-row">
                  <div className="item-icon-box">
                    <span>{product.imageIcon}</span>
                  </div>

                  <div className="item-info">
                    <h4>{product.name}</h4>
                    <p className="item-meta">{product.brand} • {product.unitSize}</p>
                    <span className="item-price-unit">₹{product.price} each</span>
                  </div>

                  {/* Quantity Control as specified: [ - ] qty [ + ] */}
                  <div className="cart-qty-wrapper">
                    <div className="qty-control-box">
                      <button 
                        className="qty-btn"
                        onClick={() => onUpdateQuantity(product.id, qty - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="qty-count">{qty}</span>
                      <button 
                        className="qty-btn"
                        onClick={() => onUpdateQuantity(product.id, qty + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <span className="item-total-price">₹{product.price * qty}</span>

                    <button 
                      className="btn-remove"
                      onClick={() => onRemoveItem(product.id)}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary & CTA Panel */}
          <div className="cart-summary-panel">
            <div className="summary-card">
              {/* Selected shop banner */}
              {selectedShop && (
                <div className="cart-selected-shop-banner">
                  <Store size={15} color="var(--primary)" />
                  <div>
                    <span className="cart-shop-banner-label">Shopping from:</span>
                    <strong className="cart-shop-banner-name">{selectedShop.name}</strong>
                  </div>
                  <ShieldCheck size={14} color="var(--primary)" />
                </div>
              )}
              <h3>Order Summary</h3>

              <div className="summary-row">
                <span>Total Items</span>
                <strong>{totalItemsCount} items</strong>
              </div>

              <div className="summary-row">
                <span>Estimated Items Cost</span>
                <strong>₹{estimatedSubtotal}</strong>
              </div>

              <div className="summary-row text-muted" style={{ fontSize: '0.85rem' }}>
                <span>Delivery Charge</span>
                <span>Calculated by Kirana Shop</span>
              </div>

              <div className="summary-divider" />

              <div className="summary-row total-row">
                <span>Estimated Total</span>
                <span className="total-amount">₹{estimatedSubtotal}</span>
              </div>

              <div className="cart-trust-note">
                <Store size={16} color="var(--primary)" />
                <span>Final stock & price will be matched against nearby shop live inventory.</span>
              </div>

              <button 
                className="btn btn-primary btn-lg btn-full mt-4"
                onClick={onFindShops}
              >
                Find Nearby Kirana Shops
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
