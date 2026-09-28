import React from 'react';
import { ShoppingBag, Package, Store, Users, ArrowRight, CheckCircle2, Clock, MapPin, ShieldCheck, DollarSign, Bell } from 'lucide-react';

export default function OwnerDashboard({ 
  activeOrder, 
  onAcceptOrder, 
  onRejectOrder, 
  onNavigateTab 
}) {
  const pendingCount = activeOrder && activeOrder.status === 'NEW' ? 1 : 0;

  return (
    <div className="owner-section-container">
      {/* Welcome Banner */}
      <div className="owner-welcome-header">
        <div>
          <h2>Good morning, Sharma Kirana</h2>
          <p className="subtitle">Manage your shop and stay connected with nearby customers.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {pendingCount > 0 && (
            <button 
              className="notification-indicator-pill animate-pulse"
              onClick={() => onNavigateTab('orders')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#ef4444',
                color: '#ffffff',
                border: 'none',
                padding: '0.4rem 0.85rem',
                borderRadius: '999px',
                fontWeight: '600',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              <Bell size={16} />
              <span>🔔 {pendingCount} New Order{pendingCount > 1 ? 's' : ''}</span>
            </button>
          )}
          <div className="online-status-badge">
            <span className="status-dot-green">●</span> Shop Online & Receiving Orders
          </div>
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="owner-kpi-grid mb-4">
        <div className="kpi-card">
          <div className="kpi-icon-box">
            <ShoppingBag size={22} color="var(--primary)" />
          </div>
          <div>
            <span className="kpi-label">Today's Orders</span>
            <strong className="kpi-value">12</strong>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box alert-icon">
            <Clock size={22} color="#d97706" />
          </div>
          <div>
            <span className="kpi-label">Pending Orders</span>
            <strong className="kpi-value" style={{ color: '#d97706' }}>
              {activeOrder ? '1' : '0'}
            </strong>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box">
            <Package size={22} color="var(--primary)" />
          </div>
          <div>
            <span className="kpi-label">Products in Stock</span>
            <strong className="kpi-value">128</strong>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-box">
            <Store size={22} color="var(--primary)" />
          </div>
          <div>
            <span className="kpi-label">Today's Sales</span>
            <strong className="kpi-value">₹4,850</strong>
          </div>
        </div>
      </div>

      {/* Prominent NEW ORDER Section */}
      {activeOrder ? (
        <div className="new-order-highlight-card mb-4">
          <div className="new-order-header">
            <div className="new-order-title">
              <span className="badge badge-accent">NEW ORDER REQUEST</span>
              <h3>Order #{activeOrder.orderId}</h3>
            </div>
            <span className="distance-tag"><MapPin size={14} /> {activeOrder.distance} away</span>
          </div>

          <div className="new-order-body-grid">
            <div className="order-items-preview-col">
              <span className="preview-label">Requested Customer Items:</span>
              <ul className="order-items-bullet-list">
                {activeOrder.items.map((item, idx) => (
                  <li key={idx}>
                    <strong>{item.name}</strong> — {item.requestedQty} {item.unit || 'units'}
                  </li>
                ))}
              </ul>
            </div>

            <div className="order-meta-summary-col">
              <div className="summary-meta-item">
                <span>Customer Location:</span>
                <strong>{activeOrder.customerLocation}</strong>
              </div>
              <div className="summary-meta-item">
                <span>Est. Order Value:</span>
                <strong className="price-large">₹{activeOrder.totalAmount}</strong>
              </div>
            </div>
          </div>

          <div className="new-order-footer">
            <div className="owner-stay-note">
              <ShieldCheck size={16} color="var(--primary)" />
              <span>Owner remains at shop to verify & prepare stock.</span>
            </div>

            <div className="new-order-btns">
              <button className="btn btn-outline" onClick={onRejectOrder}>
                Reject
              </button>
              <button 
                className="btn btn-primary btn-lg" 
                onClick={() => {
                  onAcceptOrder();
                  onNavigateTab('orders');
                }}
              >
                Accept Order & Check Stock
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-pending-order-box mb-4">
          <CheckCircle2 size={24} color="var(--primary)" />
          <span>All current orders processed. Waiting for new neighborhood requests.</span>
        </div>
      )}

      {/* Section 9: Your Local Customers */}
      <div className="local-customers-card mb-4">
        <div className="local-card-header">
          <div className="local-title">
            <Users size={20} color="var(--primary)" />
            <h3>Your Local Customers</h3>
          </div>
          <button className="btn-link" onClick={() => onNavigateTab('profile')}>View Customer Metrics</button>
        </div>

        <div className="local-stats-row">
          <div className="local-stat-box">
            <span className="stat-number">24</span>
            <span className="stat-label">Nearby Customers</span>
          </div>
          <div className="local-stat-box">
            <span className="stat-number">8</span>
            <span className="stat-label">New Customers This Month</span>
          </div>
          <div className="local-stat-box">
            <span className="stat-number">16</span>
            <span className="stat-label">Returning Customers</span>
          </div>
        </div>

        <div className="local-visibility-banner">
          <ShieldCheck size={18} color="var(--primary)" />
          <p>
            "Customers nearby can discover your shop based on availability, distance, ratings and trust."
          </p>
        </div>
      </div>

      {/* Section 11 & 12: Core Conceptual Architecture Connection Visual */}
      <div className="architecture-connection-card">
        <h4>KiranaSetu Neighborhood Ecosystem Architecture</h4>
        <p className="subtext">Empowering traditional Kirana stores with digital visibility and neighborhood fulfillment.</p>

        <div className="arch-flow-diagram">
          <div className="arch-step">
            <span className="step-tag">1. CUSTOMER</span>
            <p>"I need groceries"</p>
          </div>
          <div className="arch-arrow">↓</div>
          <div className="arch-step hub">
            <span className="step-tag">2. KIRANASETU</span>
            <p>"Finds nearby trusted shop"</p>
          </div>
          <div className="arch-arrow">↓</div>
          <div className="arch-step">
            <span className="step-tag">3. KIRANA OWNER</span>
            <p>"Receives customer order"</p>
          </div>
          <div className="arch-arrow">↓</div>
          <div className="arch-step">
            <span className="step-tag">4. SHOP</span>
            <p>"Checks stock & prepares order"</p>
          </div>
          <div className="arch-arrow">↓</div>
          <div className="arch-step">
            <span className="step-tag">5. DELIVERY</span>
            <p>"Shop staff or delivery partner"</p>
          </div>
          <div className="arch-arrow">↓</div>
          <div className="arch-step">
            <span className="step-tag">6. CUSTOMER</span>
            <p>"Receives groceries"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
