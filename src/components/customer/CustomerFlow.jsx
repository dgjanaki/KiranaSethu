import React, { useState, useEffect } from 'react';
import MethodSelector from './MethodSelector';
import ManualProductSelector from './ManualProductSelector';
import ScanGroceryList from './ScanGroceryList';
import CommonCartView from './CommonCartView';
import ShopSelectionView from './ShopSelectionView';
import ShopDetailView from './ShopDetailView';
import OrderReviewView from './OrderReviewView';
import DeliverySelectionView from './DeliverySelectionView';
import OrderTrackingView from './OrderTrackingView';
import { KIRANA_PRODUCTS } from '../../data/products';
import { Store, ShoppingBag } from 'lucide-react';

export default function CustomerFlow({ initialStep = 'select_method', onBackToLanding }) {
  // Step navigation state:
  // 'select_method' | 'manual_select' | 'scan_list' | 'view_cart' | 'find_shops' | 'shop_detail' | 'review_order' | 'select_delivery' | 'order_tracking'
  const [step, setStep] = useState(initialStep);

  useEffect(() => {
    if (initialStep) {
      setStep(initialStep);
    }
  }, [initialStep]);
  
  // Shared Cart State across both manual selection and AI camera scan
  const [cart, setCart] = useState({});
  const [selectedShop, setSelectedShop] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  // Cart helper functions
  const handleAddToCart = (productId) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const handleUpdateQuantity = (productId, newQty) => {
    setCart(prev => {
      const updated = { ...prev };
      if (newQty <= 0) {
        delete updated[productId];
      } else {
        updated[productId] = newQty;
      }
      return updated;
    });
  };

  const handleRemoveItem = (productId) => {
    setCart(prev => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };

  // Bulk add AI recognized products directly to the SAME cart
  const handleBulkAddAIProducts = (productIdsArray) => {
    setCart(prev => {
      const updated = { ...prev };
      productIdsArray.forEach(id => {
        updated[id] = updated[id] ? updated[id] + 1 : 1;
      });
      return updated;
    });
  };

  const totalCartCount = Object.values(cart).reduce((sum, q) => sum + q, 0);

  // Compute available items subtotal for selected shop
  const getAvailableSubtotal = (shop) => {
    if (!shop) return 0;
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      if (shop.unavailableProductIds?.includes(id)) return sum;
      const product = KIRANA_PRODUCTS.find(p => p.id === id);
      return sum + (product ? product.price * qty : 0);
    }, 0);
  };

  const handleViewShopDetail = (shop) => {
    setSelectedShop(shop);
    setStep('shop_detail');
  };

  const handleChooseShop = (shop) => {
    setSelectedShop(shop);
    setStep('review_order');
  };

  const handlePlaceOrder = (details) => {
    setOrderDetails(details);
    setStep('order_tracking');
  };

  const handleStartNewOrder = () => {
    setCart({});
    setSelectedShop(null);
    setOrderDetails(null);
    setStep('select_method');
  };

  return (
    <div className="customer-flow-app">
      {/* Top Header Bar for Customer Application */}
      <header className="customer-app-header">
        <div className="container header-content">
          <div className="header-left">
            <button className="btn-back-home" onClick={onBackToLanding}>
              ← Return to Home
            </button>
            <div className="header-brand">
              <Store size={22} color="var(--primary)" />
              <span>KiranaSetu • Customer Portal</span>
            </div>
          </div>

          <div className="header-right">
            {totalCartCount > 0 && step !== 'order_tracking' && (
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setStep('view_cart')}
              >
                <ShoppingBag size={16} />
                Cart ({totalCartCount})
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Flow Content Container */}
      <main className="customer-flow-main">
        {step === 'select_method' && (
          <MethodSelector 
            onSelectMethod={(method) => {
              if (method === 'manual') setStep('manual_select');
              else if (method === 'scan') setStep('scan_list');
              else if (method === 'view_cart') setStep('view_cart');
            }}
            cartItemCount={totalCartCount}
          />
        )}

        {step === 'manual_select' && (
          <ManualProductSelector 
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onGoToCart={() => setStep('view_cart')}
            onBackToMethods={() => setStep('select_method')}
          />
        )}

        {step === 'scan_list' && (
          <ScanGroceryList 
            onBulkAddAIProducts={handleBulkAddAIProducts}
            onGoToCart={() => setStep('view_cart')}
            onBackToMethods={() => setStep('select_method')}
          />
        )}

        {step === 'view_cart' && (
          <CommonCartView 
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onFindShops={() => setStep('find_shops')}
            onBackToMethods={() => setStep('select_method')}
          />
        )}

        {step === 'find_shops' && (
          <ShopSelectionView 
            cart={cart}
            onViewShopDetail={handleViewShopDetail}
            onChooseShop={handleChooseShop}
            onBackToCart={() => setStep('view_cart')}
          />
        )}

        {step === 'shop_detail' && (
          <ShopDetailView 
            shop={selectedShop}
            cart={cart}
            onChooseShop={(shop) => handleChooseShop(shop)}
            onBackToShopList={() => setStep('find_shops')}
          />
        )}

        {step === 'review_order' && (
          <OrderReviewView 
            shop={selectedShop}
            cart={cart}
            onProceedToDelivery={() => setStep('select_delivery')}
            onBackToShopDetail={() => setStep('shop_detail')}
          />
        )}

        {step === 'select_delivery' && (
          <DeliverySelectionView 
            shop={selectedShop}
            itemsSubtotal={getAvailableSubtotal(selectedShop)}
            cart={cart}
            onPlaceOrder={handlePlaceOrder}
            onBackToReview={() => setStep('review_order')}
          />
        )}

        {step === 'order_tracking' && (
          <OrderTrackingView 
            shop={selectedShop}
            orderDetails={orderDetails}
            cart={cart}
            onStartNewOrder={handleStartNewOrder}
            onBackToHome={onBackToLanding}
          />
        )}
      </main>
    </div>
  );
}
