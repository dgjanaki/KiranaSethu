import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductShowcase from './components/ProductShowcase';
import ProblemSection from './components/ProblemSection';
import HowItWorks from './components/HowItWorks';
import FutureFeatures from './components/FutureFeatures';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import CustomerFlow from './components/customer/CustomerFlow';
import OwnerFlow from './components/owner/OwnerFlow';
import { ShoppingBag, Store, ArrowRight, ShieldCheck } from 'lucide-react';

export default function App() {
  // Navigation view state: 'landing' | 'customer-flow' | 'owner-flow'
  const [currentView, setCurrentView] = useState('landing');
  const [initialCustomerStep, setInitialCustomerStep] = useState('select_method');

  // Handle URL deep-linking & SW notification clicks
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('view') === 'owner-flow') {
      setCurrentView('owner-flow');
    }

    const handleSWMessage = (event) => {
      if (event.data && event.data.type === 'NOTIFICATION_CLICK') {
        setCurrentView('owner-flow');
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleSWMessage);
    }
    window.addEventListener('message', handleSWMessage);

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleSWMessage);
      }
      window.removeEventListener('message', handleSWMessage);
    };
  }, []);

  // Shared Order state linking Customer placing order to Shop Owner receiving order
  const [sharedOrder, setSharedOrder] = useState({
    orderId: 'KS1001',
    customerName: 'Nearby Customer',
    customerLocation: 'Sector 4, Block C, Main Road',
    distance: '0.5 km',
    totalAmount: 1245,
    status: 'NEW',
    deliveryMode: null,
    timestamp: 'Just Now',
    items: [
      { id: 'prod_1', name: 'Rice', requestedQty: 2, unit: 'kg', price: 380 },
      { id: 'prod_2', name: 'Atta', requestedQty: 5, unit: 'kg', price: 265 },
      { id: 'prod_3', name: 'Toor Dal', requestedQty: 1, unit: 'kg', price: 160 },
      { id: 'prod_4', name: 'Cooking Oil', requestedQty: 2, unit: 'L', price: 145 },
      { id: 'prod_5', name: 'Sugar', requestedQty: 2, unit: 'kg', price: 48 },
      { id: 'prod_6', name: 'Tea', requestedQty: 1, unit: 'pack', price: 290 }
    ]
  });

  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); 

  const handleOpenAuth = (mode) => {
    if (mode === 'start-shopping' || mode === 'register-customer') {
      setInitialCustomerStep('manual_select');
      setCurrentView('customer-flow');
    } else if (mode === 'register-shop' || mode === 'login-shop') {
      setCurrentView('owner-flow');
    } else {
      setAuthMode(mode);
      setAuthModalOpen(true);
    }
  };

  const handleNavigate = (view, step = 'select_method') => {
    setInitialCustomerStep(step);
    setCurrentView(view);
  };

  const handleUpdateSharedOrderStatus = (newStatus, deliveryMode = null) => {
    setSharedOrder(prev => ({
      ...prev,
      status: newStatus,
      deliveryMode: deliveryMode || prev.deliveryMode
    }));
  };

  if (currentView === 'customer-flow') {
    return (
      <CustomerFlow 
        initialStep={initialCustomerStep}
        onBackToLanding={() => setCurrentView('landing')} 
      />
    );
  }

  if (currentView === 'owner-flow') {
    return (
      <OwnerFlow 
        onBackToLanding={() => setCurrentView('landing')}
        sharedOrder={sharedOrder}
        onUpdateSharedOrderStatus={handleUpdateSharedOrderStatus}
      />
    );
  }

  return (
    <div className="app-layout">
      {/* Navigation Bar */}
      <Navbar 
        onOpenAuth={handleOpenAuth} 
        onNavigate={handleNavigate}
        activeView={currentView}
      />

      <main>
        {/* Hero Section */}
        <Hero 
          onOpenAuth={handleOpenAuth} 
          onNavigate={handleNavigate}
        />

        {/* Indian Kirana Essentials Showcase Strip */}
        <ProductShowcase />

        {/* Problem & Visual Solution Architecture Section */}
        <ProblemSection />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Future Product Features & Roadmap */}
        <FutureFeatures />

        {/* Action Callout Banner */}
        <section className="cta-banner">
          <div className="container">
            <div className="cta-box">
              <div className="badge badge-accent" style={{ marginBottom: '1rem' }}>
                Join The Local Retail Revolution
              </div>
              <h2>Ready to connect with your local Kirana?</h2>
              <p>
                Whether you're looking for daily essentials or expanding your shop's neighborhood reach, KiranaSetu is built for you.
              </p>
              <div className="cta-box-buttons">
                <button 
                  className="btn btn-white btn-lg"
                  onClick={() => handleNavigate('customer-flow', 'manual_select')}
                >
                  <ShoppingBag size={18} />
                  Start Shopping
                </button>
                <button 
                  className="btn btn-transparent btn-lg"
                  onClick={() => handleNavigate('owner-flow')}
                >
                  <Store size={18} />
                  Shop Owner Portal
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer onOpenAuth={handleOpenAuth} />

      {/* Auth / Onboarding Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        mode={authMode} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </div>
  );
}
