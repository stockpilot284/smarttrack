import { DeliveryTiming, OrderStatus, OrderTable } from '@/types/order.type'

export const mockRecentOrders: OrderTable[] = [
  {
    orderRef: 'ORD-1007',
    trackingNumber: 'TRK-2026-0002',
    customer: 'William Johnson',
    driver: 'Ama Boateng',
    createdAt: new Date('2026-02-07T12:50:00Z').toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }),
    status: OrderStatus.ASSIGNED,
    vehicle: 'Truck G7',
    dropOffLocation: 'Accra Central, Accra',
    pickupLocation: 'Kumasi Depot',
  },
]

export const orders = [
  {
    id: '123',
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
