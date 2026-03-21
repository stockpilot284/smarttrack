/**
 * mock-tracking-items.ts
 *
 * Fixes applied:
 *
 * 1. Warehouse-dispatched DROPOFF stops (stop_003_5, stop_006_5) have NO orderId.
 *    sortTripStops throws if a DROPOFF has an orderId with no matching PICKUP.
 *    Warehouse orders are pre-loaded — no pickup stop is needed in the trip.
 *
 * 2. Date helpers converted to functions so `new Date()` is called at access
 *    time, not module load time. This prevents SSR/hydration mismatches where
 *    the server and client compute different timestamps.
 */

import { TrackingItem } from '@/types/tracking.type'

// ─── Date helpers (functions — NOT top-level constants) ───────────────────────
// Using functions ensures `new Date()` is called when the value is read,
// not when the module is first imported on the server.

const hoursAgo = (h: number) =>
  new Date(Date.now() - h * 60 * 60 * 1000).toISOString()
const minutesAgo = (m: number) =>
  new Date(Date.now() - m * 60 * 1000).toISOString()
const inMinutes = (m: number) =>
  new Date(Date.now() + m * 60 * 1000).toISOString()
const inHours = (h: number) =>
  new Date(Date.now() + h * 60 * 60 * 1000).toISOString()

// ─── 1. ASSIGNED ─────────────────────────────────────────────────────────────

export const mockTrackingItem1: TrackingItem = {
  id: 'trip_001',
  type: 'trip',
  reference: 'TRP-2024-001',
  status: 'ASSIGNED',
  createdAt: hoursAgo(1),
  estimatedCompletion: inHours(3),
  progress: 0,
  driver: {
    id: 'drv_001',
    name: 'Kwame Mensah',
    phone: '+233 24 123 4567',
    email: 'kwame.mensah@delivery.com',
    availability: 'AVAILABLE',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kwame',
  },
  vehicle: {
    id: 'veh_001',
    type: 'VAN',
    model: 'Toyota HiAce',
    plateNumber: 'GR-1234-23',
    latitude: 0,
    longitude: 0,
    speed: 0,
    heading: 270,
  },
  stops: [
    {
      id: 'stop_001_1',
      type: 'PICKUP',
      address: 'Makola Market, Accra Central',
      latitude: 5.548,
      longitude: -0.213,
      contactName: 'Ama Owusu',
      contactPhone: '+233 20 987 6543',
      status: 'PENDING',
      estimatedArrival: inMinutes(40),
      orderId: 'ord_101',
      items: [
        {
          id: 'item_001_1',
          name: 'Electronics Package',
          quantity: 2,
          description: 'Fragile — handle with care',
        },
        {
          id: 'item_001_2',
          name: 'Phone Accessories',
          quantity: 5,
          description: 'Chargers and cables assorted',
        },
      ],
    },
    {
      id: 'stop_001_3',
      type: 'PICKUP',
      address: 'Tema Community 1 Warehouse',
      latitude: 5.6698,
      longitude: -0.0166,
      contactName: 'Yaw Darko',
      contactPhone: '+233 27 333 2222',
      status: 'PENDING',
      estimatedArrival: inHours(1.5),
      orderId: 'ord_102',
      items: [
        {
          id: 'item_001_3',
          name: 'Clothing Bundle',
          quantity: 10,
          description: 'Assorted sizes — bagged',
        },
      ],
    },
    {
      id: 'stop_001_2',
      type: 'DROPOFF',
      address: 'East Legon, Accra',
      latitude: 5.636,
      longitude: -0.153,
      contactName: 'Kofi Acheampong',
      contactPhone: '+233 24 555 0101',
      status: 'PENDING',
      estimatedArrival: inHours(2),
      orderId: 'ord_101',
      items: [
        {
          id: 'item_001_1',
          name: 'Electronics Package',
          quantity: 2,
          description: 'Fragile — handle with care',
        },
        {
          id: 'item_001_2',
          name: 'Phone Accessories',
          quantity: 5,
          description: 'Chargers and cables assorted',
        },
      ],
    },
    {
      id: 'stop_001_4',
      type: 'DROPOFF',
      address: 'Cantonments, Accra',
      latitude: 5.5833,
      longitude: -0.1833,
      contactName: 'Abena Frimpong',
      contactPhone: '+233 26 444 7777',
      status: 'PENDING',
      estimatedArrival: inHours(2.5),
      orderId: 'ord_102',
      items: [
        {
          id: 'item_001_3',
          name: 'Clothing Bundle',
          quantity: 10,
          description: 'Assorted sizes — bagged',
        },
      ],
    },
  ],
  orderIds: ['ord_101', 'ord_102'],
}

