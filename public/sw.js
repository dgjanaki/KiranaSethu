// KiranaSetu Service Worker for PWA & Background Push Notifications

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle incoming background Push Notifications
self.addEventListener('push', (event) => {
  let data = {
    title: 'KiranaSetu — New Order',
    body: 'Sharma Kirana has received a new order.\n5 items • ₹1,245',
    url: '/?view=owner-flow&tab=orders',
    orderId: 'KS1001',
    shopId: 'SHOP_SHARMA'
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      data = { ...data, ...parsed };
    } catch (err) {
      data.body = event.data.text() || data.body;
    }
  }

  const notificationOptions = {
    body: data.body,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || `/?view=owner-flow&tab=orders&orderId=${data.orderId || ''}`,
      orderId: data.orderId,
      shopId: data.shopId
    },
    tag: `kiranasetu-order-${data.orderId || Date.now()}`,
    renotify: true,
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification(data.title, notificationOptions)
  );
});

// Handle Owner tapping/clicking Notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const notificationData = event.notification.data || {};
  const targetUrl = notificationData.url || '/?view=owner-flow&tab=orders';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If KiranaSetu is already open, focus it and post direct navigation message
      for (const client of clientList) {
        if ('focus' in client) {
          client.focus();
          client.postMessage({
            type: 'NOTIFICATION_CLICK',
            url: targetUrl,
            orderId: notificationData.orderId,
            tab: 'orders'
          });
          return;
        }
      }
      // If KiranaSetu is closed, open it directly to target order URL
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
