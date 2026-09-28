import React, { useState, useEffect } from 'react';
import { CheckCircle2, Store, MapPin, Truck, Clock, RefreshCw, Home, ArrowDown, ArrowUp, ChevronRight } from 'lucide-react';
import { KIRANA_PRODUCTS } from '../../data/products';
import { subscribeToDatabaseChanges, isSupabaseConfigured } from '../../lib/supabase';

const TIMELINE_STEPS = [
  { id: 'NEW', title: 'Order Placed', desc: 'Sent directly to shop portal', icon: CheckCircle2 },
  { id: 'ACCEPTED', title: 'Shop Accepted', desc: 'Shop owner confirmed stock', icon: Store },
  { id: 'PREPARING', title: 'Preparing Order', desc: 'Shop staff packing items', icon: Clock },
  { id: 'READY', title: 'Ready for Delivery', desc: 'Packed & waiting for dispatch', icon: CheckCircle2 },
  { id: 'OUT_FOR_DELIVERY', title: 'Out for Delivery', desc: 'Fulfillment agent en route', icon: Truck },
  { id: 'DELIVERED', title: 'Delivered', desc: 'Handed over at your doorstep', icon: CheckCircle2 }
];

export default function OrderTrackingView({ shop, orderDetails, cart, onStartNewOrder, onBackToHome }) {
  const [liveOrder, setLiveOrder] = useState(null);

  // Subscribe to real-time database changes from Supabase
  useEffect(() => {
    const unsubscribe = subscribeToDatabaseChanges((dbRecord) => {
      setLiveOrder(dbRecord);
    });
    return () => unsubscribe();
  }, []);

  const currentStatus = liveOrder?.status || 'NEW';
  
  // Map database status string to step index (0 to 5)
  const statusIndexMap = {
    'NEW': 0,
    'ACCEPTED': 1,
    'PREPARING': 2,
    'READY': 3,
    'OUT_FOR_DELIVERY': 4,
    'DISPATCHED': 4,
    'DELIVERED': 5
  };

  const currentStepIndex = statusIndexMap[currentStatus] ?? 0;

  const cartEntries = Object.entries(cart)
    .map(([id, qty]) => {
      const product = KIRANA_PRODUCTS.find(p => p.id === id);
      const isUnavailable = shop?.unavailableProductIds?.includes(id);
      return product && qty > 0 && !isUnavailable ? { product, qty } : null;
    })
    .filter(Boolean);

  const totalItems = cartEntries.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="flow-container">
      <div className="order-confirmed-card text-center">
        {/* Success Icon */}
        <div className="confirmed-icon-wrap">
          <CheckCircle2 size={48} color="var(--primary)" />
        </div>

        <span className="badge badge-primary mb-2">
          {isSupabaseConfigured ? 'Supabase Realtime Sync' : 'Live Sync Connected'}
        </span>
        <h2>Order Placed Successfully ✓</h2>
        <p className="subtitle" style={{ marginBottom: '1.5rem' }}>
          Your order has been sent to <strong>{shop?.name || liveOrder?.shop_name || 'Sharma Kirana'}</strong>.
        </p>

        {/* Order Details Pills */}
        <div className="order-meta-pills-bar">
          <div className="meta-pill">
            <span className="meta-pill-label">Order Number</span>
            <strong>#{liveOrder?.order_code || 'KS1001'}</strong>
          </div>
          <div className="meta-pill">
            <span className="meta-pill-label">Selected Shop</span>
            <strong>{shop?.name || liveOrder?.shop_name || 'Sharma Kirana'}</strong>
          </div>
          <div className="meta-pill">
            <span className="meta-pill-label">Delivery Mode</span>
            <strong>{liveOrder?.delivery_mode || orderDetails?.deliveryMode || 'Delivery Partner'}</strong>
          </div>
          <div className="meta-pill">
            <span className="meta-pill-label">Order Status</span>
            <strong style={{ color: 'var(--primary)' }}>{currentStatus.replace('_', ' ')}</strong>
          </div>
        </div>

        {/* Step 8: Order Tracking Timeline */}
        <div className="timeline-card-container">
          <div className="timeline-header">
            <h3>Live Order Progress Timeline</h3>
            <span className="badge badge-primary">
              Realtime Database Status
            </span>
          </div>

          <div className="timeline-stepper">
            {TIMELINE_STEPS.map((stepItem, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const StepIcon = stepItem.icon;

              return (
                <div key={stepItem.id} className={`timeline-step-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                  <div className="step-node-icon">
                    {isCompleted ? <CheckCircle2 size={20} /> : <span className="step-circle-number">{idx + 1}</span>}
                  </div>
                  <div className="step-text-content">
                    <span className="step-title-text">{stepItem.title}</span>
                    <span className="step-desc-text">{stepItem.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 9: Emotional Connection Visual */}
        <div className="emotional-connection-card">
          <div className="connection-diagram-subtle">
            <div className="conn-node">Customer</div>
            <div className="conn-arrow">↕</div>
            <div className="conn-hub">KIRANASETU</div>
            <div className="conn-arrow">↕</div>
            <div className="conn-node">{shop?.name || liveOrder?.shop_name || 'Sharma Kirana'}</div>
          </div>

          <div className="connection-text">
            <p className="main-conn-text">"Your local shop is now connected to you."</p>
            <p className="sub-conn-text">Supporting local Kiranas, one order at a time.</p>
          </div>
        </div>

        {/* Summary Items Purchased */}
        <div className="confirmed-items-summary text-left">
          <h4>Order Items ({totalItems > 0 ? totalItems : liveOrder?.items?.length || 0} items)</h4>
          <div className="summary-items-list">
            {cartEntries.length > 0 ? (
              cartEntries.map(({ product, qty }) => (
                <div key={product.id} className="summary-item-row">
                  <span>{product.imageIcon} {product.name} ({product.unitSize})</span>
                  <span>x{qty} • ₹{product.price * qty}</span>
                </div>
              ))
            ) : (
              liveOrder?.items?.map((item, idx) => (
                <div key={idx} className="summary-item-row">
                  <span>📦 {item.name} ({item.unit || 'pack'})</span>
                  <span>x{item.requestedQty} • ₹{item.price * item.requestedQty}</span>
                </div>
              ))
            )}
          </div>

          <div className="summary-total-footer">
            <span>Grand Total Paid / COD:</span>
            <strong>₹{liveOrder?.grand_total || orderDetails?.grandTotal || 1245}</strong>
          </div>
        </div>

        {/* Action buttons */}
        <div className="confirmed-actions">
          <button className="btn btn-primary btn-lg" onClick={onStartNewOrder}>
            <RefreshCw size={18} />
            Start New Order
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