// ─── 2. IN_TRANSIT — clockwise east loop ─────────────────────────────────────

export const mockTrackingItem2: TrackingItem = {
  id: 'trip_002',
  type: 'trip',
  reference: 'TRP-2024-002',
  status: 'IN_TRANSIT',
  createdAt: hoursAgo(3),
  startedAt: hoursAgo(2),
  estimatedCompletion: inHours(1),
  progress: 40,
  driver: {
    id: 'drv_002',
    name: 'Akosua Boateng',
    phone: '+233 24 234 5678',
    email: 'akosua.boateng@delivery.com',
    availability: 'BUSY',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=akosua',
  },
  vehicle: {
    id: 'veh_002',
    type: 'BIKE',
    model: 'Honda CB125F',
    plateNumber: 'GW-5678-23',
    latitude: 5.6167,
    longitude: -0.15,
    speed: 0,
    heading: 0,
  },
  stops: [
    {
      id: 'stop_002_1',
      type: 'PICKUP',
      address: 'Osu Oxford Street, Accra',
      latitude: 5.5606,
      longitude: -0.1769,
      contactName: 'Nana Adjei',
      contactPhone: '+233 20 111 2222',
      status: 'COMPLETED',
      estimatedArrival: hoursAgo(1.5),
      actualArrival: hoursAgo(1.4),
      completedAt: hoursAgo(1.3),
      orderId: 'ord_201',
      items: [
        {
          id: 'item_002_1',
          name: 'Restaurant Food Order',
          quantity: 3,
          description: 'Keep upright — contains liquids',
        },
      ],
    },
    {
      id: 'stop_002_3',
      type: 'PICKUP',
      address: 'Accra Mall, Spintex Road',
      latitude: 5.6167,
      longitude: -0.15,
      contactName: 'Kweku Baah',
      contactPhone: '+233 27 765 4321',
      status: 'IN_PROGRESS',
      estimatedArrival: inMinutes(15),
      orderId: 'ord_202',
      items: [
        {
          id: 'item_002_2',
          name: 'Grocery Package',
          quantity: 1,
          description: 'Contains perishables — refrigerate on arrival',
        },
        {
          id: 'item_002_3',
          name: 'Household Items',
          quantity: 4,
          description: 'Cleaning products and toiletries',
        },
      ],
    },
    {
      id: 'stop_002_2',
      type: 'DROPOFF',
      address: 'Airport Residential Area, Accra',
      latitude: 5.596,
      longitude: -0.1769,
      contactName: 'Maame Asante',
      contactPhone: '+233 24 888 9999',
      status: 'PENDING',
      estimatedArrival: inMinutes(30),
      orderId: 'ord_201',
      items: [
        {
          id: 'item_002_1',
          name: 'Restaurant Food Order',
          quantity: 3,
          description: 'Keep upright — contains liquids',
        },
      ],
    },
    {
      id: 'stop_002_4',
      type: 'DROPOFF',
      address: 'Adenta Housing Down, Accra',
      latitude: 5.695,
      longitude: -0.163,
      contactName: 'Efua Mensah',
      contactPhone: '+233 26 543 2109',
      status: 'PENDING',
      estimatedArrival: inHours(1),
      orderId: 'ord_202',
      items: [
        {
          id: 'item_002_2',
          name: 'Grocery Package',
          quantity: 1,
          description: 'Contains perishables — refrigerate on arrival',
        },
        {
          id: 'item_002_3',
          name: 'Household Items',
          quantity: 4,
          description: 'Cleaning products and toiletries',
        },
      ],
    },
  ],
  orderIds: ['ord_201', 'ord_202'],
}

