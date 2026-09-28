import React from 'react';
import { Camera, Sliders, CheckCircle2, Star, Layers, Calendar, BarChart3, Sparkles } from 'lucide-react';

const futureFeaturesList = [
  {
    icon: Camera,
    title: 'Grocery-List Photo Recognition',
    description: 'Snap a handwritten paper list photo and convert it instantly into a digital Kirana cart.',
  },
  {
    icon: Sliders,
    title: 'Quantity & Variant Selection',
    description: 'Custom grammage, brand preference, and precise unit quantity selection for every item.',
  },
  {
    icon: CheckCircle2,
    title: 'Real-Time Product Availability',
    description: 'Live inventory status synced with your neighborhood shop to eliminate missing items.',
  },
  {
    icon: Star,
    title: 'Ratings & Trust Scores',
    description: 'Locality-verified ratings, customer feedback, and neighborhood trust badges.',
  },
  {
    icon: Layers,
    title: 'Family Grocery Packs',
    description: 'Pre-bundled monthly essential packs designed for Indian households of 2, 4, or 6 people.',
  },
  {
    icon: Calendar,
    title: 'Monthly Subscriptions',
    description: 'Automated recurring deliveries for staples like milk, flour, oil, tea, and daily essentials.',
  },
  {
    icon: BarChart3,
    title: 'Stock Management for Shop Owners',
    description: 'Simple digital inventory management, low-stock alerts, and billing tools built for Kirana owners.',
  },
];

export default function FutureFeatures() {
  return (
    <section className="roadmap-section" id="future-roadmap">
      <div className="container">
        <div className="section-header">
          <span className="badge badge-accent" style={{ marginBottom: '0.75rem' }}>
            Product Vision & Roadmap
          </span>
          <h2>Upcoming Platform Innovations</h2>
          <p>
            We are actively designing smart capabilities to empower neighborhood commerce and enhance your shopping experience.
          </p>
        </div>

        <div className="roadmap-grid">
          {futureFeaturesList.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="roadmap-card">
                <div className="roadmap-icon">
                  <Icon size={22} />
                </div>
                <div className="roadmap-info">
                  <h3>
                    <span>{item.title}</span>
                    <span className="tag-coming-soon">Coming Soon</span>
                  </h3>
                  <p>{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
