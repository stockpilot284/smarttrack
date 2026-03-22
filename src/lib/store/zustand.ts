import { createStore } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useStore } from 'zustand'
import { useEffect, useState } from 'react'

// ======================
// TYPES
// ======================

type Company = {
  id: string
  name: string
  emailAddress: string
  contactPhone: string
  address: string
  city: string
  country: string
}

type OrderSettings = {
  allowOrderCancellation?: boolean
  cancellationWindowMinutes?: number
  autoAssignOrder?: boolean
  requireProofOfDelivery?: boolean
  allowManualOrderCompletion?: boolean
  softDeleteOrders?: boolean
  orderRetentionDays?: number
}

type TrackingSettings = {
  enableLiveTracking?: boolean
  trackingRefreshInterval?: number
  routeOptimizationEnabled?: boolean
  shareTrackingLink?: boolean
  trackingLinkExpiryHours?: number
  showDriverDetailsOnTracking?: boolean
}

type NotificationSettings = {
  enableEmailNotifications?: boolean
  enableSmsNotifications?: boolean
  notifyOnOrderCreated?: boolean
  notifyOnDriverAssigned?: boolean
  notifyOnDelivery?: boolean
  notifyOnDriverOffline?: boolean
  notifyOnOrderCancelled?: boolean
}

type DriverSettings = {
  allowDriverToToggleAvailability?: boolean
  requireDriverVerification?: boolean
  enableDriverLocationTracking?: boolean
}

type BillingSettings = {
  billingEmail?: string
  currency?: string
  taxNumber?: string
  invoicePrefix?: string
}

type CompanySettings = {
  orderSettings: OrderSettings
  trackingSettings: TrackingSettings
  notificationSettings: NotificationSettings
  driverSettings: DriverSettings
  billingSettings: BillingSettings
}

export type CompanyRole =
  | 'OWNER'
  | 'ADMIN'
  | 'DISPATCHER'
  | 'DRIVER'
  | 'CUSTOMER'

type User = {
  id?: string
  fullName?: string
  emailAddress?: string
  contactPhone?: string
  role?: CompanyRole
}

// ======================
// PLAN TYPES
// ======================

export type PlanName = 'FREE' | 'GROWTH' | 'PRO'

export type PlanLimits = {
  maxDrivers: number
  maxVehicles: number
  maxOrdersPerMonth?: number
  maxAdmins: number
  maxTotalMembers: number
}

export type PlanFeatures = {
  // Free plan features
  orderCreation: boolean
  orderAssignment: boolean
  basicLiveTracking: boolean
  basicAlerts: boolean
  deliveryStatusUpdates: boolean
  basicDashboard: boolean

  // Growth+ features
  advancedLiveTracking: boolean
  bulkImportOrders: boolean
  etaCalculation: boolean
  routeDisplay: boolean
  realTimeAlerts: boolean
  driverPerformanceDashboard: boolean
  trackingLinkSharing: boolean
  deliveryTimeline: boolean
  orderHistory: boolean
  alertAcknowledgments: boolean
  archiveRecovery: boolean

  // Professional
  routeOptimization: boolean
  driverAvailabilitySystem: boolean
  vehicleManagement: boolean
  orderScheduling: boolean
  trackingSessionReplay: boolean
  exportReports: boolean
  webhookIntegrations: boolean
  apiAccess: boolean
}

export type Plan = {
  name: PlanName
  limits: PlanLimits
  features: PlanFeatures
}

// ======================
// UPGRADE MODAL STATE
// ======================

export type UpgradeModalState = {
  isOpen: boolean
  limitName?: keyof PlanLimits
  currentValue?: number
  maxValue?: number
  featureName?: keyof PlanFeatures
  onUpgrade?: () => void // optional callback after upgrade (e.g., refetch)
}

// ======================
// DEFAULT PLAN (FREE)
// ======================