// ─── 3. IN_TRANSIT — east-to-west sweep with exceptions ──────────────────────
// stop_003_5 is a warehouse-dispatched DROPOFF — no orderId, no matching PICKUP

export const mockTrackingItem3: TrackingItem = {
  id: 'trip_003',
  type: 'trip',
  reference: 'TRP-2024-003',
  status: 'IN_TRANSIT',
  createdAt: hoursAgo(5),
  startedAt: hoursAgo(4),
  estimatedCompletion: inMinutes(90),
  progress: 60,
  driver: {
    id: 'drv_003',
    name: 'Fiifi Asante',
    phone: '+233 24 345 6789',
    email: 'fiifi.asante@delivery.com',
    availability: 'BUSY',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fiifi',
  },
  vehicle: {
    id: 'veh_003',
    type: 'TRUCK',
    model: 'Isuzu NPR',
    plateNumber: 'GT-9012-22',
    latitude: 5.663,
    longitude: -0.218,
    speed: 8.0,
    heading: 200,
  },
  stops: [
    {
      id: 'stop_003_1',
      type: 'PICKUP',
      address: 'Industrial Area Warehouse, Accra',
      latitude: 5.5404,
      longitude: -0.227,
      contactName: 'Kwabena Poku',
      contactPhone: '+233 20 222 3333',
      status: 'COMPLETED',
      estimatedArrival: hoursAgo(3.5),
      actualArrival: hoursAgo(3.4),
      completedAt: hoursAgo(3.2),
      orderId: 'ord_301',
      items: [
        {
          id: 'item_003_1',
          name: 'Office Furniture',
          quantity: 1,
          description: 'Executive desk — requires assembly on delivery',
        },
      ],
    },
    {
      id: 'stop_003_3',
      type: 'PICKUP',
      address: 'Tema Port Warehouse',
      latitude: 5.6167,
      longitude: 0.0167,
      contactName: 'Emmanuel Tawiah',
      contactPhone: '+233 27 444 5555',
      status: 'COMPLETED',
      estimatedArrival: hoursAgo(1.8),
      actualArrival: hoursAgo(1.7),
      completedAt: hoursAgo(1.5),
      orderId: 'ord_302',
      items: [
        {
          id: 'item_003_2',
          name: 'Import Goods',
          quantity: 20,
          description: 'Cleared at port — customs documents attached',
        },
      ],
    },
    {
      id: 'stop_003_2',
      type: 'DROPOFF',
      address: 'North Industrial Area, Accra',
      latitude: 5.595,
      longitude: -0.205,
      contactName: 'Grace Tetteh',
      contactPhone: '+233 24 000 1111',
      status: 'FAILED',
      estimatedArrival: hoursAgo(2.5),
      actualArrival: hoursAgo(2.3),
      failureReason: {
        code: 'NO_ONE_HOME',
        message: 'No one available to receive the furniture delivery',
        failedAt: hoursAgo(2.2),
      },
      orderId: 'ord_301',
      items: [
        {
          id: 'item_003_1',
          name: 'Office Furniture',
          quantity: 1,
          description: 'Executive desk — requires assembly on delivery',
        },
      ],
    },
    {
      id: 'stop_003_4',
      type: 'DROPOFF',
      address: 'Madina Market, Accra',
      latitude: 5.678,
      longitude: -0.168,
      contactName: 'Adwoa Kusi',
      contactPhone: '+233 26 666 7777',
      status: 'SKIPPED',
      skippedAt: minutesAgo(45),
      orderId: 'ord_302',
      items: [
        {
          id: 'item_003_2',
          name: 'Import Goods',
          quantity: 20,
          description: 'Cleared at port — customs documents attached',
        },
      ],
    },
    {
      id: 'stop_003_5',
      type: 'DROPOFF',
      address: 'Dome Market, Accra',
      latitude: 5.663,
      longitude: -0.218,
      contactName: 'Yaa Bonsu',
      contactPhone: '+233 24 888 1234',
      status: 'IN_PROGRESS',
      estimatedArrival: minutesAgo(10),
      actualArrival: minutesAgo(8),
      // No orderId — warehouse-dispatched, no matching PICKUP in this trip
      items: [
        {
          id: 'item_003_3',
          name: 'Medical Supplies',
          quantity: 5,
          description: 'Temperature-sensitive — keep cool',
        },
      ],
    },
  ],
  orderIds: ['ord_301', 'ord_302', 'ord_303'],
}

