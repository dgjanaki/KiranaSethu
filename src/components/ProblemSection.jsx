import React from 'react';
import { User, Store, ArrowDown, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ProblemSection() {
  return (
    <section className="problem-section" id="for-customers">
      <div className="container">
        <div className="section-header">
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
            Bridging The Neighborhood Gap
          </span>
          <h2>Solving Everyday Kirana Shopping Pain Points</h2>
          <p>
            Traditional Kirana stores are the backbone of local commerce, yet disconnected from digital-first neighborhood residents.
          </p>
        </div>

        {/* Problems Grid */}
        <div className="problems-grid">
          {/* Customer Side */}
          <div className="problem-card">
            <div className="problem-card-header">
              <div className="problem-icon-box customer">
                <User size={24} />
              </div>
              <div>
                <h3>Customer Challenges</h3>
                <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>For Buyers</span>
              </div>
            </div>
            
            <ul className="problem-list">
              <li>
                <span className="bullet-x">✕</span>
                <span>New residents or customers may not know nearby Kirana shops.</span>
              </li>
              <li>
                <span className="bullet-x">✕</span>
                <span>Customers don't know which local shop they can trust.</span>
              </li>
              <li>
                <span className="bullet-x">✕</span>
                <span>Product availability is unclear before walking into the store.</span>
              </li>
              <li>
                <span className="bullet-x">✕</span>
                <span>Customers often need to visit multiple shops to get all daily items.</span>
              </li>
            </ul>
          </div>

          {/* Shop Owner Side */}
          <div className="problem-card" id="for-shop-owners">
            <div className="problem-card-header">
              <div className="problem-icon-box owner">
                <Store size={24} />
              </div>
              <div>
                <h3>Kirana Owner Challenges</h3>
                <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>For Retailers</span>
              </div>
            </div>

            <ul className="problem-list">
              <li>
                <span className="bullet-x">✕</span>
                <span>Limited digital visibility compared to quick-commerce giants.</span>
              </li>
              <li>
                <span className="bullet-x">✕</span>
                <span>Depends heavily on foot traffic and traditional walk-in customers.</span>
              </li>
              <li>
                <span className="bullet-x">✕</span>
                <span>Nearby customers may not know what items are currently available in stock.</span>
              </li>
              <li>
                <span className="bullet-x">✕</span>
                <span>Has difficulty reaching new nearby customers moving into the locality.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Visual Connection Diagram requested in prompt */}
        <div className="diagram-container">
          <div className="diagram-title">
            The KiranaSetu Solution Architecture
          </div>

          <div className="diagram-flow">
            {/* Step 1: Customer */}
            <div className="diagram-node">
              <div className="node-icon">
                <User size={24} />
              </div>
              <div className="node-title">CUSTOMER</div>
              <div className="node-desc">Locates shop & checks stock availability</div>
            </div>

            {/* Arrow */}
            <div className="diagram-arrow">
              <span className="arrow-label">Connects Via</span>
              <ArrowRight size={28} />
            </div>

            {/* Step 2: KiranaSetu Hub */}
            <div className="diagram-node hub">
              <div className="node-icon">
                <ShieldCheck size={26} />
              </div>
              <div className="node-title">KIRANASETU</div>
              <div className="node-desc">Trust Platform & Direct Communication Bridge</div>
            </div>

            {/* Arrow */}
            <div className="diagram-arrow">
              <span className="arrow-label">Fulfills With</span>
              <ArrowRight size={28} />
            </div>

            {/* Step 3: Trusted Kirana Shop */}
            <div className="diagram-node">
              <div className="node-icon">
                <Store size={24} />
              </div>
              <div className="node-title">TRUSTED KIRANA SHOP</div>
              <div className="node-desc">Fulfills order directly with shop staff or partner</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
