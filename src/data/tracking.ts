import { DriverAvailability } from '@/types/driver.type'
import { OrderStatus } from '@/types/order.type'
import { TrackingOrder } from '@/types/tracking'
import { VehicleType } from '@/types/vehicle.type'

export const mockTrackingOrders: TrackingOrder[] = [
  {
    id: 'order_003',
    trackingNumber: 'TRK-2026-0003',
    status: 'DELIVERED',
    progress: 0,
    driver: {
      id: 'driver_003',
      name: 'Kwame Asare',
      phone: '+233201234567',
      email: 'kwame@logix.com',
      availability: 'AVAILABLE',
    },
    vehicle: {
      id: 'vehicle_003',
      type: 'TRUCK',
      model: 'Isuzu NPR',
      plateNumber: 'GT-4567-23',
      imageUrl: 'https://cdn.example.com/vehicles/isuzu-npr.png',
      latitude: 5.6037,
      longitude: -0.187,
      speed: 0,
      heading: 0,
      accuracy: 5,
    },
    stops: [
      {
        id: 'stop_pickup_003',
        type: 'PICKUP',
        address: 'Accra Logistics Hub, Spintex Road',
        latitude: 5.6204,
        longitude: -0.1533,
        contactName: 'Accra Warehouse',
        contactPhone: '+233302555444',
      },
      {
        id: 'stop_dropoff_003',
        type: 'DROPOFF',
        address: 'Tema Industrial Area, Harbor',
        latitude: 5.6689,
        longitude: -0.0068,
        contactName: 'Tema Port',
        contactPhone: '+233303777888',
      },
    ],
    timeline: [
      {
        id: 'tl_3_1',
        status: 'CREATED',
        message: 'Order created',
        timestamp: '2026-03-01T10:00:00Z',
      },
      {
        id: 'tl_3_2',
        status: 'ASSIGNED',
        message: 'Assigned to Kwame Asare',
        timestamp: '2026-03-01T10:15:00Z',
      },
      {
        id: 'tl_3_3',
        status: 'PICKED_UP',
        message: 'Picked up from Accra Logistics Hub',
        timestamp: '2026-03-01T10:45:00Z',
      },
      {
        id: 'tl_3_4',
        status: 'IN_TRANSIT',
        message: 'En route to Tema',
        timestamp: '2026-03-01T11:00:00Z',
      },
      {
        id: 'tl_3_5',
        status: 'DELIVERED',
        message: 'Delivered to Tema Port',
        timestamp: '2026-03-01T11:45:00Z',
      },
    ],
    locationHistory: [
      {
        latitude: 5.6204,
        longitude: -0.1533,
        timestamp: '2026-03-01T10:45:00Z',
      },
      { latitude: 5.622, longitude: -0.149, timestamp: '2026-03-01T10:48:00Z' },
      {
        latitude: 5.6245,
        longitude: -0.144,
        timestamp: '2026-03-01T10:51:00Z',
      },
      {
        latitude: 5.6275,
        longitude: -0.139,
        timestamp: '2026-03-01T10:54:00Z',
      },
      { latitude: 5.631, longitude: -0.134, timestamp: '2026-03-01T10:57:00Z' },
      { latitude: 5.635, longitude: -0.129, timestamp: '2026-03-01T11:00:00Z' },
      {
        latitude: 5.6395,
        longitude: -0.124,
        timestamp: '2026-03-01T11:03:00Z',
      },
      { latitude: 5.644, longitude: -0.119, timestamp: '2026-03-01T11:06:00Z' },
      {
        latitude: 5.6485,
        longitude: -0.114,
        timestamp: '2026-03-01T11:09:00Z',
      },
      { latitude: 5.653, longitude: -0.109, timestamp: '2026-03-01T11:12:00Z' },
      {
        latitude: 5.6575,
        longitude: -0.104,
        timestamp: '2026-03-01T11:15:00Z',
      },
      { latitude: 5.662, longitude: -0.099, timestamp: '2026-03-01T11:18:00Z' },
      {
        latitude: 5.6665,
        longitude: -0.094,
        timestamp: '2026-03-01T11:21:00Z',
      },
      { latitude: 5.6689, longitude: -0.09, timestamp: '2026-03-01T11:24:00Z' },
      {
        latitude: 5.6689,
        longitude: -0.085,
        timestamp: '2026-03-01T11:27:00Z',
      },
      { latitude: 5.6689, longitude: -0.08, timestamp: '2026-03-01T11:30:00Z' },
      {
        latitude: 5.6689,
        longitude: -0.075,
        timestamp: '2026-03-01T11:33:00Z',
      },
      { latitude: 5.6689, longitude: -0.07, timestamp: '2026-03-01T11:36:00Z' },
      {
        latitude: 5.6689,
        longitude: -0.065,
        timestamp: '2026-03-01T11:39:00Z',
      },
      {
        latitude: 5.6689,
        longitude: -0.0068,
        timestamp: '2026-03-01T11:45:00Z',
      }, // final dropoff
    ],
  },
  // ... other orders
]