// ─── 4. COMPLETED ─────────────────────────────────────────────────────────────

export const mockTrackingItem4: TrackingItem = {
  id: 'trip_004',
  type: 'trip',
  reference: 'TRP-2024-004',
  status: 'COMPLETED',
  createdAt: hoursAgo(8),
  startedAt: hoursAgo(7),
  estimatedCompletion: hoursAgo(1),
  completedAt: hoursAgo(0.5),
  progress: 100,
  driver: {
    id: 'drv_004',
    name: 'Esi Quaye',
    phone: '+233 24 456 7890',
    email: 'esi.quaye@delivery.com',
    availability: 'AVAILABLE',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=esi',
  },
  vehicle: {
    id: 'veh_004',
    type: 'VAN',
    model: 'Nissan Urvan',
    plateNumber: 'GN-3456-21',
    latitude: 5.618,
    longitude: -0.229,
    speed: 0,
    heading: 0,
  },
  stops: [
    {
      id: 'stop_004_1',
      type: 'PICKUP',
      address: 'Kantamanto Market, Accra Central',
      latitude: 5.548,
      longitude: -0.213,
      contactName: 'Kwesi Osei',
      contactPhone: '+233 20 333 4444',
      status: 'COMPLETED',
      estimatedArrival: hoursAgo(6),
      actualArrival: hoursAgo(5.9),
      completedAt: hoursAgo(5.7),
      orderId: 'ord_401',
      items: [
        {
          id: 'item_004_1',
          name: 'Fashion Items',
          quantity: 15,
          description: 'Mixed garments — sorted by order label',
        },
      ],
    },
    {
      id: 'stop_004_3',
      type: 'PICKUP',
      address: 'Kwame Nkrumah Circle Warehouse, Accra',
      latitude: 5.573,
      longitude: -0.212,
      contactName: 'Kojo Darko',
      contactPhone: '+233 27 999 0000',
      status: 'COMPLETED',
      estimatedArrival: hoursAgo(5),
      actualArrival: hoursAgo(4.9),
      completedAt: hoursAgo(4.7),
      orderId: 'ord_402',
      items: [
        {
          id: 'item_004_2',
          name: 'Building Materials',
          quantity: 8,
          description: 'Cement bags — heavy load, use trolley',
        },
      ],
    },
    {
      id: 'stop_004_2',
      type: 'DROPOFF',
      address: 'Labone, Accra',
      latitude: 5.568,
      longitude: -0.173,
      contactName: 'Akua Mensah',
      contactPhone: '+233 24 777 8888',
      status: 'COMPLETED',
      estimatedArrival: hoursAgo(4),
      actualArrival: hoursAgo(3.8),
      completedAt: hoursAgo(3.5),
      orderId: 'ord_401',
      items: [
        {
          id: 'item_004_1',
          name: 'Fashion Items',
          quantity: 15,
          description: 'Mixed garments — sorted by order label',
        },
      ],
    },
    {
      id: 'stop_004_4',
      type: 'DROPOFF',
      address: 'Achimota, Accra',
      latitude: 5.618,
      longitude: -0.229,
      contactName: 'Ama Boateng',
      contactPhone: '+233 26 111 2222',
      status: 'COMPLETED',
      estimatedArrival: hoursAgo(2.5),
      actualArrival: hoursAgo(2.3),
      completedAt: hoursAgo(2.0),
      orderId: 'ord_402',
      items: [
        {
          id: 'item_004_2',
          name: 'Building Materials',
          quantity: 8,
          description: 'Cement bags — heavy load, use trolley',
        },
      ],
    },
  ],
  orderIds: ['ord_401', 'ord_402'],
}

// ─── 5. CANCELLED ────────────────────────────────────────────────────────────

