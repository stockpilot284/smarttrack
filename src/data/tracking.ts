import { DriverAvailability } from '@/types/driver.type'
import { OrderStatus } from '@/types/order.type'
import { MapMarker, TrackingOrder } from '@/types/tracking'
export const trackingOrders: TrackingOrder[] = [
  {
    id: 'TRK-122',
    trackingNumber: 'TRK-GH-0001',
    status: OrderStatus.IN_TRANSIT,
    progress: 68,

    driver: {
      id: 'DRV-GH-001',
      name: 'Kwame Mensah',
      phone: '+233 24 123 4567',
      email: 'kwame.mensah@logistics.com',
      accuracy: 4,
      speed: 54,
      latitude: 5.6451, // Amasaman area
      longitude: -0.2766,
      availability: DriverAvailability.AVAILABLE,
    },

    stops: [
      {
        id: 'STOP-GH-001',
        type: 'PICKUP',
        latitude: 5.6503, // Amasaman Market
        longitude: -0.2754,
        contactName: 'Ama Boateng',
        contactPhone: '+233 20 987 6543',
        address: 'Amasaman Market, Greater Accra',
      },
      {
        id: 'STOP-GH-002',
        type: 'DROPOFF',
        latitude: 5.5346, // Kasoa
        longitude: -0.4208,
        contactName: 'Yaw Asante',
        contactPhone: '+233 26 654 3210',
        address: 'Kasoa Nyanyano Road, Central Region',
      },
    ],

    timeline: [
      {
        id: 'TL-GH-001',
        status: OrderStatus.PICKED_UP,
        message: 'Package picked up at Amasaman Market',
        timestamp: '2026-02-23T09:15:00Z',
      },
      {
        id: 'TL-GH-002',
        status: OrderStatus.IN_TRANSIT,
        message: 'Driver en route to Kasoa',
        timestamp: '2026-02-23T10:45:00Z',
      },
    ],
  },

  {
    id: 'TRK-10022',
    trackingNumber: 'TRK-GH-0002',
    status: OrderStatus.DELIVERED,
    progress: 100,

    driver: {
      id: 'DRV-GH-002',
      name: 'Akosua Owusu',
      phone: '+233 55 456 7890',
      email: 'akosua.owusu@logistics.com',
      accuracy: 3,
      speed: 0,
      latitude: 5.6037, // Madina area
      longitude: -0.1684,
      availability: DriverAvailability.UNAVAILABLE,
    },

    stops: [
      {
        id: 'STOP-GH-003',
        type: 'PICKUP',
        latitude: 5.603, // East Legon
        longitude: -0.1869,
        contactName: 'Kofi Adu',
        contactPhone: '+233 27 321 0987',
        address: 'East Legon, Accra',
      },
      {
        id: 'STOP-GH-004',
        type: 'DROPOFF',
        latitude: 5.6037, // Madina Zongo
        longitude: -0.1684,
        contactName: 'Fatima Sule',
        contactPhone: '+233 24 210 9876',
        address: 'Madina Zongo Junction, Accra',
      },
    ],

    timeline: [
      {
        id: 'TL-GH-003',
        status: OrderStatus.PICKED_UP,
        message: 'Package picked up at East Legon',
        timestamp: '2026-02-22T08:30:00Z',
      },
      {
        id: 'TL-GH-004',
        status: OrderStatus.DELIVERED,
        message: 'Package delivered successfully in Madina',
        timestamp: '2026-02-22T11:05:00Z',
      },
    ],
  },
]
