export type PaymentMethodType = 'card' | 'mobile_money'
export type MobileMoneyProvider = 'MTN' | 'Telecel' | 'AirtelTigo' | string

export interface PaymentMethod {
  id: string
  type: PaymentMethodType
  default?: boolean
  // Card fields
  brand?: string
  last4?: string
  expMonth?: number
  expYear?: number
  // Mobile money fields
  provider?: MobileMoneyProvider
  phoneNumber?: string
  name?: string
}