export const mockTrackingItem5: TrackingItem = {
  id: 'trip_005',
  type: 'trip',
  reference: 'TRP-2024-005',
  status: 'CANCELLED',
  createdAt: hoursAgo(4),
  startedAt: hoursAgo(3),
  progress: 25,
  cancellationInfo: {
    cancelledBy: 'dispatcher_001',
    cancelledAt: hoursAgo(1),
    reason: 'Customer requested cancellation of all orders on this trip',
  },
  driver: {
    id: 'drv_005',
    name: 'Nana Kofi Boadu',
    phone: '+233 24 567 8901',
    email: 'nana.boadu@delivery.com',
    availability: 'ON_BREAK',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nana',
  },
  vehicle: {
    id: 'veh_005',
    type: 'BIKE',
    model: 'Yamaha FZ',
    plateNumber: 'GE-7890-23',
    latitude: 5.57,
    longitude: -0.195,
    speed: 0,
    heading: 90,
  },
  stops: [
    {
      id: 'stop_005_1',
      type: 'PICKUP',
      address: 'Accra Sports Stadium Area',
      latitude: 5.556,
      longitude: -0.202,
      contactName: 'Mawuli Agbesi',
      contactPhone: '+233 20 444 5555',
      status: 'COMPLETED',
      estimatedArrival: hoursAgo(2.5),
      actualArrival: hoursAgo(2.4),
      completedAt: hoursAgo(2.2),
      orderId: 'ord_501',
      items: [
        {
          id: 'item_005_1',
          name: 'Catering Supplies',
          quantity: 6,
          description: 'Event supplies — plates, cutlery and napkins',
        },
      ],
    },
    {
      id: 'stop_005_3',
      type: 'PICKUP',
      address: 'Tudu Market, Accra',
      latitude: 5.554,
      longitude: -0.207,
      contactName: 'Kwame Frimpong',
      contactPhone: '+233 27 222 3333',
      status: 'PENDING',
      estimatedArrival: hoursAgo(1),
      orderId: 'ord_502',
      items: [
        {
          id: 'item_005_2',
          name: 'Food Supplies',
          quantity: 12,
          description: 'Bulk dry goods — rice, flour and sugar',
        },
      ],
    },
    {
      id: 'stop_005_2',
      type: 'DROPOFF',
      address: 'Ringway Estate, Accra',
      latitude: 5.57,
      longitude: -0.189,
      contactName: 'Afia Asante',
      contactPhone: '+233 24 666 0000',
      status: 'PENDING',
      estimatedArrival: hoursAgo(1.5),
      orderId: 'ord_501',
      items: [
        {
          id: 'item_005_1',
          name: 'Catering Supplies',
          quantity: 6,
          description: 'Event supplies — plates, cutlery and napkins',
        },
      ],
    },
    {
      id: 'stop_005_4',
      type: 'DROPOFF',
      address: 'Roman Ridge, Accra',
      latitude: 5.595,
      longitude: -0.179,
      contactName: 'Adjoa Sarpong',
      contactPhone: '+233 26 888 9999',
      status: 'PENDING',
      orderId: 'ord_502',
      items: [
        {
          id: 'item_005_2',
          name: 'Food Supplies',
          quantity: 12,
          description: 'Bulk dry goods — rice, flour and sugar',
        },
      ],
    },
  ],
  orderIds: ['ord_501', 'ord_502'],
}

// ─── 6. FAILED — coastal east run ────────────────────────────────────────────
// stop_006_5 is warehouse-dispatched — no orderId, no matching PICKUP

