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
import { Store, ShoppingBag, MapPin } from 'lucide-react';

export default function CustomerFlow({ initialStep = 'select_method', onBackToLanding }) {
  // Step navigation state:
  // 'select_method' | 'manual_select' | 'scan_list' | 'view_cart'
  // | 'find_shops' | 'shop_detail' | 'review_order' | 'select_delivery' | 'order_tracking'
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

  // Customer location state — shared across cart → find_shops → checkout
  const [customerLocation, setCustomerLocation] = useState(null);

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
    // Keep customerLocation — user shouldn't have to re-grant GPS for a second order
    setStep('select_method');
  };

  // Step labels for progress indicator
  const STEP_LABELS = {
    select_method: 'Choose Method',
    manual_select: 'Build List',
    scan_list: 'Scan List',
    view_cart: 'Your Cart',
    find_shops: 'Find Shops',
    shop_detail: 'Shop Details',
    review_order: 'Review Order',
    select_delivery: 'Delivery',
    order_tracking: 'Tracking'
  };

  const STEP_ORDER = ['select_method', 'view_cart', 'find_shops', 'review_order', 'select_delivery', 'order_tracking'];
  const currentStepIndex = STEP_ORDER.indexOf(step);

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
              <span>KiranaSetu · Customer Portal</span>
            </div>
          </div>

          <div className="header-right">
            {/* Location chip in header — shows real coordinates, never a city name */}
            {customerLocation && step !== 'order_tracking' && (
              <div className="header-location-chip">
                <MapPin size={14} color="var(--primary)" />
                <span>
                  {customerLocation.lat.toFixed(3)}°N, {customerLocation.lng.toFixed(3)}°E
                </span>
              </div>
            )}

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

        {/* Progress bar for main steps */}
        {currentStepIndex >= 0 && (
          <div className="flow-progress-bar">
            <div
              className="flow-progress-fill"
              style={{ width: `${((currentStepIndex + 1) / STEP_ORDER.length) * 100}%` }}
            />
          </div>
        )}
      </header>

      {/* Shopping from banner when shop is selected */}
      {selectedShop && !['find_shops', 'shop_detail', 'select_method', 'manual_select', 'scan_list', 'order_tracking'].includes(step) && (
        <div className="shopping-from-banner">
          <div className="container">
            <span className="shopping-from-label">🛒 Shopping from:</span>
            <strong>{selectedShop.name}</strong>
            <span className="shopping-from-meta">
              · {selectedShop.distance}
              {selectedShop.rating && selectedShop.rating !== '—' ? ` · ${selectedShop.rating}★` : ''}
            </span>
          </div>
        </div>
      )}

      {/* Main Flow Content Container */}
      <main className="customer-flow-main">
        {step === 'select_method' && (
          <MethodSelector
            onSelectMethod={(method) => {
              if (method === 'manual') setStep('manual_select');
              else if (method === 'scan') setStep('scan_list');
              else if (method === 'view_cart') setStep('view_cart');
              else if (method === 'find_shops') setStep('find_shops');
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
            selectedShop={selectedShop}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onFindShops={() => setStep('find_shops')}
            onBackToMethods={() => setStep('select_method')}
          />
        )}

        {step === 'find_shops' && (
          <ShopSelectionView
            cart={cart}
            customerLocation={customerLocation}
            onViewShopDetail={handleViewShopDetail}
            onChooseShop={handleChooseShop}
            onBackToCart={() => setStep('view_cart')}
            onLocationObtained={(loc) => setCustomerLocation(loc)}
          />
        )}

        {step === 'shop_detail' && (
          <ShopDetailView
            shop={selectedShop}
            cart={cart}
            onChooseShop={(shop) => handleChooseShop(shop)}
            onBackToShopList={() => setStep('find_shops')}
            onUpdateCart={handleUpdateQuantity}
          />
        )}

        {step === 'review_order' && (
          <OrderReviewView
            shop={selectedShop}
            cart={cart}
            customerLocation={customerLocation}
            onProceedToDelivery={() => setStep('select_delivery')}
            onBackToShopDetail={() => setStep('shop_detail')}
          />
        )}

        {step === 'select_delivery' && (
          <DeliverySelectionView
            shop={selectedShop}
            itemsSubtotal={getAvailableSubtotal(selectedShop)}
            cart={cart}
            customerLocation={customerLocation}
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
