import React, { useState } from 'react';
import { KIRANA_PRODUCTS } from '../../data/products';
import { Plus, Minus, Search, ShoppingBag, ArrowRight, Check } from 'lucide-react';

export default function ManualProductSelector({ cart, onAddToCart, onUpdateQuantity, onGoToCart, onBackToMethods }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(KIRANA_PRODUCTS.map(p => p.category))];

  const filteredProducts = KIRANA_PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate total items in cart
  const totalCartItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  return (
    <div className="flow-container">
      <div className="flow-top-bar">
        <button className="btn-back" onClick={onBackToMethods}>
          ← Back to Options
        </button>
        <div className="flow-title-wrap">
          <h2>Select Kirana Products</h2>
          <p>Choose daily essential groceries for your family list.</p>
        </div>
        {totalCartItems > 0 && (
          <button className="btn btn-primary btn-sm" onClick={onGoToCart}>
            <ShoppingBag size={16} /> View Cart ({totalCartItems})
          </button>
        )}
      </div>

      {/* Filter and Search controls */}
      <div className="catalog-filters">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search Rice, Atta, Dal, Oil, Soap..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-pills">
          {categories.map(cat => (
            <button
              key={cat}
              className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="products-grid-catalog">
        {filteredProducts.map(product => {
          const qtyInCart = cart[product.id] || 0;

          return (
            <div key={product.id} className={`product-card-catalog ${qtyInCart > 0 ? 'in-cart' : ''}`}>
              <div className="product-icon-large">
                <span>{product.imageIcon}</span>
              </div>

              <div className="product-details">
                <span className="product-category-tag">{product.category}</span>
                <h4>{product.name}</h4>
                <p className="product-brand">{product.brand}</p>
                <div className="product-meta">
                  <span className="unit">{product.unitSize}</span>
                  <span className="price">₹{product.price}</span>
                </div>
              </div>

              <div className="product-action">
                {qtyInCart === 0 ? (
                  <button 
                    className="btn btn-primary btn-sm btn-full"
                    onClick={() => onAddToCart(product.id)}
                  >
                    <Plus size={16} /> Add
                  </button>
                ) : (
                  <div className="qty-control-box">
                    <button 
                      className="qty-btn"
                      onClick={() => onUpdateQuantity(product.id, qtyInCart - 1)}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="qty-count">{qtyInCart}</span>
                    <button 
                      className="qty-btn"
                      onClick={() => onUpdateQuantity(product.id, qtyInCart + 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Cart Bar */}
      {totalCartItems > 0 && (
        <div className="floating-cart-bar">
          <div className="floating-cart-info">
            <div className="cart-badge-count">{totalCartItems}</div>
            <div>
              <strong>{totalCartItems} item(s) selected</strong>
              <p>Ready to proceed to shopping cart</p>
            </div>
          </div>
          <button className="btn btn-primary btn-lg" onClick={onGoToCart}>
            Review Cart & Find Shops
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
