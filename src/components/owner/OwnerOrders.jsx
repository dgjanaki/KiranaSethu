import React from 'react';
import { Store, CheckCircle2, UserCheck, Truck, Clock, AlertTriangle, ChevronRight, MapPin, Phone } from 'lucide-react';

export default function OwnerOrders({ 
  order, 
  inventoryList,
  onAcceptOrder, 
  onRejectOrder,
  onPrepareOrder, 
  onMarkReady, 
  onAssignDelivery, 
  onMarkDelivered 
}) {
  if (!order) {
    return (
      <div className="owner-section-container text-center" style={{ padding: '4rem 1rem' }}>
        <Store size={48} color="var(--text-light)" style={{ marginBottom: '1rem' }} />
        <h3>No Active Orders</h3>
        <p className="text-muted">New incoming customer orders will appear here automatically from Supabase.</p>
      </div>
    );
  }

  // Map requested items with live shop inventory check
  const itemsWithStock = order.items.map(item => {
    const invProduct = inventoryList.find(p => p.id === item.id || p.name.toLowerCase().includes(item.name.toLowerCase()));
    const currentStock = invProduct ? invProduct.stock : 10;
    const isLowStock = currentStock < item.requestedQty;
    return {
      ...item,
      currentStock,
      isLowStock
    };
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'NEW':
        return <span className="badge badge-accent">🔔 NEW ORDER</span>;
      case 'ACCEPTED':
        return <span className="badge badge-primary">ORDER ACCEPTED</span>;
      case 'PREPARING':
        return <span className="badge badge-primary">PREPARING ORDER</span>;
      case 'READY':
        return <span className="badge badge-primary">READY FOR DELIVERY</span>;
      case 'OUT_FOR_DELIVERY':
      case 'DISPATCHED':
        return <span className="badge badge-neutral">OUT FOR DELIVERY</span>;
      case 'DELIVERED':
        return <span className="badge badge-primary">DELIVERED ✓</span>;
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  return (
    <div className="owner-section-container">
      <div className="section-header-row mb-4">
        <div>
          <h2>Order Management Portal</h2>
          <p className="subtitle">Manage incoming customer grocery lists, verify stock, and assign neighborhood fulfillment.</p>
        </div>
        <div>
          {getStatusBadge(order.status)}
        </div>
      </div>

      {/* Main Order Card */}
      <div className="owner-order-card">
        <div className="order-card-header">
          <div className="order-title-wrap">
            <h3>Order #{order.orderId}</h3>
            <span className="order-time-tag"><Clock size={12} /> {order.timestamp || 'Live Database Sync'}</span>
          </div>

          <div className="customer-info-pill">
            <MapPin size={14} color="var(--primary)" />
            <span><strong>{order.customerName}</strong> • {order.customerLocation} ({order.distance})</span>
          </div>
        </div>

        {/* Progress Stepper Visual */}
        <div className="order-progress-stepper">
          <div className={`stepper-node ${['NEW', 'ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DISPATCHED', 'DELIVERED'].indexOf(order.status) >= 0 ? 'done' : ''}`}>
            <span className="node-num">1</span>
            <span>New</span>
          </div>
          <div className="stepper-line" />
          <div className={`stepper-node ${['ACCEPTED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DISPATCHED', 'DELIVERED'].indexOf(order.status) >= 0 ? 'done' : ''}`}>
            <span className="node-num">2</span>
            <span>Accepted</span>
          </div>
          <div className="stepper-line" />
          <div className={`stepper-node ${['PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DISPATCHED', 'DELIVERED'].indexOf(order.status) >= 0 ? 'done' : ''}`}>
            <span className="node-num">3</span>
            <span>Preparing</span>
          </div>
          <div className="stepper-line" />
          <div className={`stepper-node ${['READY', 'OUT_FOR_DELIVERY', 'DISPATCHED', 'DELIVERED'].indexOf(order.status) >= 0 ? 'done' : ''}`}>
            <span className="node-num">4</span>
            <span>Ready</span>
          </div>
          <div className="stepper-line" />
          <div className={`stepper-node ${['OUT_FOR_DELIVERY', 'DISPATCHED', 'DELIVERED'].indexOf(order.status) >= 0 ? 'done' : ''}`}>
            <span className="node-num">5</span>
            <span>Out for Delivery</span>
          </div>
          <div className="stepper-line" />
          <div className={`stepper-node ${order.status === 'DELIVERED' ? 'done' : ''}`}>
            <span className="node-num">6</span>
            <span>Delivered</span>
          </div>
        </div>

        {/* Inventory Stock Check Section */}
        <div className="inventory-check-section">
          <h4>
            Check Inventory & Item Availability ({itemsWithStock.length} items requested)
          </h4>

          <div className="requested-items-table-wrap">
            <table className="requested-items-table">
              <thead>
                <tr>
                  <th>Requested Product</th>
                  <th>Quantity</th>
                  <th>Shop Stock Level</th>
                  <th>Stock Availability Status</th>
                </tr>
              </thead>
              <tbody>
                {itemsWithStock.map((item, idx) => (
                  <tr key={idx}>
                    <td><strong>{item.name}</strong></td>
                    <td>{item.requestedQty} {item.unit || 'units'}</td>
                    <td>{item.currentStock} {item.unit || 'units'}</td>
                    <td>
                      {!item.isLowStock ? (
                        <span className="stock-check-tag tag-available">
                          <CheckCircle2 size={14} /> Available
                        </span>
                      ) : (
                        <span className="stock-check-tag tag-low">
                          <AlertTriangle size={14} /> Low Stock ({item.currentStock} {item.unit} remaining)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Action Workflows based on database status */}
        <div className="order-actions-footer">
          <div className="order-financial-summary">
            <span>Total Order Value:</span>
            <strong className="order-grand-price">₹{order.totalAmount}</strong>
          </div>

          <div className="action-buttons-wrap">
            {order.status === 'NEW' && (
              <>
                <button className="btn btn-outline" onClick={onRejectOrder}>
                  Reject
                </button>
                <button className="btn btn-primary btn-lg" onClick={onAcceptOrder}>
                  Accept Order
                </button>
              </>
            )}

            {order.status === 'ACCEPTED' && (
              <button className="btn btn-primary btn-lg" onClick={onPrepareOrder}>
                Start Preparing Order
              </button>
            )}

            {order.status === 'PREPARING' && (
              <button className="btn btn-primary btn-lg" onClick={onMarkReady}>
                Mark as Ready
              </button>
            )}

            {order.status === 'READY' && (
              <div className="delivery-assignment-box">
                <span className="assign-label">Order Ready! Select Delivery Assignment:</span>
                <div className="assign-buttons-row">
                  <button 
                    className="btn btn-primary"
                    onClick={() => onAssignDelivery('Kirana Shop Staff')}
                  >
                    <UserCheck size={16} /> Assign Shop Staff
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => onAssignDelivery('Delivery Partner')}
                  >
                    <Truck size={16} /> Request Delivery Partner
                  </button>
                </div>
              </div>
            )}

            {(order.status === 'OUT_FOR_DELIVERY' || order.status === 'DISPATCHED') && (
              <div className="delivery-progress-controls">
                <span className="badge badge-primary mb-2" style={{ display: 'block' }}>
                  Delivery Mode: {order.deliveryMode || 'Delivery Partner'}
                </span>
                <button className="btn btn-primary btn-lg" onClick={onMarkDelivered}>
                  <CheckCircle2 size={18} /> Mark Delivered
                </button>
              </div>
            )}

            {order.status === 'DELIVERED' && (
              <div className="alert-box alert-info">
                <CheckCircle2 size={18} color="var(--primary)" />
                <strong>Order Completed & Handed Over to Customer ✓</strong>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
