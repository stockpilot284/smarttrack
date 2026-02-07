import { Button } from '@/components/ui/button'
import OrDivider from '../OrDivider'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useState } from 'react'
import { toast } from 'sonner'
import { Provider } from '@supabase/supabase-js'
import { Link } from '@tanstack/react-router'
import { useClerkAuth } from '@/hooks/useClerkAuth'

const signUpFormSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'Full Name must be at least 2 characters.' })
    .max(30, { message: 'Full Name must be at most 30 characters.' })
    .regex(/^[a-zA-Z\s]+$/, {
      message: 'Full Name can only contain letters and spaces.',
    }),

  email: z
    .string()
    .min(1, 'Email is required')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters.' })
    .max(64, { message: 'Password must be at most 64 characters.' })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter.',
    })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter.',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
    .regex(/[^A-Za-z0-9]/, {
      message: 'Password must contain at least one special character.',
    }),
})

type SignUpFormValues = z.infer<typeof signUpFormSchema>

export default function SignUpForm() {
  return (
    <section
      className="flex-1 md:flex justify-center items-center py-8 lg:py-0"
      id="sign-up-form"
    >
      <div className="w-full md:w-100 flex flex-col items-center  px-6 ">
        {/* Logo  */}
        <Link className="flex items-center gap-1.5 lg:w-full" to="/">
          <img src={'/assets/logo.svg'} alt="SmartTrack Logo" />
          <p className="text-sm font-bold text-foreground">SmartTrack</p>
        </Link>

        {/* Title & Login CTA */}
        <div className="pt-10 pb-2.5 flex flex-col gap-1.5 items-center lg:items-start lg:w-full">
          <h1 className="text-2xl font-bold text-foreground">
            Get Started Now
          </h1>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/auth/sign-in" className="text-primary hover:underline">
                Log in here
              </Link>
            </p>
          </div>
        </div>

        {/* Continue With Google */}
        <div className="py-2.5 w-full">
          <Button
            variant={'outline'}
            leftIcon={<img src="/assets/google-icon.svg" alt="Google Icon" />}
            className="text-primary w-full border-primary hover:bg-primary/5 hover:text-primary"
          >
            Continue with Google
          </Button>
        </div>

        {/* Or Divider */}
        <OrDivider />

        {/* Form Fields */}
        <FormContent />

        {/* Terms and Privacy */}
        <div className="pt-4 text-center lg:text-left">
          <p className="text-xs text-muted-foreground">
            By signing up, you agree to our{' '}
            <Link to="/" className="text-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

function FormContent() {
  const [loading, setLoading] = useState<boolean>(false)
  const { signUpWithEmail } = useClerkAuth()

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
    mode: 'onChange',
  })

  async function onSubmit(data: SignUpFormValues) {
    const { email, password, fullName } = data
    const firstName = fullName.split(' ')[0]
    const lastName = fullName.split(' ')[1] ?? ''
    await handleSignUpWithEmail(email, password, firstName, lastName)
  }

  async function handleSignUpWithEmail(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) {
    setLoading(true)
    const toastId = toast.loading('Creating account.....', { id: 'sign-up' })

    const { data, error } = await signUpWithEmail(
      email,
      password,
      firstName,
      lastName,
    )
    console.log(error)

    // Check too many requests
    if (error?.message === 'Too many requests. Please try again later.') {
      setLoading(false)
      return toast.error(error.message, {
        id: toastId,
      })
    }
    // Check email already exists but not confirmed
    if (error?.message === 'Email address has not been verified.') {
      setLoading(false)
      return toast.error(error.message, {
        id: toastId,
      })
    }
    // Check email already exists and confirmed
    if (error?.message === 'This email address is already in use.') {
      setLoading(false)
      return toast.error(error.message, { id: toastId })
    }

    // Check for main error
    if (error) {
      setLoading(false)
      return toast.error('Something went wrong. Please try again.', {
        id: toastId,
      })
    }

    setLoading(false)
    toast.success('Account created successfully! Please verify your email.', {
      id: toastId,
    })
  }

  return (
    <Form {...(form as any)}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full py-3 flex flex-col gap-4"
      >
        {/** Full Name Field */}
        <FormField
          control={form.control as any}
          name="fullName"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <FormLabel mandatory={true}>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/** Email Field */}
        <FormField
          control={form.control as any}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel mandatory={true}>Email Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="johndoe@example.com"
                  {...field}
                  type="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/** Password Field */}
        <FormField
          control={form.control as any}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel mandatory={true}>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your password"
                  {...field}
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/** Submit Button */}
        <Button
          type="submit"
          className="w-full "
          disabled={!form.formState.isValid || loading}
          loading={loading}
        >
          Create Account
        </Button>
      </form>
    </Form>
  )
}
