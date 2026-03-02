import { DriverAvailability } from '@/types/driver.type'
import { OrderStatus } from '@/types/order.type'
import { TrackingOrder } from '@/types/tracking'
import { VehicleType } from '@/types/vehicle.type'

export const mockTrackingOrders: TrackingOrder[] = [
  /* ================================
     ORDER 001 — Accra (existing, status ASSIGNED)
  ================================ */
  // (You can keep your existing order_001 if you have one; here I'm adding new ones with a consistent pattern)

  /* ================================
     ORDER 002 — Kumasi (ASSIGNED)
  ================================ */
  {
    id: 'order_002',
    trackingNumber: 'TRK-2026-0002',
    status: OrderStatus.ASSIGNED,
    progress: 0,

    driver: {
      id: 'driver_002',
      name: 'Ama Boateng',
      phone: '+233207654321',
      email: 'ama@logix.com',
      availability: DriverAvailability.BUSY,
    },

    vehicle: {
      id: 'vehicle_002',
      type: VehicleType.VAN,
      model: 'Toyota Hiace',
      plateNumber: 'AS-7743-23',
      imageUrl: 'https://cdn.example.com/vehicles/toyota-hiace.png',

      latitude: 6.692,
      longitude: -1.615,
      speed: 0,
      heading: 0,
      accuracy: 8,
    },

    stops: [
      {
        id: 'stop_pickup_002',
        type: 'PICKUP',
        address: 'Kumasi Depot',
        latitude: 6.688,
        longitude: -1.624,
        contactName: 'Kumasi Depot',
        contactPhone: '+233201111222',
      },
      {
        id: 'stop_dropoff_002',
        type: 'DROPOFF',
        address: 'Ejisu Market',
        latitude: 6.719,
        longitude: -1.575,
        contactName: 'Ejisu Store',
        contactPhone: '+233209999333',
      },
    ],

    timeline: [
      {
        id: 'tl_2',
        status: OrderStatus.ASSIGNED,
        message: 'Order assigned',
        timestamp: '2026-02-26T08:30:00Z',
      },
    ],
  },
]
