import React from 'react';
import { ListChecks, MapPin, Store, Truck } from 'lucide-react';

const steps = [
  {
    number: '1',
    title: 'Create your grocery list',
    description: 'Select daily essential Kirana products or quickly build your family grocery items list.',
    icon: ListChecks,
  },
  {
    number: '2',
    title: 'Find nearby trusted Kirana shops',
    description: 'Browse verified neighborhood Kirana stores close to your location with real inventory status.',
    icon: MapPin,
  },
  {
    number: '3',
    title: 'Choose a shop and order',
    description: 'Pick your preferred store based on distance, trust score, and availability, then place your order.',
    icon: Store,
  },
  {
    number: '4',
    title: 'Receive your order',
    description: 'Get your groceries delivered quickly through shop staff or a trusted local third-party partner.',
    icon: Truck,
  },
];

export default function HowItWorks() {
  return (
    <section className="how-it-works-section" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
            Simple 4-Step Process
          </span>
          <h2>How KiranaSetu Works</h2>
          <p>
            Connecting neighbor buyers with local store owners in minutes, without unnecessary middleman costs.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <div key={step.number} className="step-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div className="step-number">{step.number}</div>
                  <div style={{ color: 'var(--primary)', opacity: 0.8 }}>
                    <IconComponent size={24} />
                  </div>
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
