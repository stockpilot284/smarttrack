import { useSignUp, useSignIn, useAuth } from '@clerk/tanstack-react-start'
import { signUpWithEmailService } from '@/services/clerk/clerkAuthService'
import type {
  SignUpResource,
  SignInResource,
  SessionResource,
} from '@clerk/types'

export function useClerkAuth() {
  const signUp = useSignUp()
  const signIn = useSignIn()
  const auth = useAuth()

  return {
    signUpWithEmail: (
      email: string,
      password: string,
      firstName: string,
      lastName: string,
    ) =>
      signUpWithEmailService(
        signUp.signUp as SignUpResource,
        email,
        password,
        firstName,
        lastName,
      ),

    signOut: async () => {
      try {
        await auth.signOut()
        return { data: null, error: null }
      } catch (err: any) {
        return { data: null, error: err }
      }
    },

    // getSession: async () => {
    //   try {
    //     return { data: auth.session, error: null }
    //   } catch (err: any) {
    //     return { data: null, error: err }
    //   }
    // },
  }
}
