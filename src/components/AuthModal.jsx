import React, { useState } from 'react';
import { X, Store, User, Phone, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AuthModal({ isOpen, mode, onClose }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState(
    mode === 'register-shop' ? 'shop' : 'customer'
  );
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {!submitted ? (
          <>
            <div className="modal-header">
              <h3>
                {mode === 'login' 
                  ? 'Welcome Back to KiranaSetu' 
                  : mode === 'register-shop' 
                  ? 'Register Your Kirana Shop' 
                  : 'Join KiranaSetu Platform'}
              </h3>
              <p>Connect directly with your neighborhood local store ecosystem.</p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: '8px' }}>
              <button
                type="button"
                className={`btn btn-sm ${activeTab === 'customer' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1, border: 'none' }}
                onClick={() => setActiveTab('customer')}
              >
                <User size={14} /> Customer
              </button>
              <button
                type="button"
                className={`btn btn-sm ${activeTab === 'shop' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1, border: 'none' }}
                onClick={() => setActiveTab('shop')}
              >
                <Store size={14} /> Kirana Owner
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {activeTab === 'shop' ? (
                <>
                  <div className="form-group">
                    <label>Kirana Shop Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Laxmi General Store" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Owner Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Rajesh Kumar" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Mobile Number (WhatsApp)</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      placeholder="+91 98765 43210" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Locality / Pincode</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Sector 15, Noida - 201301" 
                      required 
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Ananya Sharma" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Mobile Number</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      placeholder="+91 98765 43210" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Delivery Area / Pincode</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="e.g. Indiranagar, Bengaluru" 
                      required 
                    />
                  </div>
                </>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                {activeTab === 'shop' ? 'Submit Shop Registration' : 'Continue Shopping'}
                <ArrowRight size={16} />
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ width: '56px', height: '56px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              {activeTab === 'shop' ? 'Shop Registration Received!' : 'Welcome to KiranaSetu!'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {activeTab === 'shop'
                ? 'Thank you for registering. Our team will verify your local shop details shortly.'
                : 'Your profile has been saved. We are locating your nearby trusted Kirana stores.'}
            </p>
            <button className="btn btn-primary" onClick={handleReset} style={{ width: '100%' }}>
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
