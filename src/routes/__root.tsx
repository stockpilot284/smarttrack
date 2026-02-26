import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import appCss from '../styles.css?url'
import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { ClerkProvider } from '@clerk/tanstack-react-start'
import ThemeProvider from '@/components/ThemeProvider'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'SmartTrack',
      },
      {
        name: 'description',
        description:
          'Smart Track helps businesses manage deliveries, vehicles, and drivers in one simple platform. Track availability, assign orders, and move faster.',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/favicon.svg',
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || ''
  return (
    // <ClerkProvider
    //   publishableKey={publishableKey}
    //   appearance={{
    //     variables: {
    //       colorPrimary: '#6B37C8',
    //       colorText: '#111827',
    //       borderRadius: '8px',
    //     },
    //     elements: {
    //       formButtonPrimary: 'bg-primary text-white hover:bg-primary/90',
    //       card: 'shadow-lg border',
    //       headerTitle: 'text-xl font-semibold',
    //       headerSubtitle: 'text-sm text-muted-foreground',
    //     },
    //   }}
    // >
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Toaster position="bottom-right" richColors />

        <Scripts />
      </body>
    </html>
    // </ClerkProvider>
  )
}
