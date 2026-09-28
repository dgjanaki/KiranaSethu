import React, { useState } from 'react';
import { Plus, Minus, CheckCircle2, Save, Search, RefreshCw, AlertTriangle } from 'lucide-react';

export const INITIAL_SHOP_STOCK = [
  { id: 'prod_1', name: 'Rice (Basmati / Daily)', brand: 'Fortune Biryani', category: 'Staples & Grains', unit: 'kg', stock: 20 },
  { id: 'prod_2', name: 'Atta (Whole Wheat)', brand: 'Aashirvaad Shuddh Chakki', category: 'Staples & Grains', unit: 'kg', stock: 8 },
  { id: 'prod_3', name: 'Toor Dal (Unpolished)', brand: 'Tata Sampann', category: 'Pulses & Dals', unit: 'kg', stock: 12 },
  { id: 'prod_4', name: 'Cooking Oil', brand: 'Fortune Sun Lite Refined', category: 'Oils & Ghee', unit: 'L', stock: 1 }, // Low Stock
  { id: 'prod_5', name: 'Sugar (White Crystal)', brand: 'Madhur Pure Sugar', category: 'Staples & Grains', unit: 'kg', stock: 15 },
  { id: 'prod_6', name: 'Tea (CTC Leaf)', brand: 'Tata Tea Premium', category: 'Beverages', unit: 'packs', stock: 20 },
  { id: 'prod_8', name: 'Biscuits', brand: 'Parle-G Gold / Britannia', category: 'Snacks & Packaged', unit: 'packs', stock: 35 },
  { id: 'prod_9', name: 'Noodles (Instant)', brand: 'Maggi 2-Minute Masala', category: 'Snacks & Packaged', unit: 'packs', stock: 24 },
  { id: 'prod_10', name: 'Salt (Iodized)', brand: 'Tata Salt', category: 'Spices & Seasoning', unit: 'kg', stock: 18 },
  { id: 'prod_12', name: 'Soap (Bathing)', brand: 'Dettol Original', category: 'Personal Care', unit: 'packs', stock: 14 },
  { id: 'prod_15', name: 'Detergent Powder', brand: 'Surf Excel Easy Wash', category: 'Household Care', unit: 'kg', stock: 10 }
];

export default function OwnerInventory({ stockList, onUpdateStock }) {
  const [editingId, setEditingId] = useState(null);
  const [editVal, setEditVal] = useState(0);
  const [successToast, setSuccessToast] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setEditVal(item.stock);
    setSuccessToast('');
  };

  const handleSave = (id, name) => {
    onUpdateStock(id, editVal);
    setEditingId(null);
    setSuccessToast(`Stock updated for ${name} ✓`);
    setTimeout(() => {
      setSuccessToast('');
    }, 3500);
  };

  const filteredItems = stockList.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="owner-section-container">
      <div className="section-header-row">
        <div>
          <h2>Shop Inventory Management</h2>
          <p className="subtitle">Keep product availability updated so nearby customers see accurate stock.</p>
        </div>

        {successToast && (
          <div className="alert-box alert-info animate-fade-in" style={{ padding: '0.5rem 1rem' }}>
            <CheckCircle2 size={16} color="var(--primary)" />
            <strong>{successToast}</strong>
          </div>
        )}
      </div>

      <div className="search-box mb-4" style={{ maxWidth: '480px' }}>
        <Search size={18} className="search-icon" />
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search items to update stock..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="inventory-table-card">
        <table className="owner-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => {
              const isEditing = editingId === item.id;
              const isLowStock = item.stock <= 2;

              return (
                <tr key={item.id} className={isLowStock ? 'row-warning' : ''}>
                  <td>
                    <strong>{item.name}</strong>
                    <span className="brand-sub">{item.brand}</span>
                  </td>

                  <td>
                    <span className="badge badge-neutral">{item.category}</span>
                  </td>

                  <td>
                    {isEditing ? (
                      <div className="qty-control-box">
                        <button 
                          className="qty-btn"
                          onClick={() => setEditVal(Math.max(0, editVal - 1))}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="qty-count">{editVal} {item.unit}</span>
                        <button 
                          className="qty-btn"
                          onClick={() => setEditVal(editVal + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    ) : (
                      <strong style={{ fontSize: '1.05rem' }}>{item.stock} {item.unit}</strong>
                    )}
                  </td>

                  <td>
                    {item.stock > 5 ? (
                      <span className="badge badge-primary">✓ Available</span>
                    ) : item.stock > 0 ? (
                      <span className="badge badge-accent">
                        <AlertTriangle size={12} /> Low Stock
                      </span>
                    ) : (
                      <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>Out of Stock</span>
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleSave(item.id, item.name)}
                      >
                        <Save size={14} /> Save Stock
                      </button>
                    ) : (
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => handleStartEdit(item)}
                      >
                        Update Stock
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
