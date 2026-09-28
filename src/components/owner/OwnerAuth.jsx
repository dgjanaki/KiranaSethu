import React, { useState } from 'react';
import { Store, UserCheck, ArrowRight, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

export default function OwnerAuth({ onLoginSuccess, onBackToLanding }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [shopName, setShopName] = useState('Sharma Kirana');
  const [ownerName, setOwnerName] = useState('Ramesh Sharma');
  const [mobile, setMobile] = useState('+91 98765 43210');
  const [pincode, setPincode] = useState('Sector 4, Main Market - 110001');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoginSuccess({
      shopName,
      ownerName,
      mobile,
      pincode
    });
  };

  return (
    <div className="flow-container" style={{ maxWidth: '640px', paddingTop: '2rem' }}>
      <div className="flow-top-bar" style={{ marginBottom: '1.5rem' }}>
        <button className="btn-back" onClick={onBackToLanding}>
          ← Return to Home
        </button>
      </div>

      <div className="owner-auth-card">
        <div className="text-center mb-4">
          <div className="owner-auth-icon-box">
            <Store size={36} color="var(--primary)" />
          </div>
          <span className="badge badge-primary mb-2">Kirana Owner Portal</span>
          <h2>Welcome to KiranaSetu</h2>
          <p className="subtitle">Bring your local customers online.</p>
        </div>

        {/* Tab switcher */}
        <div className="auth-tab-row">
          <button 
            className={`auth-tab-btn ${authMode === 'login' ? 'active' : ''}`}
            onClick={() => setAuthMode('login')}
          >
            <UserCheck size={16} /> Login as Shop Owner
          </button>
          <button 
            className={`auth-tab-btn ${authMode === 'register' ? 'active' : ''}`}
            onClick={() => setAuthMode('register')}
          >
            <Store size={16} /> Register Your Shop
          </button>
        </div>

        <form onSubmit={handleSubmit} className="owner-form">
          {authMode === 'register' && (
            <div className="form-group">
              <label>Kirana Shop Name</label>
              <input 
                type="text" 
                className="form-control" 
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="e.g. Sharma Kirana" 
                required 
              />
            </div>
          )}

          <div className="form-group">
            <label>Owner Name</label>
            <input 
              type="text" 
              className="form-control" 
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="e.g. Ramesh Sharma" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Registered Mobile Number</label>
            <input 
              type="tel" 
              className="form-control" 
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="+91 98765 43210" 
              required 
            />
          </div>

          {authMode === 'register' && (
            <div className="form-group">
              <label>Shop Location / Area Pincode</label>
              <input 
                type="text" 
                className="form-control" 
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Sector 4, Main Market" 
                required 
              />
            </div>
          )}

          <div className="alert-box alert-info mb-4" style={{ fontSize: '0.8rem' }}>
            <Lock size={16} color="var(--primary)" />
            <span>Demo Mode: Pre-configured for Sharma Kirana. Click button below to enter dashboard.</span>
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-full">
            {authMode === 'login' ? 'Login to Shop Owner Portal' : 'Register Shop & Launch Portal'}
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