const defaultPlan: Plan = {
  name: 'PRO',
  limits: {
    maxDrivers: 2,
    maxVehicles: 2,
    maxOrdersPerMonth: 20,
    maxAdmins: 1,
    maxTotalMembers: 5,
  },
  features: {
    // Free Features
    orderCreation: true,
    orderAssignment: true,
    basicLiveTracking: true,
    basicAlerts: true,
    deliveryStatusUpdates: true,
    basicDashboard: true,

    // Growth Features
    advancedLiveTracking: true,
    bulkImportOrders: true,
    etaCalculation: true,
    routeDisplay: true,
    realTimeAlerts: true,
    driverPerformanceDashboard: true,
    trackingLinkSharing: true,
    deliveryTimeline: true,
    orderHistory: true,
    alertAcknowledgments: true,
    archiveRecovery: true,
    routeOptimization: true,

    // Professional Features
    driverAvailabilitySystem: true,
    vehicleManagement: true,
    orderScheduling: true,
    trackingSessionReplay: true,
    exportReports: true,
    webhookIntegrations: true,
    apiAccess: true,
  },
}

// ======================
// INITIAL STATE
// ======================

const defaultCompany: Company = {
  id: '',
  name: '',
  emailAddress: '',
  contactPhone: '',
  address: '',
  city: '',
  country: '',
}

const defaultOrderSettings: OrderSettings = {
  allowOrderCancellation: true,
  cancellationWindowMinutes: 0,
  autoAssignOrder: true,
  requireProofOfDelivery: true,
  allowManualOrderCompletion: false,
  softDeleteOrders: true,
  orderRetentionDays: 30,
}

const defaultTrackingSettings: TrackingSettings = {
  trackingRefreshInterval: 15,
  trackingLinkExpiryHours: 24,
}

const defaultNotificationSettings: NotificationSettings = {
  enableEmailNotifications: true,
  enableSmsNotifications: false,
  notifyOnOrderCreated: true,
  notifyOnDriverAssigned: true,
  notifyOnDelivery: true,
  notifyOnDriverOffline: false,
  notifyOnOrderCancelled: true,
}

const defaultDriverSettings: DriverSettings = {
  allowDriverToToggleAvailability: true,
  requireDriverVerification: true,
  enableDriverLocationTracking: true,
}

const defaultBillingSettings: BillingSettings = {
  billingEmail: '',
  currency: 'USD',
  taxNumber: '',
  invoicePrefix: 'INV-',
}

const defaultSettings: CompanySettings = {
  orderSettings: defaultOrderSettings,
  trackingSettings: defaultTrackingSettings,
  notificationSettings: defaultNotificationSettings,
  driverSettings: defaultDriverSettings,
  billingSettings: defaultBillingSettings,
}

const defaultUser: User = {
  id: '',
  fullName: '',
  emailAddress: '',
  contactPhone: '',
  role: 'OWNER',
}

const defaultUpgradeModal: UpgradeModalState = {
  isOpen: false,
}

// ======================
// ACTIONS
// ======================

type AppState = {
  company: Company
  settings: CompanySettings
  user: User
  plan: Plan
  upgradeModal: UpgradeModalState
}

type AppActions = {
  setCompany: (company: Partial<Company>) => void
  updateCompany: (company: Partial<Company>) => void
  setSettings: (settings: Partial<CompanySettings>) => void
  updateSettings: (settings: Partial<CompanySettings>) => void
  setUser: (user: Partial<User>) => void
  updateUser: (user: Partial<User>) => void
  setPlan: (plan: Plan) => void
  reset: () => void
  hasFeature: (featureName: keyof PlanFeatures) => boolean
  withinLimit: (limitName: keyof PlanLimits, currentValue: number) => boolean
  openUpgradeModal: (params: Omit<UpgradeModalState, 'isOpen'>) => void
  closeUpgradeModal: () => void
}

// ======================
// STORE WITH PERSISTENCE
// ======================

