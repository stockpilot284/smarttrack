import {
  DeliveryTiming,
  Order,
  OrderStatus,
  OrderTable,
} from '@/types/order.type'

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
    status: 'IN_TRANSIT',
    vehicle: 'Truck G7',
    dropOffLocation: 'Accra Central, Accra',
    pickupLocation: 'Kumasi Depot',
  },
  {
    orderRef: 'ORD-1008',
    trackingNumber: 'TRK-2026-0002',
    customer: 'Jane Doe',
    driver: 'Ama Boateng',
    createdAt: new Date('2026-02-07T12:50:00Z').toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }),
    status: 'DELIVERED',
    vehicle: 'Truck G7',
    dropOffLocation: '101 Customer Rd, Queens, NY 11301',
    pickupLocation: '789 Supplier St, Brooklyn, NY 11201',
  },
]

export const orders: Order[] = [
  {
    id: '123',
    orderReference: 'ORD-1007',
    customerName: 'Alex Rivers',
    customerEmail: 'alex.rivers@example.com',
    customerPhone: '+15550123456',
    priority: 'HIGH',
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
    deliveryTiming: 'SEND_NOW',
    orderLabel: 'ORD-2024-X99',
    packageWeight: '2.5kg',
    deliveryNotes: 'Leave at the front desk with security.',
    externalReference: 'REF-987654',
    status: 'CREATED',
    createdAt: '2024-10-25T09:00:00Z',
    estimatedArrival: '2024-10-25T16:00:00Z',
    items: [
      {
        id: 'item-1',
        name: 'Mechanical Keyboard',
        quantity: 1,
      },
      {
        id: 'item-2',
        name: 'USB-C Cable',
        quantity: 2,
      },
    ],
    proofOfDelivery: undefined, // not delivered yet
  },
  // Example delivered order with proof
  {
    id: '124',
    orderReference: 'ORD-1008',
    customerName: 'Jane Doe',
    customerEmail: 'jane.doe@example.com',
    customerPhone: '+15550123457',
    priority: 'MEDIUM',
    pickupLocation: {
      address: '789 Supplier St, Brooklyn, NY 11201',
      coordinates: {
        latitude: 40.68,
        longitude: -73.98,
      },
    },
    pickupContactName: 'Mike Ross',
    pickupContactPhone: '+15559876544',
    dropoffLocation: {
      address: '101 Customer Rd, Queens, NY 11301',
      coordinates: {
        latitude: 40.73,
        longitude: -73.9,
      },
    },
    recipientName: 'John Smith',
    recipientPhone: '+15552468102',
    deliveryTiming: 'SCHEDULED',
    orderLabel: 'ORD-2024-X100',
    packageWeight: '1.2kg',
    deliveryNotes: 'Call upon arrival.',
    externalReference: 'REF-123456',
    status: 'DELIVERED',
    createdAt: '2024-10-24T10:00:00Z',
    estimatedArrival: '2024-10-24T14:00:00Z',
    items: [
      {
        id: 'item-3',
        name: 'Wireless Mouse',
        quantity: 1,
      },
    ],
    proofOfDelivery: {
      type: 'signature',
      url: '/proofs/ord-1008-signature.png',
    },
  },
]
