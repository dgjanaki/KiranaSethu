import React from 'react';
import { ShoppingBag, Package, Sparkles } from 'lucide-react';

const kiranaProducts = [
  { id: '1', name: 'Rice (Basmati & Daily)', category: 'Grains & Staples', desc: '5kg & 10kg bags' },
  { id: '2', name: 'Atta (Whole Wheat)', category: 'Flour', desc: 'Chakki fresh packs' },
  { id: '3', name: 'Dal (Pulses)', category: 'Staples', desc: 'Toor, Moong, Chana' },
  { id: '4', name: 'Cooking Oil', category: 'Oil & Ghee', desc: 'Mustard, Sunflower, Refined' },
  { id: '5', name: 'Sugar', category: 'Staples', desc: 'Refined crystal sugar' },
  { id: '6', name: 'Tea & Coffee', category: 'Beverages', desc: 'Popular Indian blends' },
  { id: '7', name: 'Biscuits & Snacks', category: 'Packaged Foods', desc: 'Daily tea-time snacks' },
  { id: '8', name: 'Soap & Body Care', category: 'Personal Care', desc: 'Hygiene & bath soaps' },
  { id: '9', name: 'Detergent Powder', category: 'Household Care', desc: 'Washing powder & bars' },
  { id: '10', name: 'Noodles & Pasta', category: 'Quick Meals', desc: 'Instant noodles packs' },
];

export default function ProductShowcase() {
  return (
    <section className="products-strip-section">
      <div className="container">
        <div className="strip-label">
          Daily Kirana Essentials Available at Nearby Shops
        </div>

        <div className="products-grid">
          {kiranaProducts.map((item) => (
            <div key={item.id} className="product-card-mini">
              <div className="product-icon-wrap">
                <Package size={20} />
              </div>
              <h4>{item.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
