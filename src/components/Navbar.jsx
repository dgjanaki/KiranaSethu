import React, { useState } from 'react';
import { Store, Menu, X, ShoppingBag, User, ListChecks, MapPin, ShieldCheck } from 'lucide-react';

export default function Navbar({ onOpenAuth, onNavigate, activeView, cartCount = 0 }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <a href="#" className="logo" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('landing'); }}>
          <div className="logo-icon-box">
            <Store size={22} color="#ffffff" />
          </div>
          <div className="logo-text-wrap">
            <span className="brand-name">KiranaSetu</span>
            <span className="brand-tagline">Connecting Customers. Empowering Kiranas.</span>
          </div>
        </a>

        <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <li>
            <a 
              href="#" 
              className={`nav-link ${activeView === 'landing' ? 'active' : ''}`} 
              onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('landing'); setMobileMenuOpen(false); }}
            >
              Home
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className={`nav-link ${activeView === 'customer-flow' ? 'active' : ''}`} 
              onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('customer-flow'); setMobileMenuOpen(false); }}
            >
              <ListChecks size={15} style={{ display: 'inline', marginRight: '4px' }} /> Grocery List
            </a>
          </li>
          <li>
            <a 
              href="#for-customers" 
              className="nav-link" 
              onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('customer-flow', 'find_shops'); setMobileMenuOpen(false); }}
            >
              <MapPin size={15} style={{ display: 'inline', marginRight: '4px' }} /> Shops
            </a>
          </li>
          <li>
            <a 
              href="#" 
              className="nav-link" 
              onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('customer-flow', 'order_tracking'); setMobileMenuOpen(false); }}
            >
              Orders
            </a>
          </li>
          <li>
            <a 
              href="#for-shop-owners" 
              className="nav-link" 
              onClick={(e) => { e.preventDefault(); onOpenAuth && onOpenAuth('login'); setMobileMenuOpen(false); }}
            >
              Profile
            </a>
          </li>
        </ul>

        <div className="nav-actions">
          {/* Cart Icon with Live Item Count */}
          <button 
            className="btn btn-outline btn-sm cart-nav-btn"
            onClick={() => onNavigate && onNavigate('customer-flow', 'view_cart')}
            title="View Grocery Cart"
          >
            <ShoppingBag size={18} color="var(--primary)" />
            <span className="cart-nav-label">Cart</span>
            {cartCount > 0 && (
              <span className="cart-badge-count-nav">{cartCount}</span>
            )}
          </button>

          {/* Owner Portal Quick Switcher */}
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigate && onNavigate('owner-flow')}
          >
            <Store size={16} />
            Shop Owner Portal
          </button>

          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
