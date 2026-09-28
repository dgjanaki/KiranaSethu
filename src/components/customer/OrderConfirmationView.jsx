import React from 'react';
import { CheckCircle2, Store, MapPin, Truck, Clock, ArrowRight, RefreshCw, Home } from 'lucide-react';
import { KIRANA_PRODUCTS } from '../../data/products';

export default function OrderConfirmationView({ selectedShop, cart, onStartNewOrder, onBackToHome }) {
  const cartEntries = Object.entries(cart)
    .map(([id, qty]) => {
      const product = KIRANA_PRODUCTS.find(p => p.id === id);
      return product && qty > 0 ? { product, qty } : null;
    })
    .filter(Boolean);

  const totalItems = cartEntries.reduce((sum, item) => sum + item.qty, 0);
  const estimatedTotal = cartEntries.reduce((sum, item) => sum + (item.product.price * item.qty), 0);

  return (
    <div className="flow-container">
      <div className="order-confirmed-card text-center">
        <div className="confirmed-icon-wrap">
          <CheckCircle2 size={48} color="var(--primary)" />
        </div>

        <span className="badge badge-primary mb-2">Order Sent to Shop</span>
        <h2>Grocery List Sent to {selectedShop?.name}!</h2>
        <p className="subtitle">
          Your neighborhood Kirana shop has received your grocery list. Shop staff are preparing your items for delivery.
        </p>

        {/* Selected Shop Banner */}
        <div className="confirmed-shop-box">
          <div className="shop-box-info">
            <div className="shop-avatar-sm">
              <Store size={22} color="var(--primary)" />
            </div>
            <div className="text-left">
              <h4>{selectedShop?.name}</h4>
              <p><MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} /> {selectedShop?.distance} away • {selectedShop?.address}</p>
            </div>
          </div>
          <div className="delivery-mode-pill">
            <Truck size={14} color="var(--primary)" />
            <span>{selectedShop?.deliveryMode}</span>
          </div>
        </div>

        {/* Order Details List */}
        <div className="confirmed-items-summary text-left">
          <h4>Order Items Summary ({totalItems} items)</h4>
          <div className="summary-items-list">
            {cartEntries.map(({ product, qty }) => (
              <div key={product.id} className="summary-item-row">
                <span>{product.imageIcon} {product.name} ({product.unitSize})</span>
                <span>x{qty} • ₹{product.price * qty}</span>
              </div>
            ))}
          </div>

          <div className="summary-total-footer">
            <span>Estimated Total:</span>
            <strong>₹{estimatedTotal}</strong>
          </div>
        </div>

        <div className="confirmed-actions">
          <button className="btn btn-primary btn-lg" onClick={onStartNewOrder}>
            <RefreshCw size={18} />
            Start New Grocery List
          </button>
          
          <button className="btn btn-outline btn-lg" onClick={onBackToHome}>
            <Home size={18} />
            Back to KiranaSetu Home
          </button>
        </div>
      </div>
    </div>
  );
}
