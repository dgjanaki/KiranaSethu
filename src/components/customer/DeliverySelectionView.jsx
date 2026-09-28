import React, { useState } from 'react';
import { UserCheck, Truck, ArrowLeft, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { createOrderInDatabase } from '../../lib/supabase';

export default function DeliverySelectionView({ shop, itemsSubtotal, cart, onPlaceOrder, onBackToReview }) {
  // Delivery mode state: 'staff' | 'partner'
  const [selectedDeliveryMode, setSelectedDeliveryMode] = useState('staff');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const staffFee = shop?.staffDeliveryFee || 15;
  const partnerFee = shop?.partnerDeliveryFee || 25;

  const currentDeliveryFee = selectedDeliveryMode === 'staff' ? staffFee : partnerFee;
  const grandTotal = itemsSubtotal + currentDeliveryFee;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const deliveryModeStr = selectedDeliveryMode === 'staff' ? 'Kirana Shop Staff' : 'Delivery Partner';

    // Format items from cart
    const itemsList = Object.entries(cart).map(([id, qty]) => ({
      id,
      name: id === 'prod_1' ? 'Rice' : id === 'prod_2' ? 'Atta' : id === 'prod_3' ? 'Toor Dal' : id === 'prod_4' ? 'Cooking Oil' : id === 'prod_5' ? 'Sugar' : 'Tea',
      requestedQty: qty,
      price: id === 'prod_1' ? 380 : id === 'prod_2' ? 265 : id === 'prod_3' ? 160 : id === 'prod_4' ? 145 : id === 'prod_5' ? 48 : 290
    }));

    // Create real order record in Supabase / shared database engine
    const createdRecord = await createOrderInDatabase({
      shopName: shop?.name || 'SHARMA KIRANA',
      customerName: 'Nearby Customer',
      customerLocation: 'Sector 4, Block C, Main Road',
      distance: shop?.distance || '0.5 km',
      itemsSubtotal: itemsSubtotal,
      deliveryFee: currentDeliveryFee,
      grandTotal: grandTotal,
      deliveryMode: deliveryModeStr,
      items: itemsList
    });

    setIsSubmitting(false);

    onPlaceOrder({
      orderId: createdRecord.order_code,
      deliveryMode: deliveryModeStr,
      deliveryFee: currentDeliveryFee,
      grandTotal: grandTotal,
      estTime: selectedDeliveryMode === 'staff' ? shop?.estDeliveryTime || '20–30 mins' : '30–45 mins'
    });
  };

  return (
    <div className="flow-container">
      <div className="flow-top-bar">
        <button className="btn-back" onClick={onBackToReview}>
          <ArrowLeft size={16} /> Back to Order Review
        </button>
      </div>

      <div className="flow-header text-left" style={{ marginBottom: '1.5rem' }}>
        <h2>Select Delivery Method</h2>
        <p className="subtitle" style={{ margin: 0 }}>
          Choose how you would like your order delivered from {shop?.name}.
        </p>
      </div>

      <div className="review-layout-grid">
        <div className="review-main-col">
          <form onSubmit={handleFormSubmit}>
            <div className="delivery-options-cards-group">
              {/* Option 1: Kirana Shop Staff */}
              <label 
                className={`delivery-option-card ${selectedDeliveryMode === 'staff' ? 'selected' : ''}`}
                onClick={() => setSelectedDeliveryMode('staff')}
              >
                <div className="option-radio-col">
                  <input 
                    type="radio" 
                    name="delivery_mode" 
                    value="staff"
                    checked={selectedDeliveryMode === 'staff'}
                    onChange={() => setSelectedDeliveryMode('staff')}
                  />
                </div>

                <div className="option-icon-box">
                  <UserCheck size={24} color="var(--primary)" />
                </div>

                <div className="option-details-col">
                  <div className="option-title-row">
                    <h3>Kirana Shop Staff</h3>
                    <span className="fee-badge">₹{staffFee} delivery fee</span>
                  </div>
                  <p className="option-desc">Delivered by the shop's delivery staff.</p>
                  <div className="option-meta-tags">
                    <span className="meta-tag">Est. {shop?.estDeliveryTime || '20–30 mins'}</span>
                    <span className="meta-tag">Direct Local fulfillment</span>
                  </div>
                </div>
              </label>

              {/* Option 2: Generic Delivery Partner */}
              <label 
                className={`delivery-option-card ${selectedDeliveryMode === 'partner' ? 'selected' : ''}`}
                onClick={() => setSelectedDeliveryMode('partner')}
              >
                <div className="option-radio-col">
                  <input 
                    type="radio" 
                    name="delivery_mode" 
                    value="partner"
                    checked={selectedDeliveryMode === 'partner'}
                    onChange={() => setSelectedDeliveryMode('partner')}
                  />
                </div>

                <div className="option-icon-box">
                  <Truck size={24} color="var(--primary)" />
                </div>

                <div className="option-details-col">
                  <div className="option-title-row">
                    <h3>Delivery Partner</h3>
                    <span className="fee-badge">₹{partnerFee} delivery fee</span>
                  </div>
                  <p className="option-desc">Delivered through an available third-party delivery partner.</p>
                  <div className="option-meta-tags">
                    <span className="meta-tag">Est. 30–45 mins</span>
                    <span className="meta-tag">On-demand pickup</span>
                  </div>
                </div>
              </label>
            </div>

            <div className="alert-box alert-info mt-4">
              <ShieldCheck size={18} color="var(--primary)" />
              <span>
                <strong>Shop Owner Operations:</strong> The shop owner remains at the store to verify, pick, and package your order before dispatching.
              </span>
            </div>
          </form>
        </div>

        {/* Final Total Summary */}
        <div className="review-side-col">
          <div className="summary-card">
            <h3>Final Order Total</h3>

            <div className="summary-row">
              <span>Items Subtotal</span>
              <strong>₹{itemsSubtotal}</strong>
            </div>

            <div className="summary-row">
              <span>Delivery Fee ({selectedDeliveryMode === 'staff' ? 'Shop Staff' : 'Delivery Partner'})</span>
              <strong>₹{currentDeliveryFee}</strong>
            </div>

            <div className="summary-divider" />

            <div className="summary-row total-row">
              <span>Final Total</span>
              <span className="total-amount">₹{grandTotal}</span>
            </div>

            <button 
              type="button"
              className="btn btn-primary btn-lg btn-full mt-4"
              onClick={handleFormSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending Order to Shop...' : 'Place Order'}
              <Check size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
