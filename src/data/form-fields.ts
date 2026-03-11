import { OrderField } from '@/types/order.type'

export const fields = {
  // =========================
  // Order Details
  // =========================
  orderDetails: [
    {
      label: 'Customer Name',
      required: true,
      placeholder: 'e.g. Sarah Corner',
      name: 'customerName',
    },
    {
      label: 'Customer Email',
      required: true,
      placeholder: 'e.g. sarah@example.com',
      name: 'customerEmail',
    },
    {
      label: 'Customer Phone',
      required: true,
      placeholder: 'e.g. +233 550 97593',
      name: 'customerPhone',
    },
    {
      label: 'Order Label',
      required: false,
      placeholder: 'e.g. Express',
      name: 'orderLabel',
    },
    {
      label: 'Package Weight',
      required: false,
      placeholder: 'e.g. 2.5kg',
      name: 'packageWeight',
    },
  ] satisfies OrderField[],

  // =========================
  // Pickup Details (NO LOCATION HERE)
  // =========================
  pickupDetails: [
    {
      label: 'Pickup Contact Name',
      required: true,
      placeholder: 'e.g. Frederick Frimpong',
      name: 'pickupContactName',
    },
    {
      label: 'Pickup Contact Phone',
      required: true,
      placeholder: 'e.g. +233 550 97593',
      name: 'pickupContactPhone',
    },
  ] satisfies OrderField[],

  // =========================
  // Drop-off Details (NO LOCATION HERE)
  // =========================
  dropoffDetails: [
    {
      label: 'Recipient Name',
      required: true,
      placeholder: 'e.g. John Doe',
      name: 'recipientName',
    },
    {
      label: 'Recipient Phone',
      required: true,
      placeholder: 'e.g. +233 550 97593',
      name: 'recipientPhone',
    },
  ] satisfies OrderField[],

  // =========================
  // Notes
  // =========================
  notes: [
    {
      label: 'Delivery Notes',
      required: false,
      placeholder:
        'e.g. Call customer before arrival, deliver to back entrance',
      name: 'deliveryNotes',
    },
    {
      label: 'External Reference',
      required: false,
      placeholder: 'e.g. INV-2049 or PO-7781',
      name: 'externalReference',
    },
  ] satisfies OrderField[],

  // =========================
  // Delivery Timing (handled separately)
  // =========================
  deliveryTiming: [
    {
      label: 'Scheduled Pickup Date',
      required: false,
      placeholder: '',
      name: 'scheduledPickupAt',
    },
  ] satisfies OrderField[],

  // =========================
  // Assignment
  // =========================
  assignment: [
    {
      label: 'Assign Driver',
      required: false,
      placeholder: 'Select driver',
      name: 'driverClerkUserId',
    },
    {
      label: 'Assign Vehicle',
      required: false,
      placeholder: 'Select vehicle',
      name: 'vehicleIdentifier',
    },
  ],
}
