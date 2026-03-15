import { KpiItemProps } from '@/components/KpiItem'
import {
  DriverAvailability,
  DriverStatus,
  DriverTable,
} from '@/types/driver.type'
import {
  CheckCircle,
  Navigation,
  Pause,
  PauseCircle,
  Users,
} from 'lucide-react'

// data/drivers.ts
import { DriverDetail } from '@/types/driver.type'

export const mockDriverDetails: DriverDetail[] = [
  {
    id: 'd1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    status: 'ACTIVE',
    availability: 'BUSY',
    createdAt: '2026-02-01T10:30:00Z',
    lastActiveAt: '2026-03-12T09:15:00Z',
    imageUrl: 'https://ui-avatars.com/api/?name=John+Doe&background=random',
    vehicle: { model: 'Toyota Hiace', plate: 'AS-1234-23' },
    currentTrip: { destination: 'Spintex Road', status: 'In Progress' },
    emergencyContact: { name: 'Jane Doe', phone: '123-456-7891' },
    address: '123 Main St, Accra',
    licenseNumber: 'DL-123456',
    licenseExpiry: '2027-06-01',
    vehicleHistory: [
      { model: 'Ford Transit', plate: 'GV-3456-23', assignedAt: '2025-12-01' },
      { model: 'Toyota Hiace', plate: 'AS-1234-23', assignedAt: '2026-02-01' },
    ],
    documents: [
      {
        type: 'Driver License',
        url: '/docs/john_license.pdf',
        verified: true,
        expiry: '2027-06-01',
      },
      {
        type: 'Insurance',
        url: '/docs/john_insurance.pdf',
        verified: true,
        expiry: '2026-12-31',
      },
    ],
    notes: [
      {
        id: 'n1',
        content: 'Excellent driver, always on time.',
        createdAt: '2026-02-15T14:00:00Z',
        author: 'Ama Mensah',
      },
    ],
    timeline: [
      {
        id: 't1',
        event: 'Started shift',
        timestamp: '2026-03-12T08:00:00Z',
        type: 'status',
      },
      {
        id: 't2',
        event: 'Assigned to trip #ORD-1007',
        timestamp: '2026-03-12T08:30:00Z',
        type: 'trip',
      },
      {
        id: 't3',
        event: 'Picked up from Spintex Depot',
        timestamp: '2026-03-12T09:00:00Z',
        type: 'trip',
      },
    ],
    tripHistory: [
      {
        id: 'tr1',
        destination: 'Accra Mall',
        date: '2026-03-11',
        status: 'Delivered',
      },
      {
        id: 'tr2',
        destination: 'Tema Harbor',
        date: '2026-03-10',
        status: 'Delivered',
      },
    ],
  },

  {
    id: 'd2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '987-654-3210',
    status: 'SUSPENDED',
    availability: 'UNAVAILABLE',
    createdAt: '2026-01-15T14:45:00Z',
    lastActiveAt: '2026-03-01T11:20:00Z',
    imageUrl: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random',
    vehicle: undefined,
    currentTrip: undefined,
    emergencyContact: { name: 'Robert Smith', phone: '987-654-3211' },
    address: '456 Park Ave, Kumasi',
    licenseNumber: 'DL-654321',
    licenseExpiry: '2026-08-15',
    documents: [
      {
        type: 'Driver License',
        url: '/docs/jane_license.pdf',
        verified: true,
        expiry: '2026-08-15',
      },
    ],
    notes: [
      {
        id: 'n2',
        content: 'Pending investigation on incident #123',
        createdAt: '2026-03-02T09:00:00Z',
        author: 'Ama Mensah',
      },
    ],
    timeline: [
      {
        id: 't4',
        event: 'Account suspended',
        timestamp: '2026-03-01T11:30:00Z',
        type: 'status',
      },
    ],
    tripHistory: [],
  },
]

export const driverKpis: KpiItemProps[] = [
  {
    label: 'Total Drivers',
    value: 2,
    Icon: Users,
    helperText: 'All registered drivers',
  },
  {
    label: 'Available',
    value: 0,
    Icon: CheckCircle,
    helperText: 'Ready for assignment',
  },
  {
    label: 'Busy',
    value: 1,
    Icon: Navigation,
    helperText: 'Currently delivering',
  },
  {
    label: 'On Break',
    value: 0,
    Icon: PauseCircle,
    helperText: 'Taking a break',
  },
]
