import React, { useState, useEffect } from 'react';
import OwnerAuth from './OwnerAuth';
import OwnerDashboard from './OwnerDashboard';
import OwnerOrders from './OwnerOrders';
import OwnerInventory, { INITIAL_SHOP_STOCK } from './OwnerInventory';
import OwnerProfile from './OwnerProfile';
import { 
  subscribeToDatabaseChanges, 
  updateOrderStatusInDatabase, 
  isSupabaseConfigured 
} from '../../lib/supabase';
import { Store, LayoutDashboard, ShoppingBag, Package, Truck, User, LogOut, Bell, X, CheckCircle2 } from 'lucide-react';

export default function OwnerFlow({ onBackToLanding }) {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [shopInfo, setShopInfo] = useState({
    shopName: 'Sharma Kirana',
    ownerName: 'Ramesh Sharma',
    mobile: '+91 98765 43210',
    pincode: 'Sector 4, Main Market - 110001'
  });

  // Notification system state
  const [unreadCount, setUnreadCount] = useState(1);
  const [showNotificationToast, setShowNotificationToast] = useState(true);
  const [notificationMsg, setNotificationMsg] = useState({
    code: 'KS1001',
    itemCount: 6,
    amount: 1245,
    shopName: 'Sharma Kirana'
  });

  // Live order record loaded from database
  const [dbOrderRecord, setDbOrderRecord] = useState(null);

  // Inventory state
  const [inventoryList, setInventoryList] = useState(INITIAL_SHOP_STOCK);

  // Subscribe to real-time database changes from Supabase
  useEffect(() => {
    // Check URL parameters for direct deep-linking (e.g., from Push Notification click)
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'orders' || params.get('orderId')) {
      setActiveTab('orders');
      setUnreadCount(0);
      setShowNotificationToast(false);
    }

    const handleSWMessage = (event) => {
      if (event.data && event.data.type === 'NOTIFICATION_CLICK') {
        setActiveTab('orders');
        setUnreadCount(0);
        setShowNotificationToast(false);
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleSWMessage);
    }
    window.addEventListener('message', handleSWMessage);

    const unsubscribe = subscribeToDatabaseChanges((dbRecord) => {
      if (dbRecord) {
        setDbOrderRecord({
          orderId: dbRecord.order_code,
          customerName: dbRecord.customer_name,
          customerLocation: dbRecord.customer_location,
          distance: dbRecord.distance,
          totalAmount: dbRecord.grand_total,
          status: dbRecord.status,
          deliveryMode: dbRecord.delivery_mode,
          timestamp: 'Live Database Sync',
          items: dbRecord.items.map(item => ({
            id: item.id,
            name: item.name,
            requestedQty: item.requestedQty || 1,
            unit: item.unit || 'unit',
            price: item.price
          }))
        });

        // Trigger live notification popup when status is NEW
        if (dbRecord.status === 'NEW') {
          setUnreadCount(1);
          setShowNotificationToast(true);
          setNotificationMsg({
            code: dbRecord.order_code,
            itemCount: dbRecord.items ? dbRecord.items.length : 6,
            amount: dbRecord.grand_total,
            shopName: dbRecord.shop_name || 'Sharma Kirana'
          });
        }
      }
    });

    return () => {
      unsubscribe();
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleSWMessage);
      }
      window.removeEventListener('message', handleSWMessage);
    };
  }, []);

  const handleUpdateStock = (productId, newStock) => {
    setInventoryList(prev => prev.map(item => 
      item.id === productId ? { ...item, stock: Math.max(0, newStock) } : item
    ));
  };

  const handleAcceptOrder = async () => {
    setUnreadCount(0);
    setShowNotificationToast(false);
    await updateOrderStatusInDatabase('ACCEPTED');
  };

  const handleRejectOrder = async () => {
    setUnreadCount(0);
    setShowNotificationToast(false);
    await updateOrderStatusInDatabase('REJECTED');
  };

  const handlePrepareOrder = async () => {
    await updateOrderStatusInDatabase('PREPARING');
  };

  const handleMarkReady = async () => {
    await updateOrderStatusInDatabase('READY');
  };

  const handleAssignDelivery = async (mode) => {
    await updateOrderStatusInDatabase('OUT_FOR_DELIVERY', mode);
  };

  const handleMarkDelivered = async () => {
    await updateOrderStatusInDatabase('DELIVERED');
  };

  if (!isLoggedIn) {
    return (
      <OwnerAuth 
        onLoginSuccess={(info) => {
          setShopInfo(info);
          setIsLoggedIn(true);
        }}
        onBackToLanding={onBackToLanding}
      />
    );
  }

  return (
    <div className="owner-flow-app">
      {/* Realtime Notification Toast Popup */}
      {showNotificationToast && dbOrderRecord && dbOrderRecord.status === 'NEW' && (
        <div className="notification-toast-popup animate-slide-down">
          <div className="toast-content">
            <div className="toast-bell-icon">
              <Bell size={20} color="#ffffff" />
            </div>
            <div>
              <strong>🔔 New Order Received!</strong>
              <p>
                Order #{notificationMsg.code} • {notificationMsg.itemCount} items • ₹{notificationMsg.amount} ({notificationMsg.shopName})
              </p>
            </div>
          </div>
          <div className="toast-actions">
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => {
                setActiveTab('orders');
                setUnreadCount(0);
                setShowNotificationToast(false);
              }}
            >
              View Order
            </button>
            <button 
              className="toast-close-btn"
              onClick={() => setShowNotificationToast(false)}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Top Header Navigation for Shop Owner */}
      <header className="owner-app-header">
        <div className="container header-content">
          <div className="header-left">
            <button className="btn-back-home" onClick={onBackToLanding}>
              ← Return to Home
            </button>
            <div className="header-brand">
              <Store size={22} color="var(--primary)" />
              <span>KiranaSetu • Shop Owner Portal</span>
            </div>
          </div>

          <div className="header-right">
            {/* Notification Bell Icon with Unread Count */}
            <button 
              className="notification-bell-btn"
              onClick={() => {
                setActiveTab('orders');
                setUnreadCount(0);
              }}
              title="Notifications"
            >
              <Bell size={20} color="var(--text-main)" />
              {unreadCount > 0 && (
                <span className="bell-badge-count">{unreadCount}</span>
              )}
            </button>

            <span className="owner-name-tag">
              Logged in as <strong>{shopInfo.ownerName}</strong> ({shopInfo.shopName})
            </span>
            <button className="btn-icon-text" onClick={() => setIsLoggedIn(false)} title="Logout">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Owner App Secondary Navigation Bar */}
      <div className="owner-subnav-bar">
        <div className="container subnav-container">
          <div className="subnav-tabs">
            <button 
              className={`subnav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={16} /> Dashboard
            </button>

            <button 
              className={`subnav-tab ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('orders');
                setUnreadCount(0);
              }}
            >
              <ShoppingBag size={16} /> Orders
              {dbOrderRecord && dbOrderRecord.status === 'NEW' && (
                <span className="tab-dot-badge">1</span>
              )}
            </button>

            <button 
              className={`subnav-tab ${activeTab === 'inventory' ? 'active' : ''}`}
              onClick={() => setActiveTab('inventory')}
            >
              <Package size={16} /> Inventory
            </button>

            <button 
              className={`subnav-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={16} /> Profile
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="owner-flow-main">
        <div className="container">
          {activeTab === 'dashboard' && (
            <OwnerDashboard 
              activeOrder={dbOrderRecord}
              onAcceptOrder={handleAcceptOrder}
              onRejectOrder={handleRejectOrder}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'orders' && (
            <OwnerOrders 
              order={dbOrderRecord}
              inventoryList={inventoryList}
              onAcceptOrder={handleAcceptOrder}
              onRejectOrder={handleRejectOrder}
              onPrepareOrder={handlePrepareOrder}
              onMarkReady={handleMarkReady}
              onAssignDelivery={handleAssignDelivery}
              onMarkDelivered={handleMarkDelivered}
            />
          )}

          {activeTab === 'inventory' && (
            <OwnerInventory 
              stockList={inventoryList}
              onUpdateStock={handleUpdateStock}
            />
          )}

          {activeTab === 'profile' && (
            <OwnerProfile 
              shopInfo={shopInfo}
            />
          )}
        </div>
      </main>
    </div>
  );
}
