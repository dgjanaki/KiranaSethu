import React, { useState, useEffect } from 'react';
import { Store, Star, MapPin, Phone, Clock, ShieldCheck, Edit3, CheckCircle2, Bell, BellOff, AlertCircle, Smartphone } from 'lucide-react';
import { getNotificationStatus, enableOwnerNotifications, disableOwnerNotifications } from '../../lib/notifications';

export default function OwnerProfile({ shopInfo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [openingHours, setOpeningHours] = useState('7:00 AM – 10:00 PM (Mon – Sun)');
  const [contactPhone, setContactPhone] = useState('+91 98765 43210');
  const [address, setAddress] = useState('Shop No. 12, Main Market, Sector 4');
  const [successMsg, setSuccessMsg] = useState('');

  // Notification settings state
  const [notifStatus, setNotifStatus] = useState(() => getNotificationStatus());

  useEffect(() => {
    setNotifStatus(getNotificationStatus());
  }, []);

  const handleEnableNotifications = async () => {
    const res = await enableOwnerNotifications(shopInfo?.code || 'SHOP_SHARMA');
    setNotifStatus(res.status);
    if (res.status === 'enabled') {
      setSuccessMsg('Order push notifications enabled successfully ✓');
    } else {
      setSuccessMsg(res.message);
    }
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDisableNotifications = async () => {
    const res = await disableOwnerNotifications();
    setNotifStatus(res.status);
    setSuccessMsg('Notifications disabled.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setSuccessMsg('Shop details updated successfully ✓');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="owner-section-container">
      <div className="section-header-row mb-4">
        <div>
          <h2>Shop Profile & Digital Storefront</h2>
          <p className="subtitle">Manage how your Kirana store appears to nearby neighborhood customers.</p>
        </div>
        {successMsg && (
          <div className="alert-box alert-info">
            <CheckCircle2 size={16} /> <strong>{successMsg}</strong>
          </div>
        )}
      </div>

      <div className="profile-layout-grid">
        {/* Main Store Identity Card */}
        <div className="profile-card">
          <div className="profile-card-header">
            <div className="profile-avatar-box">
              <Store size={36} color="var(--primary)" />
            </div>
            <div>
              <h3>{shopInfo?.shopName || 'Sharma Kirana'}</h3>
              <p className="profile-meta">
                <Star size={14} fill="#f59e0b" color="#f59e0b" style={{ display: 'inline' }} />
                <strong>4.7</strong> (142 verified local ratings) • 
                <MapPin size={14} style={{ display: 'inline', margin: '0 4px 0 6px' }} />
                0.5 km from customer area
              </p>
              <span className="badge badge-primary mt-2">
                <ShieldCheck size={12} /> Trusted Local Kirana
              </span>
            </div>
          </div>

          <div className="profile-details-body">
            <div className="profile-detail-group">
              <label>Shop Categories Fulfilling</label>
              <div className="category-tags-row">
                <span className="cat-tag">Groceries & Staples</span>
                <span className="cat-tag">Household Care</span>
                <span className="cat-tag">Personal Care</span>
                <span className="cat-tag">Beverages & Tea</span>
              </div>
            </div>

            {!isEditing ? (
              <>
                <div className="profile-detail-group">
                  <label>Opening Hours</label>
                  <p className="detail-value-text"><Clock size={14} /> {openingHours}</p>
                </div>

                <div className="profile-detail-group">
                  <label>Contact Phone (WhatsApp Orders)</label>
                  <p className="detail-value-text"><Phone size={14} /> {contactPhone}</p>
                </div>

                <div className="profile-detail-group">
                  <label>Shop Address</label>
                  <p className="detail-value-text"><MapPin size={14} /> {address}</p>
                </div>

                <button 
                  className="btn btn-outline mt-4"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 size={16} /> Update Shop Details
                </button>
              </>
            ) : (
              <form onSubmit={handleSave} className="mt-4">
                <div className="form-group">
                  <label>Opening Hours</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={openingHours} 
                    onChange={(e) => setOpeningHours(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Contact Phone</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={contactPhone} 
                    onChange={(e) => setContactPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Shop Address</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                  <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Sidebar Info Card & Notification Settings */}
        <div className="profile-side-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Order Notifications Settings Card */}
          <div className="side-card-inner notification-settings-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="icon-badge-round" style={{ background: 'var(--primary-light)', padding: '0.5rem', borderRadius: '50%', color: 'var(--primary)' }}>
                <Bell size={22} />
              </div>
              <div>
                <h4 style={{ margin: 0 }}>Order Notifications</h4>
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>Browser & PWA Alerts</span>
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Receive instant alerts when a customer places an order, even if the KiranaSetu website is closed.
            </p>

            {/* Notification Status Indicator */}
            {notifStatus === 'enabled' && (
              <div className="alert-box alert-success mb-3" style={{ background: 'rgba(22, 163, 74, 0.1)', border: '1px solid var(--primary)', color: 'var(--primary-dark)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>
                <CheckCircle2 size={16} style={{ display: 'inline', marginRight: '6px' }} />
                <strong>✓ Notifications Enabled</strong>
              </div>
            )}

            {(notifStatus === 'disabled' || notifStatus === 'default') && (
              <div className="alert-box alert-warning mb-3" style={{ background: '#fef3c7', border: '1px solid #f59e0b', color: '#92400e', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>
                <BellOff size={16} style={{ display: 'inline', marginRight: '6px' }} />
                <span>Notifications are disabled. Enable them to receive new order alerts.</span>
              </div>
            )}

            {notifStatus === 'denied' && (
              <div className="alert-box alert-danger mb-3" style={{ background: '#fee2e2', border: '1px solid #ef4444', color: '#991b1b', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>
                <AlertCircle size={16} style={{ display: 'inline', marginRight: '6px' }} />
                <span>Notification permission was denied. Please allow notifications in browser settings.</span>
              </div>
            )}

            {notifStatus === 'unsupported' && (
              <div className="alert-box alert-neutral mb-3" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#475569', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>
                <Smartphone size={16} style={{ display: 'inline', marginRight: '6px' }} />
                <strong>Push notifications are unavailable on this device.</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem' }}>You can still view pending customer orders whenever you open the dashboard.</p>
              </div>
            )}

            {/* Notification Action Buttons */}
            {notifStatus === 'enabled' ? (
              <button 
                className="btn btn-outline btn-sm w-100"
                onClick={handleDisableNotifications}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <BellOff size={16} /> Disable Notifications
              </button>
            ) : notifStatus !== 'unsupported' ? (
              <button 
                className="btn btn-primary btn-sm w-100"
                onClick={handleEnableNotifications}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Bell size={16} /> Enable Order Notifications
              </button>
            ) : null}
          </div>

          <div className="side-card-inner">
            <ShieldCheck size={32} color="var(--primary)" />
            <h4>Verified KiranaSetu Partner</h4>
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>
              Your shop profile is visible to customers within a 2.5 km radius. Maintaining accurate stock and fast fulfillment improves your neighborhood trust badge.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
