import { createClient } from '@supabase/supabase-js';
import { sendOrderPushNotification } from './notifications';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sihkiranasethu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sample-key';

// Check if valid credentials are configured
export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  !import.meta.env.VITE_SUPABASE_URL.includes('your-supabase-project')
);

// Initialize Supabase Client
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: { persistSession: false },
    realtime: { params: { eventsPerSecond: 10 } }
  }
);

// ============================================================================
// SHARED DATABASE & REALTIME EVENT BUS ENGINE
// ============================================================================

// Local reactive fallback database state so customer & shop owner always share 1 single database record
let memoryDbOrder = {
  id: 'order_ks1001',
  order_code: 'KS1001',
  shop_name: 'SHARMA KIRANA',
  customer_name: 'Nearby Customer',
  customer_location: 'Sector 4, Block C, Main Road',
  distance: '0.5 km',
  items_subtotal: 1220,
  delivery_fee: 25,
  grand_total: 1245,
  delivery_mode: 'Delivery Partner',
  status: 'NEW', // NEW, ACCEPTED, PREPARING, READY, OUT_FOR_DELIVERY, DELIVERED, REJECTED
  created_at: new Date().toISOString(),
  items: [
    { id: 'prod_1', name: 'Rice', requestedQty: 2, unit: 'kg', price: 380 },
    { id: 'prod_2', name: 'Atta', requestedQty: 5, unit: 'kg', price: 265 },
    { id: 'prod_3', name: 'Toor Dal', requestedQty: 1, unit: 'kg', price: 160 },
    { id: 'prod_4', name: 'Cooking Oil', requestedQty: 2, unit: 'L', price: 145 },
    { id: 'prod_5', name: 'Sugar', requestedQty: 2, unit: 'kg', price: 48 },
    { id: 'prod_6', name: 'Tea', requestedQty: 1, unit: 'pack', price: 290 }
  ]
};

const subscribers = new Set();

export function subscribeToDatabaseChanges(callback) {
  subscribers.add(callback);
  
  // Realtime Supabase Channel if configured
  let channel = null;
  if (isSupabaseConfigured) {
    channel = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        if (payload.new) {
          memoryDbOrder = { ...memoryDbOrder, ...payload.new };
          callback(memoryDbOrder);
        }
      })
      .subscribe();
  }

  // Initial call with current database state
  callback(memoryDbOrder);

  return () => {
    subscribers.delete(callback);
    if (channel) supabase.removeChannel(channel);
  };
}

function notifySubscribers() {
  subscribers.forEach(cb => cb(memoryDbOrder));
}

// 1. CREATE CUSTOMER ORDER IN SUPABASE
export async function createOrderInDatabase(orderData) {
  const orderCode = `KS${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrderRecord = {
    id: `order_${Date.now()}`,
    order_code: orderCode,
    shop_name: orderData.shopName || 'SHARMA KIRANA',
    customer_name: orderData.customerName || 'Nearby Customer',
    customer_location: orderData.customerLocation || 'Sector 4, Block C, Main Road',
    distance: orderData.distance || '0.5 km',
    items_subtotal: orderData.itemsSubtotal,
    delivery_fee: orderData.deliveryFee,
    grand_total: orderData.grandTotal,
    delivery_mode: orderData.deliveryMode || 'Delivery Partner',
    // Scheduled delivery fields — null means deliver now
    delivery_type: orderData.deliveryType || 'now',
    scheduled_date: orderData.scheduledDate || null,
    scheduled_time_slot: orderData.scheduledTimeSlot || null,
    status: 'NEW',
    created_at: new Date().toISOString(),
    items: orderData.items
  };

  memoryDbOrder = newOrderRecord;

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          order_code: orderCode,
          items_subtotal: orderData.itemsSubtotal,
          delivery_fee: orderData.deliveryFee,
          grand_total: orderData.grandTotal,
          delivery_mode: orderData.deliveryMode,
          delivery_type: orderData.deliveryType || 'now',
          scheduled_date: orderData.scheduledDate || null,
          scheduled_time_slot: orderData.scheduledTimeSlot || null,
          status: 'NEW',
          customer_name: orderData.customerName,
          customer_location: orderData.customerLocation
        }])
        .select()
        .single();

      if (!error && data) {
        memoryDbOrder.id = data.id;
      }
    } catch (err) {
      console.warn('Supabase insert fallback:', err);
    }
  }

  // Trigger push notification to the owner
  sendOrderPushNotification(newOrderRecord);

  notifySubscribers();
  return memoryDbOrder;
}

// 2. UPDATE ORDER STATUS BY SHOP OWNER (NEW -> ACCEPTED -> PREPARING -> READY -> OUT_FOR_DELIVERY -> DELIVERED)
export async function updateOrderStatusInDatabase(status, deliveryMode = null) {
  memoryDbOrder = {
    ...memoryDbOrder,
    status: status,
    delivery_mode: deliveryMode || memoryDbOrder.delivery_mode,
    updated_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && memoryDbOrder.id) {
    try {
      await supabase
        .from('orders')
        .update({ 
          status: status,
          delivery_mode: deliveryMode || memoryDbOrder.delivery_mode,
          updated_at: new Date().toISOString()
        })
        .eq('order_code', memoryDbOrder.order_code);
    } catch (err) {
      console.warn('Supabase status update error:', err);
    }
  }

  notifySubscribers();
  return memoryDbOrder;
}

// 3. GET CURRENT ACTIVE ORDER
export function getCurrentActiveOrder() {
  return memoryDbOrder;
}
