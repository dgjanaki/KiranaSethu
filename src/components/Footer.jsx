import React from 'react';
import { Store, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ onOpenAuth }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#" className="logo">
              <div className="logo-icon-box">
                <Store size={22} color="#ffffff" />
              </div>
              <span>KiranaSetu</span>
            </a>
            <p>
              Connecting neighborhood customers directly with nearby trusted local Kirana shops for daily essentials and grocery fulfillment.
            </p>
          </div>

          <div className="footer-col">
            <h4>For Customers</h4>
            <ul>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#for-customers">Find Local Stores</a></li>
              <li><a href="#future-roadmap">Upcoming Features</a></li>
              <li><button onClick={() => onOpenAuth('start-shopping')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>Start Shopping</button></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>For Shop Owners</h4>
            <ul>
              <li><a href="#for-shop-owners">Digital Visibility</a></li>
              <li><button onClick={() => onOpenAuth('register-shop')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}>Register Your Shop</button></li>
              <li><a href="#future-roadmap">Stock Management</a></li>
              <li><a href="#how-it-works">Partner Program</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>KiranaSetu</h4>
            <ul>
              <li><a href="#">About KiranaSetu</a></li>
              <li><a href="#">Neighborhood Trust</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} KiranaSetu. All rights reserved. Empowerment for Local Kirana Retailers.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Built with <Heart size={14} color="#ef4444" fill="#ef4444" /> for neighborhood communities.
          </p>
        </div>
      </div>
    </footer>
  );
}