export const appStore = createStore<AppState & AppActions>()(
  persist(
    (set, get) => ({
      company: defaultCompany,
      settings: defaultSettings,
      user: defaultUser,
      plan: defaultPlan,
      upgradeModal: defaultUpgradeModal,

      // Actions
      setCompany: (company) =>
        set((state) => ({ company: { ...state.company, ...company } })),
      updateCompany: (company) =>
        set((state) => ({ company: { ...state.company, ...company } })),

      setSettings: (settings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...settings,
          },
        })),
      updateSettings: (settings) =>
        set((state) => ({
          settings: {
            ...state.settings,
            ...settings,
          },
        })),

      setUser: (user) => set((state) => ({ user: { ...state.user, ...user } })),
      updateUser: (user) =>
        set((state) => ({ user: { ...state.user, ...user } })),

      setPlan: (plan) => set({ plan }),

      reset: () =>
        set({
          company: defaultCompany,
          settings: defaultSettings,
          user: defaultUser,
          plan: defaultPlan,
          upgradeModal: defaultUpgradeModal,
        }),

      // Helper: check if a feature is enabled
      hasFeature: (featureName) => {
        const features = get().plan.features
        return features[featureName] || false
      },

      // Helper: check if current usage is within plan limit
      withinLimit: (limitName, currentValue) => {
        const limit = get().plan.limits[limitName]
        if (limit === undefined) return true // no limit defined
        return currentValue <= limit
      },

      // Upgrade modal actions
      openUpgradeModal: (params) =>
        set({ upgradeModal: { isOpen: true, ...params } }),
      closeUpgradeModal: () => set({ upgradeModal: { isOpen: false } }),
    }),
    {
      name: 'smarttrack-app-storage',
      storage: createJSONStorage(() => localStorage),
      // Persist company, user, and plan – settings are fetched from backend, modal is transient
      partialize: (state) => ({
        company: state.company,
        user: state.user,
        plan: state.plan,
      }),
    },
  ),
)

// ======================
// DEEP UPDATE HELPERS (optional)
// ======================

export const updateOrderSettings = (orderSettings: Partial<OrderSettings>) => {
  appStore.setState((state) => ({
    settings: {
      ...state.settings,
      orderSettings: { ...state.settings.orderSettings, ...orderSettings },
    },
  }))
}

export const updateTrackingSettings = (
  trackingSettings: Partial<TrackingSettings>,
) => {
  appStore.setState((state) => ({
    settings: {
      ...state.settings,
      trackingSettings: {
        ...state.settings.trackingSettings,
        ...trackingSettings,
      },
    },
  }))
}

export const updateNotificationSettings = (
  notificationSettings: Partial<NotificationSettings>,
) => {
  appStore.setState((state) => ({
    settings: {
      ...state.settings,
      notificationSettings: {
        ...state.settings.notificationSettings,
        ...notificationSettings,
      },
    },
  }))
}

export const updateDriverSettings = (
  driverSettings: Partial<DriverSettings>,
) => {
  appStore.setState((state) => ({
    settings: {
      ...state.settings,
      driverSettings: { ...state.settings.driverSettings, ...driverSettings },
    },
  }))
}

export const updateBillingSettings = (
  billingSettings: Partial<BillingSettings>,
) => {
  appStore.setState((state) => ({
    settings: {
      ...state.settings,
      billingSettings: {
        ...state.settings.billingSettings,
        ...billingSettings,
      },
    },
  }))
}

// ======================
// REACT HOOK
// ======================

export const useAppStore = <T>(
  selector: (state: AppState & AppActions) => T,
): T => {
  return useStore(appStore, selector)
}

// ======================
// HYDRATION STATUS HOOK
// ======================

export const useAppStoreHydrated = () => {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (appStore.persist.hasHydrated()) {
      setHydrated(true)
    } else {
      const unsub = appStore.persist.onFinishHydration(() => setHydrated(true))
      return unsub
    }
  }, [])

  return hydrated
}
