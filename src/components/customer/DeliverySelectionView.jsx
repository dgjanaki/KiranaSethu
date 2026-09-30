import React, { useState, useMemo } from 'react';
import { UserCheck, Truck, ArrowLeft, ShieldCheck, Check, Calendar, Clock, ChevronDown } from 'lucide-react';
import { KIRANA_PRODUCTS } from '../../data/products';
import { createOrderInDatabase } from '../../lib/supabase';

// ── Time slots available for scheduled delivery ───────────────────────────
const TIME_SLOTS = [
  { id: 'slot_1', label: '8:00 AM – 10:00 AM',  icon: '🌅' },
  { id: 'slot_2', label: '10:00 AM – 12:00 PM', icon: '☀️' },
  { id: 'slot_3', label: '12:00 PM – 2:00 PM',  icon: '🌤️' },
  { id: 'slot_4', label: '2:00 PM – 4:00 PM',   icon: '🌞' },
  { id: 'slot_5', label: '4:00 PM – 6:00 PM',   icon: '🌇' },
  { id: 'slot_6', label: '6:00 PM – 8:00 PM',   icon: '🌆' },
];

// ── Date helpers ──────────────────────────────────────────────────────────
function getTomorrowDateString() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
}

function getMaxDateString() {
  const d = new Date();
  d.setDate(d.getDate() + 14); // allow up to 14 days ahead
  return d.toISOString().split('T')[0];
}

