import { create } from 'zustand'
import { persist, StateStorage } from 'zustand/middleware'

/*  Types */

export type Role = 'OWNER' | 'ADMIN' | 'MEMBER'

type AuthState = {
  userId: string | null
  isAuthenticated: boolean
}

type WorkspaceState = {
  activeWorkspaceId: string | null
  role: Role | null
  isLoading: boolean
}

type PreferencesState = {
  theme: 'light' | 'dark' | 'system'
  sidebarCollapsed: boolean
}

type AppState = {
  hydrated: boolean
}

type AppActions = {
  setActiveWorkspace: (id: string, role: Role) => void
  clearSession: () => void
  setHydrated: () => void
}

export type AppStore = {
  auth: AuthState
  workspace: WorkspaceState
  preferences: PreferencesState
  app: AppState
} & AppActions

/* Store */

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      /* ---------- Auth ---------- */
      auth: {
        userId: null,
        isAuthenticated: false,
      },

      /* ---------- Workspace ---------- */
      workspace: {
        activeWorkspaceId: null,
        role: null,
        isLoading: false,
      },

      /* ---------- Preferences ---------- */
      preferences: {
        theme: 'system',
        sidebarCollapsed: false,
      },

      /* ---------- App ---------- */
      app: {
        hydrated: false,
      },

      /* ---------- Actions ---------- */
      setActiveWorkspace: (id, role) =>
        set((state) => ({
          workspace: {
            ...state.workspace,
            activeWorkspaceId: id,
            role,
          },
        })),

      clearSession: () =>
        set({
          auth: {
            userId: null,
            isAuthenticated: false,
          },
          workspace: {
            activeWorkspaceId: null,
            role: null,
            isLoading: false,
          },
        }),

      setHydrated: () =>
        set((state) => ({
          app: {
            ...state.app,
            hydrated: true,
          },
        })),
    }),
    {
      name: 'app-store',

      /* Persist ONLY what matters */
      partialize: (state) => ({
        workspace: {
          activeWorkspaceId: state.workspace.activeWorkspaceId,
          role: state.workspace.role,
        },
        preferences: state.preferences,
      }),

      /* Mark hydration complete */
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    },
  ),
)
