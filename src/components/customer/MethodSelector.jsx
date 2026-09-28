import React from 'react';
import { ShoppingBag, Camera, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function MethodSelector({ onSelectMethod, cartItemCount }) {
  return (
    <div className="flow-container">
      <div className="flow-header text-center">
        <span className="badge badge-primary mb-2">Step 1 of 3 • List Creation</span>
        <h2>How would you like to create your grocery list?</h2>
        <p className="subtitle">
          Choose items manually or snap a picture of your paper grocery list for instant AI item recognition.
        </p>
      </div>

      <div className="method-cards-grid">
        {/* Option 1: Select Products */}
        <div 
          className="method-card"
          onClick={() => onSelectMethod('manual')}
        >
          <div className="method-card-badge">Option 1</div>
          <div className="method-icon-box">
            <ShoppingBag size={32} />
          </div>
          <h3>Select Products</h3>
          <p>Choose groceries manually from our catalog of daily Kirana essentials.</p>

          <ul className="method-features">
            <li><CheckCircle2 size={16} className="check-icon" /> Browse Rice, Atta, Dal, Oil & Spices</li>
            <li><CheckCircle2 size={16} className="check-icon" /> Precise quantity adjustment</li>
            <li><CheckCircle2 size={16} className="check-icon" /> Instant cart addition</li>
          </ul>

          <button className="btn btn-primary btn-full mt-auto">
            Select Manually
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Option 2: Scan Grocery List */}
        <div 
          className="method-card highlight-card"
          onClick={() => onSelectMethod('scan')}
        >
          <div className="method-card-badge badge-ai">
            <Sparkles size={12} /> Option 2 • Smart Recognition
          </div>
          <div className="method-icon-box ai-icon">
            <Camera size={32} />
          </div>
          <h3>Scan Your Grocery List</h3>
          <p>Write your grocery list, take a photo, and let KiranaSetu identify the products.</p>

          <ul className="method-features">
            <li><CheckCircle2 size={16} className="check-icon" /> Snap paper list with mobile/web camera</li>
            <li><CheckCircle2 size={16} className="check-icon" /> Automatic item recognition</li>
            <li><CheckCircle2 size={16} className="check-icon" /> All items added to cart automatically</li>
          </ul>

          <button className="btn btn-secondary btn-full mt-auto">
            <Camera size={18} />
            Scan Grocery List
          </button>
        </div>
      </div>

      {cartItemCount > 0 && (
        <div className="cart-resume-banner">
          <div>
            <strong>You have {cartItemCount} item(s) in your cart</strong>
            <p>You can continue adding items or proceed directly to nearby shops.</p>
          </div>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => onSelectMethod('view_cart')}
          >
            Go to Cart ({cartItemCount})
          </button>
        </div>
      )}
    </div>
  );
}
