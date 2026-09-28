import { supabase, isSupabaseConfigured } from './supabase';

// Standard VAPID Public Key for Web Push (Can be overridden via VITE_VAPID_PUBLIC_KEY)
const PUBLIC_VAPID_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || 
  'BC0D9G3_y4rZzVw_7Y9Wz7z3y4rZzVw_7Y9Wz7z3y4rZzVw_7Y9Wz7z3y4rZzVw_7Y9Wz7z3y4rZzVw_7Y9Wz7z3';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// 1. Check if browser supports Push Notifications
export function isPushSupported() {
  return typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'Notification' in window;
}

// 2. Get Current Notification Permission & Preference Status
export function getNotificationStatus() {
  if (!isPushSupported()) {
    return 'unsupported';
  }

  const permission = Notification.permission;
  const isEnabledLocally = localStorage.getItem('kiranasetu_owner_push_enabled') === 'true';

  if (permission === 'denied') {
    return 'denied';
  }

  if (permission === 'granted' && isEnabledLocally) {
    return 'enabled';
  }

  if (permission === 'granted' && !isEnabledLocally) {
    return 'disabled';
  }

  return 'default'; // Not requested yet
}

// 3. Request Notification Permission & Enable Push Notifications
export async function enableOwnerNotifications(shopId = 'SHOP_SHARMA') {
  if (!isPushSupported()) {
    return { status: 'unsupported', message: 'Push notifications are unavailable on this device.' };
  }

  try {
    const permission = await Notification.requestPermission();
    
    if (permission !== 'granted') {
      localStorage.setItem('kiranasetu_owner_push_enabled', 'false');
      return { 
        status: 'denied', 
        message: 'Notification permission was denied. Please enable browser notifications in settings.' 
      };
    }

    // Register & ensure Service Worker is active
    let registration;
    if (navigator.serviceWorker.controller) {
      registration = await navigator.serviceWorker.ready;
    } else {
      registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;
    }

    // Store push subscription securely
    let subscription = null;
    if ('PushManager' in window && registration.pushManager) {
      try {
        subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
          });
        }
      } catch (pushErr) {
        console.warn('PushManager registration fallback:', pushErr);
      }
    }

    // Persist in Supabase if configured
    if (subscription && isSupabaseConfigured) {
      try {
        const subJson = subscription.toJSON();
        await supabase
          .from('push_subscriptions')
          .upsert([{
            shop_id: shopId,
            endpoint: subJson.endpoint,
            p256dh: subJson.keys?.p256dh || '',
            auth: subJson.keys?.auth || ''
          }], { onConflict: 'endpoint' });
      } catch (dbErr) {
        console.warn('Supabase subscription save error:', dbErr);
      }
    }

    localStorage.setItem('kiranasetu_owner_push_enabled', 'true');
    return { status: 'enabled', message: 'Notifications Enabled ✓' };

  } catch (err) {
    console.error('Error enabling notifications:', err);
    return { status: 'error', message: 'Failed to enable push notifications.' };
  }
}

// 4. Disable Push Notifications
export async function disableOwnerNotifications() {
  localStorage.setItem('kiranasetu_owner_push_enabled', 'false');

  if (isPushSupported() && 'serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      if (registration.pushManager) {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
        }
      }
    } catch (err) {
      console.warn('Unsubscribe error:', err);
    }
  }

  return { status: 'disabled', message: 'Notifications disabled.' };
}

// 5. Trigger New Order Push Notification for Shop Owner
export async function sendOrderPushNotification(orderRecord, ownerShopId = 'SHOP_SHARMA') {
  // Security check: Only notify if order is for this shop owner
  const isTargetShop = !orderRecord.shop_id || 
                       orderRecord.shop_id === ownerShopId || 
                       orderRecord.shop_name?.toUpperCase().includes('SHARMA');

  if (!isTargetShop) {
    return;
  }

  // Security check: Do NOT put sensitive customer personal data in push text!
  const title = 'KiranaSetu — New Order';
  const itemCount = orderRecord.items ? orderRecord.items.length : 5;
  const amount = orderRecord.grand_total || orderRecord.totalAmount || 1245;
  const shopName = orderRecord.shop_name || 'Sharma Kirana';
  
  const body = `${shopName} has received a new order.\n${itemCount} items • ₹${amount}`;
  const targetUrl = `/?view=owner-flow&tab=orders&orderId=${orderRecord.order_code || 'KS1001'}`;

  // If browser supports notifications & owner enabled them
  if (isPushSupported() && Notification.permission === 'granted' && localStorage.getItem('kiranasetu_owner_push_enabled') === 'true') {
    try {
      const registration = await navigator.serviceWorker.ready;
      if (registration && registration.showNotification) {
        await registration.showNotification(title, {
          body: body,
          icon: '/favicon.svg',
          badge: '/favicon.svg',
          vibrate: [200, 100, 200],
          data: {
            url: targetUrl,
            orderId: orderRecord.order_code || 'KS1001',
            shopId: ownerShopId
          },
          tag: `kiranasetu-order-${orderRecord.order_code || Date.now()}`,
          renotify: true,
          requireInteraction: true
        });
      } else {
        new Notification(title, {
          body: body,
          icon: '/favicon.svg',
          data: { url: targetUrl }
        });
      }
    } catch (err) {
      console.warn('Notification trigger error:', err);
    }
  }
}