export const mockTrackingItem6: TrackingItem = {
  id: 'trip_006',
  type: 'trip',
  reference: 'TRP-2024-006',
  status: 'FAILED',
  createdAt: hoursAgo(6),
  startedAt: hoursAgo(5),
  progress: 50,
  failureReason: {
    code: 'GPS_LOST',
    message:
      'Vehicle GPS signal lost for over 60 minutes. Driver unreachable by phone.',
    failedAt: hoursAgo(1),
    reportedBy: 'system',
  },
  driver: {
    id: 'drv_006',
    name: 'Tetteh Quaye',
    phone: '+233 24 678 9012',
    email: 'tetteh.quaye@delivery.com',
    availability: 'UNAVAILABLE',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tetteh',
  },
  vehicle: {
    id: 'veh_006',
    type: 'TRUCK',
    model: 'Mitsubishi Canter',
    plateNumber: 'GS-2345-22',
    latitude: 5.605,
    longitude: -0.065,
    speed: 0,
    heading: 90,
  },
  stops: [
    {
      id: 'stop_006_1',
      type: 'PICKUP',
      address: 'Spintex Road Depot',
      latitude: 5.623,
      longitude: -0.135,
      contactName: 'Nii Armah',
      contactPhone: '+233 20 555 6666',
      status: 'COMPLETED',
      estimatedArrival: hoursAgo(4.5),
      actualArrival: hoursAgo(4.4),
      completedAt: hoursAgo(4.2),
      orderId: 'ord_601',
      items: [
        {
          id: 'item_006_1',
          name: 'Electronics Bulk',
          quantity: 30,
          description: 'Televisions and monitors — fragile',
        },
      ],
    },
    {
      id: 'stop_006_3',
      type: 'PICKUP',
      address: 'Labadi Warehouse',
      latitude: 5.558,
      longitude: -0.138,
      contactName: 'Aba Serwah',
      contactPhone: '+233 27 333 5555',
      status: 'COMPLETED',
      estimatedArrival: hoursAgo(3.5),
      actualArrival: hoursAgo(3.4),
      completedAt: hoursAgo(3.2),
      orderId: 'ord_602',
      items: [
        {
          id: 'item_006_2',
          name: 'Pharmaceutical Goods',
          quantity: 8,
          description: 'Prescription medicines — keep at room temperature',
        },
      ],
    },
    {
      id: 'stop_006_2',
      type: 'DROPOFF',
      address: 'Teshie-Nungua, Accra',
      latitude: 5.598,
      longitude: -0.092,
      contactName: 'Adjei Kojo',
      contactPhone: '+233 24 111 0000',
      status: 'COMPLETED',
      estimatedArrival: hoursAgo(2.5),
      actualArrival: hoursAgo(2.3),
      completedAt: hoursAgo(2.0),
      orderId: 'ord_601',
      items: [
        {
          id: 'item_006_1',
          name: 'Electronics Bulk',
          quantity: 30,
          description: 'Televisions and monitors — fragile',
        },
      ],
    },
    {
      id: 'stop_006_4',
      type: 'DROPOFF',
      address: 'Sakumono Estate, Tema',
      latitude: 5.648,
      longitude: -0.062,
      contactName: 'Kofi Appiah',
      contactPhone: '+233 26 777 8888',
      status: 'PENDING',
      estimatedArrival: hoursAgo(1.5),
      orderId: 'ord_602',
      items: [
        {
          id: 'item_006_2',
          name: 'Pharmaceutical Goods',
          quantity: 8,
          description: 'Prescription medicines — keep at room temperature',
        },
      ],
    },
    {
      id: 'stop_006_5',
      type: 'DROPOFF',
      address: 'Community 25, Tema',
      latitude: 5.671,
      longitude: -0.018,
      contactName: 'Dzifa Ametefe',
      contactPhone: '+233 24 999 1234',
      status: 'PENDING',
      estimatedArrival: hoursAgo(0.5),
      // No orderId — warehouse-dispatched, no matching PICKUP in this trip
      items: [
        {
          id: 'item_006_3',
          name: 'Hardware Tools',
          quantity: 4,
          description: 'Power tools — includes drill, grinder and accessories',
        },
      ],
    },
  ],
  orderIds: ['ord_601', 'ord_602', 'ord_603'],
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export const mockTrackingItems: TrackingItem[] = [
  mockTrackingItem1,
  mockTrackingItem2,
  mockTrackingItem3,
  mockTrackingItem4,
  mockTrackingItem5,
  mockTrackingItem6,
]

export function getMockTrackingItem(id: string): TrackingItem | undefined {
  return mockTrackingItems.find((item) => item.id === id)
}

export function getMockTrackingItemsByStatus(
  status: TrackingItem['status'],
): TrackingItem[] {
  return mockTrackingItems.filter((item) => item.status === status)
}
