import {
  DriverAvailability,
  DriverStatus,
  DriverTable,
} from '@/types/driver.type'

export const driversData: DriverTable[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    status: 'ACTIVE',
    availability: 'AVAILABLE',
    createdAt: '2026-02-01T10:30:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '987-654-3210',
    status: 'SUSPENDED',
    availability: 'UNAVAILABLE',
    createdAt: '2026-01-15T14:45:00Z',
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    phone: '555-123-4567',
    status: 'INACTIVE',
    availability: 'UNAVAILABLE',
    createdAt: '2026-01-20T08:15:00Z',
  },

  {
    id: '5',
    name: 'Chris Wilson',
    email: 'chris.wilson@example.com',
    phone: '333-222-1111',
    status: 'ACTIVE',
    availability: 'BUSY',
    createdAt: '2026-02-18T09:00:00Z',
  },
]
