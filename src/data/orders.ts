import { DeliveryTiming, OrderStatus, OrderTable } from '@/types/order.type'

export const mockRecentOrders: OrderTable[] = [
  {
    orderRef: 'ORD-1007',
    customer: 'William Johnson',
    driver: 'Hannah Black',
    createdAt: new Date('2026-02-07T12:50:00Z').toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }),
    status: OrderStatus.CREATED,
    vehicle: 'Truck G7',
    dropOffLocation: 'Accra Central, Accra',
    pickupLocation: 'Ridge, Accra',
  },
  {
    orderRef: 'ORD-1008',
    customer: 'Emily Davis',
    driver: 'John Doe',
    createdAt: new Date('2026-02-15T09:30:00Z').toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }),
    status: OrderStatus.DELIVERED,
    vehicle: 'Van X5',
    dropOffLocation: 'East Legon, Accra',
    pickupLocation: 'Osu, Accra',
  },
  {
    orderRef: 'ORD-1009',
    customer: 'Michael Brown',
    driver: 'Sarah White',
    createdAt: new Date('2026-02-20T14:15:00Z').toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }),
    status: OrderStatus.IN_TRANSIT,
    vehicle: 'Bike B2',
    dropOffLocation: 'Tema Harbour, Tema',
    pickupLocation: 'Spintex, Accra',
  },
  {
    orderRef: 'ORD-1029',
    customer: 'Michael Brown',
    driver: 'Sarah White',
    createdAt: new Date('2026-02-20T14:15:00Z').toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }),
    status: OrderStatus.IN_TRANSIT,
    vehicle: 'Bike B2',
    dropOffLocation: 'Tema Harbour, Tema',
    pickupLocation: 'Spintex, Accra',
  },
]

export const orders = [
  {
    orderReference: 'ORD-1007',
    customerName: 'Alex Rivers',
    customerEmail: 'alex.rivers@example.com',
    customerPhone: '+15550123456',
    pickupLocation: {
      address: '123 Supply Way, Industrial Park, NY 10001',
      coordinates: {
        latitude: 40.7128,
        longitude: -74.006,
      },
    },
    pickupContactName: 'Jordan Smith',
    pickupContactPhone: '+15559876543',
    dropoffLocation: {
      address: '456 Destination Ave, Suite 12, NY 10002',
      coordinates: {
        latitude: 40.72,
        longitude: -73.995,
      },
    },
    recipientName: 'Sam Taylor',
    recipientPhone: '+15552468101',
    deliveryTiming: DeliveryTiming.SEND_NOW,
    orderLabel: 'ORD-2024-X99',
    packageWeight: '2.5kg',
    deliveryNotes: 'Leave at the front desk with security.',
    externalReference: 'REF-987654',
    scheduledPickupAt: '2024-10-25T14:30:00Z',
    status: OrderStatus.IN_TRANSIT,
    createdAt: '2024-10-25T09:00:00Z',
    estimatedArrival: '2024-10-25T16:00:00Z',
    items: [
      {
        id: 'item-1',
        name: 'Mechanical Keyboard',
        quantity: 1,
        price: 120.0,
      },
      {
        id: 'item-2',
        name: 'USB-C Cable',
        quantity: 2,
        price: 15.0,
      },
    ],
  },
]
