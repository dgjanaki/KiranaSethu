import React, { useState, useCallback } from 'react';
import { ShoppingBag, Store, MapPin, Check, ShieldCheck, Search, Truck, CheckCircle2, Navigation, Loader, AlertCircle } from 'lucide-react';

export default function Hero({ onOpenAuth, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationState, setLocationState] = useState('idle'); // idle | requesting | success | denied | error
  const [locationLabel, setLocationLabel] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('customer-flow', 'manual_select');
    }
  };

  const handleUseLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationState('error');
      return;
    }
    setLocationState('requesting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationState('success');
        setLocationLabel(`${pos.coords.latitude.toFixed(3)}°N, ${pos.coords.longitude.toFixed(3)}°E`);
        // Navigate to shop discovery with location
        if (onNavigate) onNavigate('customer-flow', 'find_shops');
      },
      () => {
        setLocationState('denied');
        setLocationLabel('');
      },
      { timeout: 8000, maximumAge: 60000 }
    );
  }, [onNavigate]);

  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-content">
          <div className="badge badge-primary" style={{ marginBottom: '1rem' }}>
            <ShieldCheck size={14} /> Direct Neighborhood Connection
          </div>
          
          <h1>
            Your Local Kirana, <span className="highlight">Just a Few Clicks Away</span>
          </h1>

          <p className="hero-subtitle">
            Find trusted nearby Kirana stores, check product availability, and order your everyday essentials.
          </p>

          {/* Quick Locality Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hero-search-box mb-4">
            <MapPin size={18} className="hero-search-pin" />
            <input 
              type="text"
              placeholder="Search your area or product (e.g. Sector 4, Rice, Atta, Oil)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="hero-search-input"
            />
            <button type="submit" className="btn btn-primary btn-sm hero-search-btn">
              <Search size={16} /> Search
            </button>
          </form>

          {/* LOCATION SECTION — Find Kirana Shops Near You */}
          <div className="hero-location-section">
            <div className="hero-location-header">
              <div className="hero-location-icon">
                <MapPin size={18} color="var(--primary)" />
              </div>
              <div>
                <h3 className="hero-location-title">Find Kirana Shops Near You</h3>
                <p className="hero-location-sub">Use your live location to discover trusted shops within walking distance</p>
              </div>
            </div>
            
            {locationState === 'idle' && (
              <div className="hero-location-actions">
                <button className="btn btn-primary btn-sm hero-location-btn" onClick={handleUseLocation}>
                  <Navigation size={16} />
                  Use My Location
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => onNavigate && onNavigate('customer-flow', 'find_shops')}
                >
                  Browse Shops
                </button>
              </div>
            )}

            {locationState === 'requesting' && (
              <div className="hero-location-loading">
                <Loader size={16} className="location-spin-icon" color="var(--primary)" />
                <span>Detecting your location...</span>
              </div>
            )}

            {locationState === 'success' && (
              <div className="hero-location-success">
                <CheckCircle2 size={16} color="var(--primary)" />
                <span>📍 Location detected — showing nearby shops</span>
              </div>
            )}

            {locationState === 'denied' && (
              <div className="hero-location-denied">
                <AlertCircle size={16} color="#dc2626" />
                <span>Location permission denied. </span>
                <button
                  className="btn-link"
                  style={{ fontSize: '0.875rem' }}
                  onClick={() => onNavigate && onNavigate('customer-flow', 'find_shops')}
                >
                  Use demo location instead
                </button>
              </div>
            )}
          </div>

          {/* Primary & Secondary Action Buttons */}
          <div className="hero-cta">
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => onNavigate ? onNavigate('customer-flow', 'manual_select') : onOpenAuth('start-shopping')}
            >
              <ShoppingBag size={18} />
              Build My Grocery List
            </button>
            
            <button 
              className="btn btn-secondary btn-lg"
              onClick={() => onNavigate ? onNavigate('customer-flow', 'find_shops') : onOpenAuth('start-shopping')}
            >
              <Store size={18} />
              Find Nearby Shops
            </button>
          </div>

          {/* Trust Section */}
          <div className="hero-trust-metrics">
            <div className="metric-item">
              <span className="metric-icon-title"><Store size={16} color="var(--primary)" /> Nearby Stores</span>
              <span className="metric-label">Within 0.5 – 2.5 km</span>
            </div>
            <div className="metric-item">
              <span className="metric-icon-title"><CheckCircle2 size={16} color="var(--primary)" /> Verified Stock</span>
              <span className="metric-label">Live catalog availability</span>
            </div>
            <div className="metric-item">
              <span className="metric-icon-title"><ShieldCheck size={16} color="var(--primary)" /> Trusted Kiranas</span>
              <span className="metric-label">Community ratings</span>
            </div>
            <div className="metric-item">
              <span className="metric-icon-title"><Truck size={16} color="var(--primary)" /> Flexible Delivery</span>
              <span className="metric-label">Shop staff or partner</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-visual-card">
            <div className="store-preview-header">
              <div className="store-info">
                <div className="store-avatar">
                  <Store size={24} />
                </div>
                <div className="store-title">
                  <h3>Sharma Kirana & General Store</h3>
                  <p><MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} /> Sector 4, 0.5 km away • Verified Shop</p>
                </div>
              </div>
              <span className="badge badge-accent">★ 4.7 Rated</span>
            </div>

            <div className="availability-pills">
              <div className="product-pill">
                <span>Fortune Sun Lite Oil 1L</span>
                <span className="status"><Check size={14} /> In Stock</span>
              </div>
              <div className="product-pill">
                <span>Aashirvaad Atta 5kg</span>
                <span className="status"><Check size={14} /> In Stock</span>
              </div>
              <div className="product-pill">
                <span>Tata Sampann Toor Dal</span>
                <span className="status"><Check size={14} /> In Stock</span>
              </div>
              <div className="product-pill">
                <span>Tata Tea Premium 500g</span>
                <span className="status"><Check size={14} /> In Stock</span>
              </div>
            </div>

            <div className="quick-connect-box">
              <div className="quick-connect-text">
                <p>Neighborhood Fulfillment</p>
                <span>No middleman markup • Shop staff or partner delivery</span>
              </div>
              <button 
                className="btn btn-primary btn-sm"
                onClick={() => onNavigate ? onNavigate('customer-flow', 'find_shops') : onOpenAuth('start-shopping')}
              >
                Connect Store
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
