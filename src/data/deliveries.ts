// data/deliveries.ts
import { Delivery } from '@/components/dashboard/UpcomingDeliveries'

export const MOCK_DELIVERIES: Delivery[] = [
  {
    id: 'del_001',
    customerName: 'Acme Corporation',
    deliveryAddress: '123 Main Street, Accra',
    pickupTime: new Date().toISOString(), // now
    deliveryTiming: 'SEND_NOW',
    priority: 'HIGH',
    assignedDriver: null,
    pickupCoordinates: { latitude: 5.6037, longitude: -0.187 },
    pickupAddress: '123 Warehouse Lane, Accra',
    dropoffCoordinates: { latitude: 5.62, longitude: -0.153 },
    status: 'CREATED',
  },
  {
    id: 'del_002',
    customerName: 'Globex Industries',
    deliveryAddress: '456 Industrial Road, Tema',
    pickupTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // in 2 hours
    deliveryTiming: 'SCHEDULED',
    priority: 'MEDIUM',
    assignedDriver: { id: 'd1', name: 'John Doe' },
    pickupCoordinates: { latitude: 5.6689, longitude: -0.0068 },
    pickupAddress: 'Tema Harbour Depot, Tema',
    dropoffCoordinates: { latitude: 5.69, longitude: -0.02 },
    status: 'ASSIGNED',
  },
  {
    id: 'del_003',
    customerName: 'Initech',
    deliveryAddress: '789 Park Avenue, Kumasi',
    pickupTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // in 15 minutes
    deliveryTiming: 'SEND_NOW',
    priority: 'LOW',
    assignedDriver: null,
    pickupCoordinates: { latitude: 6.688, longitude: -1.624 },
    pickupAddress: 'Kumasi Central Warehouse, Kumasi',
    dropoffCoordinates: { latitude: 6.71, longitude: -1.59 },
    status: 'CREATED',
  },
  {
    id: 'del_004',
    customerName: 'Umbrella Corp',
    deliveryAddress: '101 Raccoon Street, Cape Coast',
    pickupTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // in 5 hours
    deliveryTiming: 'SCHEDULED',
    priority: 'HIGH',
    assignedDriver: { id: 'd2', name: 'Jane Smith' },
    pickupCoordinates: { latitude: 5.11, longitude: -1.25 },
    pickupAddress: 'Cape Coast Logistics Hub, Cape Coast',
    dropoffCoordinates: { latitude: 5.15, longitude: -1.2 },
    status: 'ASSIGNED',
  },
  {
    id: 'del_005',
    customerName: 'Stark Industries',
    deliveryAddress: '10880 Malibu Point, Takoradi',
    pickupTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
    deliveryTiming: 'SCHEDULED',
    priority: 'MEDIUM',
    assignedDriver: null,
    pickupCoordinates: { latitude: 4.89, longitude: -1.76 },
    pickupAddress: 'Takoradi Port Warehouse, Takoradi',
    dropoffCoordinates: { latitude: 4.92, longitude: -1.7 },
    status: 'CREATED',
  },
]