function formatDisplayDate(isoDate) {
  if (!isoDate) return '';
  const d = new Date(isoDate + 'T00:00:00'); // local time parse
  return d.toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

// ─────────────────────────────────────────────────────────────────────────
export default function DeliverySelectionView({
  shop, itemsSubtotal, cart, customerLocation, onPlaceOrder, onBackToReview
}) {
  // ── Existing state ────────────────────────────────────────────────────
  const [selectedDeliveryMode, setSelectedDeliveryMode] = useState('staff');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── New: deliver-now vs schedule toggle ───────────────────────────────
  const [deliveryType, setDeliveryType] = useState('now'); // 'now' | 'scheduled'

  // ── New: scheduled delivery fields ───────────────────────────────────
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTimeSlot, setScheduledTimeSlot] = useState('');

  // ── Fee calculation (unchanged) ───────────────────────────────────────
  const staffFee   = shop?.staffDeliveryFee   || 15;
  const partnerFee = shop?.partnerDeliveryFee || 25;
  const currentDeliveryFee = selectedDeliveryMode === 'staff' ? staffFee : partnerFee;
  const grandTotal = itemsSubtotal + currentDeliveryFee;

  // ── Validation ────────────────────────────────────────────────────────
  const scheduleValid = useMemo(() => {
    if (deliveryType === 'now') return true;
    return Boolean(scheduledDate && scheduledTimeSlot);
  }, [deliveryType, scheduledDate, scheduledTimeSlot]);

  // ── Submit handler ────────────────────────────────────────────────────
  const handleFormSubmit = async () => {
    if (!scheduleValid) return;
    setIsSubmitting(true);

    const deliveryModeStr =
      selectedDeliveryMode === 'staff' ? 'Kirana Shop Staff' : 'Delivery Partner';

    const itemsList = Object.entries(cart).map(([id, qty]) => {
      const product = KIRANA_PRODUCTS.find(p => p.id === id);
      return {
        id,
        name: product?.name || id,
        requestedQty: qty,
        price: product?.price || 0,
        unit: product?.unitSize || 'pack',
      };
    });

    const deliveryAddress = customerLocation?.lat
      ? `GPS ${customerLocation.lat.toFixed(5)}, ${customerLocation.lng.toFixed(5)}`
      : 'Location not provided';

    const createdRecord = await createOrderInDatabase({
      shopName:          shop?.name || 'SHARMA KIRANA',
      customerName:      'Nearby Customer',
      customerLocation:  deliveryAddress,
      distance:          shop?.distance || 'Nearby',
      itemsSubtotal,
      deliveryFee:       currentDeliveryFee,
      grandTotal,
      deliveryMode:      deliveryModeStr,
      // ── new fields ──
      deliveryType,
      scheduledDate:     deliveryType === 'scheduled' ? scheduledDate     : null,
      scheduledTimeSlot: deliveryType === 'scheduled' ? scheduledTimeSlot : null,
      items:             itemsList,
    });

    setIsSubmitting(false);

    onPlaceOrder({
      orderId:           createdRecord.order_code,
      deliveryMode:      deliveryModeStr,
      deliveryType,
      scheduledDate:     deliveryType === 'scheduled' ? scheduledDate     : null,
      scheduledTimeSlot: deliveryType === 'scheduled' ? scheduledTimeSlot : null,
      deliveryFee:       currentDeliveryFee,
      grandTotal,
      estTime:           deliveryType === 'scheduled'
        ? `${formatDisplayDate(scheduledDate)}, ${scheduledTimeSlot}`
        : selectedDeliveryMode === 'staff'
          ? shop?.estDeliveryTime || '20–30 mins'
          : '30–45 mins',
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
        <h2>Delivery Options</h2>
        <p className="subtitle" style={{ margin: 0 }}>
          Choose how and when you'd like your order delivered from{' '}
          <strong>{shop?.name}</strong>.
        </p>
      </div>

      <div className="review-layout-grid">
        <div className="review-main-col">

          {/* ── Section 1: Delivery provider ───────────────────────── */}
          <div className="delivery-section-block">
            <h4 className="delivery-section-label">
              <Truck size={16} color="var(--primary)" /> Delivery Provider
            </h4>

            <div className="delivery-options-cards-group">
              {/* Shop Staff */}
              <label
                className={`delivery-option-card ${selectedDeliveryMode === 'staff' ? 'selected' : ''}`}
                onClick={() => setSelectedDeliveryMode('staff')}
              >
                <div className="option-radio-col">
                  <input
                    type="radio" name="delivery_mode" value="staff"
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
                    <span className="fee-badge">₹{staffFee}</span>
                  </div>
                  <p className="option-desc">Delivered directly by the shop's own staff.</p>
                  <div className="option-meta-tags">
                    <span className="meta-tag">Est. {shop?.estDeliveryTime || '20–30 mins'}</span>
                    <span className="meta-tag">Local fulfillment</span>
                  </div>
                </div>
              </label>

              {/* Delivery Partner */}
              <label
                className={`delivery-option-card ${selectedDeliveryMode === 'partner' ? 'selected' : ''}`}
                onClick={() => setSelectedDeliveryMode('partner')}
              >
                <div className="option-radio-col">
                  <input
                    type="radio" name="delivery_mode" value="partner"
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
                    <span className="fee-badge">₹{partnerFee}</span>
                  </div>
                  <p className="option-desc">Third-party delivery partner picks up from the shop.</p>
                  <div className="option-meta-tags">
                    <span className="meta-tag">Est. 30–45 mins</span>
                    <span className="meta-tag">On-demand</span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* ── Section 2: Deliver now vs schedule ─────────────────── */}
          <div className="delivery-section-block">
            <h4 className="delivery-section-label">
              <Clock size={16} color="var(--primary)" /> Delivery Timing
            </h4>

            <div className="delivery-timing-toggle">
              <button
                type="button"
                className={`timing-btn ${deliveryType === 'now' ? 'active' : ''}`}
                onClick={() => setDeliveryType('now')}
              >
                ⚡ Deliver Now
              </button>
              <button
                type="button"
                className={`timing-btn ${deliveryType === 'scheduled' ? 'active' : ''}`}
                onClick={() => setDeliveryType('scheduled')}
              >
                <Calendar size={15} /> Schedule Delivery
              </button>
            </div>

            {/* Deliver Now — no extra UI needed */}
            {deliveryType === 'now' && (
              <div className="timing-now-note">
                <span>🚀</span>
                <p>
                  Your order will be dispatched as soon as the shop confirms and packs it.
                  Estimated arrival: <strong>{shop?.estDeliveryTime || '30–45 mins'}</strong>.
                </p>
              </div>
            )}

            {/* Schedule Delivery — date + time slot picker */}
            {deliveryType === 'scheduled' && (
              <div className="schedule-picker-card">
                {/* Date picker */}
                <div className="schedule-field-group">
                  <label className="schedule-field-label">
                    <Calendar size={15} color="var(--primary)" />
                    Select Delivery Date
                  </label>
                  <div className="date-input-wrap">
                    <input
                      type="date"
                      className="schedule-date-input"
                      value={scheduledDate}
                      min={getTomorrowDateString()}
                      max={getMaxDateString()}
                      onChange={e => setScheduledDate(e.target.value)}
                    />
                    {scheduledDate && (
                      <span className="date-display-label">
                        {formatDisplayDate(scheduledDate)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Time slot selector */}
                <div className="schedule-field-group">
                  <label className="schedule-field-label">
                    <Clock size={15} color="var(--primary)" />
                    Select Time Slot
                  </label>
                  <div className="time-slots-grid">
                    {TIME_SLOTS.map(slot => (
                      <button
                        key={slot.id}
                        type="button"
                        className={`time-slot-btn ${scheduledTimeSlot === slot.label ? 'selected' : ''}`}
                        onClick={() => setScheduledTimeSlot(slot.label)}
                      >
                        <span className="slot-icon">{slot.icon}</span>
                        <span className="slot-label">{slot.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Validation nudge */}
                {(!scheduledDate || !scheduledTimeSlot) && (
                  <div className="schedule-validation-note">
                    <span>
                      {!scheduledDate && !scheduledTimeSlot
                        ? 'Please select a date and time slot to schedule delivery.'
                        : !scheduledDate
                        ? 'Please select a delivery date.'
                        : 'Please select a time slot.'}
                    </span>
                  </div>
                )}

                {/* Confirmed schedule summary */}
                {scheduledDate && scheduledTimeSlot && (
                  <div className="schedule-confirmed-summary">
                    <div className="schedule-confirmed-icon">
                      <Calendar size={20} color="var(--primary)" />
                    </div>
                    <div>
                      <strong>Delivery Scheduled</strong>
                      <p>📅 {formatDisplayDate(scheduledDate)}</p>
                      <p>🕐 {scheduledTimeSlot}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="alert-box alert-info mt-4">
            <ShieldCheck size={18} color="var(--primary)" />
            <span>
              <strong>Shop Owner Operations:</strong> The shop owner will prepare your
              order {deliveryType === 'scheduled' ? 'before your scheduled slot' : 'immediately after accepting'}.
            </span>
          </div>
        </div>

        {/* ── Summary panel ──────────────────────────────────────────── */}
        <div className="review-side-col">
          <div className="summary-card">
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Items Subtotal</span>
              <strong>₹{itemsSubtotal}</strong>
            </div>
            <div className="summary-row">
              <span>Delivery ({selectedDeliveryMode === 'staff' ? 'Shop Staff' : 'Partner'})</span>
              <strong>₹{currentDeliveryFee}</strong>
            </div>

            <div className="summary-divider" />

            <div className="summary-row total-row">
              <span>Final Total</span>
              <span className="total-amount">₹{grandTotal}</span>
            </div>

            {/* Schedule preview in summary */}
            {deliveryType === 'scheduled' && (scheduledDate || scheduledTimeSlot) && (
              <div className="summary-schedule-pill">
                <Calendar size={13} color="var(--primary)" />
                <div>
                  <span className="summary-schedule-title">Scheduled Delivery</span>
                  {scheduledDate && (
                    <span className="summary-schedule-val">
                      {formatDisplayDate(scheduledDate)}
                    </span>
                  )}
                  {scheduledTimeSlot && (
                    <span className="summary-schedule-val">{scheduledTimeSlot}</span>
                  )}
                </div>
              </div>
            )}

            {deliveryType === 'now' && (
              <div className="summary-schedule-pill summary-schedule-now">
                <span>⚡</span>
                <div>
                  <span className="summary-schedule-title">Deliver Now</span>
                  <span className="summary-schedule-val">
                    Est. {shop?.estDeliveryTime || '30–45 mins'}
                  </span>
                </div>
              </div>
            )}

            <button
              type="button"
              className="btn btn-primary btn-lg btn-full mt-4"
              onClick={handleFormSubmit}
              disabled={isSubmitting || !scheduleValid}
              title={!scheduleValid ? 'Please select a delivery date and time slot' : ''}
            >
              {isSubmitting ? 'Sending Order to Shop…' : 'Place Order'}
              <Check size={18} />
            </button>

            {!scheduleValid && (
              <p className="place-order-blocked-note">
                Select a date and time slot above to place your order.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
